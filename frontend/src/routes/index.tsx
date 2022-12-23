import type { Route } from '@tanstack/react-location';
import { AuthGuard, GuestGuard } from 'core/guards';

import CreateProjectPage from './CreateProjectPage';
import HomePage from './HomePage';
import LoginPage from './LoginPage';
import ProfilePage from './ProfilePage';
import ProjectPage from './ProjectPage';
import RegisterPage from './RegisterPage';

export default [
  { path: '/', element: <HomePage /> },
  {
    path: '/profile',
    element: (
      <AuthGuard>
        <ProfilePage />
      </AuthGuard>
    ),
  },
  {
    path: '/login',
    element: (
      <GuestGuard>
        <LoginPage />
      </GuestGuard>
    ),
  },
  {
    path: '/register',
    element: (
      <GuestGuard>
        <RegisterPage />
      </GuestGuard>
    ),
  },
  {
    path: '/projects/create',
    element: <CreateProjectPage />,
  },
  {
    path: '/projects/:id',
    element: <ProjectPage />,
  },
] satisfies Route[];
