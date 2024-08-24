import { createSlice } from '@reduxjs/toolkit'
import { persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage'

const authPersist = {
  key: 'auth',
  storage: storage
}

export const slice = createSlice({
  name: 'auth',
  initialState: {
    token: null,
    user: null
  },
  reducers: {
    login: (state, action) => {
      const { token, user } = action.payload
      state.token = token
      state.user = user
    }
  }
})

export const { login } = slice.actions
export default persistReducer(authPersist, slice.reducer)
