import { useCallback, useContext, useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

import { Clear, LibraryAdd } from '@mui/icons-material'
import { Box, IconButton, Stack, Typography } from '@mui/material'

import PlayVideo from '../components/PlayVideo'
import Segment from '../components/Segment'

import exerciseApi from '../exerciseApi'
import customToast from '~/config/toast'

const PreviewExercise = () => {
  const navigate = useNavigate()
  const { id } = useParams()
  const [exercise, setExercise] = useState({})
  const [currentSegment, setCurrentSegment] = useState({})
  const [timePlay, setTimePlay] = useState({})
  const [currentSegmentIndex, setCurrentSegmentIndex] = useState(0)

  const handleSegmentChange = (newSegment) => {
    setCurrentSegment(newSegment)
  }

  const handleCreateDictation = async () => {
    const totalValidSegments = exercise.segments.filter(
      (segment) => segment.dictationWords.length > 0
    ).length
    try {
      await exerciseApi.createDictation({
        exerciseId: exercise.id,
        totalSegments: totalValidSegments
      })
      customToast.success('Bài tập được lưu thành công!')
    } catch {
      customToast.error('Bạn cần xóa đi bài tập hiện tại để lưu mới')
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
        setExercise(exercise)
      } catch {
        navigate('/not-found')
      }
    })()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // effect currentSegment change
  useEffect(() => {
    if (currentSegment) {
      setCurrentSegmentIndex(
        (exercise.segments?.findIndex(
          (segment) => segment === currentSegment
        ) ?? -1) + 1
      )
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
        <PlayVideo
          exercise={exercise}
          onSegmentChange={handleSegmentChange}
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
                      isCurrent={currentSegment === segment}
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
              <IconButton onClick={handleCreateDictation}>
                <LibraryAdd />
              </IconButton>
            </Stack>
            <Typography variant='body2'>
              <Typography color={'primary.main'} variant='span'>
                {currentSegmentIndex || '?'} {' / '}
              </Typography>
              {exercise.segments?.length}
            </Typography>
            <IconButton onClick={() => navigate(-1)}>
              <Clear sx={{ color: 'error.main' }} />
            </IconButton>
          </Stack>
        </Box>
      </Box>
    </Box>
  )
}

export default PreviewExercise
