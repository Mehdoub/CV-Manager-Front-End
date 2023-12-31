// ** MUI Imports
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import Typography from '@mui/material/Typography'
import CardContent from '@mui/material/CardContent'

// ** Custom Components Imports
import CustomChip from 'src/@core/components/mui/chip'
import CustomAvatar from 'src/@core/components/mui/avatar'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Types Imports
import { CardStatsVerticalProps } from 'src/@core/components/card-statistics/types'

const CardStatsVertical = (props: CardStatsVerticalProps) => {
  // ** Props
  let { title, color, icon, stats, chipText, trendNumber, trend = 'positive', type, statsData } = props

  if (statsData && type && statsData[type]) {
    const lastMonth = statsData[type][0]['last_month'][0]?.count ?? 0 as number
    const recentMonth = statsData[type][0]['resent_month'][0]?.count ?? 0 as number
    stats = recentMonth + lastMonth as number
    const growthDiff = recentMonth - lastMonth
    trend = growthDiff < 0 ? 'negative' : 'positive'
    trendNumber = Math.ceil((growthDiff / (stats > 0 ? stats : 1)) * 100)
    trendNumber = String(trendNumber) + '%'
  }

  return (
    <Card>
      <CardContent sx={{ display: 'flex', flexDirection: 'column' }}>
        <Box sx={{ mb: 6, width: '100%', display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
          <CustomAvatar skin='light' variant='rounded' color={color}>
            {icon}
          </CustomAvatar>
          <Box
            sx={{ display: 'flex', alignItems: 'center', color: trend === 'positive' ? 'success.main' : 'error.main' }}
          >
            <Typography variant='subtitle2' sx={{ color: trend === 'positive' ? 'success.main' : 'error.main' }}>
              {trendNumber}
            </Typography>
            <Icon icon={trend === 'positive' ? 'mdi:chevron-up' : 'mdi:chevron-down'} fontSize='1.25rem' />
          </Box>
        </Box>
        <Typography variant='h6' sx={{ mb: 1 }}>
          {stats}
        </Typography>
        <Typography variant='body2' sx={{ mb: 5 }}>
          {title}
        </Typography>
        <CustomChip
          skin='light'
          size='small'
          label={chipText}
          color='secondary'
          sx={{ height: 20, fontWeight: 500, fontSize: '0.75rem', alignSelf: 'flex-start', color: 'text.secondary' }}
        />
      </CardContent>
    </Card>
  )
}

export default CardStatsVertical
