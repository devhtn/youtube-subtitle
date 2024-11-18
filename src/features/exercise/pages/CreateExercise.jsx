import { useCallback, useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'

import { Close, Info, LibraryAdd, WarningAmber } from '@mui/icons-material'
import {
  Box,
  Button,
  FormControl,
  IconButton,
  Stack,
  Typography
} from '@mui/material'
import _ from 'lodash'

import PlayVideo from '../components/PlayVideo'
import Segment from '../components/Segment'
import TextField from '~/components/fields/TextField'
import ConfirmDialog from '~/features/auth/components/ConfirmDialog'

import exerciseApi from '../exerciseApi'
import customToast from '~/config/toast'
import useAuth from '~/hooks/useAuth'

const CreateExercise = () => {
  const navigate = useNavigate()
  const auth = useAuth()
  const { control, handleSubmit, reset } = useForm()
  const [exercise, setExercise] = useState({})
  const [dictation, setDictation] = useState({})
  const [timePlay, setTimePlay] = useState({})
  const [currentSegmentIndex, setCurrentSegmentIndex] = useState(0)

  const onSubmit = async (data) => {
    const id = customToast.loading()
    try {
      const exercise = await exerciseApi.checkVideo(data)
      if (exercise) setExercise(exercise)
    } catch (error) {
      customToast.error(error.data.message)
    }
    customToast.stop(id)
  }

  const handleCreateExercise = async () => {
    const id = customToast.loading()
    try {
      await exerciseApi.createExercise(exercise)
      navigate('/exercise/playlist')
      customToast.success(`Lưu bài tập thành công! Chăm chỉ bạn nhé!`)
    } catch (error) {
      customToast.error(error.data.message)
    }
    customToast.stop(id)
  }

  const handleSegmentIndexChange = (segmentIndex) => {
    setCurrentSegmentIndex(segmentIndex)
  }

  const handleSegmentClick = useCallback((segment) => {
    const selection = window.getSelection().toString()
    // Nếu có nội dung được chọn (select), không thực hiện click
    if (selection.length > 0) {
      return
    }

    setTimePlay({ start: segment.start })
  }, [])

  // effect currentSegment change
  useEffect(() => {
    if (exercise.segments) {
      // scrollIntoView
      const element = document.getElementById(
        `segment-${exercise.segments[currentSegmentIndex].start}`
      )
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' })
      }
    }
  }, [currentSegmentIndex, exercise.segments])

  useEffect(() => {
    ;(async () => {
      if (auth.role === 'user') {
        try {
          const dictations = await exerciseApi.getUserDictations({
            isCompleted: false
          })
          if (dictations[0]) setDictation(dictations[0])
        } catch (error) {
          console.log(error)
        }
      }
    })()
  }, [])

  return (
    <Box>
      <ConfirmDialog
        open={!_.isEmpty(dictation)}
        icon={<WarningAmber sx={{ fontSize: '48px', color: 'warning.main' }} />}
        content='Bạn chỉ được tạo mới tối đa 1 bài tập!'
        onClose={() => navigate(-1)}
      />
      {!_.isEmpty(exercise) ? (
        <Box sx={{ display: 'flex' }}>
          <Box width={2 / 3}>
            <PlayVideo
              exercise={exercise}
              timePlay={timePlay}
              onSegmentIndexChange={handleSegmentIndexChange}
            />
            {/* video info */}
            <Box mt={2}>
              <Typography variant='body1' sx={{ mt: '2px' }}>
                Thể loại: {exercise.category}
              </Typography>
              <Typography variant='body1' sx={{ mt: '2px' }}>
                Từ vựng cần chép: {exercise.totalDictationWords} words
              </Typography>
              <Typography variant='body1' sx={{ mt: '2px' }}>
                Từ vựng gốc: {exercise.lemmaWords?.length} words
              </Typography>
              <Typography variant='body1' sx={{ mt: '2px' }}>
                Độ khó: {exercise.difficult}
              </Typography>
              <Typography variant='body1' sx={{ mt: '2px' }}>
                Tốc độ: {exercise.avgSpeed} WPM
              </Typography>
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
                          isCurrent={currentSegmentIndex === index}
                          onClick={handleSegmentClick}
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
                {/* action */}
                <Stack direction='row' gap={2}>
                  <IconButton onClick={handleCreateExercise}>
                    <LibraryAdd sx={{ color: 'primary.main' }} />
                  </IconButton>
                </Stack>
                <Typography variant='body2'>
                  <Typography color={'primary.main'} variant='span'>
                    {currentSegmentIndex + 1}
                  </Typography>
                  {' / '}
                  {exercise.segments?.length}
                </Typography>
                <IconButton
                  onClick={() => {
                    setExercise({})
                    reset()
                  }}
                >
                  <Close sx={{ color: 'error.main' }} />
                </IconButton>
              </Stack>
            </Box>
          </Box>
        </Box>
      ) : (
        <Box>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Stack direction={'row'} gap={2}>
              <TextField
                label='Link to video on YouTube'
                name='link'
                control={control}
                rules={{
                  required: 'Link to video on YouTube is required' // Thông báo lỗi khi field này bị bỏ trống
                }}
                autoComplete='off'
              />
              <FormControl margin='normal'>
                <Button
                  sx={{
                    textTransform: 'none',
                    textWrap: 'nowrap',
                    px: 4,
                    height: '40px'
                  }}
                  variant='contained'
                  color='primary'
                  type='submit'
                >
                  Kiểm tra
                </Button>
              </FormControl>
            </Stack>
          </form>
          <Box
            sx={{
              mt: 2,
              p: 2,
              borderRadius: 1,
              bgcolor: 'grey.100', // Nền nhẹ để làm nổi bật
              alignItems: 'flex-start'
            }}
          >
            <Stack direction='row' gap={1}>
              <Info sx={{ color: '#1976d2' }} />
              <Box>
                <Typography
                  variant='body2'
                  color='text.primary'
                  fontWeight='bold'
                  component='span'
                >
                  Lưu ý:
                </Typography>
                <Typography variant='body2' color='text.secondary'>
                  <br />
                  1. Bạn chỉ được tạo tối đa một bài tập cho đến khi bạn hoàn
                  thành hoặc xóa bài tập đó. <br />
                  2. Bài tập sau khi hoàn thành sẽ được chia sẻ cho mọi người.{' '}
                  <br />
                  3. Chỉ hỗ trợ video có phụ đề.
                </Typography>
              </Box>
            </Stack>
          </Box>
        </Box>
      )}
    </Box>
  )
}

export default CreateExercise
