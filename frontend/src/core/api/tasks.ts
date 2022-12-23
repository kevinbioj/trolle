import api from './_client';

interface CreateTaskData {
  title: string;
  projectId: UUID;
  columnId: Id;
}

interface UpdateTaskData {
  title?: string;
  description?: string | null;
  assignee?: string | null;
  columnId?: Id | null;
  dueDate?: string | null;
}

export const fromProject = (id: UUID) => api<Task[]>(`/projects/${id}/tasks`);

export const create = (data: CreateTaskData) =>
  api<Task, CreateTaskData>('/tasks', {
    body: data,
  });

export const remove = (id: UUID) =>
  api<void>(`/tasks/${id}`, { method: 'DELETE' });

export const update = (id: UUID, data: UpdateTaskData) =>
  api<Task, UpdateTaskData>(`/tasks/${id}`, {
    body: data,
    method: 'PATCH',
  });
