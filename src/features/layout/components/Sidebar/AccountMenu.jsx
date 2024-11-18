import { DarkMode, ExitToApp } from '@mui/icons-material'
import { ListItemIcon, Menu, MenuItem } from '@mui/material'

const AccountMenu = ({ anchorEl, open, onClose, onLogout }) => {
  return (
    <Menu
      anchorEl={anchorEl}
      id='account-menu'
      open={open}
      onClose={onClose}
      onClick={onClose}
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
      <MenuItem onClick={onLogout} sx={{ typography: 'body2' }}>
        <ListItemIcon>
          <ExitToApp fontSize='small' />
        </ListItemIcon>
        Logout
      </MenuItem>
    </Menu>
  )
}

export default AccountMenu
