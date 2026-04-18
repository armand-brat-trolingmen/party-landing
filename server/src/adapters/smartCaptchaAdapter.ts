export type SmartCaptchaVerifyInput = {
  token: string | null;
  remoteIp: string | null;
};

export type SmartCaptchaVerifyResult = {
  configured: boolean;
  verified: boolean;
  reason: string | null;
};

type SmartCaptchaValidateResponse = {
  status?: string;
  message?: string;
  host?: string;
};

const validateUrl = 'https://smartcaptcha.cloud.yandex.ru/validate';

export function createSmartCaptchaVerifier({
  serverKey,
  fetchImpl = fetch,
}: {
  serverKey: string;
  fetchImpl?: typeof fetch;
}) {
  const normalizedServerKey = serverKey.trim();

  return {
    async verify({ token, remoteIp }: SmartCaptchaVerifyInput): Promise<SmartCaptchaVerifyResult> {
      if (!normalizedServerKey) {
        return {
          configured: false,
          verified: false,
          reason: 'smartcaptcha_not_configured',
        };
      }

      const normalizedToken = token?.trim() ?? '';

      if (!normalizedToken) {
        return {
          configured: true,
          verified: false,
          reason: 'smartcaptcha_missing',
        };
      }

      try {
        const body = new URLSearchParams({
          secret: normalizedServerKey,
          token: normalizedToken,
        });

        if (remoteIp) {
          body.set('ip', remoteIp);
        }

        const response = await fetchImpl(validateUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          body,
        });

        if (!response.ok) {
          return {
            configured: true,
            verified: false,
            reason: `smartcaptcha_http_${response.status}`,
          };
        }

        const result = (await response.json()) as SmartCaptchaValidateResponse;

        if (result.status === 'ok') {
          return {
            configured: true,
            verified: true,
            reason: null,
          };
        }

        return {
          configured: true,
          verified: false,
          reason: result.message?.trim() || 'smartcaptcha_failed',
        };
      } catch {
        return {
          configured: true,
          verified: false,
          reason: 'smartcaptcha_network_error',
        };
      }
    },
  };
}
