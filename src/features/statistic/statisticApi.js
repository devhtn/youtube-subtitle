import privateAxios from '~/api/privateAxios'

const statisticApi = {
  createNewDay(body) {
    return privateAxios.post('/statistic', body)
  },
  updateDay(body) {
    return privateAxios.patch('/statistic', body)
  },
  getDays(query) {
    return privateAxios.get('/statistic', { params: query })
  }
}

export default statisticApi