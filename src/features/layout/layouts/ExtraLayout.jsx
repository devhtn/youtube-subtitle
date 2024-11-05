import { Box } from '@mui/material'

import MenuTabs from '../components/MenuTabs'
import SideBar from '../components/Sidebar'

// format of tabItems
// tabItems={[
//   { label: 'Exercises', pathname: '/admin/exercise' },
//   { label: 'Create', pathname: '/admin/exercise/create' }
// ]}

const ExtraLayout = ({ tabItems }) => {
  return (
    <Box>
      {/* <Header /> */}
      <SideBar />
      <Box
        sx={{
          ml: (theme) => `calc(${theme.spacing(8)} + 1px)`,
          display: 'flex',
          justifyContent: 'center'
        }}
      >
        <Box sx={{ width: '100%', pt: 1, px: 1 }}>
          <MenuTabs tabItems={tabItems} />
        </Box>
      </Box>
    </Box>
  )
}
export default ExtraLayout
