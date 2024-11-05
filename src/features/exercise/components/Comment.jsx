import React, { useEffect, useState } from 'react'

import { Box, Typography } from '@mui/material'

import CardAction from './CardAction'
import CommentForm from './CommentForm'
import CommentItem from './CommentItem'

import exerciseApi from '../exerciseApi'

const Comment = ({ exercise }) => {
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
    ;(async () => {
      try {
        const comments = await exerciseApi.getExerciseComments(exercise.id)
        setComments(comments)
      } catch (error) {}
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
