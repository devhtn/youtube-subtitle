import privateAxios from '~/api/privateAxios'

const commentApi = {
  createComment(body) {
    return privateAxios.post(`/comment`, body)
  },
  toggleLikeComment(body) {
    return privateAxios.post(`/comment/toggle-like`, body)
  }
}

export default commentApi
