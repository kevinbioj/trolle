import api from './_client';

interface UpdateProjectData {
  name?: string;
  isPublic?: boolean;
}

export const create = (name: string, columns: string[]) =>
  api<Project, { name: string; columns: string[] }>('/projects', {
    body: { name, columns },
  });

export const remove = (id: UUID) =>
  api<void>(`/projects/${id}`, { method: 'DELETE' });

export const findAllInvolved = () => api<Project[]>('/projects/involved');

export const findAllPublic = () => api<Project[]>('/projects/public');

export const get = (id: UUID) => api<Project>(`/projects/${id}`);

export const update = (id: UUID, data: UpdateProjectData) =>
  api<Project, UpdateProjectData>(`/projects/${id}`, {
    body: data,
    method: 'PATCH',
  });
