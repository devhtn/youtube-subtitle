import { useEffect } from 'react'
import { Outlet, useNavigate } from 'react-router-dom'

import useAuth from '~/hooks/useAuth'

const RequireAuth = ({ allowedRoles, children }) => {
  const navigate = useNavigate()
  const auth = useAuth()

  useEffect(() => {
    if (!auth.role) navigate('/login')
    else if (!allowedRoles.includes(auth.role)) navigate('/not-found')
  }, [allowedRoles, navigate, auth.role])

  if (!allowedRoles.includes(auth.role)) {
    return null
  }

  return children ? children : <Outlet />
}

export default RequireAuth
