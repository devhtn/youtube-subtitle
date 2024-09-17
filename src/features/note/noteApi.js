import privateAxios from '~/api/privateAxios'

const noteApi = {
  checkVideo(link) {
    return privateAxios.post('/note/check-video', link)
  },
  addNote(checkVideo) {
    return privateAxios.post('/note/add-note', checkVideo)
  },
  getNote(id) {
    return privateAxios.get(`/note/get-note/${id}`)
  }
}

export default noteApi
