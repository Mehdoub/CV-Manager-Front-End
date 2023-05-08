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

// ** Custom Components Import
import { useSelector } from 'react-redux'
import { getFullName, getImagePath, getTimeText } from 'src/helpers/functions'
import BootstrapTooltip from 'src/@core/components/bootstrap-tooltip'

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
  const { data: resume } = useSelector((state: any) => state.resume)

  return (
    <Grid sx={{ backgroundColor: '#4c4e640d' }}>
      <Grid container p={'10px 40px'}>
        <Timeline sx={{ my: 0, py: 0 }}>
          {resume?.call_history?.length > 0 ? (
            resume?.call_history?.map((callHistory: any, index: number) => {
              const [timeLineDateText, timeLineColor, timeLineDateString] = callHistory?.createdAt
                ? getTimeText(callHistory?.createdAt)
                : ['Yesterday', 'warning', '']
              return (
                <TimelineItem key={`call-history-timeline-${index}`}>
                  <TimelineSeparator>
                    <TimelineDot color={timeLineColor as any} />
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
                        <Avatar src={getImagePath(callHistory?.created_by?.avatar)} sx={{ width: 25, height: 25 }} />
                        <Typography sx={{ ml: 2, fontSize: '14px' }}>{getFullName(callHistory?.created_by)}</Typography>
                      </Stack>
                      <BootstrapTooltip title={timeLineDateString} placement='top'>
                        <Typography variant='body2' sx={{ color: 'text.disabled', fontSize: '13px' }}>
                          {timeLineDateText}
                        </Typography>
                      </BootstrapTooltip>
                    </Box>
                    <CallHistoryCard callHistory={callHistory} />
                  </TimelineContent>
                </TimelineItem>
              )
            })
          ) : (
            <Typography>There Is Nothing To Show Here!</Typography>
          )}
        </Timeline>
      </Grid>
    </Grid>
  )
}

export default ResumeCallsTab
