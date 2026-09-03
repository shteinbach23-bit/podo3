# 🚀 Инструкция по настройке автоматического деплоя

Теперь при каждом push в ветку `main` проект автоматически деплоится на Firebase! 

## ✅ Что уже сделано:

Создан файл `.github/workflows/deploy.yml` — это конфигурация GitHub Actions.

---

## 🔧 Что нужно сделать ВАМ:

### Шаг 1: Получить Firebase Service Account

1. Откройте: https://console.firebase.google.com/
2. Выберите проект **customer-card-shteinbah**
3. Нажмите на ⚙️ (Settings) → **Project settings**
4. Перейдите на вкладку **Service accounts**
5. Нажмите **Generate new private key**
6. Скачается JSON файл — **НЕ ДЕЛИТЕСЬ ИМ!** (это ключи доступа)

---

### Шаг 2: Добавить секрет в GitHub

1. Откройте: https://github.com/shteinbach23-bit/podo3/settings/secrets/actions
2. Нажмите **New repository secret**
3. Name: `FIREBASE_SERVICE_ACCOUNT`
4. Value: **вставьте ВЕСЬ содержимый JSON файла** из Шага 1
5. Нажмите **Add secret**

---

### Шаг 3: Запушить изменения

На вашем компьютере:

```bash
cd путь/к/podo3
git pull origin main
git push origin main
```

Или если проекта нет:

```bash
git clone https://github.com/shteinbach23-bit/podo3.git
cd podo3
git push origin main
```

---

## 🎉 Готово!

После push:
1. GitHub Actions автоматически:
   - Соберёт проект (`npm run build`)
   - Задеплоит на Firebase (`firebase deploy`)
2. Через 2-3 минуты изменения появятся на сайте!

---

## 📊 Как проверить работу:

1. Откройте: https://github.com/shteinbach23-bit/podo3/actions
2. Увидите статус деплоя (🟢 зелёная галочка = успешно)
3. Если красный ❌ — кликните и посмотрите логи

---

## 🔍 Частые проблемы:

### Ошибка "FIREBASE_SERVICE_ACCOUNT not found"
→ Не добавлен секрет в GitHub (вернитесь к Шагу 2)

### Ошибка "Permission denied"
→ JSON ключ не правильный (повторите Шаг 1)

### Ошибка "Build failed"
→ Проблема с кодом (посмотрите логи в Actions)

---

## ❓ Нужна помощь?

Скажите на каком шаге возникла проблема, помогу разобраться!

---

## 📝 Краткая версия:

1. Firebase Console → Project settings → Service accounts → Generate key
2. GitHub → Settings → Secrets → Add `FIREBASE_SERVICE_ACCOUNT` с JSON
3. `git pull && git push`
4. Готово! 🎉
