import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

export default function Layout({ children }) {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const isDashboard = location.pathname.startsWith("/dashboard");

  function handleLogout() {
    logout();
    navigate("/");
  }

  return (
    <div className={`shell ${isDashboard ? "shell-app" : ""}`}>
      <header className={`topbar ${isDashboard ? "topbar-app" : ""}`}>
        <div className="topbar-left">
          <Link to="/" className="brand">CloudVault</Link>
          <p className="brand-tag">
            {isDashboard ? "Operations workspace" : "Enterprise content workspace"}
          </p>
        </div>
        <nav className="navlinks">
          {!isDashboard ? <NavLink to="/">Home</NavLink> : null}
          {!user ? <NavLink to="/login">Login</NavLink> : null}
          {!user ? <NavLink to="/register">Register</NavLink> : null}
          <NavLink to="/dashboard">Dashboard</NavLink>
          {user ? (
            <button className="button secondary inline-button" onClick={handleLogout} type="button">
              Logout
            </button>
          ) : null}
        </nav>
      </header>
      <main className="py-5">{children}</main>
    </div>
  );
}
