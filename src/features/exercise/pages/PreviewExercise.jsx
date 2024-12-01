import { useCallback, useContext, useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

import {
  ArrowBack,
  Clear,
  LibraryAdd,
  Lock,
  Public,
  VpnLock
} from '@mui/icons-material'
import { Box, Checkbox, IconButton, Stack, Typography } from '@mui/material'

import PlayVideo from '../components/PlayVideo'
import Segment from '../components/Segment'

import exerciseApi from '../exerciseApi'
import customToast from '~/config/toast'
import useAuth from '~/hooks/useAuth'

const PreviewExercise = () => {
  const navigate = useNavigate()
  const { id } = useParams()
  const [exercise, setExercise] = useState({})
  const [timePlay, setTimePlay] = useState({})
  const [currentSegmentIndex, setCurrentSegmentIndex] = useState(0)
  const auth = useAuth()

  const [isPublic, setIsPublic] = useState(null)

  const segments = exercise?.segments

  const handleSegmentIndexChange = (index) => {
    setCurrentSegmentIndex(index)
  }
  const handleCreateClick = async (id) => {
    try {
      await exerciseApi.createDictation({
        exerciseId: id
      })
      customToast.success('Bài tập được tạo thành công!')
    } catch (error) {
      customToast.error(error.data.message)
    }
  }
  const toggleLockClick = async (id) => {
    try {
      const isPublic = await exerciseApi.toggleLockExercise({
        exerciseId: id
      })
      setIsPublic(isPublic)
      if (!isPublic) customToast.success('Video được khóa thành công!')
      else customToast.success('Video đã được mở lại thành công')
    } catch (error) {
      customToast.error(error.data.message)
    }
  }

  const handleSegmentClick = useCallback((segment) => {
    const selection = window.getSelection().toString()
    // Nếu có nội dung được chọn (select), không thực hiện click
    if (selection.length > 0) {
      return
    }

    setTimePlay({ start: segment.start })
  }, [])

  // effect
  useEffect(() => {
    ;(async () => {
      try {
        const exercise = await exerciseApi.getExercise(id)
        if (!exercise) navigate('/not-found')
        else {
          setExercise(exercise)
          setIsPublic(exercise.isPublic)
        }
      } catch {
        navigate('/not-found')
      }
    })()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id])

  // effect currentSegment change
  useEffect(() => {
    if (currentSegmentIndex) {
      const element = document.getElementById(
        `segment-${segments[currentSegmentIndex].start}`
      )
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' })
      }
    }
  }, [currentSegmentIndex])

  return (
    <Box sx={{ display: 'flex' }}>
      <Box width={2 / 3}>
        <PlayVideo
          exercise={exercise}
          onSegmentIndexChange={handleSegmentIndexChange}
          timePlay={timePlay}
          comment
        />
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
                      isCurrent={currentSegmentIndex === index}
                      onClick={handleSegmentClick}
                    />
                  </Box>
                ))}
              </Box>
            </Box>
          </Box>

          {/* action */}
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
            {/* action */}
            <Stack direction='row' gap={2}>
              {auth.role !== 'admin' ? (
                <IconButton onClick={() => handleCreateClick(exercise.id)}>
                  <LibraryAdd sx={{ color: 'primary.main' }} />
                </IconButton>
              ) : (
                <IconButton onClick={() => toggleLockClick(exercise.id)}>
                  <Public sx={{ color: isPublic ? 'primary.main' : '' }} />
                </IconButton>
              )}
            </Stack>
            <Typography variant='body2'>
              <Typography color={'primary.main'} variant='span'>
                {currentSegmentIndex !== null ? currentSegmentIndex + 1 : '?'}
              </Typography>
              {' / '}
              {exercise.segments?.length}
            </Typography>
            <IconButton onClick={() => navigate(-1)}>
              <ArrowBack sx={{ color: 'error.main' }} />
            </IconButton>
          </Stack>
        </Box>
      </Box>
    </Box>
  )
}

export default PreviewExercise
