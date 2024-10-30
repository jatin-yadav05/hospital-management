import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom'
import './index.css'
import App from './App.jsx'
import Home from './pages/Home'
import Doctors from './pages/Doctors'
import Appointments from './pages/Appointments'
import Contact from './pages/Contact'
import Services from './pages/Services'
import PatientPortal from './pages/PatientPortal'
import ProtectedRoute from './components/ProtectedRoute'
import { AuthProvider } from './context/AuthContext'
import Dashboard from './pages/Dashboard'
import Profile from './pages/Profile'
import HealthMetrics from './pages/HealthMetrics'
import MediStore from './pages/MediStore'
import { CartProvider } from './context/CartContext'
import OrderHistory from './pages/OrderHistory'
import Checkout from './pages/Checkout'

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "/",
        element: <Navigate to="home" replace />
      },
      {
        path: "home",
        element: <Home />
      },
      {
        path: "doctors",
        element: <Doctors />
      },
      {
        path: "appointments",
        element: (
          <ProtectedRoute>
            <Appointments />
          </ProtectedRoute>
        )
      },
      {
        path: "contact",
        element: <Contact />
      },
      {
        path: "services",
        element: <Services />
      },
      {
        path: "patient-portal",
        element: <PatientPortal />
      },
      {
        path: "dashboard",
        element: (
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        )
      },
      {
        path: "profile",
        element: (
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        )
      },
      {
        path: "health-metrics",
        element: (
          <ProtectedRoute>
            <HealthMetrics />
          </ProtectedRoute>
        )
      },
      {
        path: "medistore",
        element: <MediStore />
      },
      {
        path: "order-history",
        element: (
          <ProtectedRoute>
            <OrderHistory />
          </ProtectedRoute>
        )
      },
      {
        path: "checkout",
        element: (
          <ProtectedRoute>
            <Checkout />
          </ProtectedRoute>
        )
      },
      {
        path: "*",
        element: <Navigate to="/" replace />
      }
    ]
  }
], {
  basename: "/hospital-management"
});

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <CartProvider>
        <RouterProvider router={router} />
      </CartProvider>
    </AuthProvider>
  </StrictMode>,
);
