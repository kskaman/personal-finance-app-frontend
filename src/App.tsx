import { Routes, Route, Navigate } from "react-router";
import { useContext } from "react";
import { AuthContext } from "./context/AuthProvider";
import DataProvider from "./context/DataProvider";
import LoadingIndicator from "./ui/LoadingIndicator";

import MainRoutes from "./MainApp/MainRoutes";
import AuthRoutes from "./auth/AuthRoutes";
import NotFoundPage from "./NotFoundPage";

const App = () => {
  const { user, loading } = useContext(AuthContext);

  if (loading) return <LoadingIndicator />;

  return (
    <Routes>
      {/* ---- default landing: send to the right place ---- */}
      <Route
        path="/"
        element={
          <Navigate to={user ? "/app/overview" : "/auth/login"} replace />
        }
      />

      {!user && <Route path="/auth/*" element={<AuthRoutes />} />}

      {/* ---- AUTH ---- */}
      {!user && <Route path="/auth/*" element={<AuthRoutes />} />}

      {/* ---- APP (protected) ---- */}
      {user && (
        <Route
          path="/app/*"
          element={
            <DataProvider>
              <MainRoutes />
            </DataProvider>
          }
        />
      )}

      {/* optional catch‑all */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};

export default App;
