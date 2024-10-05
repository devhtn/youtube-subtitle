import privateAxios from '~/api/privateAxios'

const exerciseApi = {
  checkVideo(body) {
    return privateAxios.post('/exercise/check-video', body)
  },
  createExercise(body) {
    return privateAxios.post('/exercise', body)
  },
  getDictation(id) {
    return privateAxios.get(`/exercise/dictation/${id}`)
  },
  updateDictationProcess(dictationId, segmentId) {
    return privateAxios.patch(
      `/exercise/dictation/${dictationId}/segment/${segmentId}/process`
    )
  },
  updateDictationSegmentNote(dictationId, segmentId, body) {
    return privateAxios.patch(
      `/exercise/dictation/${dictationId}/segment/${segmentId}/note`, body
    )
  },
  getAllExercises() {
    return privateAxios.get(`/exercise`)
  },
  getExercise(videoId) {
    return privateAxios.get(`/exercise/${videoId}`)
  }
}

export default exerciseApi
