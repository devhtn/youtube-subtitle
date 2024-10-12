import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { Grid } from '@mui/material'

import CardItem from '../components/CardItem'

import exerciseApi from '../exerciseApi'
import authApi from '~/features/auth/authApi'
import useAuth from '~/hooks/useAuth'

const PlayExerciseList = () => {
  const navigate = useNavigate()
  const [dictations, setDictations] = useState([])
  const [user, setUser] = useState({})
  const auth = useAuth()

  const handleReview = (videoId) => {
    navigate(`/exercise/${videoId}/review`)
  }

  useEffect(() => {
    ;(async () => {
      try {
        const [dictations, user] = await Promise.all([
          exerciseApi.getUserDictations(),
          authApi.getUser(auth.id)
        ])
        console.log(dictations)
        setDictations(dictations)
        setUser(user)
      } catch {}
    })()
  }, [])
  return (
    <Grid container spacing={3}>
      {dictations.map((el) => (
        <Grid item xs={12} sm={6} md={3} key={el.id}>
          <CardItem
            user={user}
            exercise={el.exerciseId}
            onClickThumbnail={handleReview}
          />
        </Grid>
      ))}
    </Grid>
  )
}

export default PlayExerciseList
