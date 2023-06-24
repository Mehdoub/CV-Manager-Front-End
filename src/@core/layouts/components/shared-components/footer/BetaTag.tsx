// ** MUI Imports
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import { getColorCodes } from 'src/helpers/functions'

const BetaTag = () => {
  return (
    <Box
      sx={{
        display: 'flex',
        position: 'fixed',
        bottom: 0,
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: getColorCodes('primary'),
        height: '30px',
        zIndex: '9000000 !important'
      }}
    >
      <Typography sx={{color: 'white',}}>Beta Version</Typography>
    </Box>
  )
}

export default BetaTag
