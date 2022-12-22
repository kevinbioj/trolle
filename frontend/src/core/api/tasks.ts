import api from './_client';

export const fromProject = (id: UUID) => api<Task[]>(`/projects/${id}/tasks`);

export const update = (
  id: UUID,
  data: {
    title: string;
    description: string | null;
    assignee: string | null;
    dueDate: string | null;
  },
) =>
  api<Task>(`/tasks/${id}`, {
    body: data,
    method: 'PATCH',
  });
