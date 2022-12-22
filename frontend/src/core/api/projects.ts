import api from './_client';

export const findAllInvolved = () => api<Project[]>('/projects/involved');

export const get = (id: UUID) => api<Project>(`/projects/${id}`);
