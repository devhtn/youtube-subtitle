import Analysis from './pages/Analysis'
import Dashboard from './pages/Dashboard'
import Intro from './pages/Intro'
import RequireAuth from '~/components/RequireAuth'
import MainLayout from '~/features/layout/layouts/MainLayout'

const homeRoutes = [
  // intro
  {
    path: '/',
    element: <Intro />
  },
  // admin home routes
  {
    element: <MainLayout />,
    children: [
      {
        path: '/admin',
        element: (
          <RequireAuth allowedRoles={['admin']}>
            <Dashboard />
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
        path: '/analysis',
        element: (
          <RequireAuth allowedRoles={['user']}>
            <Analysis />
          </RequireAuth>
        )
      }
    ]
  }
]
export default homeRoutes
