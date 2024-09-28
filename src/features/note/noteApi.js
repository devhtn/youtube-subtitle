import privateAxios from '~/api/privateAxios'

const noteApi = {
  checkVideo(link) {
    return privateAxios.post('/note/check-video', link)
  },
  addNote(checkVideo) {
    return privateAxios.post('/note/add-note', checkVideo)
  },
  getDictation(id) {
    return privateAxios.get(`/note/get-dictation/${id}`)
  },
  updateSegment(segment) {
    return privateAxios.patch('/note/update-segment', segment)
  }
}

export default noteApi
