import type { VkNotificationPayload, VkSendResult } from '../types';

function buildVkMessage(payload: VkNotificationPayload) {
  return [
    'Новый лид',
    `Имя: ${payload.name}`,
    `Телефон: ${payload.phone}`,
    `Время: ${payload.createdAt}`,
    `Первый источник: ${payload.firstLeadSource ?? 'Не определен'}`,
    `Последний источник: ${payload.lastLeadSource ?? 'Не определен'}`,
  ].join('\n');
}

function normalizePeerIds(peerIds: string[]) {
  return [...new Set(peerIds.map((peerId) => peerId.trim()).filter(Boolean))];
}

export function createVkAdapter({
  enabled,
  accessToken,
  defaultPeerIds,
  apiVersion,
  fetchImpl = fetch,
}: {
  enabled: boolean;
  accessToken: string;
  defaultPeerIds: string[];
  apiVersion: string;
  fetchImpl?: typeof fetch;
}) {
  const normalizedPeerIds = normalizePeerIds(defaultPeerIds);

  return {
    async sendLeadNotification(payload: VkNotificationPayload): Promise<VkSendResult> {
      if (!enabled || !accessToken || normalizedPeerIds.length === 0) {
        return {
          status: 'skipped',
          error: null,
        };
      }

      const message = buildVkMessage(payload);
      const failures: string[] = [];

      for (const [index, peerId] of normalizedPeerIds.entries()) {
        try {
          const response = await fetchImpl('https://api.vk.com/method/messages.send', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: new URLSearchParams({
              access_token: accessToken,
              peer_id: peerId,
              random_id: `${Date.now()}${index}`,
              message,
              v: apiVersion,
            }),
          });

          if (!response.ok) {
            failures.push(`${peerId}: VK HTTP ${response.status}`);
            continue;
          }

          const json = (await response.json()) as {
            error?: {
              error_msg?: string;
            };
          };

          if (json.error?.error_msg) {
            failures.push(`${peerId}: ${json.error.error_msg}`);
          }
        } catch (error) {
          failures.push(`${peerId}: ${error instanceof Error ? error.message : 'VK request failed'}`);
        }
      }

      if (failures.length > 0) {
        return {
          status: 'failed',
          error: failures.join('; '),
        };
      }

      return {
        status: 'success',
        error: null,
      };
    },
    getDefaultPeerIds() {
      return [...normalizedPeerIds];
    },
  };
}
