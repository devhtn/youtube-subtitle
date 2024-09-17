import { useEffect } from 'react'
import { Outlet, useNavigate } from 'react-router-dom'

import useAuth from '~/hooks/useAuth'

const RequireAuth = ({ allowedRoles, children }) => {
  const navigate = useNavigate()
  const userRole = useAuth()

  useEffect(() => {
    if (!allowedRoles.includes(userRole)) {
      navigate('/not-found')
    }
  }, [allowedRoles, navigate, userRole])

  if (!allowedRoles.includes(userRole)) {
    return null
  }

  return children ? children : <Outlet />
}

export default RequireAuth
