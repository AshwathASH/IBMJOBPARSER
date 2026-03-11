import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from "react";

export type UserRole = "seeker" | "employer";

export interface User {
  name: string;
  email: string;
  role: UserRole;
}

interface AuthState {
  user: User | null;
  login: (email: string, password: string) => string | null;
  signup: (name: string, email: string, password: string, role: UserRole) => string | null;
  logout: () => void;
}

const AuthContext = createContext<AuthState | null>(null);

const USERS_KEY = "ashwath_users";
const SESSION_KEY = "ashwath_session";

interface StoredUser {
  name: string;
  email: string;
  password: string;
  role: UserRole;
}

function getStoredUsers(): StoredUser[] {
  try {
    return JSON.parse(localStorage.getItem(USERS_KEY) || "[]");
  } catch {
    return [];
  }
}

function saveUsers(users: StoredUser[]) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    try {
      const s = localStorage.getItem(SESSION_KEY);
      return s ? JSON.parse(s) : null;
    } catch {
      return null;
    }
  });

  useEffect(() => {
    if (user) {
      localStorage.setItem(SESSION_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(SESSION_KEY);
    }
  }, [user]);

  const signup = useCallback((name: string, email: string, password: string, role: UserRole): string | null => {
    if (!name.trim()) return "Name is required";
    if (!email.trim() || !email.includes("@")) return "Valid email is required";
    if (password.length < 6) return "Password must be at least 6 characters";

    const users = getStoredUsers();
    if (users.some((u) => u.email.toLowerCase() === email.toLowerCase())) {
      return "An account with this email already exists";
    }

    users.push({ name: name.trim(), email: email.toLowerCase().trim(), password, role });
    saveUsers(users);
    setUser({ name: name.trim(), email: email.toLowerCase().trim(), role });
    return null;
  }, []);

  const login = useCallback((email: string, password: string): string | null => {
    if (!email.trim() || !password) return "Email and password are required";

    const users = getStoredUsers();
    const found = users.find(
      (u) => u.email.toLowerCase() === email.toLowerCase().trim() && u.password === password
    );

    if (!found) return "Invalid email or password";
    setUser({ name: found.name, email: found.email, role: found.role });
    return null;
  }, []);

  const logout = useCallback(() => {
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
