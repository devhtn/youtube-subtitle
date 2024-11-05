import { useContext, useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

import { Close, KeyboardArrowDown } from '@mui/icons-material'
import { Box, Button, Chip, Grid, Stack, Typography } from '@mui/material'
import _ from 'lodash'
import queryString from 'query-string'

import CardItem from '../components/CardItem'
import Filter from '../components/Filter'
import SortMenu from '../components/SortMenu'
import ScrollTopButton from '~/features/auth/components/ScrollTopBottom'

import exerciseApi from '../exerciseApi'

const ListExercises = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const [exercises, setExercises] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(false)
  const [remainingExercises, setRemainingExercises] = useState(0)
  const [query, setQuery] = useState(
    location.search ? null : { sort: 'completedUsersCount', order: 'desc' }
  )
  console.log(exercises)
  console.log(query)
  const [page, setPage] = useState(1)
  // Điều hướng đến trang xem trước
  const handlePreview = (id) => {
    navigate(`/exercise/preview/${id}`)
  }

  // Xử lý khi chọn category
  const handleCategoryTag = (categoryName) => {
    setExercises([]) // Xóa danh sách exercises để load lại
    setRemainingExercises(0) // Đặt lại số bài tập còn lại
    setQuery({
      category: query.category === categoryName ? null : categoryName
    })
    setPage(1)
  }

  // Hàm lọc exercises
  const filterExercises = async () => {
    setLoading(true)
    try {
      const {
        exercises: newExercises,
        totalExercises,
        categories
      } = await exerciseApi.getExercises({ ...query, page: 1 })
      setPage(1)
      setCategories(categories)
      setExercises(newExercises)
      setRemainingExercises(totalExercises - newExercises.length) // Cập nhật số bài tập còn lại
    } catch (error) {
      console.error(error)
    }
    setLoading(false)
  }

  // Hàm tải thêm exercises
  const loadMore = async () => {
    if (remainingExercises <= 0) return // Kiểm tra nếu không còn bài tập nào

    setLoading(true)
    try {
      const { exercises: moreExercises } = await exerciseApi.getExercises({
        ...query,
        page: page + 1
      })
      setExercises((prevExercises) => [...prevExercises, ...moreExercises])
      setRemainingExercises(
        (prevRemaining) => prevRemaining - moreExercises.length
      )
      setPage((prevPage) => prevPage + 1)
    } catch (error) {
      console.error(error)
    }
    setLoading(false)
  }

  useEffect(() => {
    // Lấy category từ URL
    const parsed = queryString.parse(location.search)
    // Cập nhật query với category mới
    if (!_.isEmpty(parsed)) setQuery(parsed)
  }, [])

  useEffect(() => {
    navigate({
      pathname: `/exercise/list`,
      search: queryString.stringify(query, { arrayFormat: 'bracket' })
    })
    if (query) filterExercises()
  }, [query])

  return (
    <Box pt={1}>
      <Box>
        <Box display='flex' gap={1.5}>
          <Filter />
          {categories.map((category) => (
            <Chip
              key={category.name}
              label={
                <Stack direction='row' alignItems='center' spacing={0.5}>
                  <Typography variant='span'>{`${category.name} (${category.count})`}</Typography>
                  {category.name === query.category && (
                    <Close sx={{ color: 'error.main', fontSize: '14px' }} />
                  )}
                </Stack>
              }
              variant='outlined'
              sx={{
                borderRadius: 1,
                borderColor:
                  category.name === query.category ? 'secondary.main' : ''
              }} // Khoảng cách giữa các tag
              onClick={() => handleCategoryTag(category.name)}
            />
          ))}
        </Box>
        <SortMenu
          onChange={(result) => {
            setQuery((prev) => ({ ...prev, ...result }))
          }}
        />
      </Box>

      <Grid container spacing={3}>
        {exercises.map((exercise) => (
          <Grid item xs={12} sm={6} md={3} key={exercise._id}>
            <CardItem
              exercise={exercise}
              handlePreview={() => handlePreview(exercise.id)}
            />
          </Grid>
        ))}
      </Grid>
      {remainingExercises > 0 && (
        <Box display='flex' justifyContent='center' mt={4}>
          <Button
            onClick={loadMore}
            sx={{ textTransform: 'none', fontSize: '14px' }}
            disabled={loading}
            variant='outlined'
            endIcon={<KeyboardArrowDown sx={{ color: 'primary.main' }} />}
          >
            {loading
              ? 'Loading...'
              : `Xem thêm ${remainingExercises} video khác`}
          </Button>
        </Box>
      )}
      <ScrollTopButton />
    </Box>
  )
}

export default ListExercises
