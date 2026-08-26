import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useAuth } from "../context/AuthContext";
import {
  getAppointmentsByDate,
  addAppointment,
  updateAppointment,
  deleteAppointment,
  findOrCreateClientByPhone,
} from "../services/firestore";

// Слоты времени с 10:00 до 20:30 с шагом 30 минут
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

export default function CalendarPage() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [appointments, setAppointments] = useState({});
  const [editingSlot, setEditingSlot] = useState(null);
  const [draft, setDraft] = useState({});

  const dateKey = formatDate(currentDate);

  async function loadAppointments() {
    if (!user) return;
    const data = await getAppointmentsByDate(user.uid, dateKey);
    const byTime = {};
    data.forEach((appt) => {
      byTime[appt.time] = appt;
    });
    setAppointments(byTime);
  }

  useEffect(() => {
    loadAppointments();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, dateKey]);

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
    // Автоматически создаём (или находим существующую) карточку клиента
    // по номеру телефона, чтобы клиент появлялся в общем списке "Клиенты"
    if (draft.phone) {
      try {
        await findOrCreateClientByPhone(user.uid, {
          fullName: draft.clientName,
          phone: draft.phone,
        });
      } catch (e) {
        console.error("Не удалось создать/найти карточку клиента:", e);
      }
    }

    if (draft.id) {
      await updateAppointment(user.uid, draft.id, draft);
    } else {
      await addAppointment(user.uid, draft);
    }
    setEditingSlot(null);
    loadAppointments();
  }

  async function handleDelete() {
    if (draft.id) {
      await deleteAppointment(user.uid, draft.id);
    }
    setEditingSlot(null);
    loadAppointments();
  }

  const total = Object.values(appointments).reduce((sum, a) => sum + (Number(a.amount) || 0), 0);

  return (
    <div className="calendar-page">
      <div className="calendar-header">
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

      <p className="calendar-total">
        {t("total")}: {total} ₴
      </p>

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
