# Dokploy: два сервиса

Этот репозиторий нужно деплоить в Dokploy двумя отдельными сервисами:

1. `web` — фронтенд
2. `server` — API для лидов

## Почему не из корня

Корень репозитория нужен для локальной разработки. Боевые сервисы живут в подпапках:

- `web/` — Vite + React SPA
- `server/` — Express API

Если поднимать корень как один Node-сервис, Dokploy не сможет корректно разрулить и фронт, и API одной конфигурацией.

## Сервис 1: web

- Repository: `armand-brat-trolingmen/party-landing`
- Branch: `main`
- Root Directory: `web`
- Builder: `Nixpacks`

Что важно:
- версия Node берется из `web/package.json` (`22.x`);
- `web/nixpacks.toml` подсказывает Nixpacks, что итоговая SPA лежит в `dist`;
- обычный health check для web — `/`.

## Сервис 2: server

- Repository: `armand-brat-trolingmen/party-landing`
- Branch: `main`
- Root Directory: `server`
- Builder: `Nixpacks`

Что важно:
- версия Node берется из `server/package.json` (`22.x`);
- `server/nixpacks.toml` фиксирует стартовую команду `npm run start`;
- health check: `/healthz`.

## Обязательные env для server

- `PORT`
- `DB_PATH`
- `TRUST_PROXY`
- `ALLOWED_ORIGINS`
- `VK_ENABLED`
- `VK_ACCESS_TOKEN`
- `VK_DEFAULT_PEER_ID`
- `VK_API_VERSION`
- `SMARTCAPTCHA_SERVER_KEY`
- `SMARTCAPTCHA_REQUIRED`

## Опциональные env для server

- `VK_DEFAULT_PEER_ID_2`
- `VK_DEFAULT_PEER_ID_3`
- `VK_DEFAULT_PEER_ID_4`
- `LEADS_RATE_LIMIT_WINDOW_MS`
- `LEADS_RATE_LIMIT_MAX_REQUESTS`
- `HEALTH_RATE_LIMIT_WINDOW_MS`
- `HEALTH_RATE_LIMIT_MAX_REQUESTS`
- `RATE_LIMIT_WINDOW_MS`
- `RATE_LIMIT_MAX_REQUESTS`
- `SQLITE_BACKUP_DIR`
- `SQLITE_BACKUP_RETENTION_DAYS`

Минимальный пример:

```env
PORT=8787
DB_PATH=/data/leads.sqlite
TRUST_PROXY=1
ALLOWED_ORIGINS=https://party-everyday.ru,https://www.party-everyday.ru,http://party-everyday.ru,http://www.party-everyday.ru
VK_ENABLED=true
VK_ACCESS_TOKEN=your_token
VK_DEFAULT_PEER_ID=2000000001
VK_API_VERSION=5.199
SMARTCAPTCHA_SERVER_KEY=your_smartcaptcha_server_key
SMARTCAPTCHA_REQUIRED=true
LEADS_RATE_LIMIT_WINDOW_MS=60000
LEADS_RATE_LIMIT_MAX_REQUESTS=10
HEALTH_RATE_LIMIT_WINDOW_MS=60000
HEALTH_RATE_LIMIT_MAX_REQUESTS=60
SQLITE_BACKUP_DIR=/data/backups
SQLITE_BACKUP_RETENTION_DAYS=14
```

Legacy fallback:

```env
RATE_LIMIT_WINDOW_MS=60000
RATE_LIMIT_MAX_REQUESTS=10
```

Используй его только если старый деплой еще не переведен на `LEADS_RATE_LIMIT_*`.

## Важно по безопасности

- `TRUST_PROXY=1` корректен только если внешний трафик до API идет через Dokploy reverse proxy.
- Не открывай порт backend напрямую в интернет. Иначе `TRUST_PROXY=1` снова делает возможной подделку IP через `X-Forwarded-For`.
- `SMARTCAPTCHA_REQUIRED=true` — fail-closed режим: если `SMARTCAPTCHA_SERVER_KEY` не задан, backend не должен стартовать.
- `ALLOWED_ORIGINS` должен содержать только боевые домены сайта. Локальные `localhost` и `127.0.0.1` сервер разрешает сам для разработки.
- `DB_PATH` и `SQLITE_BACKUP_DIR` должны указывать внутрь persistent volume `/data`, иначе база и backup могут потеряться при redeploy.

## Как связать фронт и API

Лучший вариант для текущего проекта:

- домен фронта обслуживает `web`;
- путь `/api/*` проксируется в `server`.

Это сохраняет текущий клиентский контракт, потому что фронтенд уже отправляет заявки на `/api/leads`.

## Проверка после деплоя

1. Открой фронт и проверь, что главная загружается.
2. Проверь `GET /healthz` у API.
3. Отправь тестовую заявку.
4. Убедись, что:
   - API отвечает `201` для валидной формы;
   - запись появляется в SQLite;
   - уведомление в VK уходит или корректно помечается как `failed/skipped`;
   - запрос с чужого origin получает `403`;
   - флуд по `/api/leads` получает `429`.
