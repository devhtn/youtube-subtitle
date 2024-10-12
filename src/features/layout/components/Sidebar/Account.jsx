import React, { useEffect } from 'react'
import ReactAvatar from 'react-avatar'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'

import { AccountBox, DarkMode, ExitToApp } from '@mui/icons-material'
import {
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem
} from '@mui/material'

import authApi from '~/features/auth/authApi'
import { logout } from '~/features/auth/authSlice'

const Account = ({ openSidebar }) => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [anchorEl, setAnchorEl] = React.useState(null)
  const [user, setUser] = React.useState({})
  const open = Boolean(anchorEl)

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget)
  }
  const handleClose = () => {
    setAnchorEl(null)
  }

  //
  const handleLogout = () => {
    dispatch(logout())
    handleClose
    navigate('/intro')
  }

  // useEffect
  useEffect(() => {
    ;(async () => {
      await authApi.getUser().then((user) => setUser(user))
    })()
  }, [])

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
          <DarkMode fontSize='small' />
        </ListItemIcon>
        Dark mode
      </MenuItem>
      <MenuItem onClick={handleClose} sx={{ typography: 'body2' }}>
        <ListItemIcon>
          <AccountBox fontSize='small' />
        </ListItemIcon>
        Account
      </MenuItem>

      <MenuItem onClick={handleLogout} sx={{ typography: 'body2' }}>
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
            <ReactAvatar name={user.name} size='24' round />
          </ListItemIcon>
          <ListItemText
            primary={user.name}
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
