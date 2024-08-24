import { combineReducers } from '@reduxjs/toolkit'

import sidebar from '~/layouts/components/SidebarLayout/sidebarSlice'

import auth from '~/features/auth/authSlice'

const rootReducer = combineReducers({
  sidebar,
  auth
})

export default rootReducer
