import { Navigate } from '@tanstack/react-location';
import { useAuth } from 'core/providers';
import { type ReactNode } from 'react';

export function GuestGuard({ children }: { children: ReactNode }) {
  const { loading, user } = useAuth();
  if (loading) return null;
  return user ? <Navigate to="/login" /> : <>{children}</>;
}
