import { useCallback, useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'

import { Close, LibraryAdd, WarningAmber } from '@mui/icons-material'
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
  const [isExistDictation, setIsExistDictation] = useState(false)
  const [timePlay, setTimePlay] = useState({})
  const [currentSegment, setCurrentSegment] = useState({
    transText: '...'
  })
  const [currentSegmentIndex, setCurrentSegmentIndex] = useState(0)

  const onSubmit = async (data) => {
    const id = customToast.loading()
    try {
      const exercise = await exerciseApi.checkVideo(data)
      if (exercise) setExercise(exercise)
    } catch (error) {}
    customToast.stop(id)
  }

  const handleCreateExercise = async () => {
    const id = customToast.loading()
    try {
      await exerciseApi.createExercise(exercise)
      if (auth.role === 'user') {
        navigate('/exercise/play')
        customToast.success(`Lưu bài tập thành công! Chăm chỉ bạn nhé!`)
      } else {
        setExercise({})
        customToast.success(`Bài tập đã được tạo thành công!`)
        reset()
      }
    } catch (error) {
      customToast.error(error.data.message)
    }
    customToast.stop(id)
  }

  const handleSegmentChange = (newSegment) => {
    setCurrentSegment(newSegment)
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

  useEffect(() => {
    ;(async () => {
      if (auth.role === 'user') {
        try {
          const dictation = await exerciseApi.getUserDictations({
            isCompleted: false
          })
          if (dictation[0]) {
            setIsExistDictation(true)
          }
        } catch {}
      }
    })()
  }, [])

  return (
    <Box>
      <ConfirmDialog
        open={isExistDictation}
        icon={<WarningAmber sx={{ fontSize: '48px', color: 'warning.main' }} />}
        content='Bạn cần hoàn thành bài tập đang dang dở của mình hoặc xóa nó đi để tạo bài tập mới. Đi đến bài tập hiện tại của bạn ?'
        onConfirm={() => navigate('/exercise/play')}
        onClose={() => navigate(-1)}
      />
      {!_.isEmpty(exercise) ? (
        <Box sx={{ display: 'flex' }}>
          <Box width={2 / 3}>
            <PlayVideo
              exercise={exercise}
              timePlay={timePlay}
              onSegmentChange={handleSegmentChange}
            />
            {/* video info */}
            <Box mt={2}>
              <Typography variant='body1' sx={{ mt: '2px' }}>
                Thể loại: {exercise.category}
              </Typography>
              <Typography variant='body1' sx={{ mt: '2px' }}>
                Từ vựng bài tập: {exercise.totalDictationWords} words
              </Typography>
              <Typography variant='body1' sx={{ mt: '2px' }}>
                Từ vựng gốc: {exercise.lemmaWords?.length} words
              </Typography>
              <Typography variant='body1' sx={{ mt: '2px' }}>
                Độ khó từ vựng:{' '}
                {exercise.lemmaWords?.length - exercise.checkList[0].match}
              </Typography>
              <Typography variant='body1' sx={{ mt: '2px' }}>
                Độ khó nghe: {exercise.avgSpeed} WPM
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
                          isCurrent={currentSegment === segment}
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
                    <LibraryAdd />
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
      )}
    </Box>
  )
}

export default CreateExercise
