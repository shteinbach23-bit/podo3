// Конфигурация Firebase
// Возьми эти значения из консоли Firebase:
// Настройки проекта -> Общие -> Ваши приложения -> веб-приложение (</>)
// Если веб-приложение еще не создано - нажми "Добавить приложение" -> Web

import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDjWuh3JKo5aW_NTONxA--zmrpLxF60sbw",
  authDomain: "customer-card-shteinbah.firebaseapp.com",
  projectId: "customer-card-shteinbah",
  storageBucket: "customer-card-shteinbah.firebasestorage.app",
  messagingSenderId: "748235257742",
  appId: "1:748235257742:web:2c4c52d4f0b4e2f62c16df",
  measurementId: "G-QHRJ58ZWWL",
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
