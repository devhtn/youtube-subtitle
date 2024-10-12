const formatTime = (totalSeconds) => {
  const minutes = Math.floor((totalSeconds % 3600) / 60)
  const seconds = totalSeconds % 60

  const formattedMinutes = minutes.toFixed(0).toString().padStart(2, '0')
  const formattedSeconds = seconds.toFixed(0).toString().padStart(2, '0')

  return `${formattedMinutes}:${formattedSeconds}`
}

const getTimeSince = (date) => {
  const seconds = Math.floor((new Date() - new Date(date)) / 1000)

  let interval = Math.floor(seconds / 31536000)
  if (interval > 1) {
    return `${interval} năm trước`
  }
  interval = Math.floor(seconds / 2592000)
  if (interval > 1) {
    return `${interval} tháng trước`
  }
  interval = Math.floor(seconds / 86400)
  if (interval > 1) {
    return `${interval} ngày trước`
  }
  interval = Math.floor(seconds / 3600)
  if (interval > 1) {
    return `${interval} giờ trước`
  }
  interval = Math.floor(seconds / 60)
  if (interval >= 1) {
    return `${interval} phút trước`
  }
  return `${Math.floor(seconds)} giây trước`
}

const exerciseUtil = {
  getTimeSince,
  formatTime
}
export default exerciseUtil
