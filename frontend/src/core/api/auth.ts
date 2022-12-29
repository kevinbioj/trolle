import api from './_client';

export const login = (username: string, password: string) =>
  api<User, { username: string; password: string }>('/login', {
    body: new URLSearchParams({ username, password }),
  });

export const logout = () => api<void>('/logout', { method: 'POST' });
