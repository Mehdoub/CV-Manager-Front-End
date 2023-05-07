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
import { getTimeText, ratingTextsObj, showDate, uppercaseFirstLetters } from 'src/helpers/functions'
import BootstrapTooltip from 'src/@core/components/bootstrap-tooltip'

const callHostoryResultIcons: any = {
  rejected: {
    icon: 'solar:call-cancel-linear',
    color: 'error'
  },
  answered: {
    icon: 'charm:circle-tick',
    color: 'success'
  },
  busy: { icon: 'ic:baseline-call-missed-outgoing', color: 'warning' },
  'wrong-number': { icon: 'material-symbols:call-quality', color: 'secondary' },
  recall: { icon: 'material-symbols:restart-alt', color: 'primary' }
}

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

const CallHistoryCard = ({ callHistory }: { callHistory: any }) => {
  const [callingDateText, callingColor, callingDateString] = getTimeText(callHistory?.calling_date)
  const [recallDateText, recallColor, recallDateString] =
    callHistory?.recall_at?.length > 0 ? getTimeText(callHistory?.recall_at) : ['', '', '']
  return (
    <Card
    // sx={{ backgroundColor: '#4c4e640d' }}
    >
      <Grid container spacing={6}>
        <StyledGrid1 item xs={12} lg={9}>
          <CardContent>
            <Box sx={{ py: 1, mb: 2, display: 'flex', flexWrap: 'wrap', alignItems: 'center' }}>
              <Rating readOnly value={callHistory?.rating ?? 0} name='read-only' sx={{ mr: 2 }} />
              <Typography variant='body2'>
                {callHistory?.rating ?? 0} Star | {ratingTextsObj[callHistory?.rating ?? 0]}!
              </Typography>
            </Box>
            <Typography variant='body2'>{callHistory?.description}</Typography>
            {callHistory?.recall_at?.length > 0 && (
              <Box
                sx={{
                  mt: 14,
                  display: 'flex',
                  alignItems: 'center',
                  '&:not(:last-of-type)': { mb: 4 },
                  '& svg': { color: 'text.primary' }
                }}
              >
                <Icon fontSize={24} icon='mdi:alarm-clock' />

                <Typography fontSize={14} sx={{ fontWeight: 600, mr: 2, ml: 1 }}>
                  Recall Time:
                </Typography>
                <BootstrapTooltip title={recallDateString} placement='top'>
                  <Typography fontSize={14} sx={{ color: recallColor + '.main' }}>
                    {recallDateText}
                  </Typography>
                </BootstrapTooltip>
              </Box>
            )}
          </CardContent>
        </StyledGrid1>
        <StyledGrid2 item xs={12} lg={3}>
          <CardContent sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Stack direction='column' sx={{ display: 'flex', alignItems: 'center' }}>
              <CustomAvatar
                color={callHostoryResultIcons[callHistory?.result].color}
                variant='rounded'
                skin='light'
                sx={{ width: 100, height: 100, mb: 2 }}
              >
                <Icon icon={callHostoryResultIcons[callHistory?.result].icon} fontSize='3rem' />
              </CustomAvatar>
              <Typography>{uppercaseFirstLetters(callHistory?.result)}</Typography>
              <BootstrapTooltip title={callingDateString} placement='top'>
                <Typography fontWeight={200} fontSize={14} sx={{ color: callingColor + '.main' }}>
                  {callingDateText}
                </Typography>
              </BootstrapTooltip>
            </Stack>
          </CardContent>
        </StyledGrid2>
      </Grid>
    </Card>
  )
}

export default CallHistoryCard
