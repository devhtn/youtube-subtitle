import React from 'react'
import { useSelector } from 'react-redux'

import {
  AccountCircle,
  ExitToApp,
  LoginOutlined,
  PersonAdd,
  Settings
} from '@mui/icons-material'
import {
  Avatar,
  Divider,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem
} from '@mui/material'

const Account = ({ openSidebar }) => {
  const auth = useSelector((state) => state.auth)
  const [anchorEl, setAnchorEl] = React.useState(null)
  const open = Boolean(anchorEl)

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget)
  }
  const handleClose = () => {
    setAnchorEl(null)
  }

  const renderMenu = (
    <Menu
      anchorEl={anchorEl}
      id='account-menu'
      open={open}
      onClose={handleClose}
      onClick={handleClose}
      sx={{ py: 0 }}
      MenuListProps={{
        sx: { py: 0 } // Điều chỉnh padding cho MenuList
      }}
      PaperProps={{
        elevation: 0,
        sx: {
          overflow: 'visible',
          filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
          mb: 1.5,
          '& .MuiAvatar-root': {
            width: 32,
            height: 32,
            ml: -0.5,
            mr: 1
          },
          '&::before': {
            content: '""',
            display: 'block',
            position: 'absolute',
            bottom: 0,
            left: 10,
            width: 10,
            height: 10,
            bgcolor: 'background.paper',
            transform: 'translateY(50%) rotate(45deg)',
            zIndex: 0
          }
        }
      }}
      transformOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      anchorOrigin={{ horizontal: 'right', vertical: 'top' }}
    >
      <MenuItem onClick={handleClose} sx={{ typography: 'body2' }}>
        <ListItemIcon>
          <PersonAdd fontSize='small' />
        </ListItemIcon>
        Add another account
      </MenuItem>
      <MenuItem onClick={handleClose} sx={{ typography: 'body2' }}>
        <ListItemIcon>
          <Settings fontSize='small' />
        </ListItemIcon>
        Settings
      </MenuItem>

      <MenuItem onClick={handleClose} sx={{ typography: 'body2' }}>
        <ListItemIcon>
          <ExitToApp fontSize='small' />
        </ListItemIcon>
        Logout
      </MenuItem>
    </Menu>
  )
  return (
    <List sx={{ p: 0 }}>
      <ListItem disablePadding sx={{ display: 'block' }}>
        <ListItemButton
          sx={{
            minHeight: 48,
            justifyContent: open ? 'initial' : 'center',
            px: 2.5
          }}
          onClick={handleClick}
        >
          <ListItemIcon
            sx={{
              minWidth: 0,
              mr: openSidebar ? 2 : 'auto',
              justifyContent: 'center'
            }}
          >
            {auth.user.picture ? (
              <Avatar src={auth.user.picture} sx={{ width: 24, height: 24 }} />
            ) : (
              <AccountCircle />
            )}
          </ListItemIcon>
          <ListItemText
            primary={auth.user.name}
            primaryTypographyProps={{
              fontSize: '14px',
              overflow: 'hidden', // Ẩn nội dung tràn
              whiteSpace: 'nowrap', // Ngăn ngắt dòng
              textOverflow: 'ellipsis' // Hiển thị dấu "..."
            }}
            sx={{
              opacity: openSidebar ? 1 : 0
            }}
          />
        </ListItemButton>
      </ListItem>
      {renderMenu}
    </List>
  )
}

export default Account
