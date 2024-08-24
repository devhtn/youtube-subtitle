import { useSelector } from 'react-redux'
import { Outlet } from 'react-router-dom'

import { Box } from '@mui/material'

import Header from '../components/HeaderLayout'
import SideBar from '../components/SidebarLayout'

const MainLayout = () => {
  const isOpen = useSelector((state) => state.sidebar.isOpen)
  return (
    <Box>
      <Header />
      <SideBar />
      <Box
        sx={{
          ml: (theme) =>
            isOpen ? theme.app.sidebarWidth : `calc(${theme.spacing(8)} + 1px)`
        }}
      >
        <Outlet />
      </Box>
    </Box>
  )
}
export default MainLayout
