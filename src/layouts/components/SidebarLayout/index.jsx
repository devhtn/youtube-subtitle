import { useSelector } from 'react-redux'

import MailIcon from '@mui/icons-material/Mail'
import InboxIcon from '@mui/icons-material/MoveToInbox'
import {
  Box,
  Divider,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText
} from '@mui/material'
import MuiDrawer from '@mui/material/Drawer'
import { styled } from '@mui/material/styles'

const openedMixin = (theme) => ({
  width: theme.app.sidebarWidth,
  overflowX: 'hidden'
})

const closedMixin = (theme) => ({
  overflowX: 'hidden',
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up('sm')]: {
    width: `calc(${theme.spacing(8)} + 1px)`
  }
})

const DrawerHeader = styled('div')(({ theme }) => ({
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
  '@media (min-width:600px)': {
    minHeight: theme.app.headerHeight // Ghi đè min-height cho màn hình >= 600px
  }
}))

const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== 'open'
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
  const isOpen = useSelector((state) => state.sidebar.isOpen)

  return (
    <Drawer variant='permanent' open={isOpen}>
      <DrawerHeader />
      <Box
        sx={{
          overflowY: 'auto',
          overflowX: 'hidden',
          // '&::-webkit-scrollbar': {
          //   width: 0
          // },
          '&:hover': {
            '&::-webkit-scrollbar': {
              width: '8px' // Hiển thị scrollbar khi hover
            }
          },
          // '&::-webkit-scrollbar-thumb': {
          //   backgroundColor: '#c4c4c4' // Màu sắc của thanh cuộn
          // },
          // '&::-webkit-scrollbar-track': {
          //   backgroundColor: '#fff' // Màu nền của đường cuộn
          // }
          '&::-webkit-scrollbar': {
            width: '0px'
          },
          '&::-webkit-scrollbar-thumb': {
            backgroundColor: '#c4c4c4',
            borderRadius: '10px',
            border: '2px solid transparent',
            backgroundClip: 'content-box'
          },
          '&::-webkit-scrollbar-track': {
            backgroundColor: '#f5f5f5'
          }
        }}
      >
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
