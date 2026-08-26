import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useAuth } from "../context/AuthContext";
import { getSpecializationOptions } from "../config/specializations";

export default function RegisterPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { register, registerSalonOwner } = useAuth();

  const [accountType, setAccountType] = useState("master");

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [specialization, setSpecialization] = useState(getSpecializationOptions()[0]?.id || "");
  const [inviteCode, setInviteCode] = useState("");
  const [salonName, setSalonName] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [createdInviteCode, setCreatedInviteCode] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      if (accountType === "owner") {
        const { inviteCode: newCode } = await registerSalonOwner({
          email,
          password,
          fullName,
          salonName,
        });
        setCreatedInviteCode(newCode);
      } else {
        await register({ email, password, fullName, specialization, inviteCode });
        navigate("/clients");
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  if (createdInviteCode) {
    return (
      <div className="auth-page">
        <h1>{t("app_name")}</h1>
        <h2>Салон создан</h2>
        <p>Передайте этот код мастерам, чтобы они присоединились к вашему салону при регистрации:</p>
        <p className="invite-code">{createdInviteCode}</p>
        <button onClick={() => navigate("/salon")}>Перейти в панель салона</button>
      </div>
    );
  }

  return (
    <div className="auth-page">
      <h1>{t("app_name")}</h1>
      <h2>{t("register")}</h2>

      <div className="account-type-switch">
        <button
          type="button"
          className={accountType === "master" ? "active" : ""}
          onClick={() => setAccountType("master")}
        >
          Я мастер
        </button>
        <button
          type="button"
          className={accountType === "owner" ? "active" : ""}
          onClick={() => setAccountType("owner")}
        >
          Я владелец салона
        </button>
      </div>

      <form onSubmit={handleSubmit}>
        <label>
          {t("full_name")}
          <input value={fullName} onChange={(e) => setFullName(e.target.value)} required />
        </label>

        {accountType === "owner" ? (
          <label>
            Название салона
            <input value={salonName} onChange={(e) => setSalonName(e.target.value)} required />
          </label>
        ) : (
          <>
            <label>
              {t("specialization")}
              <select value={specialization} onChange={(e) => setSpecialization(e.target.value)}>
                {getSpecializationOptions().map((opt) => (
                  <option key={opt.id} value={opt.id}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </label>
            <label>
              Код приглашения в салон (необязательно)
              <input
                value={inviteCode}
                onChange={(e) => setInviteCode(e.target.value)}
                placeholder="Оставьте пустым, если работаете без салона"
              />
            </label>
          </>
        )}

        <label>
          {t("email")}
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </label>
        <label>
          {t("password")}
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={6}
          />
        </label>
        {error && <p className="error">{error}</p>}
        <button type="submit" disabled={loading}>
          {t("sign_up")}
        </button>
      </form>
      <p>
        <Link to="/login">{t("login")}</Link>
      </p>
    </div>
  );
}
