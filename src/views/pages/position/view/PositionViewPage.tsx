// ** MUI Imports
import Grid from '@mui/material/Grid'

// ** Demo Components Imports
import PositionViewRight from 'src/views/pages/position/view/PositionViewRight'
import CardStatisticsVertical from 'src/@core/components/card-statistics/card-stats-vertical'
import CrmTotalGrowth from 'src/views/statistics/CrmTotalGrowth'
import CrmTotalProfit from 'src/views/statistics/CrmTotalProfit'
import Icon from 'src/@core/components/icon'
import CrmAward from 'src/views/statistics/CrmAward'
import ApexChartWrapper from 'src/@core/styles/libs/react-apexcharts'
import { Skeleton } from '@mui/material'
import { useSelector } from 'react-redux'
import PersonSearchIcon from '@mui/icons-material/PersonSearch'
import PersonOffIcon from '@mui/icons-material/PersonOff'
import TaskIcon from '@mui/icons-material/Task'

const fakeData = [
  {
    count: 20,
    state: 'Hired'
  },
  {
    count: 30,
    state: 'Rejected'
  },
  {
    count: 25,
    state: 'Pending'
  }
]

type Props = {
  tab: string
  positionId: string
}

const PositionViewPage = ({ tab, positionId }: Props) => {
  const { loading: statisticsResumeByStatesLoading, data: statisticsResumeByStates } = useSelector(
    (state: any) => state.companyStatisticsResumeByStates
  )
  const { loading: statisticsResumeStatesInLastMonthLoading, data: statisticsResumeStatesInLastMonth }: any =
    useSelector((state: any) => state.companyStatisticsResumeStatesInLastMonth)

  return (
    <ApexChartWrapper>
      <Grid container spacing={6}>
        {tab !== 'resume' && (
          <Grid item container spacing={6} className='match-height'>
            <Grid item xs={6} sm={3} md={4}>
              {statisticsResumeByStatesLoading ? <Skeleton variant='rounded' height={200} /> : <CrmAward />}
            </Grid>
            <Grid item xs={6} sm={3} md={2}>
              {statisticsResumeStatesInLastMonthLoading ? (
                <Skeleton variant='rounded' height={200} />
              ) : (
                <CardStatisticsVertical
                  stats='20'
                  color='primary'
                  trendNumber='35%'
                  title='Total Received Resumes'
                  chipText='Last Month'
                  icon={<PersonSearchIcon />}
                  statsData={statisticsResumeStatesInLastMonth}
                  type='received'
                />
              )}
            </Grid>
            <Grid item xs={6} sm={3} md={2}>
              {statisticsResumeStatesInLastMonthLoading ? (
                <Skeleton variant='rounded' height={200} />
              ) : (
                <CardStatisticsVertical
                  stats='26'
                  color='error'
                  trendNumber='40%'
                  title='Rejected Resumes'
                  chipText='Last Month'
                  icon={<PersonOffIcon />}
                  statsData={statisticsResumeStatesInLastMonth}
                  type='rejected'
                />
              )}
            </Grid>
            <Grid item xs={6} sm={3} md={2}>
              {statisticsResumeStatesInLastMonthLoading ? (
                <Skeleton variant='rounded' height={200} />
              ) : (
                <CardStatisticsVertical
                  stats='12'
                  color='success'
                  trendNumber='18%'
                  title='Hired Resumes'
                  chipText='Last Month'
                  icon={<TaskIcon />}
                  statsData={statisticsResumeStatesInLastMonth}
                  type='hired'
                />
              )}
            </Grid>
            <Grid item xs={6} sm={3} md={2}>
              {statisticsResumeByStatesLoading ? (
                <Skeleton variant='rounded' height={200} />
              ) : (
                <CrmTotalGrowth statsData={fakeData} />
              )}
            </Grid>
          </Grid>
        )}

        <Grid item xs={12} md={12} lg={12}>
          <PositionViewRight tab={tab} positionId={positionId} />
        </Grid>
      </Grid>
    </ApexChartWrapper>
  )
}

export default PositionViewPage
