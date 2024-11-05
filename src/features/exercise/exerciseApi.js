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
  updateDictationSegment(dictationId, segmentId, body) {
    return privateAxios.patch(
      `/exercise/dictation/${dictationId}/segment/${segmentId}`,
      body
    )
  },
  getExercise(videoId) {
    return privateAxios.get(`/exercise/${videoId}`)
  },
  getUserList() {
    return privateAxios.get(`/exercise/user-list`)
  },
  createComment(body) {
    return privateAxios.post(`/exercise/comment`, body)
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
  getExercises(query) {
    return privateAxios.get('/exercise', { params: query })
  },
  getUserDictations(query) {
    return privateAxios.get('/exercise/user-dictation', { params: query })
  },
  createDictation(body) {
    return privateAxios.post('/exercise/dictation', body)
  },
  delDictation(id) {
    return privateAxios.delete(`/exercise/dictation/${id}`)
  }
}

export default exerciseApi
