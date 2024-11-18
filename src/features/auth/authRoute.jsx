import MainLayout from '../layout/layouts/MainLayout'
import Auth from './pages/Auth'
import ManageUser from './pages/ManageUser'
import RequireAuth from '~/components/RequireAuth'

const authRoutes = [
  // user auth routes
  {
    path: 'login',
    element: <Auth />
  },
  {
    path: 're-login',
    element: <Auth />
  },
  {
    element: <MainLayout />,
    children: [
      {
        path: 'user',
        children: [
          {
            path: 'manage',
            element: (
              <RequireAuth allowedRoles={['admin']}>
                <ManageUser />
              </RequireAuth>
            )
          }
        ]
      }
    ]
  }
]
export default authRoutes
