import React from 'react'

import { Inbox } from '@mui/icons-material'
import {
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText
} from '@mui/material'

const Navigation = ({ openSidebar, icon }) => {
  return (
    <ListItem disablePadding sx={{ display: 'block' }}>
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
            mr: openSidebar ? 2 : 'auto',
            justifyContent: 'center'
          }}
        >
          {icon}
        </ListItemIcon>
        <ListItemText
          primary='Video'
          primaryTypographyProps={{ fontSize: '14px' }}
          sx={{ opacity: openSidebar ? 1 : 0 }}
        />
      </ListItemButton>
    </ListItem>
  )
}

export default Navigation
