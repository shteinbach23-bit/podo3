import { BrowserRouter, Routes, Route, Navigate, NavLink } from "react-router-dom";
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

function Sidebar() {
  const { t } = useTranslation();
  const { user, masterProfile, logout } = useAuth();
  const isOwner = masterProfile?.role === "owner";

  if (!user) return null;

  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <img src="/logo-icon.svg" alt="Lumina" className="sidebar-logo-icon" />
        <div className="sidebar-logo-text">
          <div className="sidebar-logo-title">LUMINA</div>
          <div className="sidebar-logo-subtitle">Для подологов</div>
        </div>
      </div>

      <nav className="sidebar-nav">
        {isOwner ? (
          <>
            <NavLink to="/salon" className={({ isActive }) => "sidebar-link" + (isActive ? " active" : "")}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                <circle cx="9" cy="7" r="4"/>
                <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
                <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
              </svg>
              Мой салон
            </NavLink>
            <NavLink to="/salon-calendar" className={({ isActive }) => "sidebar-link" + (isActive ? " active" : "")}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                <line x1="16" y1="2" x2="16" y2="6"/>
                <line x1="8" y1="2" x2="8" y2="6"/>
                <line x1="3" y1="10" x2="21" y2="10"/>
              </svg>
              {t("calendar")}
            </NavLink>
          </>
        ) : (
          <>
            <NavLink to="/clients" className={({ isActive }) => "sidebar-link" + (isActive ? " active" : "")}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                <circle cx="9" cy="7" r="4"/>
                <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
                <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
              </svg>
              {t("clients")}
            </NavLink>
            <NavLink to="/calendar" className={({ isActive }) => "sidebar-link" + (isActive ? " active" : "")}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                <line x1="16" y1="2" x2="16" y2="6"/>
                <line x1="8" y1="2" x2="8" y2="6"/>
                <line x1="3" y1="10" x2="21" y2="10"/>
              </svg>
              {t("calendar")}
            </NavLink>
            <NavLink to="/subscription" className={({ isActive }) => "sidebar-link" + (isActive ? " active" : "")}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="1" y="4" width="22" height="16" rx="2" ry="2"/>
                <line x1="1" y1="10" x2="23" y2="10"/>
              </svg>
              Подписка
            </NavLink>
            <NavLink to="/settings" className={({ isActive }) => "sidebar-link" + (isActive ? " active" : "")}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="3"/>
                <path d="M19.07 4.93a10 10 0 0 1 0 14.14M4.93 4.93a10 10 0 0 0 0 14.14"/>
                <path d="M12 2v2M12 20v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M2 12h2M20 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/>
              </svg>
              Настройки
            </NavLink>
          </>
        )}
      </nav>

      <button className="sidebar-logout" onClick={logout}>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
          <polyline points="16 17 21 12 16 7"/>
          <line x1="21" y1="12" x2="9" y2="12"/>
        </svg>
        {t("logout")}
      </button>
    </aside>
  );
}

function Layout({ children }) {
  const { user } = useAuth();

  return (
    <div className={`layout ${user ? "layout--with-sidebar" : ""}`}>
      <Sidebar />
      <main className="main-content">{children}</main>
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
