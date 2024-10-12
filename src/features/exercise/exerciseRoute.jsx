import ExtraLayout from '../layout/layouts/ExtraLayout'
import MainLayout from '../layout/layouts/MainLayout'
import CreateExercise from './pages/CreateExercise'
import DiscoverExercise from './pages/DiscoverExercise'
import ExerciseList from './pages/ExerciseList'
import ManageExercise from './pages/ManageExercise'
import PlayExercise from './pages/PlayExercise'
import ReviewExercise from './pages/ReviewExercise'
import SavedExerciseList from './pages/SavedExerciseList'
import RequireAuth from '~/components/RequireAuth'

const exerciseRoutes = [
  // admin home routes
  {
    element: <MainLayout />,
    children: [
      {
        path: 'play',
        element: (
          <RequireAuth allowedRoles={['user']}>
            <PlayExercise />
          </RequireAuth>
        )
      },
      {
        path: 'exercise',
        children: [
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
  },
  {
    element: (
      <ExtraLayout
        tabItems={[
          { label: 'Exercise', pathname: '/exercise' },
          { label: 'Liked', pathname: '/exercise/liked' },
          { label: 'Discover', pathname: '/exercise/discover' },
          { label: 'Create', pathname: '/exercise/create' }
        ]}
      />
    ),
    children: [
      {
        path: 'exercise',
        children: [
          {
            path: '',
            element: (
              <RequireAuth allowedRoles={['user']}>
                <ExerciseList />
              </RequireAuth>
            )
          },
          {
            path: 'liked',
            element: (
              <RequireAuth allowedRoles={['user']}>
                <SavedExerciseList />
              </RequireAuth>
            )
          },
          {
            path: 'discover',
            element: (
              <RequireAuth allowedRoles={['user']}>
                <DiscoverExercise />
              </RequireAuth>
            )
          },
          {
            path: 'create',
            element: (
              <RequireAuth allowedRoles={['user']}>
                <CreateExercise />
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
