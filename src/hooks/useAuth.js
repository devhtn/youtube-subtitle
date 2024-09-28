import { useSelector } from 'react-redux'

import { jwtDecode } from 'jwt-decode'

const useAuth = () => {
  const auth = useSelector((state) => state.auth)
  const token = auth.token ? auth.token : null

  if (!token) {
    return {}
  }

  try {
    const decoded = jwtDecode(token) // Giải mã token
    return decoded // Trả về role
  } catch (error) {
    return {}
  }
}

export default useAuth
