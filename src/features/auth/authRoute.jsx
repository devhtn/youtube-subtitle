import Auth from './pages/Auth'

const authRoutes = [
  // user auth routes
  {
    path: '/login',
    element: <Auth />
  },
  {
    path: '/re-login',
    element: <Auth />
  }
]
export default authRoutes
