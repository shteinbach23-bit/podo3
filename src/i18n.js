import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

const resources = {
  ru: {
    translation: {
      app_name: "Lumina",
      login: "Войти",
      register: "Регистрация",
      sign_up: "Зарегистрироваться",
      email: "Email",
      password: "Пароль",
      full_name: "ФИО",
      specialization: "Специализация",
      logout: "Выйти",
      clients: "Клиенты",
      calendar: "Календарь",
      add_client: "Добавить клиента",
      edit: "Редактировать",
      delete: "Удалить",
      save: "Сохранить",
      cancel: "Отмена",
      notes: "Заметки",
      time: "Время",
      client: "Клиент",
      procedure: "Процедура",
      phone: "Телефон",
      prepayment: "Предоплата",
      amount: "Сумма",
      action: "Действие",
      total: "Итого",
    },
  },
  en: {
    translation: {
      app_name: "Client Card",
      login: "Log in",
      register: "Register",
      sign_up: "Sign up",
      email: "Email",
      password: "Password",
      full_name: "Full name",
      specialization: "Specialization",
      logout: "Log out",
      clients: "Clients",
      calendar: "Calendar",
      add_client: "Add client",
      edit: "Edit",
      delete: "Delete",
      save: "Save",
      cancel: "Cancel",
      notes: "Notes",
      time: "Time",
      client: "Client",
      procedure: "Procedure",
      phone: "Phone",
      prepayment: "Prepayment",
      amount: "Amount",
      action: "Action",
      total: "Total",
    },
  },
  de: {
    translation: {
      app_name: "Kundenkarte",
      login: "Anmelden",
      register: "Registrieren",
      sign_up: "Registrieren",
      email: "E-Mail",
      password: "Passwort",
      full_name: "Vollständiger Name",
      specialization: "Spezialisierung",
      logout: "Abmelden",
      clients: "Kunden",
      calendar: "Kalender",
      add_client: "Kunde hinzufügen",
      edit: "Bearbeiten",
      delete: "Löschen",
      save: "Speichern",
      cancel: "Abbrechen",
      notes: "Notizen",
      time: "Zeit",
      client: "Kunde",
      procedure: "Behandlung",
      phone: "Telefon",
      prepayment: "Anzahlung",
      amount: "Betrag",
      action: "Aktion",
      total: "Gesamt",
    },
  },
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: "ru",
    interpolation: { escapeValue: false },
  });

export default i18n;
