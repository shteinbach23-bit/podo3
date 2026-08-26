// Тестовый сценарий: регистрация владельца салона, регистрация мастера по коду,
// проверка прав доступа (владелец управляет записями, но не видит карточку клиента).
//
// Запуск: node scripts/test-salon-flow.mjs
// Использует реальный Firebase-проект, создаёт тестовые данные с префиксом test-
// в email, которые нужно удалить после проверки (см. вывод в конце).

import { initializeApp } from "firebase/app";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import {
  getFirestore,
  doc,
  setDoc,
  updateDoc,
  collection,
  addDoc,
  getDocs,
  query,
  where,
  serverTimestamp,
} from "firebase/firestore";

const apiKey = process.env.FIREBASE_TEST_API_KEY;
if (!apiKey) {
  console.error("Задайте переменную окружения FIREBASE_TEST_API_KEY перед запуском.");
  process.exit(1);
}

const firebaseConfig = {
  apiKey,
  authDomain: "customer-card-shteinbah.firebaseapp.com",
  projectId: "customer-card-shteinbah",
  storageBucket: "customer-card-shteinbah.firebasestorage.app",
  messagingSenderId: "748235257742",
  appId: "1:748235257742:web:2c4c52d4f0b4e2f62c16df",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

const stamp = Date.now();
const ownerEmail = `test-owner-${stamp}@example.com`;
const masterEmail = `test-master-${stamp}@example.com`;
const password = "TestPass123!";

let ok = true;
function check(label, cond) {
  console.log(`${cond ? "PASS" : "FAIL"} - ${label}`);
  if (!cond) ok = false;
}

async function main() {
  const ownerCred = await createUserWithEmailAndPassword(auth, ownerEmail, password);
  const ownerId = ownerCred.user.uid;
  await setDoc(doc(db, "masters", ownerId), {
    fullName: "Тест Владелец",
    email: ownerEmail,
    specialization: null,
    plan: "basic",
    createdAt: serverTimestamp(),
  });

  const inviteCode = "TEST" + stamp.toString().slice(-2);
  const salonRef = doc(collection(db, "salons"));
  await setDoc(salonRef, {
    ownerId,
    name: "Тестовый салон",
    inviteCode,
    memberIds: [],
    createdAt: serverTimestamp(),
  });
  await updateDoc(doc(db, "masters", ownerId), { salonId: salonRef.id, role: "owner" });
  console.log(`Владелец салона создан, код приглашения: ${inviteCode}`);
  await signOut(auth);

  const masterCred = await createUserWithEmailAndPassword(auth, masterEmail, password);
  const masterId = masterCred.user.uid;
  await setDoc(doc(db, "masters", masterId), {
    fullName: "Тест Мастер",
    email: masterEmail,
    specialization: "manicure",
    plan: "basic",
    createdAt: serverTimestamp(),
  });

  const salonQuery = query(collection(db, "salons"), where("inviteCode", "==", inviteCode));
  const salonSnap = await getDocs(salonQuery);
  check("Мастер нашёл салон по коду приглашения", !salonSnap.empty);
  const foundSalon = salonSnap.docs[0];
  await updateDoc(doc(db, "salons", foundSalon.id), { memberIds: [masterId] });
  await updateDoc(doc(db, "masters", masterId), { salonId: foundSalon.id, ownerId });

  const clientRef = await addDoc(collection(db, "masters", masterId, "clients"), {
    fullName: "Тестовый Клиент",
    phone: "+380000000000",
    createdAt: serverTimestamp(),
  });
  await addDoc(collection(db, "masters", masterId, "appointments"), {
    date: "2026-08-27",
    time: "10:00",
    clientId: clientRef.id,
    clientName: "Тестовый Клиент",
    procedure: "Маникюр",
    phone: "+380000000000",
    amount: "500",
  });
  console.log("Мастер создал клиента и запись");
  await signOut(auth);

  await signInWithEmailAndPassword(auth, ownerEmail, password);

  try {
    const apptSnap = await getDocs(
      query(collection(db, "masters", masterId, "appointments"), where("date", "==", "2026-08-27"))
    );
    check("Владелец салона может прочитать записи мастера", apptSnap.size === 1);
  } catch (e) {
    check("Владелец салона может прочитать записи мастера", false);
    console.log("  ошибка:", e.message);
  }

  try {
    await addDoc(collection(db, "masters", masterId, "appointments"), {
      date: "2026-08-28",
      time: "11:00",
      clientName: "Клиент от админа",
      procedure: "Педикюр",
      phone: "+380000000001",
      amount: "600",
    });
    check("Владелец салона может создать запись мастеру", true);
  } catch (e) {
    check("Владелец салона может создать запись мастеру", false);
    console.log("  ошибка:", e.message);
  }

  try {
    await getDocs(collection(db, "masters", masterId, "clients"));
    check("Владелец салона НЕ может читать карточки клиентов (должно быть запрещено)", false);
  } catch (e) {
    check("Владелец салона НЕ может читать карточки клиентов (должно быть запрещено)", true);
  }

  try {
    await updateDoc(doc(db, "masters", masterId, "clients", clientRef.id), { fullName: "Hacked" });
    check("Владелец салона НЕ может редактировать карточку клиента (должно быть запрещено)", false);
  } catch (e) {
    check("Владелец салона НЕ может редактировать карточку клиента (должно быть запрещено)", true);
  }

  await signOut(auth);

  console.log("\n" + (ok ? "Все проверки прошли успешно." : "Есть проваленные проверки, см. выше."));
  console.log(`\nТестовые аккаунты для удаления (Authentication):\n- ${ownerEmail}\n- ${masterEmail}`);
  console.log(
    `Тестовые документы Firestore для удаления:\n- salons/${foundSalon.id}\n- masters/${ownerId}\n- masters/${masterId} (включая подколлекции clients, appointments)`
  );

  process.exit(ok ? 0 : 1);
}

main().catch((err) => {
  console.error("Ошибка выполнения теста:", err);
  process.exit(1);
});
