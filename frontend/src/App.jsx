import {
  createBrowserRouter,
  Navigate,
  RouterProvider,
} from 'react-router-dom';

import RootLayout from './components/home/RootLayout';
import HomePage from './pages/HomePage';
import SignUpPage from './pages/SignUpPage';
import LoginPage from './pages/LoginPage';
import ErrorPage from './pages/ErrorPage';
import NotificationPage from './pages/NotificationPage';
import ProfilePage from './pages/ProfilePage';
import { useQuery } from '@tanstack/react-query';
import fetchUrl from './utils/axios';
import LoadingSpinner from './components/common/LoadingSpinner';

const App = () => {
  const { data: authUser, isLoading } = useQuery({
    queryKey: ['authUser'],
    queryFn: async () => {
      try {
        const { data, status } = await fetchUrl.get('/auth/me');

        if (status !== 200) {
          throw new Error(
            data.error?.response?.data?.message || 'Failed to logout'
          );
        }

        return data;
      } catch (error) {
        throw err;
      }
    },
  });

  const userAuthentication = authUser?.status === 'success';

  const router = createBrowserRouter([
    {
      path: '/',
      element: <RootLayout />,
      errorElement: <ErrorPage />,
      children: [
        {
          path: '/',
          element: userAuthentication ? <HomePage /> : <Navigate to="/login" />,
        },
        {
          path: '/signup',
          element: !userAuthentication ? <SignUpPage /> : <Navigate to="/" />,
        },
        {
          path: '/login',
          element: !userAuthentication ? <LoginPage /> : <Navigate to="/" />,
        },
        {
          path: '/notifications',
          element: userAuthentication ? (
            <NotificationPage />
          ) : (
            <Navigate to="/login" />
          ),
        },
        {
          path: '/profile/:username',
          element: userAuthentication ? (
            <ProfilePage />
          ) : (
            <Navigate to="/login" />
          ),
        },
      ],
    },
  ]);

  if (isLoading) {
    return (
      <div className="h-screen flex justify-center items-center">
        <LoadingSpinner size="lg1" />
      </div>
    );
  }

  return <RouterProvider router={router} />;
};

export default App;
