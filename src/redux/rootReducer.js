import { combineReducers } from '@reduxjs/toolkit'

import auth from '~/features/auth/slices/authSlice'
import level from '~/features/auth/slices/levelSlice'

// Phải đảm bảo tên của
const rootReducer = combineReducers({
  // Đảm bảo tên thuộc tính phải trùng với name trong createSlice
  auth,
  level
})

export default rootReducer
