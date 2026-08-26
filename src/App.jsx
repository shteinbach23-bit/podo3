import { BrowserRouter, Routes, Route, Navigate, Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { AuthProvider, useAuth } from "./context/AuthContext";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import ClientsPage from "./pages/ClientsPage";
import CalendarPage from "./pages/CalendarPage";
import SalonPage from "./pages/SalonPage";
import SalonCalendarPage from "./pages/SalonCalendarPage";
import SalonMasterDetailPage from "./pages/SalonMasterDetailPage";
import "./App.css";

function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return <p>...</p>;
  if (!user) return <Navigate to="/login" replace />;
  return children;
}

function LanguageSwitcher() {
  const { i18n } = useTranslation();
  return (
    <select value={i18n.language} onChange={(e) => i18n.changeLanguage(e.target.value)}>
      <option value="ru">RU</option>
      <option value="en">EN</option>
      <option value="de">DE</option>
    </select>
  );
}

function Layout({ children }) {
  const { t } = useTranslation();
  const { user, masterProfile, logout } = useAuth();
  const isOwner = masterProfile?.role === "owner";

  return (
    <div className="layout">
      <nav className="navbar">
        <span className="brand">{t("app_name")}</span>
        {user && (
          <div className="nav-links">
            {isOwner ? (
              <>
                <Link to="/salon">Мой салон</Link>
                <Link to="/salon-calendar">{t("calendar")}</Link>
              </>
            ) : (
              <>
                <Link to="/clients">{t("clients")}</Link>
                <Link to="/calendar">{t("calendar")}</Link>
              </>
            )}
            <button onClick={logout}>{t("logout")}</button>
          </div>
        )}
        <LanguageSwitcher />
      </nav>
      <main>{children}</main>
    </div>
  );
}

function AppRoutes() {
  return (
    <Layout>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route
          path="/clients"
          element={
            <ProtectedRoute>
              <ClientsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/calendar"
          element={
            <ProtectedRoute>
              <CalendarPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/salon"
          element={
            <ProtectedRoute>
              <SalonPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/salon-calendar"
          element={
            <ProtectedRoute>
              <SalonCalendarPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/salon/master/:masterId"
          element={
            <ProtectedRoute>
              <SalonMasterDetailPage />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<Navigate to="/clients" replace />} />
      </Routes>
    </Layout>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
