import CreateVideo from './pages/CreateVideo'
import RequireAuth from '~/components/RequireAuth'
import MainLayout from '~/layouts/MainLayout'

const videoRoutes = [
  // admin home routes
  {
    element: <MainLayout />,
    children: [
      {
        path: '/admin/create-video',
        element: (
          <RequireAuth allowedRoles={['admin']}>
            <CreateVideo />
          </RequireAuth>
        )
      }
    ]
  }
  // user home routes
]
export default videoRoutes
