import { useDispatch, useSelector } from 'react-redux'

import { Menu } from '@mui/icons-material'
import MailIcon from '@mui/icons-material/Mail'
import InboxIcon from '@mui/icons-material/MoveToInbox'
import {
  Box,
  Divider,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText
} from '@mui/material'
import MuiDrawer from '@mui/material/Drawer'
import { styled } from '@mui/material/styles'

import { toggleSidebar } from './sidebarSlice'

const openedMixin = (theme) => ({
  width: theme.app.sidebarWidth,
  overflowX: 'hidden'
})

const closedMixin = (theme) => ({
  overflowX: 'hidden',
  width: `calc(${theme.spacing(8)} + 1px)`
})

// const DrawerHeader = styled('div')(({ theme }) => ({
//   // necessary for content to be below app bar
//   ...theme.mixins.toolbar,
//   '@media (min-width:600px)': {
//     minHeight: theme.app.headerHeight // Ghi đè min-height cho màn hình >= 600px
//   }
// }))

const Drawer = styled(MuiDrawer, {
  // Không dùng shouldForwardProp khi không cần thiết
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
  const sidebar = useSelector((state) => state.sidebar)
  const dispatch = useDispatch()

  return (
    <Drawer
      variant={sidebar.persistent ? 'persistent' : 'permanent'}
      open={sidebar.isOpen}
    >
      {/* <DrawerHeader /> */}
      <Box
        sx={{
          overflowY: 'auto',
          overflowX: 'hidden'
        }}
      >
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
            onClick={() => dispatch(toggleSidebar())}
          >
            <Menu />
          </IconButton>
        </Box>
        <List>
          {['Inbox', 'Starred', 'Send email', 'Drafts'].map((text, index) => (
            <ListItem key={text} disablePadding sx={{ display: 'block' }}>
              <ListItemButton
                sx={{
                  minHeight: 48,
                  justifyContent: open ? 'initial' : 'center',
                  px: 2.5
                }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 0,
                    mr: open ? 3 : 'auto',
                    justifyContent: 'center'
                  }}
                >
                  {index % 2 === 0 ? <InboxIcon /> : <MailIcon />}
                </ListItemIcon>
                <ListItemText primary={text} sx={{ opacity: open ? 1 : 0 }} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
        <Divider />
        <List>
          {['All mail', 'Trash', 'Spam'].map((text, index) => (
            <ListItem key={text} disablePadding sx={{ display: 'block' }}>
              <ListItemButton
                sx={{
                  minHeight: 48,
                  justifyContent: open ? 'initial' : 'center',
                  px: 2.5
                }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 0,
                    mr: open ? 3 : 'auto',
                    justifyContent: 'center'
                  }}
                >
                  {index % 2 === 0 ? <InboxIcon /> : <MailIcon />}
                </ListItemIcon>
                <ListItemText primary={text} sx={{ opacity: open ? 1 : 0 }} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Box>
    </Drawer>
  )
}
export default SidebarLayout
