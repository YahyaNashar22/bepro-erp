/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import axios from "axios";

import type { IAuthContext } from "../interfaces/IAuthContext";
import type { IUser } from "../interfaces/IUser";
import api from "../utils/axiosInstance";
const AuthContext = createContext<IAuthContext | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<IUser | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [authLoading, setAuthLoading] = useState(true);

  const login = async (username: string, password: string) => {
    try {
      const res = await api.post(
        `/user/login`,
        { username, password },
        { withCredentials: true }
      );

      setUser(res.data.payload);
      setAccessToken(res.data.accessToken);
      axios.defaults.headers.common[
        "Authorization"
      ] = `Bearer ${res.data.accessToken}`;
    } catch (error: any) {
      console.error("Login failed:", error.response?.data || error.message);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await api.post(`/user/logout`, {}, { withCredentials: true });
    } catch (err) {
      console.error("Error logging out:", err);
    } finally {
      setUser(null);
      setAccessToken(null);
      delete axios.defaults.headers.common["Authorization"];
    }
  };

  useEffect(() => {
    let isMounted = true;

    const refresh = async () => {
      try {
        const res = await api.get(`/user/refresh`, {
          withCredentials: true,
        });

        if (!isMounted) return;

        setUser(res.data.payload);
        setAccessToken(res.data.accessToken);
        axios.defaults.headers.common[
          "Authorization"
        ] = `Bearer ${res.data.accessToken}`;
      } catch (error) {
        console.warn("Token refresh failed:", error);
        setUser(null);
        setAccessToken(null);
        delete axios.defaults.headers.common["Authorization"];
      } finally {
        if (isMounted) setAuthLoading(false);
      }
    };

    refresh();

    const interval = setInterval(refresh, 5 * 60 * 1000);
    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, []);

  return (
    <AuthContext.Provider
      value={{ authLoading, user, accessToken, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};
