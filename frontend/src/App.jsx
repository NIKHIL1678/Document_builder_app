import { Route, Routes } from "react-router-dom";
import Layout from "./components/Layout.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import HomePage from "./pages/HomePage.jsx";
import AuthPage from "./pages/AuthPage.jsx";
import DashboardPage from "./pages/DashboardPage.jsx";
import FilesPage from "./pages/FilesPage.jsx"; // New
import AIPage from "./pages/AIPage.jsx";       // New
import SettingsPage from "./pages/SettingsPage.jsx"; // New
import SharedFilePage from "./pages/SharedFilePage.jsx";
import DocumentUpload from "./pages/UploadText.jsx";
import EditorPage from "./pages/EditorPage.jsx";

export default function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<AuthPage mode="login" />} />
        <Route path="/register" element={<AuthPage mode="register" />} />
        <Route path="/shared/:token" element={<SharedFilePage />} />

        {/* Protected Infrastructure Routes */}
        <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
        <Route path="/files" element={<ProtectedRoute><FilesPage /></ProtectedRoute>} />
        <Route path="/ai" element={<ProtectedRoute><AIPage /></ProtectedRoute>} />
        <Route path="/upload" element={<ProtectedRoute><DocumentUpload /></ProtectedRoute>} />
        <Route path="/edit" element={<ProtectedRoute><EditorPage /></ProtectedRoute>} />
        <Route path="/settings" element={<ProtectedRoute><SettingsPage /></ProtectedRoute>} />
      </Routes>
    </Layout>
  );
}