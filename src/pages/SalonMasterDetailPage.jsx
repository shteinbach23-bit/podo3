import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getMasterProfile } from "../services/firestore";
import { getSpecializationOptions } from "../config/specializations";

function specializationLabel(id) {
  const opt = getSpecializationOptions().find((o) => o.id === id);
  return opt ? opt.label : "—";
}

export default function SalonMasterDetailPage() {
  const { masterId } = useParams();
  const [master, setMaster] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function load() {
      setLoading(true);
      setError("");
      try {
        const profile = await getMasterProfile(masterId);
        setMaster(profile);
      } catch (err) {
        setError("Не удалось загрузить данные мастера: " + err.message);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [masterId]);

  if (loading) {
    return (
      <div style={{ textAlign: "center", padding: "3rem" }}>
        <p style={{ color: "var(--text-secondary)" }}>Загрузка...</p>
      </div>
    );
  }

  if (error) return <p className="error">{error}</p>;
  if (!master) return <p>Мастер не найден.</p>;

  return (
    <div className="salon-master-detail">
      <Link to="/salon" style={{ 
        color: "var(--accent-primary)", 
        textDecoration: "none",
        display: "inline-flex",
        alignItems: "center",
        gap: "0.5rem",
        marginBottom: "1.5rem",
        fontSize: "0.9375rem",
        fontWeight: 500
      }}>
        ← Назад к салону
      </Link>

      <div style={{
        background: "var(--bg-elevated)",
        border: "1px solid var(--border)",
        borderRadius: "12px",
        padding: "2rem",
        marginTop: "1rem"
      }}>
        <h2 style={{ marginBottom: "0.5rem" }}>{master.fullName}</h2>
        <p style={{ color: "var(--text-secondary)", marginBottom: "1rem" }}>{master.email}</p>
        
        {master.specialization && (
          <div style={{ marginBottom: "1.5rem" }}>
            <span style={{
              display: "inline-block",
              padding: "0.375rem 0.875rem",
              background: "rgba(56, 189, 248, 0.1)",
              color: "var(--accent-primary)",
              borderRadius: "6px",
              fontSize: "0.875rem",
              fontWeight: 500,
              border: "1px solid rgba(56, 189, 248, 0.3)"
            }}>
              {specializationLabel(master.specialization)}
            </span>
          </div>
        )}

        <div className="readonly-badge">
          Карточки клиентов этого мастера недоступны владельцу салона — это личные данные,
          которые ведёт только сам мастер. Записи мастера можно посмотреть и отредактировать
          на странице "Календарь".
        </div>

        <Link 
          to="/salon-calendar" 
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "0.5rem",
            color: "var(--accent-primary)",
            textDecoration: "none",
            fontSize: "0.9375rem",
            fontWeight: 500
          }}
        >
          Перейти к календарю этого мастера →
        </Link>
      </div>
    </div>
  );
}
