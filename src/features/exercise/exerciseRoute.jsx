import MainLayout from '../layout/layouts/MainLayout'
import CreateExercise from './pages/CreateExercise'
import ListExercises from './pages/ListExercises'
import ManageExercise from './pages/ManageExercise'
import PlayExercise from './pages/PlayExercise'
import PlayListExercise from './pages/PlayListExercise'
import PreviewExercise from './pages/PreviewExercise'
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
            path: 'preview/:id',
            element: (
              <RequireAuth>
                <PreviewExercise />
              </RequireAuth>
            )
          },
          {
            path: 'list',
            element: (
              <RequireAuth>
                <ListExercises />
              </RequireAuth>
            )
          },
          {
            path: 'create',
            element: (
              <RequireAuth>
                <CreateExercise />
              </RequireAuth>
            )
          },
          {
            path: 'playlist',
            element: (
              <RequireAuth>
                <PlayListExercise />
              </RequireAuth>
            )
          },
          {
            path: 'play/:id',
            element: (
              <RequireAuth>
                <PlayExercise />
              </RequireAuth>
            )
          }
        ]
      }
    ]
  }
]

export default exerciseRoutes
