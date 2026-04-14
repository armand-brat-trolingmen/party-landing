# Lead Backend MVP

Простой backend для сбора лидов с сайта `party-landing`.

Что умеет:
- принимает `name` и `phone` из фронтенда
- сохраняет лид в локальную SQLite-базу
- после сохранения пробует отправить уведомление в VK
- если VK не ответил, лид все равно остается в базе

## Структура

- `src/index.ts` — запуск сервера
- `src/app.ts` — Express app и middleware
- `src/routes/leads.ts` — `POST /api/leads`
- `src/validation/leadValidation.ts` — серверная валидация
- `src/db/` — SQLite клиент, миграция и repository
- `src/adapters/vkAdapter.ts` — отправка в VK
- `src/services/leadService.ts` — логика `validate -> save -> VK -> update status`

## Переменные окружения

Скопируйте [server/.env.example](C:/Users/606ru/OneDrive/Desktop/але/site/.worktrees/codex-leads-mvp/server/.env.example) в `server/.env`.

Обязательные:
- `PORT=8787`
- `DB_PATH=./data/leads.sqlite`
- `VK_ENABLED=true`
- `VK_ACCESS_TOKEN=...`
- `VK_DEFAULT_PEER_ID=...`
- `VK_DEFAULT_PEER_ID_2=...`
- `VK_DEFAULT_PEER_ID_3=...`
- `VK_DEFAULT_PEER_ID_4=...`
- `VK_API_VERSION=5.199`

Опциональные:
- `RATE_LIMIT_WINDOW_MS=60000`
- `RATE_LIMIT_MAX_REQUESTS=5`

## Где лежит база

SQLite-файл создается по пути из `DB_PATH`.

По умолчанию:
- [server/data/leads.sqlite](C:/Users/606ru/OneDrive/Desktop/але/site/.worktrees/codex-leads-mvp/server/data/leads.sqlite)

Папка `server/data/` и локальный `server/.env` уже добавлены в [`.gitignore`](C:/Users/606ru/OneDrive/Desktop/але/site/.worktrees/codex-leads-mvp/.gitignore), поэтому база и секреты не должны уходить в git.

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

Фронтенд будет на `http://127.0.0.1:5173`, backend на `http://127.0.0.1:8787`.

Во время локальной разработки фронтенд проксирует `/api/*` на backend через Vite proxy.

## Как протестировать

### Через браузер
1. Запустите backend
2. Запустите frontend
3. Откройте главную страницу
4. Проверьте:
   - нижнюю фиолетовую форму
   - popup-форму
5. После отправки проверьте, что появился файл SQLite и в таблице `leads` появилась запись

### Через curl / PowerShell

```bash
curl -X POST http://127.0.0.1:8787/api/leads \
  -H "Content-Type: application/json" \
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

С клиента `peer_id` не приходит вообще. Если указано несколько `peer_id`, один и тот же лид отправляется во все указанные беседы от лица бота.

Для работы нужны:
- корректный `VK_ACCESS_TOKEN`
- хотя бы один корректный `VK_DEFAULT_PEER_ID`
- доступ токена к нужной беседе

Сообщение в VK содержит:
- имя
- телефон
- время

## Ограничения VK

- если токен невалидный или у него нет доступа к беседе, VK-отправка вернет ошибку
- если `VK_ENABLED=false` или не заданы `VK_ACCESS_TOKEN` / все `VK_DEFAULT_PEER_ID*`, отправка будет помечена как `skipped`
- если отправка удалась не во все беседы, лид всё равно сохранится, а в `vk_send_error` запишется список `peer_id`, куда доставка не прошла
- это не ломает основной поток: лид все равно сохраняется в SQLite

## Прод-запуск на обычном сервере

1. Соберите проект:

```bash
npm run build
```

2. Запустите backend:

```bash
npm run server:start
```

3. Раздайте `web/dist` как статику через nginx/apache
4. Проксируйте `/api/leads` на Node backend

Для production лучше использовать процесс-менеджер уровня `pm2` или systemd unit.
