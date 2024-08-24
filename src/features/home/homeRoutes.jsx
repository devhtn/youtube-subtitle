import AdminHomePage from './pages/AdminHomePage'
import RequireAuth from '~/components/RequireAuth'
import MainLayout from '~/layouts/MainLayout'

const homeRoutes = [
  // admin home routes
  {
    element: <MainLayout />,
    children: [
      {
        path: '/admin',
        element: (
          <RequireAuth allowedRoles={['admin']}>
            <AdminHomePage />
          </RequireAuth>
        )
      }
    ]
  }
  // user home routes
]
export default homeRoutes
