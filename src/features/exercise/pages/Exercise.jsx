import { useState } from 'react'

import { Box, Tab, Tabs, Typography } from '@mui/material'

import Discover from '../components/Discover'
import CreateExercise from './CreateExercise'

function TabPanel({ children, value, index, ...other }) {
  return (
    <div
      role='tabpanel'
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 2 }}>{children}</Box>}
    </div>
  )
}

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`
  }
}

export default function SimpleTabs() {
  const [value, setValue] = useState(0)

  const handleChange = (event, newValue) => {
    setValue(newValue)
  }

  return (
    <Box sx={{ width: '100%' }}>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs
          value={value}
          onChange={handleChange}
          aria-label='basic tabs example'
        >
          <Tab label='Đang làm' {...a11yProps(0)} />
          <Tab label='Khám phá' {...a11yProps(1)} />
          <Tab label='Danh sách yêu thích' {...a11yProps(2)} />
          <Tab label='Tạo bài tập' {...a11yProps(3)} />
        </Tabs>
      </Box>
      <TabPanel value={value} index={0}>
        Nội dung của Tab 1
      </TabPanel>
      <TabPanel value={value} index={1}>
        <Discover />
      </TabPanel>
      <TabPanel value={value} index={2}>
        Danh sach yeu thich
      </TabPanel>
      <TabPanel value={value} index={3}>
        <CreateExercise />
      </TabPanel>
    </Box>
  )
}
