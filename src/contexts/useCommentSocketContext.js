import { useContext } from 'react'

import CommentSocketContext from './CommentSocketContext'

// Tạo custom hook để sử dụng Context
const useCommentSocketContext = () => {
  const context = useContext(CommentSocketContext)
  if (!context) {
    throw new Error(
      'useCommentSocketContext phải được sử dụng bên trong CommentSocketProvider'
    )
  }
  return context
}

export default useCommentSocketContext
