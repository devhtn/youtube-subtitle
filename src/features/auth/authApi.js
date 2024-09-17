import publicAxios from '~/api/publicAxios'

const authApi = {
  adminLogin(body) {
    return publicAxios.post('/auth/admin-login', body)
  },
  userLogin(body) {
    return publicAxios.post('/auth/google-login', body)
  }
}

export default authApi
