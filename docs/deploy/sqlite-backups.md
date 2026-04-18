# SQLite backups

Для проекта используется одна прикладная база: `SQLite` по пути из `DB_PATH`.

## Что делает backup

Backup запускается отдельным server-скриптом и создаёт консистентную копию текущей базы без утилиты `sqlite3`.

Скрипт:
- читает `DB_PATH`
- создаёт backup в `SQLITE_BACKUP_DIR`
- при необходимости удаляет старые backup-файлы по `SQLITE_BACKUP_RETENTION_DAYS`

## Переменные

В `server/.env`:

```env
DB_PATH=/data/leads.sqlite
SQLITE_BACKUP_DIR=/data/backups
SQLITE_BACKUP_RETENTION_DAYS=14
```

Если `SQLITE_BACKUP_DIR` не задан, backup по умолчанию уходит в папку `backups` рядом с файлом базы.

## Ручной запуск

В каталоге `server`:

```bash
npm run build
npm run backup:sqlite
```

Если всё нормально, скрипт напечатает путь до созданного файла.

## Автозапуск в Dokploy

Для текущего деплоя через `Dokploy` правильнее использовать `Schedule Jobs`, а не `cron` на хосте.

Настройка:

1. Открой `Dokploy -> Schedule Jobs -> Create`
2. Выбери тип `Application Job`
3. В качестве приложения выбери `server`
4. Команда:

```bash
npm run backup:sqlite
```

5. Расписание, например ежедневно в `03:00`:

```cron
0 3 * * *
```

Что важно:
- job запускается внутри контейнера приложения
- контейнер `server` должен быть запущен
- `SQLITE_BACKUP_DIR` должен указывать в persistent storage, а не во временную файловую систему контейнера

Для твоей схемы это должен быть путь вида:

```env
DB_PATH=/data/leads.sqlite
SQLITE_BACKUP_DIR=/data/backups
```

Тогда и база, и backup-файлы переживут redeploy.

## Резервный вариант: cron на VPS

Если ты по какой-то причине не хочешь использовать `Dokploy Schedule Jobs`, можно делать это через `cron` на сервере, но тогда команду надо запускать внутри контейнера `server` через `docker exec`. Этот вариант зависит от реального имени контейнера и менее удобен, чем встроенный `Dokploy` job.

## Как скачать базу с VPS

Если база лежит по пути `/data/...`, это обычно путь внутри контейнера `server`, а не прямой путь на хосте VPS.

Поэтому безопасный путь такой:

1. Найти имя контейнера `server`

```bash
docker ps --format "{{.Names}}" | grep server
```

2. Скопировать файл из контейнера на хост

Текущая база:

```bash
docker cp CONTAINER_NAME:/data/leads.sqlite /root/leads.sqlite
```

Папка backup-файлов:

```bash
docker cp CONTAINER_NAME:/data/backups /root/party-everyday-backups
```

3. Скачать файл или папку с VPS на свой компьютер

```bash
scp root@YOUR_SERVER_IP:/root/leads.sqlite .
scp -r root@YOUR_SERVER_IP:/root/party-everyday-backups .
```

Если у тебя в Dokploy используется не volume на `/data`, а bind mount на хостовый путь, тогда можно скачивать уже напрямую с этого host-пути. Но для текущей схемы с контейнерным путём `/data` ориентируйся именно на `docker cp`.

## Важно про пересоздание базы

Если файл базы удалён, новая пустая `SQLite`-база создастся автоматически только после рестарта `server`.

Базу создаёт backend на старте:
- открывает путь из `DB_PATH`
- запускает миграции
- создаёт таблицу `leads`, если её нет

То есть после удаления БД нужен именно redeploy или restart backend-сервиса.
