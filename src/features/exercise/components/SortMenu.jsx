import { useEffect, useState } from 'react'

import { Box, Chip, Popover } from '@mui/material'
import _ from 'lodash'

import useAuth from '~/hooks/useAuth'

const SORTS = [
  {
    label: 'Phổ biến',
    sort: 'completedUsersCount',
    orderOptions: [
      { label: 'Phổ biến - Tăng dần', order: 'asc' },
      { label: 'Phổ biến - Giảm dần', order: 'desc' }
    ]
  },
  {
    label: 'Tốc độ',
    sort: 'avgSpeed',
    orderOptions: [
      { label: 'Tốc độ - Tăng dần', order: 'asc' },
      { label: 'Tốc độ - Giảm dần', order: 'desc' }
    ]
  },
  {
    label: 'Số lượng từ nâng cao',
    sort: 'difficult',
    orderOptions: [
      { label: 'Số lượng từ - Tăng dần', order: 'asc' },
      { label: 'Số lượng từ - Giảm dần', order: 'desc' }
    ]
  },
  {
    label: 'Thời lượng',
    sort: 'duration',
    orderOptions: [
      { label: 'Thời lượng - Tăng dần', order: 'asc' },
      { label: 'Thời lượng - Giảm dần', order: 'desc' }
    ]
  }
]

const ADMIN_SORTS = [
  {
    label: 'Phổ biến',
    sort: 'completedUsersCount',
    orderOptions: [
      { label: 'Phổ biến', order: 'desc' },
      { label: 'Kém phổ biến', order: 'asc' }
    ]
  },
  {
    label: 'Thời gian',
    sort: 'createdAt',
    orderOptions: [
      { label: 'Thời gian - Cũ', order: 'asc' },
      { label: 'Thời gian - Mới', order: 'desc' }
    ]
  },
  {
    label: 'Số lượt thích',
    sort: 'likedUsersCount',
    orderOptions: [
      { label: 'Số lượt thích - Tăng dần', order: 'asc' },
      { label: 'Số lượt thích - Giảm dần', order: 'desc' }
    ]
  },
  {
    label: 'Số lượt không thích',
    sort: 'dislikedUsersCount',
    orderOptions: [
      { label: 'Số lượt không thích - Tăng dần', order: 'asc' },
      { label: 'Số lượt không thích - Giảm dần', order: 'desc' }
    ]
  },
  {
    label: 'Số lượt bình luận',
    sort: 'commentedCount',
    orderOptions: [
      { label: 'Số lượt bình luận - Tăng dần', order: 'asc' },
      { label: 'Số lượt bình luận - Giảm dần', order: 'desc' }
    ]
  }
]

const SortMenu = ({ value = {}, onChange = () => {} }) => {
  const [anchorEl, setAnchorEl] = useState(null)
  const [selectedSort, setSelectedSort] = useState(null)
  const [selectedOrder, setSelectedOrder] = useState(null)
  const [resultSort, setResultSort] = useState({})
  const auth = useAuth()

  // Chọn danh sách sắp xếp theo vai trò người dùng
  const displaySorts = auth.role === 'admin' ? ADMIN_SORTS : SORTS

  const open = Boolean(anchorEl)

  const handleOpenPopover = (event, el) => {
    if (el.orderOptions.length > 1) {
      setAnchorEl(event.currentTarget)
      setSelectedSort(el)
      setSelectedOrder(null) // Set default order value
    } else {
      setSelectedSort(el)
      setSelectedOrder(el.orderOptions[0])
      onChange({
        sort: el.sort,
        order: el.orderOptions[0].order
      })
    }
  }

  const handleClosePopover = () => {
    setAnchorEl(null)
  }

  const handleSelectOrder = (orderOption) => {
    setSelectedOrder(orderOption)
    handleClosePopover()
    onChange({
      sort: selectedSort.sort,
      order: orderOption.order
    })
  }

  useEffect(() => {
    if (!_.isEmpty(value)) setResultSort(value)
  }, [value])

  useEffect(() => {
    if (selectedSort && selectedOrder) {
      setResultSort({
        sort: selectedSort.sort,
        order: selectedOrder.order
      })
    }
  }, [selectedOrder])

  return (
    <Box display='flex' mb={1}>
      <Chip
        label='Sắp xếp theo:'
        variant='outlined'
        sx={{
          border: 0,
          '& .MuiChip-label': {
            pl: 0 // Padding for the label inside Chip
          }
        }}
      />

      <Box display='flex' alignItems='center' gap={1}>
        {displaySorts.map((el) => (
          <Chip
            key={el.sort}
            label={
              selectedSort && selectedSort.sort === el.sort
                ? selectedOrder
                  ? selectedOrder.label
                  : el.label // Show order label if selected
                : el.label // Show default label if not selected
            }
            variant='outlined'
            onClick={(event) => handleOpenPopover(event, el)} // Open popover on Chip click
            sx={{
              border: 0,
              borderRadius: 1,
              color: resultSort.sort === el.sort ? 'primary.main' : 'inherit' // Change text color if selected
            }}
          />
        ))}
      </Box>

      {/* Popover for sorting options */}
      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={handleClosePopover}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center'
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'center'
        }}
      >
        <Box p={2} display='flex' gap={1}>
          {selectedSort &&
            selectedSort.orderOptions.map((orderOption) => (
              <Chip
                key={orderOption.label}
                label={orderOption.label}
                onClick={() => handleSelectOrder(orderOption)}
                variant='outlined'
                sx={{ borderRadius: 1 }} // Spacing between Chips
              />
            ))}
        </Box>
      </Popover>
    </Box>
  )
}

export default SortMenu
