// App.tsx
import { Routes, Route, Navigate } from "react-router";
import LoginPage from "./pages/LoginPage";
import MainApp from "./MainApp";
import { useContext } from "react";
import { AuthContext } from "./context/AuthProvider";
import DataProvider from "./context/DataProvider";

const App = () => {
  const { user, loading } = useContext(AuthContext);

  //! Could add a nice spinner here if you wanted! If you do, create a simple <LoadingIndicator /> componet for it
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

/**
 * Code Review Summary & Recommendations
 *
 * 1. **Improve Reusability**:
 *    - Extract shared logic into reusable utility functions and hooks (e.g., modal management, formatting functions).
 *    - Ensure to create reusable components where things are used repeatedly. In some cases, slight differences can be handled with props but that is a fine line and ultimately it is up to you to determine what makes sense to be share and when to split into a separate component.
 *
 * 2. **Optimize Performance**:
 *    - Look into things like `Set` and `Map` for efficient lookups where applicable.
 *    - Look into things like Memoization and useCallback for expensive computations and avoid unnecessary re-renders in context-heavy components.
 *
 * 3. **Continue to Strengthen TypeScript Practices**:
 *    - Use discriminated unions to eliminate unnecessary required props.
 *
 * Overall, the code is well-structured with strong React, TypeScript, and MUI usage. The next step is refining reusability, performance, and testing to further improve maintainability and efficiency.
 */
