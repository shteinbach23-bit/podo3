// Сервисный слой для работы с Firestore.
//
// Структура данных:
// masters/{masterId}                       - профиль мастера (или салона)
// masters/{masterId}/clients/{clientId}     - карточки клиентов этого мастера
// masters/{masterId}/appointments/{apptId}  - записи в календаре
// salons/{salonId}                          - салон (владелец + список мастеров)
//
// Мультитенантность: каждый мастер видит только свои clients/appointments
// благодаря правилам безопасности Firestore (см. firestore.rules)

import {
  collection,
  doc,
  setDoc,
  getDoc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../firebase";

// ---------- Мастер (профиль) ----------

export async function createMasterProfile(masterId, data) {
  const ref = doc(db, "masters", masterId);
  await setDoc(ref, {
    fullName: data.fullName,
    email: data.email,
    specialization: data.specialization, // podolog | manicure | pedicure | browsLashes | tattoo | null
    plan: "basic", // тариф по умолчанию при регистрации
    createdAt: serverTimestamp(),
  });
}

export async function getMasterProfile(masterId) {
  const ref = doc(db, "masters", masterId);
  const snap = await getDoc(ref);
  return snap.exists() ? { id: snap.id, ...snap.data() } : null;
}

export async function updateMasterPlan(masterId, planId) {
  const ref = doc(db, "masters", masterId);
  await updateDoc(ref, { plan: planId });
}

// ---------- Салон (владелец + несколько мастеров, тариф Премиум) ----------

function generateInviteCode() {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let code = "";
  for (let i = 0; i < 6; i++) {
    code += chars[Math.floor(Math.random() * chars.length)];
  }
  return code;
}

export async function createSalon(ownerId, salonName) {
  const inviteCode = generateInviteCode();
  const ref = doc(collection(db, "salons"));
  await setDoc(ref, {
    ownerId,
    name: salonName,
    inviteCode,
    memberIds: [],
    createdAt: serverTimestamp(),
  });
  await updateDoc(doc(db, "masters", ownerId), { salonId: ref.id, role: "owner" });
  return { id: ref.id, inviteCode };
}

export async function getSalonByOwner(ownerId) {
  const ref = collection(db, "salons");
  const q = query(ref, where("ownerId", "==", ownerId));
  const snap = await getDocs(q);
  if (snap.empty) return null;
  const d = snap.docs[0];
  return { id: d.id, ...d.data() };
}

export async function findSalonByInviteCode(inviteCode) {
  const ref = collection(db, "salons");
  const q = query(ref, where("inviteCode", "==", inviteCode.toUpperCase().trim()));
  const snap = await getDocs(q);
  if (snap.empty) return null;
  const d = snap.docs[0];
  return { id: d.id, ...d.data() };
}

export async function joinSalon(masterId, inviteCode) {
  const salon = await findSalonByInviteCode(inviteCode);
  if (!salon) {
    throw new Error("Код приглашения не найден. Проверьте код и попробуйте снова.");
  }
  const salonRef = doc(db, "salons", salon.id);
  const currentMembers = salon.memberIds || [];
  if (!currentMembers.includes(masterId)) {
    await updateDoc(salonRef, { memberIds: [...currentMembers, masterId] });
  }
  await updateDoc(doc(db, "masters", masterId), {
    salonId: salon.id,
    ownerId: salon.ownerId,
  });
  return salon;
}

export async function getSalonMasters(salon) {
  if (!salon || !salon.memberIds || salon.memberIds.length === 0) return [];
  const results = await Promise.all(
    salon.memberIds.map(async (uid) => {
      const ref = doc(db, "masters", uid);
      const snap = await getDoc(ref);
      return snap.exists() ? { id: snap.id, ...snap.data() } : null;
    })
  );
  return results.filter(Boolean);
}

// ---------- Клиенты ----------

export async function addClient(masterId, clientData) {
  const ref = collection(db, "masters", masterId, "clients");
  const docRef = await addDoc(ref, {
    ...clientData,
    createdAt: serverTimestamp(),
  });
  return docRef.id;
}

export async function getClients(masterId) {
  const ref = collection(db, "masters", masterId, "clients");
  const snap = await getDocs(ref);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
}

export async function getClient(masterId, clientId) {
  const ref = doc(db, "masters", masterId, "clients", clientId);
  const snap = await getDoc(ref);
  return snap.exists() ? { id: snap.id, ...snap.data() } : null;
}

export async function updateClient(masterId, clientId, data) {
  const ref = doc(db, "masters", masterId, "clients", clientId);
  await updateDoc(ref, data);
}

export async function deleteClient(masterId, clientId) {
  const ref = doc(db, "masters", masterId, "clients", clientId);
  await deleteDoc(ref);
}

export async function findClientsByName(masterId, searchText) {
  const all = await getClients(masterId);
  const lower = searchText.toLowerCase();
  return all.filter((c) => (c.fullName || "").toLowerCase().includes(lower));
}

export async function findClientByPhone(masterId, phone) {
  if (!phone) return null;
  const ref = collection(db, "masters", masterId, "clients");
  const q = query(ref, where("phone", "==", phone));
  const snap = await getDocs(q);
  if (snap.empty) return null;
  const d = snap.docs[0];
  return { id: d.id, ...d.data() };
}

// Находит клиента по телефону либо создаёт новую карточку.
// Используется при сохранении записи из календаря, чтобы клиент
// автоматически появлялся в общем списке "Клиенты".
export async function findOrCreateClientByPhone(masterId, { fullName, phone }) {
  if (!phone) return null;
  const existing = await findClientByPhone(masterId, phone);
  if (existing) {
    // Если имя клиента изменилось/уточнилось — обновим карточку
    if (fullName && existing.fullName !== fullName) {
      await updateClient(masterId, existing.id, { fullName });
    }
    return existing.id;
  }
  const newId = await addClient(masterId, { fullName: fullName || "", phone });
  return newId;
}

// ---------- Записи (календарь) ----------

export async function addAppointment(masterId, appointmentData) {
  const ref = collection(db, "masters", masterId, "appointments");
  const docRef = await addDoc(ref, appointmentData);
  return docRef.id;
}

export async function getAppointmentsByDate(masterId, date) {
  const ref = collection(db, "masters", masterId, "appointments");
  const q = query(ref, where("date", "==", date));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
}

export async function updateAppointment(masterId, appointmentId, data) {
  const ref = doc(db, "masters", masterId, "appointments", appointmentId);
  await updateDoc(ref, data);
}

export async function deleteAppointment(masterId, appointmentId) {
  const ref = doc(db, "masters", masterId, "appointments", appointmentId);
  await deleteDoc(ref);
}
