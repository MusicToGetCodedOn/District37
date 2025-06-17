import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import HomeRoute from './routes/HomeRoute.jsx'
import AppointmentRoute from './routes/AppointmentRoute.jsx'
import AboutRoute from './routes/AboutRoute.jsx'

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
        element: <AppointmentRoute />
      },
      {
        path: '/about/',
        element: <AboutRoute />
      }
        

    ],
  },
])
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router}/>
  </StrictMode>,
)