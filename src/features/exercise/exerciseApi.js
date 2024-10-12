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
      `/exercise/dictation/${dictationId}/segment/${segmentId}/note`,
      body
    )
  },
  getExercise(videoId) {
    return privateAxios.get(`/exercise/${videoId}`)
  },
  createComment(exerciseId, body) {
    return privateAxios.post(`/exercise/${exerciseId}/comment`, body)
  },
  getExerciseComments(exerciseId) {
    return privateAxios.get(`/exercise/${exerciseId}/comment`)
  },
  toggleLikeComment(body) {
    return privateAxios.post(`/exercise/comment/toggle-like`, body)
  },
  toggleLike(body) {
    return privateAxios.post(`/exercise/toggle-like`, body)
  },
  getExercises() {
    return privateAxios.get('/exercise')
  },
  getUserDictations(query) {
    return privateAxios.get('/exercise/user-dictation', { params: query })
  }
}

export default exerciseApi
