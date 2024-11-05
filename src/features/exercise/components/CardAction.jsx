import { useContext, useEffect, useState } from 'react'

import {
  Comment,
  ExpandLess,
  ExpandMore,
  HowToReg,
  ThumbUpOffAlt
} from '@mui/icons-material'
import { Box, Button, Collapse, Stack, Typography } from '@mui/material'
import _ from 'lodash'

import exerciseApi from '../exerciseApi'
import exerciseUtil from '../exerciseUtil'
import useAuth from '~/hooks/useAuth'

const CardAction = ({ inCard = true, exercise, newComment }) => {
  const auth = useAuth()
  const [showMoreInfo, setShowMoreInfo] = useState(inCard)
  const [isCommented, setIsCommented] = useState(
    exercise.commentedUsers?.includes(auth.id)
  )
  const [commentedCount, setCommentedCount] = useState(exercise.commentedCount)
  const [likedUsers, setLikedUsers] = useState(exercise.likedUsers)

  const isLiked = likedUsers.includes(auth.id)
  const isCompleted = exercise.completedUsers.includes(auth.id)

  const handleToggleLike = async () => {
    const likedUsers = await exerciseApi.toggleLike({
      exerciseId: exercise.id
    })
    setLikedUsers(likedUsers)
  }

  useEffect(() => {
    if (!_.isEmpty(newComment)) {
      if (!isCommented) setIsCommented(true)
      setCommentedCount((prev) => prev + 1)
    }
  }, [newComment])
  return (
    <Box mb={2}>
      <Box
        display={'flex'}
        alignItems='center'
        justifyContent={'space-between'}
      >
        <Stack direction='row' gap={2}>
          <Stack
            direction='row'
            gap={3}
            border={(theme) => theme.app.border}
            padding='2px 10px'
            borderRadius='10px'
          >
            <Stack direction='row' gap='4px'>
              <ThumbUpOffAlt
                sx={{
                  fontSize: '20px',
                  color: isLiked ? 'warning.main' : '',
                  cursor: 'pointer'
                }}
                onClick={handleToggleLike}
              />
              <Typography variant='body2'>{likedUsers.length}</Typography>
            </Stack>
            <Stack direction='row' gap='4px'>
              <Comment
                sx={{
                  fontSize: '20px',
                  color: isCommented ? 'warning.main' : ''
                }}
              />
              <Typography variant='body2'>{commentedCount || 0}</Typography>
            </Stack>
            <Stack direction='row' gap='4px'>
              <HowToReg
                sx={{
                  fontSize: '20px',
                  color: isCompleted ? 'warning.main' : ''
                }}
              />
              <Typography variant='body2'>
                {exercise.completedUsers.length}
              </Typography>
            </Stack>
          </Stack>
          {/*  */}
          {!inCard && (
            <Button
              sx={{ p: 0 }}
              endIcon={
                showMoreInfo ? (
                  <ExpandLess sx={{ color: 'primary.main' }} />
                ) : (
                  <ExpandMore sx={{ color: 'primary.main' }} />
                )
              }
              onClick={() => setShowMoreInfo(!showMoreInfo)}
            >
              {showMoreInfo ? 'Less' : 'More'}
            </Button>
          )}
        </Stack>
        <Typography variant='body2'>
          {exerciseUtil.getTimeSince(exercise.createdAt)}
        </Typography>
      </Box>

      {/*  */}
      <Collapse in={showMoreInfo}>
        <Box mt={2}>
          <Typography variant='body2' sx={{ mt: '2px' }}>
            Thể loại: {exercise.category}
          </Typography>
          <Typography variant='body2' sx={{ mt: '2px' }}>
            Từ vựng bài tập: {exercise.totalDictationWords} words
          </Typography>
          <Typography variant='body2' sx={{ mt: '2px' }}>
            Từ vựng gốc: {exercise.lemmaWords?.length} words
          </Typography>
          <Typography variant='body2' sx={{ mt: '2px' }}>
            Độ khó:{' '}
            {exercise.lemmaWords?.length - exercise.checkList?.[0].match}
          </Typography>
          <Typography variant='body2' sx={{ mt: '2px' }}>
            Tốc độ nói: {exercise.avgSpeed} WPM
          </Typography>
        </Box>
      </Collapse>
    </Box>
  )
}

export default CardAction
