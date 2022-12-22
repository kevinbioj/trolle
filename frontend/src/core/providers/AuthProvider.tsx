import * as api from 'core/api';
import {
  createContext,
  useContext,
  useMemo,
  useState,
  useEffect,
  type ReactNode,
} from 'react';

interface AuthContextProps {
  loading: boolean;
  login: (username: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  refetchUser: () => Promise<void>;
  user: User | null;
}

const AuthContext = createContext<AuthContextProps>(null!);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    api.users
      .getMe()
      .then((u) => setUser(u))
      .catch(() => void 0)
      .finally(() => setLoading(false));
  }, []);

  const login = (username: string, password: string) =>
    api.auth
      .login(username, password)
      .then(setUser)
      .finally(() => setLoading(false));
  const logout = () => api.auth.logout().then(() => setUser(null));
  const refetchUser = () =>
    api.users
      .getMe()
      .then((u) => setUser(u))
      .catch(() => void 0);

  const value = useMemo(
    () => ({
      loading,
      login,
      logout,
      refetchUser,
      user,
    }),
    [loading, user],
  );
  return (
    <AuthContext.Provider value={value}>
      {loading ? null : children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
