import constants from '~/config/constants'

const isEmptyFunction = (fn) => {
  return (
    fn.toString().replace(/\s+/g, '') ===
    (() => {}).toString().replace(/\s+/g, '')
  )
}

const getTimeSince = (date) => {
  const seconds = Math.floor((new Date() - new Date(date)) / 1000)

  let interval = Math.floor(seconds / 31536000)
  if (interval >= 1) {
    return `${interval} năm trước`
  }
  interval = Math.floor(seconds / 2592000)
  if (interval >= 1) {
    return `${interval} tháng trước`
  }
  interval = Math.floor(seconds / 86400)
  if (interval >= 1) {
    return `${interval} ngày trước`
  }
  interval = Math.floor(seconds / 3600)
  if (interval >= 1) {
    return `${interval} giờ trước`
  }
  interval = Math.floor(seconds / 60)
  if (interval >= 1) {
    return `${interval} phút trước`
  }
  return `${Math.floor(seconds)} giây trước`
}

const getRoboHashUrl = (userId, set = 'set4') => {
  if (!userId) throw new Error('User ID is required to generate RoboHash URL')
  return `${constants.ROBOHASH_URL}${userId}?set=${set}`
}

const util = { isEmptyFunction, getTimeSince, getRoboHashUrl }
export default util
