// App.tsx
import { Routes, Route, Navigate } from "react-router";
import LoginPage from "./pages/LoginPage";
import MainApp from "./MainApp";
import { useContext } from "react";
import { AuthContext } from "./context/AuthProvider";
import DataProvider from "./context/DataProvider";

const App = () => {
  const { user, loading } = useContext(AuthContext);

  if (loading) return <div>Loading...</div>;
  return (
    <Routes>
      {/* Public route for login */}
      <Route
        path="/login"
        element={user ? <Navigate to="/" /> : <LoginPage />}
      />
      {/* Protected routes for the main app */}
      <Route
        path="/*"
        element={
          user ? (
            <DataProvider>
              <MainApp />
            </DataProvider>
          ) : (
            <Navigate to="/login" />
          )
        }
      />
    </Routes>
  );
};

export default App;
