import CreateVideo from './pages/CreateVideoPage'
import PlayVideo from './pages/PlayVideoPage'
import RequireAuth from '~/components/RequireAuth'
import MainLayout from '~/features/layout/layouts/MainLayout'

const videoRoutes = [
  // admin home routes
  {
    element: <MainLayout />,
    children: [
      {
        path: '/create-video',
        element: <CreateVideo />
      },
      {
        path: '/play-video',
        element: <PlayVideo />
      }
    ]
  }
  // user home routes
]
export default videoRoutes
