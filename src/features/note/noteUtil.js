import axios from 'axios'

import env from '~/config/env'

function parseSrtTime(srtTime) {
  // Tách giờ, phút, giây và mili giây từ chuỗi
  const [hours, minutes, rest] = srtTime.split(':')
  const [seconds, milliseconds] = rest.split(',')

  // Chuyển đổi thành số
  const h = parseInt(hours, 10)
  const m = parseInt(minutes, 10)
  const s = parseInt(seconds, 10)
  const ms = parseInt(milliseconds, 10)

  // Tính số mili giây từ đầu ngày
  return (h * 60 * 60 + m * 60 + s) * 1000 + ms
}

const getVideoId = (url) => {
  const match = url.match(
    /(?:https?:\/\/)?(?:www\.)?youtube\.com\/(?:[^/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=|.*[?&]embed=|.*[?&]v=)([^\s&"'<>#]+)/
  )
  return match ? match[1] : null
}

const fetchVideo = async (videoId) => {
  if (videoId) {
    const response = await axios.get(
      'https://www.googleapis.com/youtube/v3/videos',
      {
        params: {
          part: 'snippet,contentDetails',
          id: videoId,
          key: env.YOUTUBE_API_KEY
        }
      }
    )

    return response.data.items[0]
  }
}

const formatTime = (totalSeconds) => {
  const minutes = Math.floor((totalSeconds % 3600) / 60)
  const seconds = totalSeconds % 60

  const formattedMinutes = minutes.toFixed(0).toString().padStart(2, '0')
  const formattedSeconds = seconds.toFixed(0).toString().padStart(2, '0')

  return `${formattedMinutes}:${formattedSeconds}`
}
const noteUtil = {
  getVideoId,
  fetchVideo,
  formatTime
}
export default noteUtil
