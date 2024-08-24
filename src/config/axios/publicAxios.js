import axios from 'axios'
import queryString from 'query-string'

const publicAxios = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  paramsSerializer: (params) => queryString.stringify(params)
})

publicAxios.interceptors.request.use(
  async (config) => {
    return {
      ...config,
      headers: {
        'Content-Type': 'application/json'
      }
    }
  },
  (err) => {
    return Promise.reject(err)
  }
)

publicAxios.interceptors.response.use(
  (response) => {
    return response.data
  },
  (error) => {
    return Promise.reject(error.response.data)
  }
)

export default publicAxios
