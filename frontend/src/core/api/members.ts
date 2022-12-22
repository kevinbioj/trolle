import api from './_client';

export const get = (id: UUID) => api<Member[]>(`/projects/${id}/members`);

export const add = (id: UUID, username: string) =>
  api<void>(`/projects/${id}/members/${username}`, { method: 'PUT' });

export const remove = (id: UUID, username: string) =>
  api<void>(`/projects/${id}/members/${username}`, { method: 'DELETE' });
