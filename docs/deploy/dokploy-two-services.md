# Dokploy: два сервиса

Этот репозиторий нужно деплоить в Dokploy не из корня, а двумя отдельными сервисами:

1. `web` — фронтенд
2. `server` — API для лидов

## Почему не из корня

Корень репозитория — это управляющий слой для локальной разработки. Боевые сервисы живут в подпапках:

- `web/` — Vite + React SPA
- `server/` — Express API

Если выбрать корень репозитория как один Node-сервис, Dokploy не сможет корректно запустить и фронт, и API одной командой.

## Сервис 1: web

- Repository: `armand-brat-trolingmen/party-landing`
- Branch: `main`
- Root Directory: `web`
- Builder: `Nixpacks`

Что важно:

- Node берётся из `web/package.json` (`22.x`)
- `web/nixpacks.toml` подсказывает Nixpacks, что итоговая SPA лежит в `dist`
- Для health check обычно достаточно `/`

Переменные окружения:

- не обязательны, если фронт ходит в API через внешний reverse proxy
- если API будет на отдельном домене, фронту нужен прокси/маршрутизация на уровне Dokploy или домена

## Сервис 2: server

- Repository: `armand-brat-trolingmen/party-landing`
- Branch: `main`
- Root Directory: `server`
- Builder: `Nixpacks`

Что важно:

- Node берётся из `server/package.json` (`22.x`)
- `server/nixpacks.toml` фиксирует стартовую команду `npm run start`
- Health check: `/healthz`

Обязательные переменные окружения:

- `PORT`
- `DB_PATH`
- `TRUST_PROXY`
- `VK_ENABLED`
- `VK_ACCESS_TOKEN`
- `VK_DEFAULT_PEER_ID`
- `VK_API_VERSION`
- `SMARTCAPTCHA_SERVER_KEY`
- `SMARTCAPTCHA_REQUIRED`

Опционально:

- `VK_DEFAULT_PEER_ID_2`
- `VK_DEFAULT_PEER_ID_3`
- `VK_DEFAULT_PEER_ID_4`
- `RATE_LIMIT_WINDOW_MS`
- `RATE_LIMIT_MAX_REQUESTS`
- `SQLITE_BACKUP_DIR`
- `SQLITE_BACKUP_RETENTION_DAYS`

Минимальный пример:

```env
PORT=8787
DB_PATH=/data/leads.sqlite
TRUST_PROXY=1
VK_ENABLED=true
VK_ACCESS_TOKEN=your_token
VK_DEFAULT_PEER_ID=2000000001
VK_API_VERSION=5.199
SMARTCAPTCHA_SERVER_KEY=your_smartcaptcha_server_key
SMARTCAPTCHA_REQUIRED=true
RATE_LIMIT_WINDOW_MS=600000
RATE_LIMIT_MAX_REQUESTS=20
SQLITE_BACKUP_DIR=/data/backups
SQLITE_BACKUP_RETENTION_DAYS=14
```

Важно по безопасности:

- `TRUST_PROXY=1` корректен для текущей схемы Dokploy, где внешний трафик приходит в API только через reverse proxy.
- Не открывай порт `8787` напрямую в интернет. Если API можно обойти мимо Dokploy proxy, `TRUST_PROXY=1` снова даст возможность подделывать IP через `X-Forwarded-For`.
- `SMARTCAPTCHA_REQUIRED=true` означает fail-closed режим: если `SMARTCAPTCHA_SERVER_KEY` не задан, backend не должен стартовать как будто защита включена.
- `DB_PATH` и `SQLITE_BACKUP_DIR` должны указывать внутрь persistent volume `/data`, иначе база и backup могут потеряться при redeploy.

## Как связать фронт и API

Есть два нормальных варианта:

1. Повесить оба сервиса на один домен и проксировать `/api/*` в `server`
2. Дать `server` отдельный поддомен и настроить reverse proxy так, чтобы браузер всё равно ходил на `/api/*`

Для текущего фронтенда лучший вариант:

- домен фронта обслуживает `web`
- путь `/api/*` проксируется в `server`

Это сохранит текущие клиентские запросы без изменения кода, потому что фронт уже отправляет лиды на `/api/leads`.

## Проверка после деплоя

1. Открой фронт и убедись, что главная загружается
2. Проверь `GET /healthz` у API
3. Отправь тестовую заявку
4. Убедись, что:
   - API отвечает `201`
   - запись появляется в SQLite
   - уведомление в VK отправляется или корректно помечается как `failed/skipped`
