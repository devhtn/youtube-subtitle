import { useSelector } from 'react-redux'

import { jwtDecode } from 'jwt-decode'

const useAuth = () => {
  const auth = useSelector((state) => state.auth)
  const token = auth.token ? auth.token : null

  if (!token) {
    return null
  }

  try {
    const decoded = jwtDecode(token) // Giải mã token
    return decoded.role // Trả về role
  } catch (error) {
    return null
  }
}

export default useAuth
