import { Navigate } from '@tanstack/react-location';
import { useAuth } from 'core/providers';
import { type ReactNode } from 'react';

export function AuthGuard({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  return user ? <>{children}</> : <Navigate to="/login" />;
}
