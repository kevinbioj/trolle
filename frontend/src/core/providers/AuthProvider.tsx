import { useQuery, useQueryClient } from '@tanstack/react-query';
import * as api from 'core/api';
import { createContext, useContext, type ReactNode } from 'react';

interface AuthContextProps {
  isLoading: boolean;
  login: (username: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  refetch: () => void;
  user: User | null;
}

const AuthContext = createContext<AuthContextProps>(null!);

export function AuthProvider({ children }: { children: ReactNode }) {
  const user = useQuery({
    queryKey: ['user'],
    queryFn: api.users.me,
  });
  const queryClient = useQueryClient();

  const login = (username: string, password: string) =>
    api.auth
      .login(username, password)
      .then((user) => void queryClient.setQueryData(['user'], user));
  const logout = () =>
    api.auth.logout().then(() => void queryClient.setQueryData(['user'], null));

  return (
    <AuthContext.Provider
      value={{
        isLoading: user.isLoading,
        login,
        logout,
        refetch: user.refetch,
        user: user.data ?? null,
      }}
    >
      {user.isLoading ? null : children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
