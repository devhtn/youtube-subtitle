import privateAxios from '~/api/privateAxios'

const commentApi = {
  createComment(body) {
    return privateAxios.post(`/comment`, body)
  },
  toggleLikeComment(body) {
    return privateAxios.post(`/comment/toggle-like`, body)
  },
  getExerciseComments(exerciseId) {
    return privateAxios.get(`/comment/${exerciseId}`)
  }
}

export default commentApi
