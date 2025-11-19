import React, { createContext, useContext, useEffect, useMemo, useState } from "react";

type User = {
  firstName: string;
  provider?: string;
};

type AuthContextType = {
  user: User | null;
  loading: boolean;
  refresh: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const API_BASE = (import.meta as any).env?.VITE_API_BASE_URL || "http://localhost:3000";

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchStatus = async () => {
    try {
      const res = await fetch(`${API_BASE}/status`, { credentials: "include" });
      if (res.status === 401) {
        setUser(null);
      } else {
        const data = await res.json();
        if (data?.authenticated) {
          setUser({ firstName: data.firstName, provider: data.provider });
        } else {
          setUser(null);
        }
      }
    } catch (e) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStatus();
    // no deps, run once on mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const value = useMemo(() => ({ user, loading, refresh: fetchStatus }), [user, loading]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};
