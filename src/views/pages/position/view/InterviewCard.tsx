// ** MUI Imports
import Box, { BoxProps } from '@mui/material/Box'
import Card from '@mui/material/Card'
import Rating from '@mui/material/Rating'
import { styled } from '@mui/material/styles'
import Typography from '@mui/material/Typography'
import CardContent from '@mui/material/CardContent'
import Grid, { GridProps } from '@mui/material/Grid'
import CustomAvatar from 'src/@core/components/mui/avatar'
import Icon from 'src/@core/components/icon'
import { AvatarGroup, Divider, IconButton, Stack } from '@mui/material'
import { getFullName, getImagePath, getTimeText, ratingTextsObj, uppercaseFirstLetters } from 'src/helpers/functions'
import BootstrapTooltip from 'src/@core/components/bootstrap-tooltip'

const fakeUsers = [
  {
    id: 1,
    firstname: 'Aliakbar',
    lastname: 'Rezaei',
    avatar: '/images/avatars/7.png'
  },
  {
    id: 2,
    firstname: 'Mahdi',
    lastname: 'Amereh',
    avatar: '/images/avatars/3.png'
  },
  {
    id: 3,
    firstname: 'Ali',
    lastname: 'Hamzehei',
    avatar: '/images/avatars/5.png'
  },
  {
    id: 4,
    firstname: 'Saeed',
    lastname: 'Esfehani',
    avatar: '/images/avatars/2.png'
  }
]

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

const StyledBox = styled(Box)<BoxProps>(({ theme }) => ({
  [theme.breakpoints.up('sm')]: {
    borderRight: `1px solid ${theme.palette.divider}`
  }
}))

const InterviewCard = ({ interview }: { interview: any }) => {
  const [interviewDateText, interviewColor, interviewDateString] = getTimeText(interview?.event_time, true)

  return (
    <Card>
      <Grid container spacing={6}>
        <StyledGrid1 item xs={12} lg={9}>
          <Box sx={{ p: 6, mb: 2, display: 'flex', flexWrap: 'wrap', alignItems: 'center' }}>
            <Rating readOnly value={interview?.rating ?? 0} name='read-only' sx={{ mr: 2 }} />
            <Typography variant='body2'>
              {interview?.rating ?? 0} Star(s) | {ratingTextsObj[interview?.rating ?? 0]}
            </Typography>
          </Box>
          <Typography px={6} variant='body2'>
            {interview?.description}
          </Typography>
          <Divider sx={{ my: theme => `${theme.spacing(7)} !important`, ml: 4, width: '100%' }} />
          <Grid container spacing={4} p={5}>
            <Grid item xs={12} sm={5}>
              <StyledBox>
                <Box
                  sx={{
                    py: 1.25,
                    mb: 4,
                    display: 'flex',
                    alignItems: 'center',
                    '& svg': { color: 'primary.main', mr: 2.5 }
                  }}
                >
                  <Icon icon='heroicons-outline:status-online' fontSize={20} />
                  <Typography variant='body2'>{uppercaseFirstLetters(interview?.event_type)}</Typography>
                </Box>
                <Box
                  sx={{
                    py: 1.25,
                    display: 'flex',
                    alignItems: 'center',
                    '& svg': { color: 'primary.main', mr: 2.5 }
                  }}
                >
                  <Icon icon='mdi:account-outline' fontSize={20} />
                  <Typography variant='body2'>{uppercaseFirstLetters(interview?.type)}</Typography>
                </Box>
              </StyledBox>
            </Grid>
            <Grid item xs={12} sm={7}>
              <Box
                sx={{
                  py: 1.25,
                  mb: 4,
                  display: 'flex',
                  alignItems: 'center',
                  '& svg': { color: 'primary.main', mr: 2.5 }
                }}
              >
                <Icon icon='material-symbols:pending-outline' fontSize={20} />
                <Typography variant='body2'>{uppercaseFirstLetters(interview?.status)}</Typography>
              </Box>
              {interview?.result && (
                <Box
                  sx={{ py: 1.25, display: 'flex', alignItems: 'center', '& svg': { color: 'primary.main', mr: 2.5 } }}
                >
                  <Icon icon='mdi:account-tick' fontSize={20} />
                  <Typography variant='body2'>{uppercaseFirstLetters(interview?.result)}</Typography>
                </Box>
              )}
            </Grid>
          </Grid>
        </StyledGrid1>
        <StyledGrid2
          item
          xs={12}
          lg={3}
          sx={{ flexDirection: 'column', justifyContent: 'start', pb: '24px', pr: '20px' }}
        >
          <Grid sx={{ display: 'flex', justifyContent: 'end', width: '100%' }}>
            <IconButton>
              <Icon icon='material-symbols:more-vert' />
            </IconButton>
          </Grid>
          <CardContent sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <BootstrapTooltip placement='top' title={interviewDateString}>
              <Stack direction='column' sx={{ display: 'flex', alignItems: 'center' }}>
                <CustomAvatar
                  color={interviewColor as any}
                  variant='rounded'
                  skin='light'
                  sx={{ width: 100, height: 100, mb: 2 }}
                >
                  <Icon
                    className={interviewDateText == 'right now' ? 'blinking' : ''}
                    icon='mdi:alarm-clock'
                    fontSize='3rem'
                  />
                </CustomAvatar>
                <Typography fontWeight={200} fontSize={14}>
                  {uppercaseFirstLetters(interviewDateText)}
                </Typography>
              </Stack>
            </BootstrapTooltip>
          </CardContent>
          <AvatarGroup className='pull-up'>
            {interview?.contribution?.map((item: any, index: any) => (
              <BootstrapTooltip key={'interview-contribution-' + index} title={getFullName(item)} placement='top'>
                <CustomAvatar src={getImagePath(item?.avatar)} sx={{ height: 30, width: 30 }} />
              </BootstrapTooltip>
            ))}
          </AvatarGroup>
        </StyledGrid2>
      </Grid>
    </Card>
  )
}

export default InterviewCard
