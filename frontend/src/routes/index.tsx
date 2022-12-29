import type { Route } from '@tanstack/react-location';
import { AuthGuard, GuestGuard } from 'core/guards';

const HomePage = () => import('./HomePage').then((p) => <p.default />);
const LoginPage = () =>
  import('./LoginPage').then((p) => (
    <GuestGuard>
      <p.default />
    </GuestGuard>
  ));
const RegisterPage = () =>
  import('./RegisterPage').then((p) => (
    <GuestGuard>
      <p.default />
    </GuestGuard>
  ));
const ProfilePage = () =>
  import('./ProfilePage').then((p) => (
    <AuthGuard>
      <p.default />
    </AuthGuard>
  ));
const CreateProjectPage = () =>
  import('./CreateProjectPage').then((p) => (
    <AuthGuard>
      <p.default />
    </AuthGuard>
  ));
const ProjectPage = () => import('./ProjectPage').then((p) => <p.default />);
const MembersPage = () => import('./MembersPage').then((p) => <p.default />);

export default [
  { path: '/', element: HomePage },
  {
    path: '/profile',
    element: ProfilePage,
  },
  {
    path: '/login',
    element: LoginPage,
  },
  {
    path: '/register',
    element: RegisterPage,
  },
  {
    path: '/projects/create',
    element: CreateProjectPage,
  },
  {
    path: '/projects/:id',
    children: [
      {
        path: '/members',
        element: MembersPage,
      },
      {
        path: '/',
        element: ProjectPage,
      },
    ],
  },
] satisfies Route[];
