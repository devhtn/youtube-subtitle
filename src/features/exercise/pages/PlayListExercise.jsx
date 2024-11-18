import { useState } from 'react'

import { Box } from '@mui/material'

import CompletedList from '../components/CompletedList'
import EmptyList from '../components/EmptyList'
import PlayingList from '../components/PlayingList'
import MenuTabs from '~/components/MenuTabs'

const PlayListExercise = () => {
  const [isShowEmpty, setIsShowEmpty] = useState(false)

  const handleEmpty = (isEmpty) => {
    setIsShowEmpty(isEmpty)
  }

  return (
    <Box>
      <MenuTabs
        tabItems={[
          {
            label: 'Bài tập của tôi',
            component: <PlayingList onEmpty={handleEmpty} />
          },
          {
            label: 'Đã hoàn thành',
            component: <CompletedList onEmpty={handleEmpty} />
          }
        ]}
      />
      {/* Thông báo khi danh sách trống */}
      <EmptyList show={isShowEmpty} />
    </Box>
  )
}

export default PlayListExercise
