import React from 'react'

import {
  EditNote,
  StarBorderOutlined
} from '@mui/icons-material'
import {
  Box,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Typography
} from '@mui/material'

const NoteSegment = ({ segment }) => {
  const notes = segment.note.split('\n')
  return (
    <Box>
      {/* Tiêu đề với icon */}
      <Box display={'flex'} gap={2}>
        <EditNote />
        <Typography>Ghi chú</Typography>
      </Box>

      {/* Danh sách đánh số */}
      <List style={{ paddingLeft: '40px' }}>
        {notes.map((el, index) => (
          <ListItem key={index}>
            <ListItemIcon>
              <StarBorderOutlined fontSize='small' />
            </ListItemIcon>
            <ListItemText primary={el} />
          </ListItem>
        ))}
      </List>
    </Box>
  )
}

export default NoteSegment
