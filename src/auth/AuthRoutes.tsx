import { Navigate, Route, Routes } from "react-router";
import LoginForm from "./components/LoginForm";
import SignupForm from "./components/SignupForm";
import ForgotPasswordForm from "./components/ForgotPasswordForm";
import AuthPage from "./AuthPage";

const AuthRoutes = () => (
  <Routes>
    {/* default => /auth  (index route) */}
    <Route path="" element={<AuthPage />}>
      <Route index element={<Navigate to="login" />} />

      {/* explicit /auth/login (optional but nice) */}
      <Route
        path="login"
        element={
          <LoginForm userEmail="john@example.com" userPassword="johnPass#1" />
        }
      />

      <Route path="signup" element={<SignupForm />} />

      <Route path="forgot-password" element={<ForgotPasswordForm />} />
    </Route>
  </Routes>
);

export default AuthRoutes;
