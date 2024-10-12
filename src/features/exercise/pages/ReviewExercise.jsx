import { useCallback, useEffect, useRef, useState } from 'react'
import ReactPlayer from 'react-player'
import { useNavigate, useParams } from 'react-router-dom'

import {
  PlaylistAdd,
  PlaylistAddCircle,
  Queue,
  Subtitles,
  ThumbUpAltOutlined,
  WatchLater
} from '@mui/icons-material'
import { Box, IconButton, Skeleton, Stack, Typography } from '@mui/material'

import Comment from '../components/Comment'
import Segment from '../components/Segment'

import exerciseApi from '../exerciseApi'
import customToast from '~/config/toast'
import authApi from '~/features/auth/authApi'
import useAuth from '~/hooks/useAuth'
import util from '~/utils'

const ReviewExercise = () => {
  const navigate = useNavigate()
  const auth = useAuth()
  const { videoId } = useParams()
  const playerRef = useRef(null)
  const [exercise, setExercise] = useState({})
  const [loading, setLoading] = useState(true)
  const [currentSegment, setCurrentSegment] = useState({})
  const [currentSegmentIndex, setCurrentSegmentIndex] = useState(0)
  const [playing, setPlaying] = useState(false)
  const [user, setUser] = useState({})

  const isLiked = user.likeList?.includes(exercise.id)

  const handleToggleLike = async () => {
    const newUser = await exerciseApi.toggleLike({
      exerciseId: exercise.id
    })
    if (newUser) setUser(newUser)
  }

  const handleReady = () => {
    setLoading(false) // Ẩn Skeleton khi video sẵn sàng
  }
  // Function to check the current time and update subtitle
  const handleProgress = (state) => {
    const currentTime = state.playedSeconds

    // Find the matching subtitle based on current time
    const findIndex = exercise.segments.findIndex(
      (segment) => currentTime >= segment.start && currentTime <= segment.end
    )
    setCurrentSegment(exercise.segments[findIndex] || {})
    if (findIndex !== -1) setCurrentSegmentIndex(findIndex)
    // Set the subtitle if it exists, otherwise clear it
  }

  const handlePause = () => {
    setPlaying(false)
  }

  const memorizedHandleSegmentClick = useCallback((segment) => {
    const selection = window.getSelection().toString()

    // Nếu có nội dung được chọn (select), không thực hiện click
    if (selection.length > 0) {
      return
    }

    if (playerRef.current) {
      // Seek đến vị trí cần thiết
      playerRef.current.seekTo(segment.start + 0.001, 'seconds')

      setPlaying(true)
    }
  }, [])

  // effect
  useEffect(() => {
    ;(async () => {
      try {
        const [exercise, user] = await Promise.all([
          exerciseApi.getExercise(videoId),
          authApi.getUser(auth.id)
        ])
        setExercise(exercise)
        setUser(user)
      } catch {
        navigate('/not-found')
      }
    })()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // effect currentSegment change
  useEffect(() => {
    if (currentSegment) {
      // scrollIntoView
      const element = document.getElementById(`segment-${currentSegment.start}`)
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' })
      }
    }
  }, [currentSegment])

  return (
    <Box sx={{ display: 'flex' }}>
      <Box width={2 / 3}>
        <Box
          sx={{
            position: 'relative',
            paddingTop: '56.25%' // 16:9 aspect ratio
          }}
        >
          {loading && (
            <Skeleton
              variant='rectangular'
              width='100%'
              height='100%'
              sx={{ position: 'absolute', top: 0, left: 0, zIndex: 1 }}
            />
          )}
          <ReactPlayer
            url={`https://www.youtube.com/embed/${videoId}`}
            style={{ position: 'absolute', top: 0, left: 0 }}
            width='100%'
            height='100%'
            onProgress={handleProgress}
            onPlay={() => setPlaying(true)}
            onPause={handlePause}
            playing={playing}
            ref={playerRef}
            onReady={handleReady} // Ẩn Skeleton khi video đã sẵn sàng
            controls
          />
        </Box>
        <Box
          sx={{
            bottom: '0', // Adjust as needed for lower subtitle
            color: '#fff',
            backgroundColor: 'rgba(0, 0, 0)', // Semi-transparent background
            textAlign: 'center',
            width: '100%',
            height: '44px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <Typography variant='subtitle1'>
            {currentSegment.transText}
          </Typography>
        </Box>
        {/* comment */}
        <Box p={2}>
          {!util.isEmptyObject(exercise) && (
            <Comment exerciseId={exercise.id} />
          )}
        </Box>
      </Box>
      <Box width={1 / 3}>
        <Box
          sx={{
            position: 'sticky',
            top: '0',
            height: 'calc(100vh - 56px)',
            backgroundColor: '#f5f5f5eb' // Đặt màu nền sidebar
          }}
        >
          {/* show subtitle */}
          <Box
            height={'100%'}
            display={'flex'}
            flexDirection={'column'}
            justifyContent={'space-between'}
          >
            <Box
              sx={{
                overflowY: 'auto', // Cho phép cuộn khi nội dung tràn
                overflowX: 'hidden'
              }}
            >
              <Box>
                {exercise.segments?.map((segment, index) => (
                  <Box key={index}>
                    <Segment
                      segment={segment}
                      isCurrent={currentSegment === segment}
                      handleSegmentClick={memorizedHandleSegmentClick}
                    />
                  </Box>
                ))}
              </Box>
            </Box>
          </Box>
          <Stack
            direction='row'
            alignItems='center'
            justifyContent='space-between'
            gap={2}
            sx={{
              borderLeft: '1px solid #f5f5f5eb',
              borderRight: '1px solid #f5f5f5eb',
              py: 1,
              px: 2
            }}
          >
            <Box>
              <Typography variant='subtitle1'>
                <Typography color={'warning.main'} variant='span'>
                  {currentSegmentIndex + 1}
                </Typography>
                {' / '}
                {exercise.segments?.length}
              </Typography>
            </Box>
            {/* action */}
            <Stack direction='row' gap={2}>
              <IconButton>
                <Queue />
              </IconButton>
              <IconButton onClick={handleToggleLike}>
                <ThumbUpAltOutlined
                  sx={{
                    color: isLiked ? 'warning.main' : ''
                  }}
                />
              </IconButton>
            </Stack>
          </Stack>
        </Box>
      </Box>
    </Box>
  )
}

export default ReviewExercise
