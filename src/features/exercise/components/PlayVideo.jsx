import { useEffect, useRef, useState } from 'react'
import ReactPlayer from 'react-player'

import { Box, Skeleton, Typography } from '@mui/material'
import _ from 'lodash'

import Comment from './Comment'

const PlayVideo = ({
  onSegmentChange,
  onTimeChange,
  timePlay,
  volume = 100,
  rate = 1,
  isHidden = false,
  isPlaying,
  selectedSegment = {},
  onPlayingChange,
  exercise = {},
  comment
}) => {
  const [loading, setLoading] = useState(true)
  const [playing, setPlaying] = useState(false)
  const [currentSegment, setCurrentSegment] = useState({
    transText: '...'
  })

  const playerRef = useRef(null)

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
    if (exercise.segments[findIndex])
      setCurrentSegment(exercise.segments[findIndex])

    if (findIndex !== -1) {
      const newSegment = exercise.segments[findIndex]
      setCurrentSegment(newSegment)
      onSegmentChange && onSegmentChange(newSegment) // Thông báo cho component cha
    }
    onTimeChange && onTimeChange(currentTime)
  }

  useEffect(() => {
    if (!_.isEmpty(timePlay)) {
      playerRef.current.seekTo(Number(timePlay.start) + 0.001, 'seconds')
      setPlaying(true)
    }
  }, [timePlay])

  useEffect(() => {
    setPlaying(isPlaying)
  }, [isPlaying])
  useEffect(() => {
    onPlayingChange && onPlayingChange(playing)
  }, [playing])

  return (
    <>
      <Box
        sx={{
          position: 'relative',
          paddingTop: '56.25%' // 16:9 aspect ratio
        }}
      >
        {loading && (
          <Skeleton
            animation='wave'
            variant='rectangular'
            width='100%'
            height='100%'
            sx={{ position: 'absolute', top: 0, left: 0, zIndex: 1 }}
          />
        )}
        <Box
          sx={{
            display: isHidden ? 'flex' : 'none',
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundColor: 'rgba(0, 0, 0)',
            zIndex: 3,
            alignItems: 'center',
            justifyContent: 'center',
            color: '#fff'
          }}
        >
          Để bạn tập trung lắng nghe, video tạm thời được ẩn
        </Box>
        {exercise.videoId && (
          <ReactPlayer
            url={`https://www.youtube.com/embed/${exercise.videoId}`}
            style={{ position: 'absolute', top: 0, left: 0 }}
            width='100%'
            height='100%'
            onProgress={handleProgress}
            onPlay={() => setPlaying(true)}
            onPause={() => setPlaying(false)}
            playing={playing}
            ref={playerRef}
            onReady={handleReady} // Ẩn Skeleton khi video đã sẵn sàng
            controls
            volume={volume / 100}
            playbackRate={rate}
            progressInterval={500}
          />
        )}
      </Box>
      <Box
        sx={{
          bottom: '0', // Adjust as needed for lower subtitle
          textAlign: 'center',
          width: '100%',
          px: 2,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0px 1px 5px rgba(0, 0, 0, 0.5)'
        }}
      >
        <Typography fontSize={20}>
          {selectedSegment.transText
            ? selectedSegment.transText
            : currentSegment.transText}
        </Typography>
      </Box>
      {/* comment */}
      {comment && (
        <Box p={2}>
          {!_.isEmpty(exercise) && <Comment exercise={exercise} />}
        </Box>
      )}
    </>
  )
}

export default PlayVideo
