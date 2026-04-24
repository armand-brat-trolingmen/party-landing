# Lead Backend MVP

Простой backend для приема заявок с сайта `party-landing`.

Что делает сервер:
- принимает `name` и `phone` с фронтенда;
- пишет лид в SQLite;
- после сохранения пытается отправить уведомление в VK;
- если VK недоступен, лид все равно остается в базе.

## Структура

- `src/index.ts` — запуск сервера и чтение env
- `src/app.ts` — Express app, CORS/origin gate, rate limits, error handling
- `src/routes/leads.ts` — `POST /api/leads`
- `src/validation/leadValidation.ts` — валидация обязательных полей
- `src/db/` — SQLite клиент, миграции, repository
- `src/adapters/vkAdapter.ts` — доставка уведомлений в VK
- `src/services/leadService.ts` — бизнес-логика `validate -> anti-spam -> save -> VK -> update status`

## Переменные окружения

Скопируйте `server/.env.example` в `server/.env`.

Обязательные:
- `PORT=8787`
- `DB_PATH=./data/leads.sqlite`
- `TRUST_PROXY=1`
- `ALLOWED_ORIGINS=https://party-everyday.ru,https://www.party-everyday.ru,http://party-everyday.ru,http://www.party-everyday.ru`
- `VK_ENABLED=true`
- `VK_ACCESS_TOKEN=...`
- `VK_DEFAULT_PEER_ID=...`
- `VK_API_VERSION=5.199`
- `SMARTCAPTCHA_SERVER_KEY=...`
- `SMARTCAPTCHA_REQUIRED=true`

Опциональные:
- `VK_DEFAULT_PEER_ID_2=...`
- `VK_DEFAULT_PEER_ID_3=...`
- `VK_DEFAULT_PEER_ID_4=...`
- `LEADS_RATE_LIMIT_WINDOW_MS=60000`
- `LEADS_RATE_LIMIT_MAX_REQUESTS=10`
- `HEALTH_RATE_LIMIT_WINDOW_MS=60000`
- `HEALTH_RATE_LIMIT_MAX_REQUESTS=60`
- `RATE_LIMIT_WINDOW_MS=...`
- `RATE_LIMIT_MAX_REQUESTS=...`
- `SQLITE_BACKUP_DIR=./data/backups`
- `SQLITE_BACKUP_RETENTION_DAYS=14`

`RATE_LIMIT_WINDOW_MS` и `RATE_LIMIT_MAX_REQUESTS` оставлены как legacy fallback только для lead endpoint. Для новых конфигов используй `LEADS_RATE_LIMIT_*`.

## Безопасность API

Сервер принимает `POST /api/leads` только с:
- `https://party-everyday.ru`
- `https://www.party-everyday.ru`
- `http://party-everyday.ru`
- `http://www.party-everyday.ru`
- `http://localhost:*`
- `http://127.0.0.1:*`

Что важно:
- один `CORS` не считается полной защитой;
- сервер дополнительно валидирует `Origin` и fallback на `Referer`;
- чужой origin получает `403` до бизнес-логики;
- лид-эндпоинт имеет hard rate limit `10 req/min/IP`;
- `GET /healthz` и `GET /api/healthz` имеют свой limit `60 req/min/IP`;
- наружу возвращаются только общие ошибки без внутренних деталей.

## Где лежит база

SQLite-файл создается по пути из `DB_PATH`.

По умолчанию:
- `server/data/leads.sqlite`

Папка `server/data/` и локальный `server/.env` уже добавлены в `.gitignore`, поэтому база и секреты не должны попадать в git.

## Локальный запуск

Из корня репозитория:

```bash
npm install
npm --prefix web install
npm --prefix server install
```

Потом в двух терминалах:

```bash
npm run dev:server
```

```bash
npm run dev:web
```

Локально фронтенд будет на `http://127.0.0.1:5173`, backend на `http://127.0.0.1:8787`.

Во время локальной разработки фронтенд проксирует `/api/*` на backend через Vite proxy.

## Как протестировать

### Через браузер
1. Запустите backend.
2. Запустите frontend.
3. Откройте главную страницу.
4. Проверьте нижнюю форму и popup-форму.
5. После отправки проверьте, что в `server/data/leads.sqlite` появилась запись.

### Через curl

```bash
curl -X POST http://127.0.0.1:8787/api/leads \
  -H "Content-Type: application/json" \
  -H "Origin: https://party-everyday.ru" \
  -d "{\"name\":\"Иван\",\"phone\":\"+7 (999) 123 45 67\"}"
```

Ожидаемый ответ:

```json
{
  "ok": true,
  "id": 1,
  "vkSendStatus": "success",
  "message": "Заявка сохранена"
}
```

## Настройка VK

Backend отправляет уведомление через `messages.send`.

Используются только серверные `peer_id`:
- `VK_DEFAULT_PEER_ID`
- `VK_DEFAULT_PEER_ID_2`
- `VK_DEFAULT_PEER_ID_3`
- `VK_DEFAULT_PEER_ID_4`

С клиента `peer_id` не принимается. Если указано несколько `peer_id`, одна и та же заявка отправляется во все указанные беседы от лица бота.

Для работы нужны:
- корректный `VK_ACCESS_TOKEN`;
- хотя бы один корректный `VK_DEFAULT_PEER_ID`;
- доступ токена к нужной беседе.

## Ограничения VK

- если токен невалидный или у него нет доступа к беседе, VK-отправка вернет ошибку;
- если `VK_ENABLED=false` или не заданы `VK_ACCESS_TOKEN` / все `VK_DEFAULT_PEER_ID*`, отправка будет помечена как `skipped`;
- если отправка удалась не во все беседы, лид все равно сохранится, а в `vk_send_error` будет список `peer_id`, где доставка не прошла.

## Прод-запуск на обычном сервере

1. Соберите проект:

```bash
npm run build
```

2. Запустите backend:

```bash
npm run server:start
```

3. Раздайте `web/dist` как статику.
4. Проксируйте `/api/*` на Node backend.

Для production лучше использовать процесс-менеджер уровня `pm2` или systemd unit.
