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

const parseFileSrt = (fileSrt) => {
  return new Promise((resolve, reject) => {
    const subtitles = []
    const reader = new FileReader()

    reader.onload = (e) => {
      const srtContent = e.target.result

      // Normalize line breaks and remove any leading/trailing whitespace
      const cleanSrtContent = srtContent.replace(/\r\n|\r/g, '\n').trim()

      // Split the content by double line breaks (paragraphs)
      const srtArray = cleanSrtContent.split(/\n{2,}/)

      srtArray.forEach((item) => {
        const lines = item.split('\n')
        if (lines.length >= 3) {
          const time = lines[1].split(' --> ')
          subtitles.push({
            startTime: parseSrtTime(time[0]),
            endTime: parseSrtTime(time[1]),
            text: lines.slice(2).join('\n')
          })
        }
      })

      // Resolve the promise with the subtitles array
      resolve(subtitles)
    }

    reader.onerror = (error) => {
      reject(error)
    }

    // Start reading the file
    reader.readAsText(fileSrt)
  })
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

const translateSubs = async (mainFile, refFile) => {
  const mainSubs = await createVideoUtils.parseFileSrt(mainFile)
  const refSubs = await createVideoUtils.parseFileSrt(refFile)
  // const mainSubs = JSON.parse(JSON.stringify(mainSubs))
  // const refSubs = JSON.parse(JSON.stringify(refSubs))
  const newSubs = []
  const deleteArrayIndex = []
  let deleted = 0
  for (let i = 0; i < mainSubs.length; i++) {
    const mainSegment = mainSubs[i]
    let transText = ''
    let count = 0
    const mainEndTime = mainSegment.endTime
    for (let j = deleted; j < refSubs.length; j++) {
      const refSegment = refSubs[j]
      const refStartTime = refSegment.startTime
      if (mainEndTime >= refStartTime) {
        if (count > 0) transText += '<br />' + refSegment.text
        else transText += refSegment.text
        count++
      }
    }
    if (transText) {
      deleted += count
      mainSegment.transText = transText
    } else if (i > 0) {
      const prevSegment = mainSubs[i - 1]
      prevSegment.text += '<br />' + mainSegment.text
      prevSegment.endTime = mainSegment.endTime
      mainSubs[i] = prevSegment

      deleteArrayIndex.push(i)
    }
    newSubs.push(mainSegment)
  }
  return newSubs.filter((_, index) => !deleteArrayIndex.includes(index))
}

const formatTime = (milliseconds) => {
  const totalSeconds = Math.floor(milliseconds / 1000)
  const minutes = Math.floor((totalSeconds % 3600) / 60)
  const seconds = totalSeconds % 60

  const formattedMinutes = minutes.toString().padStart(2, '0')
  const formattedSeconds = seconds.toString().padStart(2, '0')

  return `${formattedMinutes}:${formattedSeconds}`
}
const createVideoUtils = {
  parseFileSrt,
  getVideoId,
  fetchVideo,
  translateSubs,
  formatTime
}
export default createVideoUtils
