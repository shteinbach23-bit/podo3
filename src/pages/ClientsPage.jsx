import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useAuth } from "../context/AuthContext";
import { getClients, findClientsByName } from "../services/firestore";
import ClientFormModal from "../components/ClientFormModal";

export default function ClientsPage() {
  const { t } = useTranslation();
  const { user, masterProfile } = useAuth();
  const [clients, setClients] = useState([]);
  const [search, setSearch] = useState("");
  const [modalState, setModalState] = useState(null); // null | {} | client

  async function loadClients() {
    if (!user) return;
    const data = search.trim() ? await findClientsByName(user.uid, search.trim()) : await getClients(user.uid);
    setClients(data);
  }

  useEffect(() => {
    loadClients();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, search]);

  const specialization = masterProfile?.specialization;

  return (
    <div className="clients-page">
      <div className="clients-header">
        <input
          className="search-input"
          placeholder="Поиск по имени..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <button onClick={() => setModalState({})}>{t("add_client")}</button>
      </div>

      <table className="clients-table">
        <thead>
          <tr>
            <th>ФИО</th>
            <th>Телефон</th>
          </tr>
        </thead>
        <tbody>
          {clients.map((c) => (
            <tr key={c.id} className="clickable-row" onClick={() => setModalState(c)}>
              <td>{c.fullName}</td>
              <td>{c.phone}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {modalState !== null && (
        <ClientFormModal
          masterId={user.uid}
          specialization={specialization}
          existingClient={modalState.id ? modalState : null}
          onClose={() => setModalState(null)}
          onSaved={() => {
            setModalState(null);
            loadClients();
          }}
        />
      )}
    </div>
  );
}
