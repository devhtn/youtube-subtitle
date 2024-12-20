import { useState } from 'react'

import {
  AutoGraph,
  Dashboard,
  KeyboardDoubleArrowLeft,
  KeyboardDoubleArrowRight,
  LibraryBooks,
  ManageAccounts,
  PostAdd,
  SportsEsports
} from '@mui/icons-material'
import { Box, Button, List } from '@mui/material'
import MuiDrawer from '@mui/material/Drawer'
import { styled } from '@mui/material/styles'

import Account from './Account'
import Navigation from './Navigation'

import useAuth from '~/hooks/useAuth'

const openedMixin = (theme) => ({
  width: theme.app.sidebarWidth,
  overflowX: 'hidden'
})

const closedMixin = (theme) => ({
  overflowX: 'hidden',
  width: `calc(${theme.spacing(8)} + 1px)`
})

// Dùng cái này khi có header để đẩy sidebar đi xuống khỏi header cố định
// const DrawerHeader = styled('div')(({ theme }) => ({
//   // necessary for content to be below app bar
//   ...theme.mixins.toolbar,
//   '@media (min-width:600px)': {
//     minHeight: theme.app.headerHeight // Ghi đè min-height cho màn hình >= 600px
//   }
// }))

const Drawer = styled(MuiDrawer, {
  // Không dùng shouldForwardProp khi không cần thiết, nó khiến persistent không work
  // shouldForwardProp: (prop) => prop !== 'open'
})(({ theme, open }) => ({
  width: theme.app.sidebarWidth,
  flexShrink: 0,
  whiteSpace: 'nowrap',
  boxSizing: 'border-box',
  ...(open && {
    ...openedMixin(theme),
    '& .MuiDrawer-paper': {
      ...openedMixin(theme),
      overflowY: 'hidden'
    }
  }),
  ...(!open && {
    ...closedMixin(theme),
    '& .MuiDrawer-paper': { ...closedMixin(theme), overflowY: 'hidden' }
  })
}))

const Sidebar = () => {
  const [open, setOpen] = useState(false)
  const auth = useAuth()

  return (
    <Drawer
      variant={'permanent'}
      open={open}
      PaperProps={{
        sx: {
          boxShadow: open ? '1px 0px 10px rgba(0, 0, 0, 0.2)' : '', // Chỉ bóng đổ bên phải
          transition: 'width 0.2s ease'
        }
      }}
    >
      {/* <DrawerHeader /> */}
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          height: '100%'
        }}
      >
        {/* control sidebar */}
        <Box
          sx={{
            display: 'flex',
            justifyContent: open ? 'initial' : 'center',
            alignSelf: open ? 'end' : ''
          }}
        >
          <Button
            size='large'
            color='inherit'
            aria-label='open drawer'
            onClick={() => setOpen(!open)}
          >
            {!open ? <KeyboardDoubleArrowRight /> : <KeyboardDoubleArrowLeft />}
          </Button>
        </Box>

        {/* List */}
        <Box
          sx={{
            flexGrow: 1,
            display: 'flex',
            flexDirection: 'column',
            overflowX: 'hidden',
            overflowY: 'auto',
            justifyContent: 'space-between'
          }}
        >
          {auth && auth.role === 'admin' ? (
            <List>
              <Navigation
                text='Dashboard'
                icon={<Dashboard />}
                openSidebar={open}
                path='/admin'
              />
              <Navigation
                text='Quản lý bài tập'
                icon={<LibraryBooks />}
                openSidebar={open}
                path='/exercise/admin/manage'
              />
              <Navigation
                text='Tạo mới bài tập'
                icon={<PostAdd />}
                openSidebar={open}
                path='/exercise/admin/create'
              />
              <Navigation
                text='Quản lý account'
                icon={<ManageAccounts />}
                openSidebar={open}
                path='/user'
              />
            </List>
          ) : (
            <List>
              <Navigation
                text='Thống kê phát triển'
                icon={<AutoGraph />}
                openSidebar={open}
                path='/'
              />
              <Navigation
                text='Danh sách bài tập'
                icon={<LibraryBooks />}
                openSidebar={open}
                path='/exercise/list'
              />
              <Navigation
                text='Tạo mới bài tập'
                icon={<PostAdd />}
                openSidebar={open}
                path='/exercise/create'
              />
              <Navigation
                text='Làm bài tập'
                icon={<SportsEsports />}
                openSidebar={open}
                path='/exercise/play'
              />
            </List>
          )}
          <Account openSidebar={open} />
        </Box>
      </Box>
    </Drawer>
  )
}
export default Sidebar
