import { useEffect, useState } from 'react'

import { Close, FilterAlt } from '@mui/icons-material'
import {
  Alert,
  Backdrop,
  Box,
  Button,
  Chip,
  Popover,
  Stack,
  Typography
} from '@mui/material'
import _ from 'lodash'

import exerciseApi from '../exerciseApi'

const FILTER = [
  {
    property: 'duration',
    label: 'Thời lượng',
    items: [
      { label: 'Dưới 2 phút', value: '0-120' },
      { label: '2-5 phút', value: '120-300' },
      { label: '5-10 phút', value: '300-600' },
      { label: 'Trên 10 phút', value: '600-' }
    ]
  },
  {
    property: 'difficult',
    label: 'Cấp độ',
    items: [
      { label: 'Dễ', value: '0-50' },
      { label: 'Trung bình', value: '50-100' },
      { label: 'Khó', value: '100-' }
    ]
  },
  {
    property: 'interaction',
    label: 'Tương tác',
    items: [
      { label: 'Hoàn thành', value: 'completedUsers' },
      { label: 'Yêu thích', value: 'likedUsers' },
      { label: 'Bình luận', value: 'commentedUsers' }
    ]
  }
]

const Filter = ({ value = {}, onChange = () => {} }) => {
  const [anchorEl, setAnchorEl] = useState(null)
  const [filter, setFilter] = useState([...FILTER])
  const [selectedFilter, setSelectedFilter] = useState({})
  const [activeFilter, setActiveFilter] = useState({})
  const [resultTotalExercises, setResultTotalExercises] = useState(0)
  console.log(activeFilter)

  const open = Boolean(anchorEl)

  const handleOpenPopover = (event) => {
    setAnchorEl(event.currentTarget)
  }

  const handleClosePopover = () => {
    setAnchorEl(null)
  }

  const handleClick = (property, value) => {
    setSelectedFilter((prev) => {
      const updatedFilter = { ...prev }

      if (updatedFilter[property]) {
        // Tìm vị trí của value trong mảng
        const index = updatedFilter[property].indexOf(value)

        if (index !== -1) {
          // Nếu value đã có trong mảng, loại bỏ nó
          updatedFilter[property].splice(index, 1)
        } else {
          // Nếu không có value, thêm value vào mảng
          updatedFilter[property].push(value)
        }

        // Nếu mảng của property trống sau khi cập nhật, loại bỏ property
        if (updatedFilter[property].length === 0) {
          delete updatedFilter[property]
        }
      } else {
        // Nếu property chưa có, tạo mảng mới với value
        updatedFilter[property] = [value]
      }

      return updatedFilter
    })
  }

  const handleActiveFilter = () => {
    handleClosePopover()
    setActiveFilter(selectedFilter)
    onChange(selectedFilter)
  }

  const handleDeselect = (property, value) => {
    setActiveFilter((prevState) => {
      // Tạo bản sao của activeFilter để tránh thay đổi trực tiếp
      const updatedFilter = { ...prevState }

      // Kiểm tra nếu property tồn tại trong activeFilter
      if (updatedFilter[property]) {
        // Loại bỏ item trong mảng của property
        updatedFilter[property] = updatedFilter[property].filter(
          (item) => item !== value
        )

        // Nếu mảng của property trở thành rỗng, loại bỏ property khỏi object
        if (updatedFilter[property].length === 0) {
          delete updatedFilter[property]
        }
      }
      onChange(updatedFilter)
      setSelectedFilter(_.cloneDeep(updatedFilter))
      return updatedFilter
    })
  }

  useEffect(() => {
    if (!_.isEmpty(value)) {
      setSelectedFilter(_.cloneDeep(value)) // Bản sao sâu của `value`
      setActiveFilter(_.cloneDeep(value)) // Bản sao sâu khác của `value`
    }
  }, [value])

  useEffect(() => {
    if (!_.isEmpty(selectedFilter)) {
      ;(async () => {
        try {
          const { totalExercises } =
            await exerciseApi.getExercises(selectedFilter)
          setResultTotalExercises(totalExercises)
        } catch (error) {
          console.log(error)
        }
      })()
    } else setResultTotalExercises(0)
  }, [selectedFilter])

  useEffect(() => {
    ;(async () => {
      try {
        const categories = await exerciseApi.getCategories()
        setFilter(() => [
          { property: 'category', label: 'Thể loại', items: categories },
          ...FILTER
        ])
      } catch (error) {
        console.log(error)
      }
    })()
  }, [])
  return (
    <Box position='relative'>
      {/* Backdrop xuất hiện khi Popover mở và không phủ Chip và Popover */}
      {open && (
        <Backdrop
          open={open}
          onClick={handleClosePopover} // Đóng Popover khi nhấp vào overlay
          sx={{
            zIndex: (theme) => theme.zIndex.drawer, // Đặt thấp hơn Chip và Popover
            backgroundColor: 'rgba(0, 0, 0, 0.4)', // Màu nền tối với độ mờ
            position: 'fixed', // Bao phủ toàn bộ màn hình
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh'
          }}
        />
      )}

      <Box display='flex' gap={1} mb={1}>
        {/* Nút Filter để mở Popover */}
        <Chip
          icon={<FilterAlt />}
          label='Filter'
          variant='outlined'
          onClick={handleOpenPopover}
          sx={{
            cursor: 'pointer',
            backgroundColor: 'white',
            borderRadius: 1,
            zIndex: (theme) => (open ? theme.zIndex.drawer : '') // Đảm bảo Chip luôn hiển thị trên Backdrop
          }}
        />
        {/* Đã chọn */}
        {!_.isEmpty(activeFilter) && (
          <Stack direction='row' gap={1}>
            {filter.map(
              (el, index) =>
                activeFilter[el.property] && (
                  <Stack key={index} direction='row' gap={1} flexWrap='wrap'>
                    {el.items.map((item, itemIndex) => {
                      // Kiểm tra nếu Chip đã được chọn
                      const isSelected =
                        activeFilter[el.property] &&
                        activeFilter[el.property].includes(item.value)
                      return (
                        isSelected && (
                          <Chip
                            key={itemIndex}
                            label={
                              <Stack
                                direction='row'
                                alignItems='center'
                                spacing={0.5}
                              >
                                <Typography variant='span'>
                                  {item.label}
                                </Typography>
                                {isSelected && (
                                  <Close
                                    sx={{
                                      color: 'error.main',
                                      fontSize: '14px'
                                    }}
                                  />
                                )}
                              </Stack>
                            }
                            variant='outlined'
                            sx={{
                              borderRadius: 1,
                              borderColor: isSelected ? 'secondary.main' : ''
                            }}
                            onClick={() =>
                              handleDeselect(el.property, item.value)
                            }
                          />
                        )
                      )
                    })}
                  </Stack>
                )
            )}
          </Stack>
        )}

        {/* Popover với các tùy chọn lọc */}
        <Popover
          open={open}
          anchorEl={anchorEl}
          onClose={handleClosePopover}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'left'
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'left'
          }}
          PaperProps={{
            sx: {
              overflow: 'visible',
              mt: 1.5,
              '&::before': {
                content: '""',
                display: 'block',
                position: 'absolute',
                top: -10,
                left: 10,
                width: 10,
                height: 10,
                bgcolor: 'background.paper',
                transform: 'translateY(50%) rotate(45deg)',
                zIndex: 0
              }
            }
          }}
        >
          <Box minWidth={400} maxWidth={600}>
            {!_.isEmpty(selectedFilter) && (
              <Box p={2} sx={{ borderBottom: (theme) => theme.app.border }}>
                <Typography variant='body2' fontWeight={600} mb={1}>
                  Đã chọn
                </Typography>
                <Stack direction='row' gap={1}>
                  {filter.map(
                    (el, index) =>
                      selectedFilter[el.property] && (
                        <Stack
                          key={index}
                          direction='row'
                          gap={1}
                          flexWrap='wrap'
                        >
                          {el.items.map((item, itemIndex) => {
                            // Kiểm tra nếu Chip đã được chọn
                            const isSelected =
                              selectedFilter[el.property] &&
                              selectedFilter[el.property].includes(item.value)
                            return (
                              isSelected && (
                                <Chip
                                  key={itemIndex}
                                  label={
                                    <Stack
                                      direction='row'
                                      alignItems='center'
                                      spacing={0.5}
                                    >
                                      <Typography variant='span'>
                                        {item.label}
                                      </Typography>
                                      {isSelected && (
                                        <Close
                                          sx={{
                                            color: 'error.main',
                                            fontSize: '14px'
                                          }}
                                        />
                                      )}
                                    </Stack>
                                  }
                                  variant='outlined'
                                  sx={{
                                    borderRadius: 1,
                                    borderColor: isSelected
                                      ? 'secondary.main'
                                      : ''
                                  }}
                                  onClick={() =>
                                    handleClick(el.property, item.value)
                                  }
                                />
                              )
                            )
                          })}
                        </Stack>
                      )
                  )}
                </Stack>
              </Box>
            )}
            {filter.map((el, index) => (
              <Box
                key={index}
                sx={{ borderBottom: (theme) => theme.app.border }}
              >
                <Box p={2}>
                  <Typography variant='body2' fontWeight={600} mb={1}>
                    {el.label}
                  </Typography>
                  <Stack direction='row' gap={1} flexWrap='wrap'>
                    {el.items.map((item, itemIndex) => {
                      // Kiểm tra nếu Chip đã được chọn
                      const isSelected =
                        selectedFilter[el.property] &&
                        selectedFilter[el.property].includes(item.value)
                      return (
                        <Chip
                          key={itemIndex}
                          label={item.label}
                          variant='outlined'
                          sx={{
                            borderRadius: 1,
                            borderColor: isSelected ? 'secondary.main' : ''
                          }}
                          onClick={() => handleClick(el.property, item.value)}
                        />
                      )
                    })}
                  </Stack>
                </Box>
              </Box>
            ))}
          </Box>
          {!_.isEmpty(selectedFilter) && (
            <Stack p={1} direction='row' justifyContent='center'>
              {resultTotalExercises > 0 ? (
                <Button
                  onClick={handleActiveFilter}
                  sx={{ textTransform: 'none', fontSize: '14px', px: 4 }}
                  variant='contained'
                >
                  Xem
                  <Typography fontWeight='bold' variant='body2' px='4px'>
                    {resultTotalExercises}
                  </Typography>
                  kết quả
                </Button>
              ) : (
                <Alert severity='warning'>Không có bài tập phù hợp</Alert>
              )}
            </Stack>
          )}
        </Popover>
      </Box>
    </Box>
  )
}

export default Filter
