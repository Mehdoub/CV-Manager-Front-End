import { Grid, Stack } from '@mui/material'
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

// ** Custom Components Import
import InterviewCard from './InterviewCard'

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

const ResumeInterviewsTab = () => {
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
                  <Avatar src='/images/avatars/3.png' sx={{ width: 25, height: 25 }} />
                  <Typography sx={{ ml: 2, fontSize: '14px' }}>Ali Akbar Rezaei</Typography>
                </Stack>
                <Typography variant='body2' sx={{ color: 'text.disabled', fontSize: '13px' }}>
                  Yesterday
                </Typography>
              </Box>
              <InterviewCard />
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
                  <Avatar src='/images/avatars/5.png' sx={{ width: 25, height: 25 }} />
                  <Typography sx={{ ml: 2, fontSize: '14px' }}>Mahdi Amereh</Typography>
                </Stack>
                <Typography variant='body2' sx={{ color: 'text.disabled', fontSize: '13px' }}>
                  4 hour
                </Typography>
              </Box>
              <InterviewCard />
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
                  <Avatar src='/images/avatars/7.png' sx={{ width: 25, height: 25 }} />
                  <Typography sx={{ ml: 2, fontSize: '14px' }}>Mani Mohammadi</Typography>
                </Stack>
                <Typography variant='body2' sx={{ color: 'text.disabled', fontSize: '13px' }}>
                  15 min
                </Typography>
              </Box>
              <InterviewCard />
            </TimelineContent>
          </TimelineItem>
        </Timeline>
      </Grid>
    </Grid>
  )
}

export default ResumeInterviewsTab