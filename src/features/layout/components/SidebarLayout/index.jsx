import { useState } from 'react'

import {
  Home,
  KeyboardAlt,
  Menu,
  OtherHouses,
  PlayCircle
} from '@mui/icons-material'
import InboxIcon from '@mui/icons-material/MoveToInbox'
import {
  Box,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText
} from '@mui/material'
import MuiDrawer from '@mui/material/Drawer'
import { styled } from '@mui/material/styles'

import Account from './Account'
import Navigation from './Navigation'

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

const SidebarLayout = () => {
  const [open, setOpen] = useState(false)

  return (
    <Drawer variant={'permanent'} open={open}>
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
            mt: 1,
            px: '8px'
          }}
        >
          <IconButton
            size='large'
            color='inherit'
            aria-label='open drawer'
            onClick={() => setOpen(!open)}
          >
            <Menu />
          </IconButton>
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
          <List>
            <Navigation icon={<KeyboardAlt />} openSidebar={open} />
          </List>
          <Account openSidebar={open} />
        </Box>
      </Box>
    </Drawer>
  )
}
export default SidebarLayout
