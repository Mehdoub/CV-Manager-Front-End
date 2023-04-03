import { Grid, Stack } from '@mui/material'
import CallHistoryCard from './CallHistoryCard'
// ** MUI Import
import Box from '@mui/material/Box'
import Avatar from '@mui/material/Avatar'
import { styled } from '@mui/material/styles'
import TimelineDot from '@mui/lab/TimelineDot'
import TimelineItem from '@mui/lab/TimelineItem'
import Typography from '@mui/material/Typography'
import TimelineContent from '@mui/lab/TimelineContent'
import TimelineSeparator from '@mui/lab/TimelineSeparator'
import TimelineConnector from '@mui/lab/TimelineConnector'
import MuiTimeline, { TimelineProps } from '@mui/lab/Timeline'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Custom Components Import
import OptionsMenu from 'src/@core/components/option-menu'

// Styled Timeline component
const Timeline = styled(MuiTimeline)<TimelineProps>({
  paddingLeft: 0,
  paddingRight: 0,
  '& .MuiTimelineItem-root': {
    width: '100%',
    '&:before': {
      display: 'none'
    }
  }
})

const ResumeCallsTab = () => {
  return (
    <Grid sx={{ backgroundColor: '#4c4e640d' }}>
      <Grid container p={'10px 40px'}>
        <Timeline sx={{ my: 0, py: 0 }}>
          <TimelineItem>
            <TimelineSeparator>
              <TimelineDot color='warning' />
              <TimelineConnector />
            </TimelineSeparator>
            <TimelineContent sx={{ mt: 0, mb: theme => `${theme.spacing(2)} !important` }}>
              <Box
                sx={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  mb: 3
                }}
              >
                <Stack direction='row' sx={{ display: 'flex', alignItems: 'center' }}>
                  <Avatar src='/images/avatars/3.png' sx={{ width: 30, height: 30 }} />
                  <Typography sx={{ ml: 2, fontWeight: 500 }}>Ali Akbar Rezaei</Typography>
                </Stack>
                <Typography variant='body2' sx={{ color: 'text.disabled' }}>
                  Yesterday
                </Typography>
              </Box>
              <CallHistoryCard />
            </TimelineContent>
          </TimelineItem>
          <TimelineItem>
            <TimelineSeparator>
              <TimelineDot color='info' />
              <TimelineConnector />
            </TimelineSeparator>
            <TimelineContent sx={{ mt: 0, mb: theme => `${theme.spacing(2)} !important` }}>
              <Box
                sx={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  mb: 3
                }}
              >
                <Stack direction='row' sx={{ display: 'flex', alignItems: 'center' }}>
                  <Avatar src='/images/avatars/5.png' sx={{ width: 30, height: 30 }} />
                  <Typography sx={{ ml: 2, fontWeight: 500 }}>Mahdi Amereh</Typography>
                </Stack>
                <Typography variant='body2' sx={{ color: 'text.disabled' }}>
                  4 hour
                </Typography>
              </Box>
              <CallHistoryCard />
            </TimelineContent>
          </TimelineItem>
          <TimelineItem>
            <TimelineSeparator>
              <TimelineDot color='error' />
              <TimelineConnector />
            </TimelineSeparator>
            <TimelineContent sx={{ mt: 0, mb: theme => `${theme.spacing(2)} !important` }}>
              <Box
                sx={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  mb: 3
                }}
              >
                <Stack direction='row' sx={{ display: 'flex', alignItems: 'center' }}>
                  <Avatar src='/images/avatars/7.png' sx={{ width: 30, height: 30 }} />
                  <Typography sx={{ ml: 2, fontWeight: 500 }}>Mani Mohammadi</Typography>
                </Stack>
                <Typography variant='body2' sx={{ color: 'text.disabled' }}>
                  15 min
                </Typography>
              </Box>
              <CallHistoryCard />
            </TimelineContent>
          </TimelineItem>
        </Timeline>
        {/* {[1, 2, 3].map((item: any, index: number) => (
          <Grid item lg={10} p={5}>
            <CallHistoryCard />
          </Grid>
        ))} */}
      </Grid>
    </Grid>
  )
}

export default ResumeCallsTab
