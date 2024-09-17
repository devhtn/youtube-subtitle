import axios from 'axios'
import { jwtDecode } from 'jwt-decode'
import queryString from 'query-string'

import env from '~/config/env'

const privateAxios = axios.create({
  baseURL: env.API_URL,
  paramsSerializer: (params) => queryString.stringify(params),
  headers: {
    'Content-Type': 'application/json'
  }
})

privateAxios.interceptors.request.use(
  async (config) => {
    const auth = localStorage.getItem('persist:auth')
    if (auth && typeof auth === 'string') {
      const authJSON = JSON.parse(auth)
      const token = JSON.parse(authJSON?.token)
      return {
        ...config,
        headers: {
          ...config.headers,
          Authorization: `Bearer ${token}`
        }
      }
    }
    return config
  },
  (err) => {
    return Promise.reject(err)
  }
)

privateAxios.interceptors.response.use(
  (res) => {
    return res.data
  },
  (err) => {
    if (err.response.status === 401) {
      const auth = localStorage.getItem('persist:auth')
      if (auth && typeof auth === 'string') {
        const authJSON = JSON.parse(auth)
        const token = JSON.parse(authJSON?.token)
        const userRole = jwtDecode(token).role
        if (['user'].includes(userRole)) window.open('/re-login', '_blank')
        else window.open('/admin/re-login', '_blank')
        return null
      }
    }
    return Promise.reject(err.response)
  }
)

export default privateAxios
