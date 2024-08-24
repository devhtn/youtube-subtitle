import publicAxios from '~/config/axios/publicAxios'

const authApi = {
  signin(body) {
    return publicAxios.post('/auth/admin-login', body)
  }
}

export default authApi
