# VPS: `party-everyday.ru`

Актуальная схема деплоя для проекта — через `Dokploy`, без репозиторного `nginx`-конфига.

## Текущая схема

1. `web` собирается через `Nixpacks`
2. `server` собирается отдельным сервисом через `Nixpacks`
3. Домен `party-everyday.ru` настраивается в `Dokploy Domains`
4. Роутинг делается path-based правилами в `Dokploy`:
   - `Path: /` -> `web`
   - `Path: /api` -> `server`

Это сохраняет текущий клиентский контракт без переписывания frontend, потому что заявки уже уходят на `/api/leads`.

## Что важно

- Репозиторный `nginx`-конфиг удалён, потому что он не используется в текущем Dokploy-деплое.
- Внешний reverse proxy и TLS обслуживает сам `Dokploy`.
- Отдельно поддерживать VPS-схему с ручным `nginx`, `certbot`, `systemd` и `pm2` больше не нужно.

## Минимальные переменные для API

```env
PORT=8787
DB_PATH=/data/leads.sqlite
VK_ENABLED=true
VK_ACCESS_TOKEN=...
VK_DEFAULT_PEER_ID=...
VK_API_VERSION=5.199
SMARTCAPTCHA_SERVER_KEY=...
RATE_LIMIT_WINDOW_MS=600000
RATE_LIMIT_MAX_REQUESTS=20
```

## Минимальные переменные для web

```env
VITE_SMARTCAPTCHA_SITE_KEY=...
```

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

1. `https://party-everyday.ru/` открывается
2. `https://party-everyday.ru/api/healthz` отвечает `200`
3. отправка формы уходит на `/api/leads`
4. запись появляется в SQLite
5. VK-уведомление уходит или корректно помечается как `failed/skipped`
