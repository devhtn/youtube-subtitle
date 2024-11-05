import { useEffect } from 'react'
import { Outlet, useNavigate } from 'react-router-dom'

import useAuth from '~/hooks/useAuth'

const RequireAuth = ({ allowedRoles, children }) => {
  const navigate = useNavigate()
  const auth = useAuth()

  useEffect(() => {
    if (!auth || !allowedRoles.includes(auth.role)) {
      navigate('/login')
    }
  }, [allowedRoles, navigate, auth])

  if (!auth || !allowedRoles.includes(auth.role)) {
    return null
  }

  return children ? children : <Outlet />
}

export default RequireAuth
