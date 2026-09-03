# Beauty App - Salon Management System

Профессиональная система управления для салонов красоты и мастеров.

## 🚀 Функциональность

### Для мастеров
- **Управление клиентами** — полные карточки клиентов с учётом специализации (подолог, маникюр, педикюр, брови/ресницы, тату)
- **Календарь записей** — планирование встреч, управление временем, учёт оплаты и предоплат
- **Мультиязычность** — русский, английский, немецкий

### Для владельцев салонов
- **Управление командой** — приглашение мастеров через код
- **Обзор календаря** — просмотр и редактирование записей всех мастеров
- **Конфиденциальность** — карточки клиентов доступны только мастерам (медицинские данные защищены)

## 🛠 Технологии

- **Frontend:** React 19 + Vite
- **Backend:** Firebase (Authentication + Firestore)
- **Routing:** React Router v7
- **Internationalization:** i18next
- **Стиль:** Custom CSS с современным тёмным дизайном

## 📦 Установка

```bash
npm install
```

## 🔧 Разработка

```bash
npm run dev
```

Приложение откроется на `http://localhost:5173`

## 🏗 Сборка

```bash
npm run build
```

## 🚀 Деплой

Проект настроен для развёртывания на Firebase Hosting:

```bash
npm install -g firebase-tools
firebase login
firebase deploy
```

## 📂 Структура проекта

```
src/
├── assets/          # Статические файлы
├── components/      # React компоненты
│   └── ClientFormModal.jsx
├── config/          # Конфигурация специализаций
│   └── specializations.js
├── context/         # React Context (Auth)
│   └── AuthContext.jsx
├── pages/           # Страницы приложения
│   ├── LoginPage.jsx
│   ├── RegisterPage.jsx
│   ├── ClientsPage.jsx
│   ├── CalendarPage.jsx
│   ├── SalonPage.jsx
│   ├── SalonCalendarPage.jsx
│   └── SalonMasterDetailPage.jsx
├── services/        # Интеграция с Firestore
│   └── firestore.js
├── App.jsx          # Основной компонент
├── App.css          # Стили приложения
├── index.css        # Глобальные стили
├── firebase.js      # Конфигурация Firebase
├── i18n.js          # Конфигурация i18next
└── main.jsx         # Точка входа
```

## 🔐 Безопасность

- Firebase Authentication для регистрации и входа
- Firestore Security Rules для защиты данных клиентов
- Мультитенантная архитектура (каждый мастер видит только свои данные)

## 🌍 Локализация

Поддержка языков:
- 🇷🇺 Русский (по умолчанию)
- 🇬🇧 English
- 🇩🇪 Deutsch

## 📝 Лицензия

Private project

## 👨‍💻 Автор

Разработано для профессионального использования в индустрии красоты.
