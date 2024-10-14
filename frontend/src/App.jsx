import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import RootLayout from './components/home/RootLayout';
import HomePage from './pages/HomePage';
import SignUpPage from './pages/SignUpPage';
import LoginPage from './pages/LoginPage';
import ErrorPage from './pages/ErrorPage';
import NotificationPage from './pages/NotificationPage';
import ProfilePage from './pages/ProfilePage';

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

const App = () => {
  return <RouterProvider router={router} />;
};

export default App;
