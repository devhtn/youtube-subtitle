import { useEffect, useState } from 'react'

import { FitnessCenter, MenuBook, People } from '@mui/icons-material'
import { Box, IconButton, Paper, Stack, Typography } from '@mui/material'
import {
  Label,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from 'recharts'

import statisticApi from '../statisticApi'

const AdminStatistic = () => {
  const [userStatistic, setUserStastic] = useState([])
  const [exerciseStatistic, setExerciseStastic] = useState([])
  const [totalUsers, setTotalUsers] = useState(0)
  const [totalExercises, setTotalExercises] = useState(0)
  useEffect(() => {
    ;(async () => {
      try {
        const [
          { statistic: userStatistic, totalUsers },
          { statistic: exerciseStatistic, totalExercises }
        ] = await Promise.all([
          statisticApi.getUserStatistic(),
          statisticApi.getExerciseStatistic()
        ])
        setUserStastic(userStatistic)
        setExerciseStastic(exerciseStatistic)
        setTotalUsers(totalUsers)
        setTotalExercises(totalExercises)
      } catch (error) {
        console.log(error)
      }
    })()
  }, [])
  const statistics = [
    {
      label: 'Tổng người dùng',
      value: totalUsers,
      icon: <People sx={{ color: 'white' }} />,
      color: '#321FDC'
    },
    {
      label: 'Tổng bài tập',
      value: totalExercises,
      icon: <MenuBook sx={{ color: 'white' }} />,
      color: '#3399FF'
    }
  ]

  return (
    <Box
      sx={{
        p: 2,
        borderRadius: '8px',
        margin: '0 auto',
        display: 'flex',
        flexDirection: 'column',
        gap: 4
      }}
    >
      <Stack spacing={2} direction='row' justifyContent='space-around'>
        {statistics.map((stat, index) => (
          <Box key={index} width='100%'>
            <Paper
              elevation={3}
              sx={{
                padding: 2,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}
            >
              {/* Biểu tượng */}
              <IconButton
                sx={{
                  backgroundColor: stat.color
                }}
              >
                {stat.icon}
              </IconButton>

              {/* Nội dung */}
              <Box sx={{ textAlign: 'right' }}>
                <Typography fontSize={16}>{stat.label}</Typography>
                <Typography fontSize={16} sx={{ color: stat.color }}>
                  {stat.value}
                </Typography>
              </Box>
            </Paper>
          </Box>
        ))}
      </Stack>
      <Box
        display='flex'
        flexDirection='row'
        justifyContent='space-between'
        gap={2}
      >
        <Box width='100%'>
          <Paper elevation={3} sx={{ padding: 2 }}>
            <ResponsiveContainer width='100%' height={400}>
              <LineChart data={userStatistic} margin={{ bottom: 50 }}>
                <XAxis dataKey='month' tick={{ fontSize: 14 }}>
                  <Label
                    value='Tháng'
                    offset={0}
                    position='insideBottomRight'
                    style={{ fontSize: 14 }}
                    dy={20}
                  />
                </XAxis>
                <YAxis tick={{ fontSize: 14 }}>
                  <Label
                    value='Số lượng người dùng'
                    angle={-90}
                    position='insideLeft'
                    style={{ fontSize: 14 }}
                    dx={10}
                  />
                </YAxis>
                <Tooltip />
                <Line
                  type='monotone'
                  dataKey='countUser'
                  name='Số lượng người dùng'
                  stroke='#3f51b5'
                />
              </LineChart>
            </ResponsiveContainer>
          </Paper>
        </Box>

        <Box width='100%'>
          <Paper elevation={3} sx={{ padding: 2 }}>
            <ResponsiveContainer width='100%' height={400}>
              <LineChart data={exerciseStatistic} margin={{ bottom: 50 }}>
                <XAxis dataKey='month' tick={{ fontSize: 14 }}>
                  <Label
                    value='Tháng'
                    offset={0}
                    position='insideBottomRight'
                    style={{ fontSize: 14 }}
                    dy={20}
                  />
                </XAxis>
                <YAxis tick={{ fontSize: 14 }}>
                  <Label
                    value='Số lượng bài tập'
                    angle={-90}
                    position='insideLeft'
                    style={{ fontSize: 14 }}
                    dx={10}
                  />
                </YAxis>
                <Tooltip />
                <Line
                  type='monotone'
                  dataKey='countExercise'
                  name='Số lượng bài tập'
                  stroke='#3f51b5'
                />
              </LineChart>
            </ResponsiveContainer>
          </Paper>
        </Box>
      </Box>
    </Box>
  )
}

export default AdminStatistic
