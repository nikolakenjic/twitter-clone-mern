import { createBrowserRouter, RouterProvider } from 'react-router-dom';

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

        console.log('auth user is here', data);
        return data;
      } catch (error) {
        throw err;
      }
    },
  });

  const router = createBrowserRouter([
    {
      path: '/',
      element: <RootLayout />,
      errorElement: <ErrorPage />,
      children: [
        { path: '/', element: <HomePage /> },
        { path: '/signup', element: <SignUpPage /> },
        { path: '/login', element: <LoginPage /> },
        { path: '/notifications', element: <NotificationPage /> },
        { path: '/profile/:username', element: <ProfilePage /> },
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
