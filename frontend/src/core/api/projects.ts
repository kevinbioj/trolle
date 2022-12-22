import api from './_client';

export const create = (name: string, columns: string[]) =>
  api<Project>('/projects', {
    body: { name, columns },
  });

export const findAllInvolved = () => api<Project[]>('/projects/involved');

export const findAllPublic = () => api<Project[]>('/projects/public');

export const get = (id: UUID) => api<Project>(`/projects/${id}`);
