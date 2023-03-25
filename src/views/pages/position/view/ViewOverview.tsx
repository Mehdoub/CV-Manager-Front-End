import Grid from '@mui/material/Grid'
import ResumesPerProjectsStats from 'src/views/statistics/ResumesPerProjectsStats'
import Icon from 'src/@core/components/icon'
import CardStatisticsVertical from 'src/@core/components/card-statistics/card-stats-vertical'
import AnalyticsTotalRevenue from 'src/views/statistics/AnalyticsTotalRevenue'
import AnalyticsOverview from 'src/views/statistics/AnalyticsOverview'
import AnalyticsSessions from 'src/views/statistics/AnalyticsSessions'
import CrmMeetingSchedule from 'src/views/statistics/CrmMeetingSchedule'
import CrmMonthlyBudget from 'src/views/statistics/CrmMonthlyBudget'
import PositionViewLeft from 'src/views/pages/position/view/PositionViewLeft'

const ViewOverview = ({ positionId }: { positionId: string }) => {
  return (
    <>
      <Grid container spacing={6}>
        <Grid item xs={4} md={4} lg={4}>
          <PositionViewLeft positionId={positionId} />
        </Grid>
        <Grid container item xs={8} md={8} lg={8} spacing={6}>
          <Grid item xs={12} sm={6} md={6}>
            <CrmMeetingSchedule />
          </Grid>
          <Grid item xs={12} sm={6} md={6}>
            <Grid container spacing={6}>
              <Grid item xs={6}>
                <AnalyticsTotalRevenue />
              </Grid>
              <Grid item xs={6}>
                <AnalyticsSessions />
              </Grid>
              <Grid item xs={6}>
                <CardStatisticsVertical
                  color='info'
                  stats='142.8k'
                  trendNumber='+62%'
                  chipText='Last One Year'
                  title='Total Impressions'
                  icon={<Icon icon='mdi:link' />}
                />
              </Grid>
              <Grid item xs={6}>
                <AnalyticsOverview />
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={12} sm={6} md={6}>
            <CrmMonthlyBudget />
          </Grid>
        </Grid>
      </Grid>
    </>
  )
}

export default ViewOverview
