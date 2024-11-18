import { useEffect, useMemo, useState } from 'react'

import { Box, Tab, Tabs } from '@mui/material'

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`
  }
}

function MenuTabs({ tabItems }) {
  // Tạo index tabItems chỉ khi tabItems thay đổi
  const tabItemsMemo = useMemo(() => tabItems, [tabItems])

  // Xác định giá trị mặc định cho `Tabs` dựa trên pathname
  const currentTabIndex = tabItemsMemo.findIndex(
    (item) => location.pathname === item.pathname
  )

  const [value, setValue] = useState(
    currentTabIndex !== -1 ? currentTabIndex : 0
  )

  // Cập nhật `value` khi có thay đổi pathname
  useEffect(() => {
    if (currentTabIndex !== -1 && currentTabIndex !== value) {
      setValue(currentTabIndex)
    }
  }, [currentTabIndex, value])

  const handleChange = (event, newValue) => {
    if (newValue !== value) {
      setValue(newValue)
    }
  }

  return (
    <Box sx={{ width: '100%' }}>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs
          value={value}
          onChange={handleChange}
          aria-label='navigation tabs'
          sx={{ '& .MuiTab-root': { marginRight: 2 } }}
        >
          {tabItemsMemo.map((item, index) => (
            <Tab key={index} label={item.label} {...a11yProps(index)} />
          ))}
        </Tabs>
      </Box>
      {/* Hiển thị component tương ứng với tab đã chọn */}
      {tabItemsMemo[value] && tabItemsMemo[value].component}
    </Box>
  )
}

export default MenuTabs
