// ** MUI Imports
import Grid from '@mui/material/Grid'

// ** Types
// import { InvoiceType } from 'src/types/apps/invoiceTypes'

// ** Demo Components Imports
import CompanyViewLeft from 'src/views/pages/company/view/CompanyViewLeft'
import CompanyViewRight from 'src/views/pages/company/view/CompanyViewRight'
import CardStatisticsVertical from 'src/@core/components/card-statistics/card-stats-vertical'
import CrmTotalGrowth from 'src/views/statistics/CrmTotalGrowth'
import CrmTotalProfit from 'src/views/statistics/CrmTotalProfit'
import ApexChartWrapper from 'src/@core/styles/libs/react-apexcharts'
import CardStatisticsHorizontal from 'src/@core/components/card-statistics/card-stats-horizontal'

import Icon from 'src/@core/components/icon'

type Props = {
  tab: string
  invoiceData: any
}

const CompanyView = ({ tab, invoiceData }: Props) => {
  return (
    <ApexChartWrapper>
      <Grid container spacing={6}>
        <Grid item container spacing={6}>
          <Grid item xs={6} sm={3} md={4}>
            {/* <Grid item md={12}>
              <CardStatisticsHorizontal
                {...{
                  color: 'info',
                  stats: '2,450k',
                  trend: 'negative',
                  icon: 'mdi:trending-up',
                  trendNumber: '24.6%',
                  title: 'New Transactions'
                }}
                icon={<Icon icon='mdi:trending-up' />}
              />
            </Grid>
            <Grid item md={12} sx={{marginTop: '40px'}}>
              <CardStatisticsHorizontal
                {...{
                  color: 'info',
                  stats: '2,450k',
                  trend: 'negative',
                  icon: 'mdi:trending-up',
                  trendNumber: '24.6%',
                  title: 'New Transactions'
                }}
                icon={<Icon icon='mdi:trending-up' />}
              />
            </Grid> */}
          </Grid>
          <Grid item xs={6} sm={3} md={2}>
            <CardStatisticsVertical
              stats='155k'
              color='primary'
              trendNumber='+22%'
              title='Total Orders'
              chipText='Last 4 Month'
              icon={<Icon icon='mdi:cart-plus' />}
            />
          </Grid>
          <Grid item xs={6} sm={3} md={2}>
            <CardStatisticsVertical
              stats='$13.4k'
              color='success'
              trendNumber='+38%'
              title='Total Sales'
              chipText='Last Six Month'
              icon={<Icon icon='mdi:currency-usd' />}
            />
          </Grid>
          <Grid item xs={6} sm={3} md={2}>
            <CrmTotalProfit />
          </Grid>
          <Grid item xs={6} sm={3} md={2}>
            <CrmTotalGrowth />
          </Grid>
        </Grid>
        <Grid item xs={12} md={5} lg={4}>
          <CompanyViewLeft />
        </Grid>
        <Grid item xs={12} md={7} lg={8}>
          <CompanyViewRight tab={tab} invoiceData={invoiceData} />
        </Grid>
      </Grid>
    </ApexChartWrapper>
  )
}

export default CompanyView
