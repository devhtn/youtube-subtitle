import AdminHomePage from './pages/AdminHomePage'
import UserHomePage from './pages/UserHomePage'
import RequireAuth from '~/components/RequireAuth'
import MainLayout from '~/features/layout/layouts/MainLayout'

const homeRoutes = [
  // admin home routes
  {
    element: <MainLayout />,
    children: [
      {
        path: '/admin',
        element: (
          <RequireAuth allowedRoles={['admin']} loginPage={'admin'}>
            <AdminHomePage />
          </RequireAuth>
        )
      }
    ]
  },
  // user home routes
  {
    element: <MainLayout />,
    children: [
      {
        path: '/',
        element: (
          <RequireAuth allowedRoles={['user']} loginPage={'user'}>
            <UserHomePage />
          </RequireAuth>
        )
      }
    ]
  }
]
export default homeRoutes
