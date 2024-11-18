import React from 'react'

import CommentSocketContext from './CommentSocketContext'

import useCommentSocket from '~/hooks/useCommentSocket'

const CommentSocketProvider = ({ userId, children }) => {
  const socketData = useCommentSocket(userId)

  return (
    <CommentSocketContext.Provider value={socketData}>
      {children}
    </CommentSocketContext.Provider>
  )
}

export default CommentSocketProvider
