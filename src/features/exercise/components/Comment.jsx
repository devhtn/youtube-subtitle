import React, { useEffect, useState } from 'react'

import { Box, Typography } from '@mui/material'

import CommentForm from './CommentForm'
import CommentItem from './CommentItem'

import exerciseApi from '../exerciseApi'

const Comment = ({ exerciseId }) => {
  const [comments, setComments] = useState([])
  const [totalComments, setTotalComments] = useState(0)

  useEffect(() => {
    if (comments.length > 0) {
      let count = 0
      comments.forEach((comment) => {
        count++
        if (comment.replies?.length > 0) count += comment.replies?.length
      })
      setTotalComments(count)
    }
  }, [comments])

  useEffect(() => {
    ;(async () => {
      await exerciseApi
        .getExerciseComments(exerciseId)
        .then((comments) => setComments(comments))
    })()
  }, [])
  return (
    <>
      <Typography variant='subtitle1' mb={2}>
        {totalComments} comments
      </Typography>
      <CommentForm exerciseId={exerciseId} setComments={setComments} />
      {/* show comment */}
      <Box mt={4}>
        {comments.map((comment) => (
          <CommentItem
            key={comment.id}
            comment={comment}
            setComments={setComments}
          />
        ))}
      </Box>
    </>
  )
}

export default Comment
