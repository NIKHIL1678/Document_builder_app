import { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { userRegister } from "../../Apis/UserRegistration.api.jsx";

import { userLogin } from "../../Apis/UserLogin.api.jsx";

export default function AuthPage({ mode }) {
  const navigate = useNavigate();
  const { user, login } = useAuth();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const isRegister = mode === "register";

  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setLoading(true);
    setError("");

    try {
      // 1. Data Preparation
      // We add a dummy company_id for now until your multi-tenant invite system is ready
      const payload = { 
        ...form, 
      };

      // 2. Execute Request
      let result;
      if (isRegister) {
        result = await userRegister(payload); // Calling the API we wrote
      } else {
        // You'll build userLogin similarly soon
        result = await userLogin({ email: form.email, password: form.password });
      }

      // 3. Update Auth Context & Navigate
      // Note: Backend sends 'accessToken', we pass that to login()
      login(result.accessToken, result.user); 
      navigate("/dashboard");

    } catch (err) {
      // Friendly error handling
      setError(err.message || "An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="auth-shell">
      <div className="auth-showcase">
        <p className="eyebrow">{isRegister ? "Launch your workspace" : "Secure sign-in"}</p>
        <h1 className="auth-title">
          {isRegister
            ? "Stand up a protected file workspace your team can trust."
            : "Access your workspace with enterprise-grade clarity."}
        </h1>
        <p className="lede">
          {isRegister
            ? "Create an operational workspace with protected uploads, structured file management, and clean internal sharing."
            : "Log in to your secure storage workspace and continue managing files, folders, and shared assets."}
        </p>
        <div className="auth-metrics">
          <article>
            <strong>25 MB</strong>
            <span>default upload rule</span>
          </article>
          <article>
            <strong>250 MB</strong>
            <span>workspace quota</span>
          </article>
          <article>
            <strong>Live</strong>
            <span>request tracing</span>
          </article>
        </div>
      </div>

      <section className="panel auth-panel product-auth-panel">
        <div className="auth-panel-head">
          <p className="eyebrow">{isRegister ? "Create account" : "Welcome back"}</p>
          <h2>{isRegister ? "Open a new workspace" : "Sign in to CloudVault"}</h2>
          <p className="helper-text">
            {isRegister
              ? "Use a business-ready password to create your workspace."
              : "Use your registered email and password to continue."}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="form-grid">
          {isRegister ? (
            <label>
              <span>Name</span>
              <input
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="Aarav Mehta"
                required
                minLength={2}
                maxLength={80}
              />
            </label>
          ) : null}
          <label>
            <span>Email</span>
            <input
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              placeholder="name@company.com"
              required
            />
          </label>
          <label>
            <span>Password</span>
            <input
              type="password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              placeholder="At least 8 characters"
              required
              minLength={8}
            />
          </label>
          {error ? <p className="error-text">{error}</p> : null}
          <button className="button primary auth-submit" disabled={loading} type="submit">
            {loading ? "Please wait..." : isRegister ? "Create workspace" : "Sign in"}
          </button>
        </form>
      </section>
    </section>
  );
}
