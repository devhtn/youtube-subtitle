import AdminLoginPage from './pages/AdminLoginPage'
import UserLoginPage from './pages/UserLoginPage'

const authRoutes = [
  // admin auth routes
  {
    path: '/admin/login',
    element: <AdminLoginPage />
  },
  {
    path: '/admin/re-login',
    element: <AdminLoginPage />
  },
  // user auth routes
  {
    path: '/login',
    element: <UserLoginPage />
  },
  {
    path: '/re-login',
    element: <UserLoginPage />
  }
]
export default authRoutes
