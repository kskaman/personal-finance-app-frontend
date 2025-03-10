// App.tsx
import { Routes, Route, Navigate } from "react-router";
import LoginPage from "./pages/LoginPage";
import MainApp from "./MainApp";

const App = () => {
  const userToken = localStorage.getItem("userToken");

  return (
    <Routes>
      {/* Public route for login */}
      <Route
        path="/login"
        element={userToken ? <Navigate to="/" /> : <LoginPage />}
      />
      {/* Protected routes for the main app */}
      <Route
        path="/*"
        element={userToken ? <MainApp /> : <Navigate to="/login" />}
      />
    </Routes>
  );
};

export default App;
