import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <section className="panel">
        <p>Loading session...</p>
      </section>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
}
