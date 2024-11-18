import privateAxios from '~/api/privateAxios'

const notifyApi = {
  getUserNotifies() {
    return privateAxios.get('/notify/user')
  },
  updateNotify(id, body) {
    return privateAxios.patch(`/notify/${id}`, body)
  }
}

export default notifyApi
