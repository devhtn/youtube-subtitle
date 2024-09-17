import privateAxios from "~/api/privateAxios"

const videoApi = {
  createVideo(body) {
    return privateAxios.post('/video/create-video', body)
  }
}

export default videoApi
