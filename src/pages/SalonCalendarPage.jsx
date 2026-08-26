import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useAuth } from "../context/AuthContext";
import {
  getSalonByOwner,
  getSalonMasters,
  getAppointmentsByDate,
  addAppointment,
  updateAppointment,
  deleteAppointment,
} from "../services/firestore";

function generateTimeSlots() {
  const slots = [];
  for (let hour = 10; hour <= 20; hour++) {
    slots.push(`${String(hour).padStart(2, "0")}:00`);
    slots.push(`${String(hour).padStart(2, "0")}:30`);
  }
  return slots;
}

const TIME_SLOTS = generateTimeSlots();

function formatDate(date) {
  return date.toISOString().split("T")[0];
}

// Календарь салона для администратора: он выбирает мастера и видит/редактирует
// его записи. Карточки клиентов (мед. данные) сюда не входят - это зона мастера.
export default function SalonCalendarPage() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [masters, setMasters] = useState([]);
  const [selectedMasterId, setSelectedMasterId] = useState("");
  const [currentDate, setCurrentDate] = useState(new Date());
  const [appointments, setAppointments] = useState({});
  const [editingSlot, setEditingSlot] = useState(null);
  const [draft, setDraft] = useState({});
  const [loading, setLoading] = useState(true);

  const dateKey = formatDate(currentDate);

  useEffect(() => {
    async function loadMasters() {
      if (!user) return;
      setLoading(true);
      const salon = await getSalonByOwner(user.uid);
      if (salon) {
        const list = await getSalonMasters(salon);
        setMasters(list);
        if (list.length > 0) setSelectedMasterId(list[0].id);
      }
      setLoading(false);
    }
    loadMasters();
  }, [user]);

  async function loadAppointments() {
    if (!selectedMasterId) return;
    const data = await getAppointmentsByDate(selectedMasterId, dateKey);
    const byTime = {};
    data.forEach((appt) => {
      byTime[appt.time] = appt;
    });
    setAppointments(byTime);
  }

  useEffect(() => {
    loadAppointments();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedMasterId, dateKey]);

  function changeDay(delta) {
    const next = new Date(currentDate);
    next.setDate(next.getDate() + delta);
    setCurrentDate(next);
  }

  function openSlot(time) {
    setEditingSlot(time);
    setDraft(appointments[time] || { date: dateKey, time });
  }

  async function handleSave() {
    if (draft.id) {
      await updateAppointment(selectedMasterId, draft.id, draft);
    } else {
      await addAppointment(selectedMasterId, draft);
    }
    setEditingSlot(null);
    loadAppointments();
  }

  async function handleDelete() {
    if (draft.id) {
      await deleteAppointment(selectedMasterId, draft.id);
    }
    setEditingSlot(null);
    loadAppointments();
  }

  if (loading) return <p>...</p>;

  if (masters.length === 0) {
    return <p>В салоне пока нет мастеров. Передайте им код приглашения, чтобы они присоединились.</p>;
  }

  return (
    <div className="calendar-page">
      <div className="calendar-header">
        <select value={selectedMasterId} onChange={(e) => setSelectedMasterId(e.target.value)}>
          {masters.map((m) => (
            <option key={m.id} value={m.id}>
              {m.fullName}
            </option>
          ))}
        </select>
        <button onClick={() => changeDay(-1)}>{"<"}</button>
        <span>{dateKey}</span>
        <button onClick={() => changeDay(1)}>{">"}</button>
      </div>

      <table className="calendar-table">
        <thead>
          <tr>
            <th>{t("time")}</th>
            <th>{t("client")}</th>
            <th>{t("procedure")}</th>
            <th>{t("phone")}</th>
            <th>{t("prepayment")}</th>
            <th>{t("amount")}</th>
            <th>{t("action")}</th>
          </tr>
        </thead>
        <tbody>
          {TIME_SLOTS.map((time) => {
            const appt = appointments[time];
            return (
              <tr key={time}>
                <td>{time}</td>
                <td>{appt?.clientName || ""}</td>
                <td>{appt?.procedure || ""}</td>
                <td>{appt?.phone || ""}</td>
                <td>{appt?.prepayment || ""}</td>
                <td>{appt?.amount || ""}</td>
                <td>
                  <button onClick={() => openSlot(time)}>+</button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      {editingSlot && (
        <div className="modal-overlay" onClick={() => setEditingSlot(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3>{editingSlot}</h3>
            <div className="form-field">
              <label>{t("client")}</label>
              <input
                value={draft.clientName || ""}
                onChange={(e) => setDraft({ ...draft, clientName: e.target.value })}
              />
            </div>
            <div className="form-field">
              <label>{t("procedure")}</label>
              <input
                value={draft.procedure || ""}
                onChange={(e) => setDraft({ ...draft, procedure: e.target.value })}
              />
            </div>
            <div className="form-field">
              <label>{t("phone")}</label>
              <input
                value={draft.phone || ""}
                onChange={(e) => setDraft({ ...draft, phone: e.target.value })}
              />
            </div>
            <div className="form-field">
              <label>{t("prepayment")}</label>
              <input
                value={draft.prepayment || ""}
                onChange={(e) => setDraft({ ...draft, prepayment: e.target.value })}
              />
            </div>
            <div className="form-field">
              <label>{t("amount")}</label>
              <input
                value={draft.amount || ""}
                onChange={(e) => setDraft({ ...draft, amount: e.target.value })}
              />
            </div>
            <div className="modal-actions">
              <button onClick={handleSave}>{t("save")}</button>
              {draft.id && (
                <button onClick={handleDelete} className="danger">
                  {t("delete")}
                </button>
              )}
              <button onClick={() => setEditingSlot(null)}>{t("cancel")}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
