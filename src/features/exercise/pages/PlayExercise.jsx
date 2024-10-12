import { useCallback, useEffect, useRef, useState } from 'react'
import ReactPlayer from 'react-player'
import { useNavigate, useParams } from 'react-router-dom'

import { Pause, PlayArrow } from '@mui/icons-material'
import { Box, Button, IconButton, Skeleton, Typography } from '@mui/material'

import Dictation from '../components/Dictation'
import PlayRate from '../components/PlayRate'
import ProcessDictation from '../components/ProcessDictation'
import Volume from '../components/Volume'

import exerciseApi from '../exerciseApi'
import customToast from '~/config/toast'
import util from '~/utils'

const PlayExercise = () => {
  const navigate = useNavigate()
  const playerRef = useRef(null)
  const [dictation, setDictation] = useState({})
  const [exercise, setExercise] = useState({})
  const [loading, setLoading] = useState(true)
  const [playing, setPlaying] = useState(false)
  const [volume, setVolume] = useState(100)
  const [playbackRate, setPlaybackRate] = useState(1)
  const [currentTime, setCurrentTime] = useState(0)
  const [currentSegment, setCurrentSegment] = useState({})
  const timeoutRef = useRef(null)
  const process =
    (dictation?.completedSegmentsCount * 100) / exercise.segments?.length

  const handleReady = () => {
    setLoading(false) // Ẩn Skeleton khi video sẵn sàng
  }

  const handlePause = () => {
    setPlaying(false)
  }

  const handlePlay = (start, end) => {
    if (playerRef.current) {
      // Seek đến vị trí cần thiết
      playerRef.current.seekTo(start + 0.001, 'seconds')

      const segmentDuration = (end - start) * 1000

      setPlaying(true)
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
      timeoutRef.current = setTimeout(() => {
        setPlaying(false)
        timeoutRef.current = null
      }, segmentDuration)
    }
  }

  const handleProgress = (state) => {
    setCurrentTime(state.playedSeconds)
  }

  const memoizedSetVolume = useCallback((value) => {
    setVolume(value)
  }, [])
  const memoizedSetPlayRate = useCallback((value) => {
    setPlaybackRate(value)
  }, [])

  const handlePlayPause = () => {
    setPlaying(!playing)
  }

  useEffect(() => {
    ;(async () => {
      try {
        const dictation = await exerciseApi.getUserDictations({
          isCompleted: false
        })
        if (dictation[0]) {
          setDictation(dictation[0] || {})
          setExercise(dictation[0].exerciseId || {})
        } else {
          navigate('/exercise/discover')
          customToast.success('Bạn cần chọn exercise trước khi play')
        }
      } catch {}
    })()
  }, [])

  useEffect(() => {
    // Clear timeout khi component unmount
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [])

  return (
    !util.isEmptyObject(dictation) && (
      <Box>
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
                url={`https://www.youtube.com/embed/${exercise.videoId}`}
                style={{ position: 'absolute', top: 0, left: 0 }}
                width='100%'
                height='100%'
                onProgress={handleProgress}
                onPlay={() => setPlaying(true)}
                onPause={handlePause}
                playing={playing}
                volume={volume / 100}
                playbackRate={playbackRate}
                ref={playerRef}
                onReady={handleReady} // Ẩn Skeleton khi video đã sẵn sàng
              />
              <Box
                sx={{
                  position: 'absolute',
                  bottom: '0', // Adjust as needed for lower subtitle
                  left: '50%',
                  transform: 'translateX(-50%)',
                  color: '#fff',
                  backgroundColor: 'rgba(0, 0, 0)', // Semi-transparent background
                  borderRadius: '4px',
                  textAlign: 'center',
                  width: '100%',
                  height: '44px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <Typography>
                  {currentSegment ? currentSegment.transText : ''}
                </Typography>
              </Box>
            </Box>
            <ProcessDictation process={process} />
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
                  {!util.isEmptyObject(exercise) && (
                    <Dictation
                      handlePlay={handlePlay}
                      exercise={exercise}
                      dictation={dictation}
                      setDictation={setDictation}
                      currentTime={currentTime}
                      setCurrentSegment={setCurrentSegment}
                    />
                  )}
                </Box>
                {/* control */}
                <Box
                  sx={{
                    position: 'sticky',
                    top: 0,
                    width: '100%',
                    py: 1,
                    display: 'flex',
                    gap: 1,
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  {/* Nút Play/Pause */}
                  <IconButton onClick={handlePlayPause}>
                    {playing ? <Pause /> : <PlayArrow />}
                  </IconButton>

                  {/* Control Volume */}
                  <Volume setVolume={memoizedSetVolume} />
                  {/* Control play rate */}
                  <PlayRate setPlayRate={memoizedSetPlayRate} />
                  {/* Control isDictation */}
                </Box>
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>
    )
  )
}

export default PlayExercise
