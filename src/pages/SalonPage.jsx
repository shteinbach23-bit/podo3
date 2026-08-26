import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getSalonByOwner, getSalonMasters } from "../services/firestore";
import { getSpecializationOptions } from "../config/specializations";

function specializationLabel(id) {
  const opt = getSpecializationOptions().find((o) => o.id === id);
  return opt ? opt.label : "—";
}

export default function SalonPage() {
  const { user } = useAuth();
  const [salon, setSalon] = useState(null);
  const [masters, setMasters] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      if (!user) return;
      setLoading(true);
      const s = await getSalonByOwner(user.uid);
      setSalon(s);
      if (s) {
        const m = await getSalonMasters(s);
        setMasters(m);
      }
      setLoading(false);
    }
    load();
  }, [user]);

  if (loading) return <p>...</p>;

  if (!salon) {
    return <p>У вас пока нет салона. Зарегистрируйтесь как владелец салона, чтобы создать его.</p>;
  }

  return (
    <div className="salon-page">
      <h2>{salon.name}</h2>
      <p>
        Код приглашения для мастеров: <span className="invite-code">{salon.inviteCode}</span>
      </p>
      <p>Передайте этот код мастерам — они введут его при регистрации, чтобы присоединиться к вашему салону.</p>

      <h3>Мастера в салоне ({masters.length})</h3>
      {masters.length === 0 ? (
        <p>Пока никто не присоединился к салону.</p>
      ) : (
        <table className="clients-table">
          <thead>
            <tr>
              <th>Имя</th>
              <th>Email</th>
              <th>Специализация</th>
            </tr>
          </thead>
          <tbody>
            {masters.map((m) => (
              <tr key={m.id} className="clickable-row">
                <td>
                  <Link to={`/salon/master/${m.id}`}>{m.fullName}</Link>
                </td>
                <td>{m.email}</td>
                <td>{specializationLabel(m.specialization)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
