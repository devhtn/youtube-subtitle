import { createBrowserRouter } from 'react-router-dom'

import authRoutes from '~/features/auth/authRoutes'
import homeRoutes from '~/features/home/homeRoutes'
import videoRoutes from '~/features/video/videoRoutes'

const router = createBrowserRouter([
  ...authRoutes,
  ...homeRoutes,
  ...videoRoutes
])

export default router
