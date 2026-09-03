# 🚀 Как увидеть изменения на сайте

## ⚠️ Важно понять:

Изменения находятся в песочнице (облако) и закоммичены в git, НО:
- Они **НЕ** запушены на GitHub
- Они **НЕ** задеплоены на Firebase Hosting
- Поэтому на https://customer-card-shteinbah.web.app/clients ничего не изменилось

---

## 📝 Что нужно сделать на ВАШЕМ компьютере:

### Шаг 1: Получить изменения из GitHub

```bash
cd путь/к/вашему/проекту/podo3

# Получить последние изменения
git pull origin main
```

Если git спросит логин/пароль - введите свои данные от GitHub.

---

### Шаг 2: Проверить локально (опционально)

```bash
# Установить зависимости (если нужно)
npm install

# Запустить локально
npm run dev
```

Откроется `http://localhost:5173/clients` - там будет новая карточка!

---

### Шаг 3: Задеплоить на Firebase

```bash
# Собрать production версию
npm run build

# Задеплоить
firebase deploy
```

Если `firebase` не установлен:
```bash
npm install -g firebase-tools
firebase login
firebase deploy
```

---

## ❓ Если у вас нет проекта на компьютере:

### Вариант 1: Клонировать заново
```bash
git clone https://github.com/shteinbach23-bit/podo3.git
cd podo3
npm install
npm run build
firebase deploy
```

### Вариант 2: Я могу запушить изменения сейчас
Но для этого нужны credentials от GitHub. Скажите, хотите это сделать?

---

## 🎯 Альтернатива: GitHub Actions (автодеплой)

Можем настроить автоматический деплой:
- При push на main → автоматически деплоится на Firebase
- Не нужно руками собирать и деплоить

Хотите настроить?

---

## ✅ Коротко:

```bash
# На вашем компьютере:
git pull origin main
npm run build
firebase deploy

# Или если проекта нет:
git clone https://github.com/shteinbach23-bit/podo3.git
cd podo3
npm install
npm run build  
firebase deploy
```

После этого изменения появятся на https://customer-card-shteinbah.web.app/clients 🎉
