import MainLayout from '../layout/layouts/MainLayout'
import CreateExercise from './pages/CreateExercise'
import Exercise from './pages/Exercise'
import ManageExercise from './pages/ManageExercise'
import PlayExercise from './pages/PlayExercise'
import ReviewExercise from './pages/ReviewExercise'
import RequireAuth from '~/components/RequireAuth'

const exerciseRoutes = [
  // admin home routes
  {
    element: <MainLayout />,
    children: [
      {
        path: 'exercise',
        children: [
          {
            path: 'create',
            element: (
              <RequireAuth allowedRoles={['user']}>
                <CreateExercise />
              </RequireAuth>
            )
          },
          {
            path: 'admin/create',
            element: (
              <RequireAuth allowedRoles={['admin']}>
                <CreateExercise />
              </RequireAuth>
            )
          },
          {
            path: 'admin/manage',
            element: (
              <RequireAuth allowedRoles={['admin']}>
                <ManageExercise />
              </RequireAuth>
            )
          },
          {
            path: '',
            element: (
              <RequireAuth allowedRoles={['user']}>
                <Exercise />
              </RequireAuth>
            )
          },
          {
            path: ':id/play',
            element: (
              <RequireAuth allowedRoles={['user']}>
                <PlayExercise />
              </RequireAuth>
            )
          },
          {
            path: ':videoId/review',
            element: (
              <RequireAuth allowedRoles={['user']}>
                <ReviewExercise />
              </RequireAuth>
            )
          }
        ]
      }
    ]
  }
  // user home routes
]

export default exerciseRoutes
