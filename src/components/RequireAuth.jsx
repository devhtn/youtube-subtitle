import { useEffect, useState } from 'react'
import { Outlet, useNavigate } from 'react-router-dom'

import useAuth from '~/hooks/useAuth'

const RequireAuth = ({ allowedRoles = ['user'], children }) => {
  const navigate = useNavigate()
  const auth = useAuth()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!auth) {
      navigate('/login')
    } else if (!allowedRoles.includes(auth.role)) {
      navigate('/login')
    } else {
      setLoading(false) // Khi xác thực xong, thay đổi trạng thái loading
    }
  }, [allowedRoles, navigate, auth])

  // Trả về null hoặc loading indicator trong khi xác thực
  if (loading) {
    return null
  }

  // Nếu đã xác thực và có quyền, render children hoặc Outlet
  return children ? children : <Outlet />
}

export default RequireAuth
