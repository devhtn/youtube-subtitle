import { createBrowserRouter } from 'react-router-dom'

import NotFound from '~/components/NotFound'

import authRoutes from '~/features/auth/authRoute'
import homeRoutes from '~/features/home/homeRoutes'
import noteRoutes from '~/features/note/noteRoute'

const router = createBrowserRouter([
  ...authRoutes,
  ...homeRoutes,
  ...noteRoutes,
  { element: <NotFound />, path: '/not-found' },
  { element: <NotFound />, path: '*' }
])

export default router
