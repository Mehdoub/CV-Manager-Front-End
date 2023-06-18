// ** MUI Imports
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import Avatar from '@mui/material/Avatar'
import Typography from '@mui/material/Typography'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import EventIcon from '@mui/icons-material/Event'

// ** Custom Components
import CustomChip from 'src/@core/components/mui/chip'
import BootstrapTooltip from 'src/@core/components/bootstrap-tooltip'
import { useSelector } from 'react-redux'
import { getFullName, getImagePath, getTimeText } from 'src/helpers/functions'
import { Grid, Skeleton } from '@mui/material'

const CrmMeetingSchedule = () => {
  const { loading: latestInterviewsLoading, data: latestInterviews }: any = useSelector(
    (state: any) => state.positionLatestInterviews
  )
  return latestInterviewsLoading ? (
    <Skeleton variant='rounded' height={425} />
  ) : (
    <Card>
      <CardHeader title='Latest Interviews' />
      <CardContent sx={{ mt: 3 }}>
        {latestInterviews?.length > 0 ? (
          latestInterviews.map((item: any) => {
            const resume = item?.resume[0]
            const [dateText, dateColor, dateString] = getTimeText(item?.event_time)
            let interviewers = ''
            item?.contribution?.map((contributor: any) => (interviewers += getFullName(contributor) + ', '))
            interviewers = interviewers.substring(0, interviewers.length - 2)

            return (
              <Box
                key={item?._id}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  mb: 6.5
                }}
              >
                <BootstrapTooltip placement='top' title={`Interviewers: ${interviewers}`}>
                  <Avatar
                    src={getImagePath(resume?.avatar)}
                    variant='rounded'
                    sx={{ mr: 3, width: 38, height: 38, cursor: 'pointer' }}
                  />
                </BootstrapTooltip>
                <Box
                  sx={{
                    width: '100%',
                    display: 'flex',
                    flexWrap: 'wrap',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                  }}
                >
                  <Box sx={{ mr: 2, display: 'flex', mb: 0.4, flexDirection: 'column' }}>
                    <Typography variant='body2' sx={{ mb: 0.5, fontWeight: 600, color: 'text.primary' }}>
                      {resume?.fullname}
                    </Typography>
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        '& svg': {
                          mr: 1.5,
                          color: 'text.secondary',
                          verticalAlign: 'middle'
                        }
                      }}
                    >
                      <EventIcon sx={{ fontSize: '1rem' }} />
                      <Typography variant='caption'>{dateString}</Typography>
                    </Box>
                  </Box>
                  <CustomChip
                    skin='light'
                    size='small'
                    label={dateText}
                    color={dateColor as any}
                    sx={{ height: 20, fontSize: '0.75rem', fontWeight: 500 }}
                  />
                </Box>
              </Box>
            )
          })
        ) : (
          <Grid container sx={{ justifyContent: 'center', p: 3 }}>
            <Typography variant='body2'>There Is No Item To Show!</Typography>
          </Grid>
        )}
      </CardContent>
    </Card>
  )
}

export default CrmMeetingSchedule
