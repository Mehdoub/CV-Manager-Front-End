// ** MUI Imports
import Grid from '@mui/material/Grid'

// ** Types
// import { InvoiceType } from 'src/types/apps/invoiceTypes'

// ** Demo Components Imports
import CompanyViewLeft from 'src/views/pages/company/view/CompanyViewLeft'
import CompanyViewRight from 'src/views/pages/company/view/CompanyViewRight'
import CardStatisticsHorizontal from 'src/@core/components/card-statistics/card-stats-horizontal'

import Icon from 'src/@core/components/icon'

type Props = {
  tab: string
  invoiceData: any
}
const apiData = {
  statsHorizontal: [
    {
      color: 'info',
      stats: '2,450k',
      trend: 'negative',
      icon: 'mdi:trending-up',
      trendNumber: '24.6%',
      title: 'New Transactions'
    },
    {
      stats: '$48.2K',
      color: 'success',
      icon: 'mdi:currency-usd',
      trendNumber: '22.5%',
      title: 'Total Revenue'
    },
    {
      icon: 'mdi:poll',
      stats: '$28.5k',
      color: 'warning',
      trendNumber: '18.2%',
      title: 'Total Profit'
    },
    {
      stats: '8,458',
      trendNumber: '8.1%',
      title: 'New Resumes',
      icon: 'mdi:account-outline'
    },
  ],
  statsVertical: [
    {
      stats: '155k',
      color: 'primary',
      icon: 'mdi:cart-plus',
      trendNumber: '+22%',
      title: 'Total Orders',
      chipText: 'Last 4 Month'
    },
    {
      stats: '$89.34k',
      color: 'warning',
      trend: 'negative',
      trendNumber: '-18%',
      title: 'Total Profit',
      icon: 'mdi:wallet-giftcard',
      chipText: 'Last One Year'
    },
    {
      icon: 'mdi:link',
      color: 'info',
      stats: '142.8k',
      trendNumber: '+62%',
      chipText: 'Last One Year',
      title: 'Total Impression'
    },
    {
      stats: '$13.4k',
      color: 'success',
      trendNumber: '+38%',
      icon: 'mdi:currency-usd',
      title: 'Total Sales',
      chipText: 'Last Six Months'
    },
    {
      color: 'error',
      stats: '$8.16k',
      trend: 'negative',
      trendNumber: '-16%',
      title: 'Total Expenses',
      icon: 'mdi:briefcase-outline',
      chipText: 'Last One Month'
    },
    {
      stats: '$2.55k',
      color: 'secondary',
      icon: 'mdi:trending-up',
      trendNumber: '+46%',
      title: 'Transactions',
      chipText: 'Last One Year'
    }
  ],
  statsCharacter: [
    {
      stats: '8.14k',
      title: 'Ratings',
      chipColor: 'primary',
      trendNumber: '+15.6%',
      chipText: 'Year of 2022',
      src: '/images/cards/card-stats-img-1.png'
    },
    {
      stats: '12.2k',
      trend: 'negative',
      title: 'Sessions',
      chipColor: 'success',
      trendNumber: '-25.5%',
      chipText: 'Last Month',
      src: '/images/cards/card-stats-img-2.png'
    },
    {
      stats: '42.4k',
      title: 'Customers',
      chipColor: 'warning',
      trendNumber: '+9.2%',
      chipText: 'Daily Customers',
      src: '/images/cards/card-stats-img-3.png'
    },
    {
      stats: '4.25k',
      trendNumber: '+10.8%',
      chipColor: 'secondary',
      title: 'Total Orders',
      chipText: 'Last Week',
      src: '/images/cards/card-stats-img-4.png'
    }
  ]
}

const CompanyView = ({ tab, invoiceData }: Props) => {
  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        {apiData && (
          <Grid container spacing={6}>
            {apiData.statsHorizontal.map((item: any, index: number) => {
              return (
                <Grid item xs={12} md={3} sm={6} key={index}>
                  <CardStatisticsHorizontal {...item} icon={<Icon icon={item.icon as string} />} />
                </Grid>
              )
            })}
          </Grid>
        )}
      </Grid>
      <Grid item xs={12} md={5} lg={4}>
        <CompanyViewLeft />
      </Grid>
      <Grid item xs={12} md={7} lg={8}>
        <CompanyViewRight tab={tab} invoiceData={invoiceData} />
      </Grid>
    </Grid>
  )
}

export default CompanyView
