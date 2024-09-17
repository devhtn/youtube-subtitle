import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  isOpen: false, // Trạng thái ban đầu của sidebar
  persistent: false
}

const sidebarSlice = createSlice({
  name: 'sidebar',
  initialState,
  reducers: {
    openSidebar: (state) => {
      state.isOpen = true
    },
    closeSidebar: (state) => {
      state.isOpen = false
    },
    toggleSidebar: (state) => {
      state.isOpen = !state.isOpen
    },
    openPersistent: (state) => {
      state.persistent = true
    },
    closePersistent: (state) => {
      state.persistent = false
    }
  }
})

export const {
  openSidebar,
  closeSidebar,
  toggleSidebar,
  openPersistent,
  closePersistent
} = sidebarSlice.actions

export default sidebarSlice.reducer
