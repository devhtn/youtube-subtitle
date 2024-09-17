import { useEffect, useRef, useState } from 'react'
import ReactPlayer from 'react-player'
import { useDispatch, useSelector } from 'react-redux'

import {
  MoreVert,
  Pause,
  PlayArrow,
  Replay,
  ScatterPlot,
  SlowMotionVideo,
  VolumeUp
} from '@mui/icons-material'
import {
  Box,
  IconButton,
  Menu,
  MenuItem,
  Slider,
  Stack,
  Typography
} from '@mui/material'

import {
  closePersistent,
  openPersistent
} from '~/features/layout/components/SidebarLayout/sidebarSlice'

import { video } from '../data'
import videoUtil from '../videoUtil'

const test = {
  start: '113',
  end: '116.92',
  text:
    'To celebrate what may be our most \n' +
    'glorious calendar yet, we&#39;ve prepared  '
}

const PlayVideo = () => {
  const dispatch = useDispatch()
  const sidebar = useSelector((state) => state.sidebar)
  const playerRef = useRef(null)
  const subtitles = video.enSubs

  const [currentSegment, setCurrentSegment] = useState({})
  const [playing, setPlaying] = useState(false)
  const [playerHeight, setPlayerHeight] = useState(0)
  const [volume, setVolume] = useState(100)
  const [playbackRate, setPlaybackRate] = useState(1)
  const [rePlaying, setRePlaying] = useState(false)
  const [selectSegment, setSelectSegment] = useState(null)
  const [intervalId, setIntervalId] = useState(null)

  const handleReplayClick = (segment) => {
    if (segment === selectSegment) {
      setRePlaying(false)
      setSelectSegment(null)
      return
    }

    const element = document.getElementById(`subtitle-${segment.startTime}`)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'center' })
    }

    playerRef.current.seekTo(segment.startTime / 1000, 'seconds')
    setRePlaying(true)
    setPlaying(true)
    setSelectSegment(segment)
  }

  // Function to check the current time and update subtitle
  const handleProgress = (state) => {
    const currentTime = state.playedSeconds
    console.log(currentTime)

    // Find the matching subtitle based on current time
    const currentSegment = subtitles.find(
      (segment) => currentTime <= segment.endTime / 1000
    )

    // Set the subtitle if it exists, otherwise clear it
    setCurrentSegment(currentSegment || {})

    // Segment replay mode
    if (selectSegment && rePlaying) {
      console.log(selectSegment)
      if (
        currentTime >=
        selectSegment.endTime / 1000
        // currentTime < selectSegment.startTime / 1000
      ) {
        playerRef.current.seekTo(selectSegment.startTime / 1000, 'seconds')
      }
    }
  }

  const handlePause = () => {
    setRePlaying(false)
    setSelectSegment(null)
    setPlaying(false)
  }

  const handleSegmentClick = (startTime) => {
    if (playerRef.current) {
      playerRef.current.seekTo(startTime / 1000, 'seconds') // Di chuyển đến thời gian tương ứng
      setPlaying(true)
      setRePlaying(false)
    }
  }

  const handleVolumeChange = (event, newValue) => {
    setVolume(newValue)
  }

  const handlePlaybackRateChange = (event) => {
    setPlaybackRate(event.target.value)
  }

  const handlePlayPause = () => {
    setPlaying(!playing)
  }

  // effect
  useEffect(() => {
    if (rePlaying) {
      // Thiết lập interval để kiểm tra tiến trình thường xuyên hơn
      const id = setInterval(() => {
        if (playerRef.current) {
          const playedSeconds = playerRef.current.getCurrentTime()
          handleProgress({ playedSeconds })
        }
      }, 100) // Kiểm tra mỗi 100ms

      setIntervalId(id)
      return () => clearInterval(id)
    } else if (intervalId) {
      // Nếu selectSegment là null, hủy interval
      clearInterval(intervalId)
      setIntervalId(null)
    }
  }, [rePlaying, selectSegment])

  // Loại bỏ mini icon trong sidebar
  // useEffect(() => {
  //   dispatch(openPersistent())
  //   return () => closePersistent()
  // }, [])

  // Lấy chiều cao của ReactPlayer sau khi component đã render
  useEffect(() => {
    if (playerRef.current) {
      const playerElement = playerRef.current.wrapper
      const boundingRect = playerElement.getBoundingClientRect()
      setPlayerHeight(boundingRect.height)
    }
  }, [playerRef.current, sidebar.isOpen]) // Gọi lại useEffect khi playerRef được cập nhật

  // Tự động cuộn đến currentSegment khi video play
  useEffect(() => {
    if (currentSegment && !rePlaying) {
      const element = document.getElementById(
        `subtitle-${currentSegment.startTime}`
      )
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' })
      }
    }
  }, [currentSegment])

  return (
    <Box>
      <Box sx={{ display: 'flex' }}>
        <Box sx={{ flex: 2 }}>
          <Box
            sx={{
              position: 'relative',
              paddingTop: '56.25%' // 16:9 aspect ratio
            }}
          >
            <ReactPlayer
              url='https://www.youtube.com/embed/h6fcK_fRYaI'
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
            />
            {currentSegment.text && (
              <Box
                sx={{
                  position: 'absolute',
                  bottom: '4px', // Adjust as needed for lower subtitle
                  left: '50%',
                  transform: 'translateX(-50%)',
                  fontSize: '18px',
                  color: '#fff',
                  backgroundColor: 'rgba(0, 0, 0, 0.6)', // Semi-transparent background
                  padding: '6px 16px',
                  borderRadius: '4px',
                  textAlign: 'center',
                  textWrap: 'nowrap'
                }}
              >
                <Typography
                  dangerouslySetInnerHTML={{
                    __html: selectSegment
                      ? selectSegment.text
                      : currentSegment.text
                  }}
                />
              </Box>
            )}
          </Box>
        </Box>
        <Box
          sx={{
            flex: 1,
            border: '1px solid #ddd'
          }}
        >
          <Box
            sx={{
              position: 'relative',
              height: `calc(${playerHeight}px - 58px)`,
              overflowY: 'auto', // Cho phép cuộn khi nội dung tràn
              overflowX: 'hidden',
              backgroundColor: '#f0f0f0', // Đặt màu nền sidebar
              borderBottom: '1px solid #ddd'
            }}
          >
            <Box>
              {subtitles.map((segment, index) => (
                <Box
                  key={index}
                  id={`subtitle-${segment.startTime}`} // Đặt id cho mỗi subtitle
                  sx={{
                    p: 2,
                    borderBottom: '1px solid #ddd',
                    backgroundColor:
                      currentSegment.startTime === segment.startTime &&
                      !rePlaying
                        ? '#cce7ff' // Màu nền khác khi segment đang kích hoạt
                        : selectSegment === segment
                          ? '#cce7ff'
                          : 'transparent',
                    cursor: 'pointer',
                    position: 'relative',
                    '&:hover .replay': {
                      display: 'flex' // Hiển thị IconButton khi hover
                    }
                  }}
                  onClick={() => handleSegmentClick(segment.startTime)}
                >
                  <Typography
                    variant='body2'
                    color='textSecondary'
                    dangerouslySetInnerHTML={{ __html: segment.text }}
                  />

                  {/* show startTime of segment */}
                  <Typography
                    variant='caption'
                    sx={{
                      position: 'absolute',
                      bottom: 0,
                      right: '8px'
                    }}
                  >
                    {videoUtil.formatTime(segment.startTime)}
                  </Typography>

                  {/* replay segment */}
                  <IconButton
                    className='replay'
                    sx={{
                      position: 'absolute',
                      top: 0,
                      right: '8px',
                      display: selectSegment === segment ? 'flex' : 'none',
                      backgroundColor:
                        selectSegment === segment ? 'white' : 'transparent'
                    }}
                    onClick={(event) => {
                      event.stopPropagation() // Ngăn chặn sự kiện lan truyền
                      // Thêm hành động khi nhấp vào IconButton tại đây
                      handleReplayClick(segment)
                    }}
                  >
                    <Replay sx={{ fontSize: 16, color: 'orange' }} />
                  </IconButton>
                </Box>
              ))}
            </Box>
          </Box>
          {/* control */}
          <Box
            sx={{
              position: 'sticky',
              bottom: 0,
              width: '100%',
              backgroundColor: '#fff',
              py: 1,
              display: 'flex',
              gap: 1,
              alignItems: 'center'
            }}
          >
            {/* Nút Play/Pause */}
            <IconButton onClick={handlePlayPause}>
              {playing ? <Pause /> : <PlayArrow />}
            </IconButton>

            {/* Control Volume */}
            <Box
              sx={{
                '&:hover .volume-slider': {
                  display: 'block' // Hiển thị slider khi hover
                }
              }}
            >
              <Stack direction='row' sx={{ alignItems: 'center' }}>
                <IconButton>
                  <VolumeUp />
                </IconButton>

                <Slider
                  value={volume !== undefined ? volume : 1}
                  onChange={handleVolumeChange}
                  aria-label='Volume'
                  sx={{ display: 'none', width: '100px', mx: 2 }}
                  className='volume-slider'
                  valueLabelDisplay='on'
                  step={20}
                  marks
                />
              </Stack>
            </Box>
            {/* Control rate play */}
            <Box
              sx={{
                '&:hover .volume-slider': {
                  display: 'block' // Hiển thị slider khi hover
                }
              }}
            >
              <Stack direction='row' sx={{ alignItems: 'center' }}>
                <IconButton>
                  <SlowMotionVideo />
                </IconButton>
                <Slider
                  value={playbackRate}
                  onChange={handlePlaybackRateChange}
                  aria-label='Volume'
                  sx={{ display: 'none', width: '100px', mx: 2 }}
                  className='volume-slider'
                  valueLabelDisplay='on'
                  min={0.5}
                  max={1.5}
                  step={0.1}
                  marks
                />
              </Stack>
            </Box>
          </Box>
        </Box>
      </Box>
      {/*  */}
      <Box>Descriptions</Box>
      <Box>Comments</Box>
      <Box dangerouslySetInnerHTML={{ __html: test.text }}></Box>
    </Box>
  )
}

export default PlayVideo
