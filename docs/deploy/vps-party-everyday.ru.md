# VPS: `party-everyday.ru`

Текущая схема хостинга для проекта:

1. `web/dist` раздаётся как статический фронтенд
2. `server` работает как отдельный Node-процесс
3. `https://party-everyday.ru/api/*` проксируется в локальный API

Это сохраняет текущий клиентский контракт без переписывания фронтенда, потому что заявки уже уходят на `/api/leads`.

## Базовые требования по безопасности

- публичный `root` должен указывать только на `/var/www/party-everyday/web/dist`
- корень репозитория, `server/`, `docs/`, `.git/`, `.env*`, SQLite и логи не должны лежать внутри web root
- API-процесс должен читать `.env` и `DB_PATH` из директорий вне `web/dist`
- Nginx должен явно блокировать dotfiles и чувствительные расширения, даже если их случайно положат рядом
- listing директорий должен быть выключен

## Рекомендуемая схема

- домен: `party-everyday.ru`
- статический фронтенд: `/var/www/party-everyday/web/dist`
- API: `127.0.0.1:8787`
- process manager для API: `systemd` или `pm2`
- TLS: Let's Encrypt
- чувствительные данные: вне web root, например `/var/www/party-everyday/shared`

## Nginx

Конфиг лежит рядом: [deploy/nginx/party-everyday.ru.conf](/Users/606ru/OneDrive/Desktop/але/site/deploy/nginx/party-everyday.ru.conf)

Что делает конфиг:

- отдаёт SPA из `web/dist`
- отправляет `/api/*` в `server`
- оставляет `try_files` для клиентских роутов
- прокидывает `X-Forwarded-*` заголовки в API
- ставит базовые security headers вместо удалённого `vercel.json`
- блокирует доступ к dotfiles, `*.env`, `*.sqlite`, логам и служебным конфигам

## Переменные для API

Минимум:

```env
PORT=8787
DB_PATH=/var/www/party-everyday/shared/data/leads.sqlite
VK_ENABLED=true
VK_ACCESS_TOKEN=...
VK_DEFAULT_PEER_ID=...
VK_API_VERSION=5.199
RATE_LIMIT_WINDOW_MS=60000
RATE_LIMIT_MAX_REQUESTS=5
```

`.env` сервера хранить отдельно от публичного фронтенда. Нормальный вариант: `/var/www/party-everyday/shared/server.env`.

## Порядок деплоя

1. Собрать фронтенд: `npm --prefix web ci && npm --prefix web run build`
2. Собрать сервер: `npm --prefix server ci && npm --prefix server run build`
3. Обновить содержимое `/var/www/party-everyday/web/dist`
4. Проверить, что `.env`, SQLite и логи лежат вне `/var/www/party-everyday/web/dist`
5. Обновить и перезапустить API-процесс
6. Перезагрузить Nginx: `nginx -t && systemctl reload nginx`

## Проверка

1. `curl -I https://party-everyday.ru/`
2. `curl https://party-everyday.ru/api/healthz`
3. Отправить тестовую заявку из браузера
4. Проверить запись в SQLite и доставку в VK
