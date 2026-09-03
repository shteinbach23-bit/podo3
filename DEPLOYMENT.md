# 🚀 Инструкция по запуску и деплою

## Локальная разработка

### 1. Установка зависимостей
```bash
npm install
```

### 2. Запуск dev-сервера
```bash
npm run dev
```
Приложение будет доступно на `http://localhost:5173`

### 3. Сборка production версии
```bash
npm run build
```

## Деплой на Firebase Hosting

### Вариант 1: Через Firebase CLI (рекомендуется)
```bash
# Установить Firebase Tools (если ещё не установлен)
npm install -g firebase-tools

# Войти в аккаунт
firebase login

# Деплой
firebase deploy
```

После деплоя приложение будет доступно на:
**https://customer-card-shteinbah.web.app**

### Вариант 2: Через GitHub Actions (CI/CD)
Создайте `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Firebase

on:
  push:
    branches:
      - main

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: '18'
      - run: npm ci
      - run: npm run build
      - uses: FirebaseExtended/action-hosting-deploy@v0
        with:
          repoToken: '${{ secrets.GITHUB_TOKEN }}'
          firebaseServiceAccount: '${{ secrets.FIREBASE_SERVICE_ACCOUNT }}'
          channelId: live
          projectId: customer-card-shteinbah
```

## Проверка перед деплоем

### Чек-лист
- [ ] `npm run lint` — без критических ошибок
- [ ] `npm run build` — успешная сборка
- [ ] Проверить `.firebaserc` — правильный projectId
- [ ] Проверить `firebase.json` — корректная конфигурация
- [ ] Проверить `src/firebase.js` — актуальные credentials

### Тестирование локально
```bash
# Собрать проект
npm run build

# Протестировать production сборку локально
npm run preview
```

## Структура Firebase

### Firestore Collections
```
masters/
  {masterId}/
    - fullName
    - email
    - specialization
    - plan
    clients/
      {clientId}/
        - fullName
        - phone
        - birthDate
        - [специфичные поля]
    appointments/
      {appointmentId}/
        - date
        - time
        - clientName
        - procedure
        - amount

salons/
  {salonId}/
    - ownerId
    - name
    - inviteCode
    - memberIds[]
```

### Security Rules
Убедитесь, что `firestore.rules` настроены правильно для защиты данных клиентов.

## Полезные команды

```bash
# Просмотр логов
firebase functions:log

# Проверка конфигурации
firebase projects:list

# Откат к предыдущей версии
firebase hosting:clone SOURCE_SITE_ID:SOURCE_CHANNEL_ID TARGET_SITE_ID:live
```

## Поддержка браузеров

- Chrome/Edge: последние 2 версии
- Firefox: последние 2 версии
- Safari: последние 2 версии
- Mobile Safari/Chrome: iOS 13+, Android 8+

## Переменные окружения

Если используете `.env` файлы (опционально):

```env
VITE_FIREBASE_API_KEY=your_key
VITE_FIREBASE_AUTH_DOMAIN=your_domain
VITE_FIREBASE_PROJECT_ID=your_project_id
```

Не забудьте добавить `.env` в `.gitignore`!

---

**Готово к деплою! 🚀**
