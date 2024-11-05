import { createSlice } from '@reduxjs/toolkit'
import _ from 'lodash' // Import lodash

const levelSlice = createSlice({
  name: 'level',
  initialState: {
    words: []
  },
  reducers: {
    addLevelWords: (state, action) => {
      const newWords = action.payload // Nhận array từ làm payload
      // Kết hợp levelWords với newWords và loại bỏ các giá trị trùng lặp
      state.words = _.uniq([...state.words, ...newWords])
    }
  }
})

export const { addLevelWords } = levelSlice.actions
export default levelSlice.reducer
