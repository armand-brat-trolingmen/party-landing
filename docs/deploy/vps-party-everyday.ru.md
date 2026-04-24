# VPS: `party-everyday.ru`

Актуальная схема деплоя для проекта — через `Dokploy`, без репозиторного `nginx`-конфига.

## Текущая схема

1. `web` собирается через `Nixpacks`
2. `server` собирается отдельным сервисом через `Nixpacks`
3. домен `party-everyday.ru` настраивается в `Dokploy Domains`
4. routing делается path-based правилами:
   - `Path: /` -> `web`
   - `Path: /api` -> `server`

Это сохраняет текущий клиентский контракт без переписывания фронтенда, потому что форма уже ходит на `/api/leads`.

## Что важно

- внешний reverse proxy и TLS обслуживает сам `Dokploy`;
- репозиторный `nginx`-конфиг в этой схеме не нужен;
- отдельно поддерживать ручной `nginx + certbot + pm2` для этого проекта больше не надо.

## Минимальные env для API

```env
PORT=8787
DB_PATH=/data/leads.sqlite
TRUST_PROXY=1
ALLOWED_ORIGINS=https://party-everyday.ru,https://www.party-everyday.ru,http://party-everyday.ru,http://www.party-everyday.ru
VK_ENABLED=true
VK_ACCESS_TOKEN=...
VK_DEFAULT_PEER_ID=...
VK_API_VERSION=5.199
SMARTCAPTCHA_SERVER_KEY=...
SMARTCAPTCHA_REQUIRED=true
LEADS_RATE_LIMIT_WINDOW_MS=60000
LEADS_RATE_LIMIT_MAX_REQUESTS=10
HEALTH_RATE_LIMIT_WINDOW_MS=60000
HEALTH_RATE_LIMIT_MAX_REQUESTS=60
```

Legacy fallback для старого конфига:

```env
RATE_LIMIT_WINDOW_MS=60000
RATE_LIMIT_MAX_REQUESTS=10
```

## Минимальные env для web

```env
VITE_SMARTCAPTCHA_SITE_KEY=...
```

## Почему это безопаснее

- `POST /api/leads` принимает запросы только с разрешенных origin сайта и локальной разработки;
- чужой `Origin` / `Referer` режется на backend до бизнес-логики;
- флуд по форме получает `429` до попадания в сервис, БД и VK;
- `GET /healthz` и `GET /api/healthz` тоже ограничены по частоте;
- наружу сервер отдает только общие ошибки без внутренних причин.

## Настройка доменов в Dokploy

Для `web`:
- Domain: `party-everyday.ru`
- Path: `/`
- Port: `80`
- HTTPS: `enabled`

Для `server`:
- Domain: `party-everyday.ru`
- Path: `/api`
- Port: `8787`
- HTTPS: `enabled`

## Проверка после деплоя

1. `https://party-everyday.ru/` открывается.
2. `https://party-everyday.ru/api/healthz` отвечает `200`.
3. Валидная форма отправляется на `/api/leads` и получает `201`.
4. Запись появляется в SQLite.
5. VK-уведомление уходит или корректно помечается как `failed/skipped`.
6. Запросы с чужого origin получают `403`.
7. Частые запросы на `/api/leads` и `/api/healthz` получают `429`.
