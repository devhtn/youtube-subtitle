import { useEffect, useState } from 'react'

import { Box, Chip, Popover } from '@mui/material'

const sorts = [
  {
    label: 'Phổ biến',
    property: 'completedUsersCount',
    orderOptions: [{ label: 'Phổ biến', order: 'desc' }]
  },
  {
    label: 'Tốc độ',
    property: 'avgSpeed',
    orderOptions: [
      { label: 'Tốc độ thấp - cao', order: 'asc' },
      { label: 'Tốc độ cao - thấp', order: 'desc' }
    ]
  },
  {
    label: 'Độ khó',
    property: 'difficult',
    orderOptions: [
      { label: 'Độ khó thấp - cao', order: 'asc' },
      { label: 'Độ khó cao - thấp', order: 'desc' }
    ]
  },
  {
    label: 'Thời lượng',
    property: 'duration',
    orderOptions: [
      { label: 'Thời lượng thấp - cao', order: 'asc' },
      { label: 'Thời lượng cao - thấp', order: 'desc' }
    ]
  }
]

const SortMenu = ({ onChange = () => {} }) => {
  const [anchorEl, setAnchorEl] = useState(null)
  const [selectedSort, setSelectedSort] = useState(null)
  const [selectedOrder, setSelectedOrder] = useState(null)
  const [result, setResult] = useState({
    property: 'completedUsersCount',
    order: 'desc'
  })

  const open = Boolean(anchorEl)

  const handleOpenPopover = (event, sort) => {
    if (sort.orderOptions.length > 1) {
      setAnchorEl(event.currentTarget)
      setSelectedSort(sort)
      setSelectedOrder(null) // Set default order value
    } else {
      setSelectedSort(sort)
      setSelectedOrder(sort.orderOptions[0])
      onChange({
        sort: sort.property,
        order: sort.orderOptions[0].order
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
      sort: selectedSort.property,
      order: orderOption.order
    })
  }

  useEffect(() => {
    if (selectedSort && selectedOrder) {
      setResult({
        property: selectedSort.property,
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
        {sorts.map((el) => (
          <Chip
            key={el.property}
            label={
              selectedSort && selectedSort.property === el.property
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
              color:
                result.property === el.property ? 'primary.main' : 'inherit' // Change text color if selected
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
