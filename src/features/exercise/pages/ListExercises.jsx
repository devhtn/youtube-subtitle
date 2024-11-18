import { useEffect, useMemo, useState } from 'react'
import { useSelector } from 'react-redux'
import { useLocation, useNavigate } from 'react-router-dom'

import { Box, Grid, Pagination } from '@mui/material'
import _ from 'lodash'
import queryString from 'query-string'

import CardItem from '../components/CardItem'
import Filter from '../components/Filter'
import SortMenu from '../components/SortMenu'
import ScrollTopButton from '~/features/auth/components/ScrollTopBottom'

import exerciseApi from '../exerciseApi'
import exerciseUtil from '../exerciseUtil'
import customToast from '~/config/toast'

const ListExercises = () => {
  const level = useSelector((state) => state.level)
  const navigate = useNavigate()
  const location = useLocation()
  const [exercises, setExercises] = useState([])
  console.log(exercises)
  const [query, setQuery] = useState(
    location.search ? null : { sort: 'completedUsersCount', order: 'desc' }
  )
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(0)
  const [activeFilter, setActiveFilter] = useState({})
  const [resultSort, setResultSort] = useState({})

  const levelWords = useMemo(
    () => level.words.map((item) => item.word),
    [level.words]
  )

  const handleChangePage = async (event, value) => {
    setPage(value)
  }
  // Điều hướng đến trang xem trước
  const handlePreviewClick = (id) => {
    navigate(`/exercise/preview/${id}`)
  }

  const handleCreateClick = async (id) => {
    try {
      await exerciseApi.createDictation({
        exerciseId: id
      })
      customToast.success('Bài tập được tạo thành công!')
      navigate('/exercise/playlist')
    } catch (error) {
      customToast.error(error.data.message)
    }
  }

  const handleChangeFilter = (filter) => {
    setQuery({ ...filter, sort: 'completedUsersCount', order: 'desc' })
    setPage(1)
  }

  const handleChangeSort = (result) => {
    setQuery((prev) => ({ ...prev, ...result }))
    setPage(1)
  }

  // Hàm lọc exercises
  const filterExercises = async () => {
    try {
      const { exercises: newExercises, totalPages } =
        await exerciseApi.getExercises({ ...query, page: Number(page) })

      const exercisesWithSimilarity = newExercises.map((exercise) => ({
        ...exercise,
        similarity: exerciseUtil.calculateIntersectionPercentage(
          levelWords,
          exercise.lemmaWords
        )
      }))
      setTotalPages(totalPages)
      setExercises(exercisesWithSimilarity)
    } catch (error) {
      console.error(error)
    }
  }

  useEffect(() => {
    // Lấy category từ URL
    const parsed = queryString.parse(location.search, {
      arrayFormat: 'bracket'
    })
    // Cập nhật query với category mới
    if (!_.isEmpty(parsed)) {
      const { page, ...query } = parsed
      setQuery(query)
      setPage(Number(page))
      const { page: _, sort, order, ...filterParsed } = parsed
      setActiveFilter(filterParsed)
      setResultSort({ sort, order })
    }
  }, [])

  useEffect(() => {
    if (page === 1) {
      // Change url
      navigate({
        pathname: `/exercise/list`,
        search: queryString.stringify(
          { ...query, page },
          { arrayFormat: 'bracket' }
        )
      })
      filterExercises()
    }
  }, [query])

  useEffect(() => {
    // Change url
    navigate({
      pathname: `/exercise/list`,
      search: queryString.stringify(
        { ...query, page },
        { arrayFormat: 'bracket' }
      )
    })
    filterExercises()
  }, [page])

  return (
    <Box pt={1}>
      <Box>
        <Box display='flex' gap={1.5}>
          <Filter onChange={handleChangeFilter} value={activeFilter} />
        </Box>
        <SortMenu onChange={handleChangeSort} value={resultSort} />
      </Box>

      <Grid container spacing={3}>
        {exercises.map((exercise) => (
          <Grid item xs={12} sm={6} md={3} key={exercise._id}>
            <CardItem
              exercise={exercise}
              preview={{
                onPreviewClick: () => handlePreviewClick(exercise._id),
                onCreateClick: () => handleCreateClick(exercise._id),
                progress: exercise.similarity
              }}
            />
          </Grid>
        ))}
      </Grid>
      <Box display='flex' justifyContent='center' mt={4}>
        <Pagination
          count={totalPages}
          page={page}
          onChange={handleChangePage}
          color='primary'
        />
      </Box>

      <ScrollTopButton />
    </Box>
  )
}

export default ListExercises
