type Id = number;
type UUID = string;

interface APIError {
  type: 'about:blank';
  title: string;
  detail: string;
  status: number;
  instance: string;
}

interface Column {
  id: Id;
  name: string;
}

interface Member {
  joinedAt: string;
  user: User;
}

interface Project {
  id: UUID;
  name: string;
  owner: User;
  columns: Column[];
  createdAt: string;
}

interface Task {
  id: UUID;
  title: string;
  description: string | null;
  project: Pick<Project, 'id' | 'name'>;
  assignee: Member | null;
  columnId: Id;
  dueDate: string | null;
  updatedAt: string;
  createdAt: string;
}

interface User {
  username: string;
  displayName: string;
  createdAt: string;
}
