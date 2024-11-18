import { RouterProvider } from 'react-router-dom'

import CommentSocketProvider from './contexts/CommentSocketProvider'

import useAuth from './hooks/useAuth'
import router from './router'

function App() {
  const auth = useAuth()
  return (
    <>
      <CommentSocketProvider userId={auth.id}>
        <RouterProvider router={router} />
      </CommentSocketProvider>
    </>
  )
}

export default App
