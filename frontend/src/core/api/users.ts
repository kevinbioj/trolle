import api from './_client';

export const me = () => api<User>('/users/@me');

export const get = (username: string) => api<User>(`/users/${username}`);

export const register = (
  username: string,
  password: string,
  displayName: string,
) =>
  api<User>('/users/register', {
    body: { username, password, displayName },
  });

export const update = (displayName: string) =>
  api<User>('/users/@me', {
    body: { displayName },
    method: 'PATCH',
  });
