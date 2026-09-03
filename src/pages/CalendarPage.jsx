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

function formatDate(date) {
  return date.toISOString().split("T")[0];
}

function getDaysInMonth(year, month) {
  return new Date(year, month + 1, 0).getDate();
}

function getFirstDayOfMonth(year, month) {
  // 0=Mon..6=Sun
  const day = new Date(year, month, 1).getDay();
  return day === 0 ? 6 : day - 1;
}

const MONTH_NAMES_RU = [
  "январь","февраль","март","апрель","май","июнь",
  "июль","август","сентябрь","октябрь","ноябрь","декабрь"
];

const DAY_NAMES_SHORT = ["Пн","Вт","Ср","Чт","Пт","Сб","Вс"];

function formatDayLabel(date) {
  const d = date.getDate();
  const m = MONTH_NAMES_RU[date.getMonth()];
  return `${d} ${m}`;
}

export default function CalendarPage() {
  const { t } = useTranslation();
  const { user } = useAuth();

  const today = new Date();
  const [viewYear, setViewYear] = useState(today.getFullYear());
  const [viewMonth, setViewMonth] = useState(today.getMonth());
  const [selectedDate, setSelectedDate] = useState(today);

  const [appointments, setAppointments] = useState({});
  const [editingSlot, setEditingSlot] = useState(null);
  const [draft, setDraft] = useState({});
  const [showNewModal, setShowNewModal] = useState(false);

  const dateKey = formatDate(selectedDate);

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
    if (showNewModal) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [showNewModal]);

  function prevMonth() {
    if (viewMonth === 0) { setViewYear(y => y - 1); setViewMonth(11); }
    else setViewMonth(m => m - 1);
  }

  function nextMonth() {
    if (viewMonth === 11) { setViewYear(y => y + 1); setViewMonth(0); }
    else setViewMonth(m => m + 1);
  }

  function goToday() {
    setViewYear(today.getFullYear());
    setViewMonth(today.getMonth());
    setSelectedDate(today);
  }

  function selectDay(year, month, day) {
    setSelectedDate(new Date(year, month, day));
  }

  function openNewAppointment() {
    setDraft({ date: dateKey, time: "10:00" });
    setShowNewModal(true);
  }

  function openSlot(appt) {
    setDraft(appt);
    setEditingSlot(appt.time);
    setShowNewModal(true);
  }

  async function handleSave() {
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
    setShowNewModal(false);
    setEditingSlot(null);
    loadAppointments();
  }

  async function handleDelete() {
    if (draft.id) {
      await deleteAppointment(user.uid, draft.id);
    }
    setShowNewModal(false);
    setEditingSlot(null);
    loadAppointments();
  }

  // Build calendar grid
  const daysInMonth = getDaysInMonth(viewYear, viewMonth);
  const firstDay = getFirstDayOfMonth(viewYear, viewMonth);

  // prev month tail
  const prevMonthDays = getDaysInMonth(
    viewMonth === 0 ? viewYear - 1 : viewYear,
    viewMonth === 0 ? 11 : viewMonth - 1
  );

  const cells = [];
  for (let i = 0; i < firstDay; i++) {
    cells.push({ day: prevMonthDays - firstDay + 1 + i, month: viewMonth - 1, year: viewMonth === 0 ? viewYear - 1 : viewYear, outside: true });
  }
  for (let d = 1; d <= daysInMonth; d++) {
    cells.push({ day: d, month: viewMonth, year: viewYear, outside: false });
  }
  const remaining = 42 - cells.length;
  for (let d = 1; d <= remaining; d++) {
    cells.push({ day: d, month: viewMonth + 1, year: viewMonth === 11 ? viewYear + 1 : viewYear, outside: true });
  }

  const appointmentList = Object.values(appointments).sort((a, b) => a.time.localeCompare(b.time));

  return (
    <div className="cal-page">
      {/* Page header */}
      <div className="cal-page-header">
        <div>
          <h1 className="cal-page-title">Календарь</h1>
          <p className="cal-page-sub">Запланированные приёмы</p>
        </div>
        <button className="cal-new-btn" onClick={openNewAppointment}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" width="16" height="16">
            <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
          </svg>
          Новая запись
        </button>
      </div>

      <div className="cal-body">
        {/* Calendar grid */}
        <div className="cal-grid-wrap">
          {/* Month nav */}
          <div className="cal-month-nav">
            <span className="cal-month-label">
              {MONTH_NAMES_RU[viewMonth]} {viewYear}
            </span>
            <div className="cal-nav-btns">
              <button onClick={prevMonth} className="cal-nav-btn">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16">
                  <polyline points="15 18 9 12 15 6"/>
                </svg>
              </button>
              <button onClick={goToday} className="cal-today-btn">Сегодня</button>
              <button onClick={nextMonth} className="cal-nav-btn">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16">
                  <polyline points="9 18 15 12 9 6"/>
                </svg>
              </button>
            </div>
          </div>

          {/* Day headers */}
          <div className="cal-weekdays">
            {DAY_NAMES_SHORT.map(d => (
              <div key={d} className="cal-weekday">{d}</div>
            ))}
          </div>

          {/* Cells */}
          <div className="cal-cells">
            {cells.map((cell, i) => {
              const cellDate = new Date(cell.year, cell.month, cell.day);
              const isToday = formatDate(cellDate) === formatDate(today);
              const isSelected = formatDate(cellDate) === dateKey;
              return (
                <div
                  key={i}
                  className={
                    "cal-cell" +
                    (cell.outside ? " cal-cell--outside" : "") +
                    (isToday ? " cal-cell--today" : "") +
                    (isSelected && !isToday ? " cal-cell--selected" : "")
                  }
                  onClick={() => selectDay(cell.year, cell.month, cell.day)}
                >
                  {cell.day}
                </div>
              );
            })}
          </div>
        </div>

        {/* Day detail panel */}
        <div className="cal-detail">
          <div className="cal-detail-header">
            <span className="cal-detail-date">{formatDayLabel(selectedDate)}</span>
            <button className="cal-detail-add" onClick={openNewAppointment}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" width="16" height="16">
                <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
              </svg>
            </button>
          </div>

          {appointmentList.length === 0 ? (
            <p className="cal-detail-empty">Нет записей на этот день</p>
          ) : (
            <div className="cal-appt-list">
              {appointmentList.map((appt) => (
                <div key={appt.id} className="cal-appt-item" onClick={() => openSlot(appt)}>
                  <span className="cal-appt-time">{appt.time}</span>
                  <div className="cal-appt-info">
                    <span className="cal-appt-name">{appt.clientName}</span>
                    {appt.procedure && <span className="cal-appt-proc">{appt.procedure}</span>}
                  </div>
                  {appt.amount && <span className="cal-appt-amount">{appt.amount} ₴</span>}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Modal */}
      {showNewModal && (
        <div className="modal-overlay" onClick={() => { setShowNewModal(false); setEditingSlot(null); }}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3>{editingSlot ? editingSlot : "Новая запись"}</h3>
            <div className="form-field">
              <label>Время</label>
              <input
                type="time"
                value={draft.time || ""}
                onChange={(e) => setDraft({ ...draft, time: e.target.value })}
              />
            </div>
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
                <button onClick={handleDelete} className="danger">{t("delete")}</button>
              )}
              <button onClick={() => { setShowNewModal(false); setEditingSlot(null); }}>{t("cancel")}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
