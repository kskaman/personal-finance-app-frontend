import { createContext, useState, useEffect, ReactNode } from "react";
import axios from "axios";
import { User } from "../types/User";

interface AuthContextProps {
  user: User | null;
  loading: boolean;
  loginError: string | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
}

const AuthContext = createContext<AuthContextProps>({
  user: null,
  loading: true,
  loginError: null,
  login: async () => {
    return false;
  },
  logout: () => {},
  setUser: () => {},
});

export { AuthContext };

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [loginError, setLoginError] = useState<string | null>(null);

  // Check localStorage token on mount
  useEffect(() => {
    const storedToken = localStorage.getItem("userToken");
    if (storedToken) {
      // Attempt auto-login
      fetchUserByToken(storedToken);
    } else {
      setLoading(false);
    }
  }, []);

  // Helper: fetch user from /users.json by token
  const fetchUserByToken = async (token: string) => {
    try {
      const response = await axios.get("/users.json");
      const allUsers: User[] = response.data.users;
      const foundUser = allUsers.find((u) => u.id === token);
      if (foundUser) {
        setUser(foundUser);
      } else {
        // token no longer valid
        localStorage.removeItem("userToken");
      }
    } catch (err) {
      console.error("Fetch user by token failed:", err);
    } finally {
      setLoading(false);
    }
  };

  // Called by your login form onSubmit
  const login = async (email: string, password: string): Promise<boolean> => {
    setLoginError(null);
    setLoading(true);
    try {
      const response = await axios.get("/users.json");
      const allUsers: User[] = response.data.users;
      const foundUser = allUsers.find(
        (u) => u.email === email && u.password === password
      );
      if (!foundUser) {
        setLoginError("Invalid email or password");
        setLoading(false);
        return false;
      }
      // Store token in localStorage
      localStorage.setItem("userToken", foundUser.id);
      setUser(foundUser);
      setLoading(false);
      return true;
    } catch (err) {
      console.error("Login failed:", err);
      setLoginError("Login failed. Please try again.");
      setLoading(false);
      return true;
    }
  };

  // Called by logout button
  const logout = () => {
    localStorage.removeItem("userToken");
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{ user, loading, loginError, login, setUser, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};
