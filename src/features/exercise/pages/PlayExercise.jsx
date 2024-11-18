import { useCallback, useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

import {
  ArrowBack,
  Close,
  Pause,
  PlayArrow,
  Preview
} from '@mui/icons-material'
import { Box, IconButton, Stack, Typography } from '@mui/material'
import _ from 'lodash'

import Dictation from '../components/Dictation'
import PlayRate from '../components/PlayRate'
import PlayVideo from '../components/PlayVideo'
import Progress from '../components/Progress'
import Segment from '../components/Segment'
import Volume from '../components/Volume'

import exerciseApi from '../exerciseApi'

const PlayExercise = () => {
  const navigate = useNavigate()
  const { id } = useParams()
  const [dictation, setDictation] = useState({})
  const [exercise, setExercise] = useState({})
  const [playing, setPlaying] = useState(false)
  const [volume, setVolume] = useState(100)
  const [rate, setRate] = useState(1)
  const [currentTime, setCurrentTime] = useState(0)
  const [currentSegment, setCurrentSegment] = useState({
    transText: '...'
  })
  const [selectedSegment, setSelectedSegment] = useState({})
  const [currentSegmentIndex, setCurrentSegmentIndex] = useState(0)
  const [isCheck, setIsCheck] = useState(true)
  const [end, setEnd] = useState(null)
  const [timePlay, setTimePlay] = useState({})
  const [isPreview, setIsPreview] = useState(false)

  const handleSegmentClick = useCallback((segment) => {
    const selection = window.getSelection().toString()
    // Nếu có nội dung được chọn (select), không thực hiện click
    if (selection.length > 0) {
      return
    }

    setTimePlay({ start: segment.start })
  }, [])

  const handlePreview = () => {
    setIsPreview(!isPreview)
  }

  const handleClose = () => {
    navigate('/exercise/playlist')
  }

  const handleCheckChange = (newCheckValue) => {
    setIsCheck(newCheckValue)
  }

  const handleDictationPlay = (start, end) => {
    setTimePlay({ start })
    setEnd(end)
  }

  const memoizedSetVolume = useCallback((value) => {
    setVolume(value)
  }, [])
  const memoizedSetPlayRate = useCallback((value) => {
    setRate(value)
  }, [])

  const handlePlayPause = () => {
    setPlaying(!playing)
  }

  useEffect(() => {
    if (end !== null && currentTime >= end) {
      setPlaying(false)
    }
  }, [currentTime, end])

  useEffect(() => {
    if (isCheck) {
      setPlaying(false)
      setEnd(null)
    }
    if (isPreview) {
      setCurrentSegment({})
      setIsCheck(true)
    }
  }, [isCheck, isPreview])

  useEffect(() => {
    ;(async () => {
      try {
        const dictation = await exerciseApi.getDictation(id)
        setDictation(dictation)
        setExercise(dictation.exerciseId)
      } catch (error) {
        console.log(error)
      }
    })()
  }, [])

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
  }, [currentSegment, exercise.segments])

  return (
    <>
      <Box>
        <Box sx={{ display: 'flex' }}>
          <Box width={2 / 3}>
            <PlayVideo
              exercise={exercise}
              isHidden={!isCheck}
              volume={volume}
              rate={rate}
              isPlaying={playing}
              onTimeChange={(value) => setCurrentTime(value)}
              selectedSegment={selectedSegment}
              timePlay={timePlay}
              onPlayingChange={(value) => setPlaying(value)}
              onSegmentChange={(value) => setCurrentSegment(value)}
              comment
            />
          </Box>
          <Box width={1 / 3}>
            <Box
              sx={{
                position: 'sticky',
                top: '0',
                height: 'calc(100vh)',
                backgroundColor: 'background.secondary' // Đặt màu nền sidebar
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
                    <Box
                      sx={{
                        display:
                          !_.isEmpty(exercise) && !isPreview ? 'block' : 'none'
                      }}
                    >
                      {!_.isEmpty(dictation) && (
                        <Dictation
                          handlePlay={handleDictationPlay}
                          exercise={exercise}
                          dictation={dictation}
                          onChangeDictation={(update) => setDictation(update)}
                          currentTime={currentTime}
                          onCheckChange={handleCheckChange}
                          onSegmentChange={(segment) =>
                            setSelectedSegment(segment)
                          }
                        />
                      )}
                    </Box>

                    <Box
                      sx={{
                        display:
                          _.isEmpty(exercise) || isPreview ? 'block' : 'none'
                      }}
                    >
                      {exercise.segments?.map((segment, index) => (
                        <Box key={index}>
                          <Segment
                            segment={segment}
                            isCurrent={currentSegment === segment}
                            onClick={handleSegmentClick}
                            dictationSegment={dictation.segments[index]}
                          />
                        </Box>
                      ))}
                    </Box>
                  </Box>
                </Box>
                {/* control */}
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
                  {!isPreview && (
                    <Progress
                      value={
                        (dictation.completedSegmentsCount * 100) /
                        dictation.totalCompletedSegments
                      }
                    />
                  )}
                  {isPreview && (
                    <Typography variant='body2'>
                      <Typography color={'primary.main'} variant='span'>
                        {currentSegmentIndex || '?'}
                      </Typography>
                      {' / '}
                      {exercise.segments?.length}
                    </Typography>
                  )}
                  {/* Nút Play/Pause */}
                  <Stack direction='row' gap={2}>
                    <IconButton onClick={handlePlayPause}>
                      {playing ? <Pause /> : <PlayArrow />}
                    </IconButton>
                    {/* Control Volume */}
                    <Volume setVolume={memoizedSetVolume} />
                    {/* Control play rate */}
                    <PlayRate setPlayRate={memoizedSetPlayRate} />
                    {/* Preview */}
                    {isCheck && (
                      <IconButton onClick={handlePreview}>
                        {!isPreview ? (
                          <Preview />
                        ) : (
                          <Close sx={{ color: 'error.main' }} />
                        )}
                      </IconButton>
                    )}
                  </Stack>

                  <IconButton onClick={handleClose}>
                    <ArrowBack sx={{ color: 'error.main' }} />
                  </IconButton>
                </Stack>
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>
    </>
  )
}

export default PlayExercise
