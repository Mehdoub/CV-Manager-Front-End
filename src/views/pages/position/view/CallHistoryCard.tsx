// ** MUI Imports
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import Rating from '@mui/material/Rating'
import Button from '@mui/material/Button'
import { styled } from '@mui/material/styles'
import Typography from '@mui/material/Typography'
import CardContent from '@mui/material/CardContent'
import CardActions from '@mui/material/CardActions'
import Grid, { GridProps } from '@mui/material/Grid'
import CustomAvatar from 'src/@core/components/mui/avatar'
import Icon from 'src/@core/components/icon'
import { Stack } from '@mui/material'

// Styled Grid component
const StyledGrid1 = styled(Grid)<GridProps>(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
  [theme.breakpoints.down('md')]: {
    paddingTop: '0 !important'
  },
  '& .MuiCardContent-root': {
    padding: theme.spacing(3, 4.75),
    [theme.breakpoints.down('md')]: {
      paddingTop: 0
    }
  }
}))

// Styled Grid component
const StyledGrid2 = styled(Grid)<GridProps>(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  [theme.breakpoints.up('md')]: {
    paddingLeft: '0 !important'
  },
  [theme.breakpoints.down('md')]: {
    order: -1
  }
}))

// Styled component for the image
const Img = styled('img')(({ theme }) => ({
  height: '11rem',
  borderRadius: theme.shape.borderRadius
}))

const CallHistoryCard = () => {
  return (
    <Card
    // sx={{ backgroundColor: '#4c4e640d' }}
    >
      <Grid container spacing={6}>
        <StyledGrid1 item xs={12} lg={9}>
          <CardContent sx={{ p: theme => `${theme.spacing(6)} !important` }}>
            {/* <Typography variant='h6' sx={{ mb: 2 }}>
              Wednesday 29 March
            </Typography> */}
            <Box sx={{ py: 1, mb: 2, display: 'flex', flexWrap: 'wrap', alignItems: 'center' }}>
              <Rating readOnly value={4} name='read-only' sx={{ mr: 2 }} />
              <Typography variant='body2'>3 Star | Good!</Typography>
            </Box>
            <Typography variant='body2'>
              Before there was a United States of America, there were coffee houses. Roasters there was a United States
              of America, before there were coffee houses.
            </Typography>
          </CardContent>
        </StyledGrid1>
        <StyledGrid2 item xs={12} lg={3}>
          <CardContent sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Stack direction='column' sx={{ display: 'flex', alignItems: 'center' }}>
              <CustomAvatar color='success' variant='rounded' skin='light' sx={{ width: 100, height: 100, mb: 2 }}>
                <Icon icon='charm:circle-tick' fontSize='3rem' />
              </CustomAvatar>
              <Typography>Answered</Typography>
            </Stack>
          </CardContent>
        </StyledGrid2>
      </Grid>
    </Card>
  )
}

export default CallHistoryCard
