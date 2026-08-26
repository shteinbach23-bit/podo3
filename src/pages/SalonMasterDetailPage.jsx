import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getMasterProfile } from "../services/firestore";

// Страница для владельца салона - просмотр профиля мастера (без доступа
// к карточкам клиентов - это зона ответственности самого мастера).
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

  if (loading) return <p>...</p>;
  if (error) return <p className="error">{error}</p>;
  if (!master) return <p>Мастер не найден.</p>;

  return (
    <div className="salon-master-detail">
      <p>
        <Link to="/salon">&larr; Назад к салону</Link>
      </p>
      <h2>{master.fullName}</h2>
      <p>{master.email}</p>
      <p className="readonly-badge">
        Карточки клиентов этого мастера недоступны владельцу салона — это личные данные,
        которые ведёт только сам мастер. Записи мастера можно посмотреть и отредактировать
        на странице "Календарь".
      </p>
      <p>
        <Link to="/salon-calendar">Перейти к календарю этого мастера &rarr;</Link>
      </p>
    </div>
  );
}
