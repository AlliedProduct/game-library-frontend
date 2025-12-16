import { Routes, Route, Navigate } from "react-router-dom";
import GameListPage from "./pages/GameListPage";
import GameFormPage from "./pages/GameFormPage";
import LoginPage from "./pages/LoginPage";
import SignUpPage from "./pages/SignUpPage.tsx";
import ProtectedRoute from "./components/ProtectedRoute";
import { useAuth } from "./context/AuthContext";

export default function App() {
  const { isAuthenticated } = useAuth();

  return (
    <Routes>
      {/* Public routes */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignUpPage />} />

      {/* Protected routes */}
      <Route element={<ProtectedRoute />}>
        <Route path="/" element={<GameListPage />} />
        <Route path="/games/new" element={<GameFormPage />} />
        <Route path="/games/:id/edit" element={<GameFormPage />} />
      </Route>

      {/* Fallback */}
      <Route
        path="*"
        element={
          <Navigate
            to={isAuthenticated ? "/" : "/login"}
            replace
          />
        }
      />
    </Routes>
  );
}
