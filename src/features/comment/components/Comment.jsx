import { memo, useEffect, useState } from 'react'
import { useLocation, useSearchParams } from 'react-router-dom'

import { Box } from '@mui/material'

import CommentForm from './CommentForm'
import CommentItem from './CommentItem'
import CardAction from '~/features/exercise/components/CardAction'

import commentApi from '../commentApi'
import useAuth from '~/hooks/useAuth'
import useSocketListener from '~/hooks/useSocketListener'

const Comment = memo(({ exercise }) => {
  const [searchParams] = useSearchParams()
  const commentId = searchParams.get('commentId')
  const auth = useAuth()

  const [commentNotify, setCommentNotify] = useState(null)

  useSocketListener(auth.id, 'comment', (data) => {
    setCommentNotify(data)
  })

  // Lắng nghe sự kiện 'comment'

  const location = useLocation()
  const [currentKey, setCurrentKey] = useState(location.key)

  useEffect(() => {
    setCurrentKey(location.key) // Buộc component được re-render mỗi khi URL thay đổi, kể cả khi nhấn lại cùng URL
  }, [location.key])

  const [comments, setComments] = useState([])
  const [newComment, setNewComment] = useState({})

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
    if (commentNotify) {
      handleCreate(commentNotify.relatedId)
    }
  }, [commentNotify])

  useEffect(() => {
    ;(async () => {
      try {
        const comments = await commentApi.getExerciseComments(exercise.id)
        setComments(comments)
      } catch (error) {
        console.log(error)
      }
    })()
  }, [exercise])

  return (
    <>
      <CardAction isCollapse exercise={exercise} newComment={newComment} />
      <CommentForm
        exerciseId={exercise.id}
        onCreate={handleCreate}
        firstLevel={true}
        role={auth.role}
      />
      {/* show comment */}
      <Box mt={4} key={currentKey}>
        {comments.map((comment) => (
          <CommentItem
            key={comment.id}
            comment={comment}
            userId={auth.id}
            onToggleLike={handleLikeChange}
            handleCreate={handleCreate}
            handleLikeChange={handleLikeChange}
            targetCommentId={commentId}
          />
        ))}
      </Box>
    </>
  )
})

export default Comment
