# API Hardening Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Убрать три найденные security-слабости API: spoofable IP, fail-open поведение SmartCaptcha и засорение SQLite спамом/дублями.

**Architecture:** План делает точечный hardening существующего Express + SQLite backend без переписывания сервиса. Мы сохраняем текущий submit flow и мягкий UX для пользователя, но делаем доверие к IP явным, server-side captcha обязательной по конфигу и прекращаем записывать откровенный мусор в рабочую базу.

**Tech Stack:** Node.js, Express 5, TypeScript, better-sqlite3, Vitest, Dokploy

---

## File Map

**Modify**
- `C:\Users\606ru\OneDrive\Desktop\але\site\server\src\index.ts`
  - добавить чтение и проверку security env
  - передавать в app настройку trust proxy и политику обязательной капчи
- `C:\Users\606ru\OneDrive\Desktop\але\site\server\src\app.ts`
  - включить корректный `trust proxy`
  - не полагаться на сырой `x-forwarded-for`
- `C:\Users\606ru\OneDrive\Desktop\але\site\server\src\utils\requestMeta.ts`
  - упростить до безопасного чтения IP через Express `request.ip`
- `C:\Users\606ru\OneDrive\Desktop\але\site\server\src\services\leadService.ts`
  - fail closed по SmartCaptcha
  - не писать `spam` и `duplicate` в основную SQLite таблицу
  - сохранить текущий фронтовый success-ответ без лишних подробностей
- `C:\Users\606ru\OneDrive\Desktop\але\site\server\src\types.ts`
  - при необходимости уточнить типы ответа для отклонённых лидов
- `C:\Users\606ru\OneDrive\Desktop\але\site\server\src\routes\leads.test.ts`
  - покрыть поведение маршрута с trust proxy и обязательной captcha
- `C:\Users\606ru\OneDrive\Desktop\але\site\server\src\services\leadService.test.ts`
  - покрыть отказ в записи spam/duplicate и fail-closed логику captcha
- `C:\Users\606ru\OneDrive\Desktop\але\site\server\.env.example`
  - добавить новые env с безопасными значениями по умолчанию
- `C:\Users\606ru\OneDrive\Desktop\але\site\docs\deploy\dokploy-two-services.md`
  - задокументировать обязательные security env и ожидания по proxy

**No schema changes planned**
- `leads` таблицу не трогаем, чтобы не вносить лишний риск в продовую БД.

---

### Task 1: Зафиксировать доверенную схему получения IP

**Files:**
- Modify: `C:\Users\606ru\OneDrive\Desktop\але\site\server\src\index.ts`
- Modify: `C:\Users\606ru\OneDrive\Desktop\але\site\server\src\app.ts`
- Modify: `C:\Users\606ru\OneDrive\Desktop\але\site\server\src\utils\requestMeta.ts`
- Test: `C:\Users\606ru\OneDrive\Desktop\але\site\server\src\routes\leads.test.ts`
- Test: `C:\Users\606ru\OneDrive\Desktop\але\site\server\src\services\leadService.test.ts`

- [ ] **Step 1: Написать падающий тест на spoofed `x-forwarded-for`**

Проверить сценарий:
- приложение работает с `trust proxy = false`
- клиент подставляет `X-Forwarded-For: 8.8.8.8`
- API не должен считать этот заголовок источником истины

- [ ] **Step 2: Прокинуть настройку `TRUST_PROXY` в `createApp`**

Новая env:
```env
TRUST_PROXY=loopback
```

Ожидаемое поведение:
- в Dokploy за reverse proxy Express будет доверять только прокси-цепочке, а не сырому пользовательскому заголовку

- [ ] **Step 3: Упростить `getRequestIp()`**

Оставить безопасный источник:
- `request.ip`

Не разбирать `request.headers['x-forwarded-for']` вручную.

- [ ] **Step 4: Запустить backend-тесты**

Run:
```bash
npm test
```

Expected:
- тест на spoofing сначала падает, после фикса проходит

- [ ] **Step 5: Commit**

```bash
git add server/src/index.ts server/src/app.ts server/src/utils/requestMeta.ts server/src/routes/leads.test.ts server/src/services/leadService.test.ts
git commit -m "fix: trust proxy for lead request ip"
```

---

### Task 2: Сделать SmartCaptcha fail-closed по конфигурации

**Files:**
- Modify: `C:\Users\606ru\OneDrive\Desktop\але\site\server\src\index.ts`
- Modify: `C:\Users\606ru\OneDrive\Desktop\але\site\server\src\services\leadService.ts`
- Modify: `C:\Users\606ru\OneDrive\Desktop\але\site\server\.env.example`
- Modify: `C:\Users\606ru\OneDrive\Desktop\але\site\docs\deploy\dokploy-two-services.md`
- Test: `C:\Users\606ru\OneDrive\Desktop\але\site\server\src\services\leadService.test.ts`

- [ ] **Step 1: Написать падающий тест на пустой `SMARTCAPTCHA_SERVER_KEY` при обязательной капче**

Проверить сценарий:
- капча обязательна
- verifier не сконфигурирован
- сервис не должен считать такой lead валидным

- [ ] **Step 2: Ввести явный env-флаг обязательности**

Новая env:
```env
SMARTCAPTCHA_REQUIRED=true
```

Политика:
- если `SMARTCAPTCHA_REQUIRED=true` и ключ пустой, backend не должен тихо стартовать как будто всё нормально
- предпочтительный вариант: падать на старте с понятной ошибкой конфигурации

- [ ] **Step 3: Зафиксировать поведение в `leadService`**

Даже если verifier каким-то образом вернул `configured: false` при обязательной капче:
- lead не считается `passed`
- VK не вызывается
- клиент получает общий безопасный ответ, без раскрытия внутренней конфигурации

- [ ] **Step 4: Обновить документацию env**

Отразить в docs:
- на проде `SMARTCAPTCHA_REQUIRED=true`
- `SMARTCAPTCHA_SERVER_KEY` обязателен

- [ ] **Step 5: Запустить backend-тесты**

Run:
```bash
npm test
```

Expected:
- новые тесты проходят
- старые сценарии по капче не ломаются

- [ ] **Step 6: Commit**

```bash
git add server/src/index.ts server/src/services/leadService.ts server/.env.example docs/deploy/dokploy-two-services.md server/src/services/leadService.test.ts
git commit -m "fix: require smartcaptcha in production"
```

---

### Task 3: Перестать засорять SQLite спамом и дублями

**Files:**
- Modify: `C:\Users\606ru\OneDrive\Desktop\але\site\server\src\services\leadService.ts`
- Modify: `C:\Users\606ru\OneDrive\Desktop\але\site\server\src\types.ts`
- Test: `C:\Users\606ru\OneDrive\Desktop\але\site\server\src\services\leadService.test.ts`
- Test: `C:\Users\606ru\OneDrive\Desktop\але\site\server\src\routes\leads.test.ts`

- [ ] **Step 1: Написать падающие тесты на `spam` и `duplicate` без записи в DB**

Нужные сценарии:
- honeypot-filled lead не вызывает `repository.insertLead`
- duplicate lead не вызывает `repository.insertLead`
- soft-rate-limit lead не вызывает `repository.insertLead`

- [ ] **Step 2: Изменить ветвление в `createLead()`**

Новая логика:
- сначала валидация
- потом anti-spam / duplicate classification
- если результат не `passed`, вернуть безопасный `ok: true` или `ok: false` по выбранной политике, но без записи в SQLite и без вызова VK

Рекомендация:
- для UX оставить `ok: true` и нейтральное сообщение, чтобы бот не получал лишнего сигнала о детекте

- [ ] **Step 3: Не менять контракт успешного `passed` lead**

Для валидной заявки сохранить:
- `insertLead`
- `updateVkStatus`
- текущий фронтовый flow

- [ ] **Step 4: Прогнать тесты**

Run:
```bash
npm test
```

Expected:
- spam/duplicate не попадают в SQLite
- валидные leads продолжают сохраняться

- [ ] **Step 5: Commit**

```bash
git add server/src/services/leadService.ts server/src/types.ts server/src/services/leadService.test.ts server/src/routes/leads.test.ts
git commit -m "fix: drop spam leads before sqlite insert"
```

---

### Task 4: Финальная регрессия и прод-проверка

**Files:**
- Modify if needed: `C:\Users\606ru\OneDrive\Desktop\але\site\docs\deploy\dokploy-two-services.md`

- [ ] **Step 1: Прогнать локальную проверку**

Run:
```bash
npm test
npm audit --omit=dev
```

Expected:
- все backend-тесты зелёные
- без prod audit findings

- [ ] **Step 2: Проверить рабочие env в Dokploy**

Проверить наличие:
```env
PORT=8787
DB_PATH=/data/leads.sqlite
TRUST_PROXY=loopback
SMARTCAPTCHA_REQUIRED=true
SMARTCAPTCHA_SERVER_KEY=...
RATE_LIMIT_WINDOW_MS=600000
RATE_LIMIT_MAX_REQUESTS=20
```

- [ ] **Step 3: После деплоя проверить боевой flow**

Ручные сценарии:
- обычная заявка с валидной капчей проходит
- пустой/сломанный токен не проходит как `passed`
- повторный spam submit не раздувает SQLite
- `/healthz` отвечает `200`

- [ ] **Step 4: Commit docs-only правки, если появились**

```bash
git add docs/deploy/dokploy-two-services.md
git commit -m "docs: document api hardening env"
```

---

## Notes

- Этот план не вводит новые библиотеки.
- Этот план не шифрует SQLite at rest. Если злоумышленник получит shell/root/docker access на VPS, файл базы всё равно будет доступен. Это инфраструктурный риск, не кодовый.
- Этот план не решает DDoS на уровне edge. Для этого нужен reverse proxy / firewall / WAF на инфраструктуре.
