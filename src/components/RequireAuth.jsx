import { useEffect } from 'react'
import { Outlet, useNavigate } from 'react-router-dom'

import useAuth from '~/hooks/useAuth'

const RequireAuth = ({ allowedRoles, children }) => {
  const navigate = useNavigate()
  const userRole = useAuth()

  useEffect(() => {
    if (!allowedRoles.includes(userRole)) {
      navigate('/admin/login') // Nếu người dùng không có quyền, điều hướng về trang login
    }
  }, [allowedRoles, navigate, userRole])

  if (!allowedRoles.includes(userRole)) {
    return null
  }

  return children ? children : <Outlet />
}

export default RequireAuth
