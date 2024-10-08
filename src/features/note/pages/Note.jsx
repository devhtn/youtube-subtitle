import { useCallback, useEffect, useRef, useState } from 'react'
import ReactPlayer from 'react-player'
import { useNavigate, useParams } from 'react-router-dom'

import { KeyboardAlt, Pause, PlayArrow } from '@mui/icons-material'
import {
  Box,
  IconButton,
  LinearProgress,
  Skeleton,
  Typography
} from '@mui/material'

import Dictation from '../components/Dictation'
import NoteSegment from '../components/NoteSegment'
import NoteSegmentForm from '../components/NoteSegmentForm'
import PlayRate from '../components/PlayRate'
import ProcessDictation from '../components/ProcessDictation'
import Segment from '../components/Segment'
import Volume from '../components/Volume'

import noteApi from '../noteApi'
import util from '~/utils'

const Note = () => {
  const navigate = useNavigate()
  const { id } = useParams()
  const playerRef = useRef(null)
  const [dictation, setDictation] = useState({})
  const [loading, setLoading] = useState(true)
  const [currentSegment, setCurrentSegment] = useState({})
  const [selectedSegment, setSelectedSegment] = useState({})
  const [playing, setPlaying] = useState(false)
  const [volume, setVolume] = useState(100)
  const [playbackRate, setPlaybackRate] = useState(1)
  const [isDictation, setIsDictation] = useState(false)
  const [openFormSegmentNote, setOpenFormSegmentNote] = useState(false)
  const [showSegmentNote, setShowSegmentNote] = useState(true)

  const timeoutRef = useRef(null)
  const process = (dictation.countCompletedWords * 100) / dictation.countWords

  const handleReady = () => {
    setLoading(false) // Ẩn Skeleton khi video sẵn sàng
  }
  // Function to check the current time and update subtitle
  const handleProgress = (state) => {
    const currentTime = state.playedSeconds

    // Find the matching subtitle based on current time
    const currentSegment =
      dictation.subs.find(
        (segment) => currentTime >= segment.start && currentTime <= segment.end
      ) || {}
    setCurrentSegment(currentSegment || {})
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
    if (timeoutRef.current) {
      return
    }

    if (playerRef.current) {
      // Seek đến vị trí cần thiết
      playerRef.current.seekTo(segment.start + 0.001, 'seconds')

      const segmentDuration = (segment.end - segment.start) * 1000

      setTimeout(() => {
        setPlaying(true)
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current)
        }
        timeoutRef.current = setTimeout(() => {
          setPlaying(false)
          timeoutRef.current = null
        }, segmentDuration)
      }, 500)
    }
  }, [])

  const memoizedSetVolume = useCallback((value) => {
    setVolume(value)
  }, [])
  const memoizedSetPlayRate = useCallback((value) => {
    setPlaybackRate(value)
  }, [])

  const handlePlayPause = () => {
    setPlaying(!playing)
  }

  // effect
  useEffect(() => {
    ;(async () => {
      const dictation = await noteApi
        .getDictation(id)
        .catch(() => navigate('/not-found'))
      if (dictation) {
        setDictation(dictation)
      }
    })()
  }, [])

  // Tự động cuộn đến currentSegment khi video play
  useEffect(() => {
    if (currentSegment) {
      const element = document.getElementById(
        `subtitle-${currentSegment.start}`
      )
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' })
      }
    }
  }, [currentSegment, isDictation])

  useEffect(() => {
    // Clear timeout khi component unmount
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [])

  return (
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
              url={`https://www.youtube.com/embed/${id}`}
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
            {isDictation && (
              <div
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  backgroundColor: 'rgba(0, 0, 0, 0.2)', // Lớp phủ mờ
                  zIndex: 1,
                  pointerEvents: 'all', // Chặn mọi tương tác với ReactPlayer,
                  cursor: 'not-allowed'
                }}
              />
            )}
            {currentSegment.text && !isDictation && (
              <Box
                sx={{
                  position: 'absolute',
                  bottom: '0', // Adjust as needed for lower subtitle
                  left: '50%',
                  transform: 'translateX(-50%)',
                  color: '#fff',
                  backgroundColor: 'rgba(0, 0, 0)', // Semi-transparent background
                  padding: '6px 16px',
                  borderRadius: '4px',
                  textAlign: 'center',
                  width: '100%',
                  height: '44px'
                }}
              >
                <Typography fontSize={20}>{currentSegment.text}</Typography>
              </Box>
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
            <IconButton onClick={() => setIsDictation(!isDictation)}>
              <KeyboardAlt sx={{ color: isDictation && 'warning.main' }} />
            </IconButton>
          </Box>

          {/* Segment Note */}
          {currentSegment.note && showSegmentNote && (
            <NoteSegment segment={currentSegment} />
          )}
        </Box>
        <Box width={1 / 3}>
          <Box
            sx={{
              position: 'sticky',
              top: '16px',
              // height: ???,
              height: 'calc(100vh - 32px)',
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
                  maxHeight: 'calc(100vh - 32px - 50px)',
                  overflowY: 'auto', // Cho phép cuộn khi nội dung tràn
                  overflowX: 'hidden'
                }}
              >
                <Box sx={{ display: isDictation ? 'none' : 'block' }}>
                  {dictation.subs?.map((segment, index) => (
                    <Box key={index}>
                      <Segment
                        segment={segment}
                        isCurrent={currentSegment === segment}
                        handleSegmentClick={memorizedHandleSegmentClick}
                        setOpenFormSegmentNote={setOpenFormSegmentNote}
                        setSelectedSegment={setSelectedSegment}
                      />
                    </Box>
                  ))}
                </Box>
                {!util.isEmptyObject(dictation) && isDictation && (
                  <Dictation
                    handleSegmentClick={memorizedHandleSegmentClick}
                    dictation={dictation}
                    setDictation={setDictation}
                    setOpenFormSegmentNote={setOpenFormSegmentNote}
                    setSelectedSegment={setSelectedSegment}
                    setShowSegmentNote={setShowSegmentNote}
                  />
                )}
              </Box>
              {!util.isEmptyObject(dictation) && (
                <ProcessDictation process={process} />
              )}
            </Box>
          </Box>
        </Box>
      </Box>

      {/* Dialog segment note form */}
      {!util.isEmptyObject(selectedSegment) && (
        <NoteSegmentForm
          selectedSegment={selectedSegment}
          setSelectedSegment={setSelectedSegment}
          open={openFormSegmentNote}
          setOpen={setOpenFormSegmentNote}
          dictation={dictation}
          setDictation={setDictation}
        />
      )}
    </Box>
  )
}

export default Note
