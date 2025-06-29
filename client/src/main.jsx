import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import HomeRoute from './routes/HomeRoute.jsx'
import AppointmentRoute from './routes/AppointmentRoute.jsx'
import AboutRoute from './routes/AboutRoute.jsx'
import LoginRoute from './routes/LoginRoute.jsx'
import RegisterRoute from './routes/RegisterRoute.jsx'
import ProtectedRoute from './routes/ProtectedRoute.jsx'
import AdminRoute from './routes/AdminRoute.jsx'

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      {
        index: true,
        element: <HomeRoute />,
      },
      {
        path: '/appointment/',
        element:<AppointmentRoute />
      },
      {
        path: '/about/',
        element: <AboutRoute />
      },
      {
        path: '/login/',
        element: <LoginRoute />
      },
      {
        path: '/register/',
        element: <RegisterRoute />
      },
      {
        path: '/dashboard/',
        element: <ProtectedRoute allowedRoles={['superuser', 'admin']}>
          <AdminRoute />
        </ProtectedRoute>
      }

    ],
  },
])
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router}/>
  </StrictMode>,
)