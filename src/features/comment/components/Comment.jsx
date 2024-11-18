import { useEffect, useState } from 'react'

import { Box } from '@mui/material'

import CommentForm from './CommentForm'
import CommentItem from './CommentItem'
import CardAction from '~/features/exercise/components/CardAction'

import useCommentSocketContext from '~/contexts/useCommentSocketContext'
import exerciseApi from '~/features/exercise/exerciseApi'

// import useCommentSocket from '~/hooks/useCommentSocket'

const Comment = ({ exercise }) => {
  const { newNotify } = useCommentSocketContext()

  const [comments, setComments] = useState([])
  const [newComment, setNewComment] = useState({})
  // const { newNotify } = useCommentSocket(auth.id)

  const handleCreate = (newComment) => {
    setNewComment(newComment)
    if (newComment.parentId === null)
      setComments((prev) => [newComment, ...prev])
    else {
      setComments((prev) =>
        prev.map((comment) => {
          if (comment.id === newComment.parentId) {
            return {
              ...comment,
              replies: [newComment, ...comment.replies] // Thêm vào đầu mảng replies
            }
          }
          return comment
        })
      )
    }
  }

  const handleLikeChange = (updateComment) => {
    if (updateComment.parentId === null) {
      // Cập nhật nếu comment gốc
      setComments((prevComments) =>
        prevComments.map((cmt) =>
          cmt.id === updateComment.id ? updateComment : cmt
        )
      )
    } else {
      // Cập nhật nếu comment là replyName
      setComments((prevComments) =>
        prevComments.map((cmt) => {
          if (cmt.id === updateComment.parentId) {
            return {
              ...cmt,
              replies: cmt.replies.map((reply) =>
                reply.id === updateComment.id ? updateComment : reply
              )
            }
          }
          return cmt
        })
      )
    }
  }

  useEffect(() => {
    if (newNotify) {
      handleCreate(newNotify)
    }
  }, [newNotify])

  useEffect(() => {
    ;(async () => {
      try {
        const comments = await exerciseApi.getExerciseComments(exercise.id)
        setComments(comments)
      } catch (error) {
        console.log(error)
      }
    })()
  }, [])

  return (
    <>
      <CardAction inCard={false} exercise={exercise} newComment={newComment} />
      <CommentForm exerciseId={exercise.id} onCreate={handleCreate} />
      {/* show comment */}
      <Box mt={4}>
        {comments.map((comment) => (
          <CommentItem
            key={comment.id}
            comment={comment}
            onToggleLike={handleLikeChange}
            handleCreate={handleCreate}
            handleLikeChange={handleLikeChange}
          />
        ))}
      </Box>
    </>
  )
}

export default Comment
