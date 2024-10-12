import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { Grid } from '@mui/material'

import CardItem from '../components/CardItem'

import exerciseApi from '../exerciseApi'
import authApi from '~/features/auth/authApi'
import useAuth from '~/hooks/useAuth'

const DiscoverExercise = () => {
  const navigate = useNavigate()
  const auth = useAuth()
  const [user, setUser] = useState({})

  const [exercises, setExercises] = useState([])

  const handleReview = (videoId) => {
    navigate(`/exercise/${videoId}/review`)
  }

  useEffect(() => {
    ;(async () => {
      try {
        const [exercises, user] = await Promise.all([
          exerciseApi.getExercises(),
          authApi.getUser(auth.id)
        ])
        setExercises(exercises)
        setUser(user)
      } catch (err) {
        console.log(err)
      }
    })()
  }, [])
  return (
    <Grid container spacing={3}>
      {exercises.map((exercise) => (
        <Grid item xs={12} sm={6} md={3} key={exercise.id}>
          <CardItem
            user={user}
            exercise={exercise}
            onClickThumbnail={handleReview}
          />
        </Grid>
      ))}
    </Grid>
  )
}

export default DiscoverExercise
