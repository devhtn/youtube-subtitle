import { useEffect, useState } from 'react'
import { Outlet, useLocation, useNavigate } from 'react-router-dom'

import { Box, Tab, Tabs } from '@mui/material'

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`
  }
}

export default function MenuTabs({ tabItems }) {
  const location = useLocation()
  const navigate = useNavigate()
  const [value, setValue] = useState(0)

  const handleChange = (event, newValue) => {
    setValue(newValue)
    navigate(tabItems[newValue].pathname)
  }

  useEffect(() => {
    // Find the tab index based on the current pathname
    const currentTabIndex = tabItems.findIndex(
      (item) => location.pathname === item.pathname
    )
    if (currentTabIndex !== -1) {
      setValue(currentTabIndex)
    }
  }, [location.pathname, tabItems])

  return (
    <Box sx={{ width: '100%' }}>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs
          value={value}
          onChange={handleChange}
          aria-label='navigation tabs'
        >
          {tabItems.map((item, index) => (
            <Tab key={index} label={item.label} />
          ))}
        </Tabs>
      </Box>
      <Box p={2}>
        <Outlet />
      </Box>
    </Box>
  )
}
