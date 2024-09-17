import MainLayout from '../layout/layouts/MainLayout'
import AddNote from './pages/AddNote'
import Note from './pages/Note'
import RequireAuth from '~/components/RequireAuth'

const noteRoutes = [
  // admin home routes
  {
    element: <MainLayout />,
    children: [
      {
        path: '/add-note',
        element: (
          <RequireAuth allowedRoles={['user']}>
            <AddNote />
          </RequireAuth>
        )
      },
      {
        path: '/note/:id',
        element: (
          <RequireAuth allowedRoles={['user']}>
            <Note />
          </RequireAuth>
        )
      }
    ]
  }
  // user home routes
]

export default noteRoutes
