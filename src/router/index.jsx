import { createBrowserRouter } from 'react-router-dom'

import NotFound from '~/components/NotFound'

import authRoutes from '~/features/auth/authRoute'
import exerciseRoutes from '~/features/exercise/exerciseRoute'
import homeRoutes from '~/features/home/homeRoutes'

const router = createBrowserRouter([
  ...authRoutes,
  ...homeRoutes,
  ...exerciseRoutes,
  { element: <NotFound />, path: '/not-found' },
  { element: <NotFound />, path: '*' }
])

export default router
