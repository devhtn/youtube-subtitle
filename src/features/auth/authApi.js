import publicAxios from '~/api/publicAxios'

const authApi = {
  login(body) {
    return publicAxios.post('/auth/login', body)
  },
  googleLogin(body) {
    return publicAxios.post('/auth/google-login', body)
  },
  register(body) {
    return publicAxios.post('/auth/register', body)
  }
}

export default authApi
