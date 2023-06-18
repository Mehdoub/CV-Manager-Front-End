// ** MUI Imports
import Grid from '@mui/material/Grid'

// ** Demo Components Imports
import PositionViewRight from 'src/views/pages/position/view/PositionViewRight'
import CardStatisticsVertical from 'src/@core/components/card-statistics/card-stats-vertical'
import CrmTotalGrowth from 'src/views/statistics/CrmTotalGrowth'
import CrmAward from 'src/views/statistics/CrmAward'
import ApexChartWrapper from 'src/@core/styles/libs/react-apexcharts'
import { Skeleton } from '@mui/material'
import { useSelector } from 'react-redux'
import PersonSearchIcon from '@mui/icons-material/PersonSearch'
import PersonOffIcon from '@mui/icons-material/PersonOff'
import TaskIcon from '@mui/icons-material/Task'
import { useDispatch } from 'react-redux'
import { useEffect } from 'react'
import {
  getPositionLatestInterviews,
  getPositionStatisticsResumeByStates,
  getPositionStatisticsResumeStatesInLastMonth
} from 'src/store/position'
import { useRouter } from 'next/router'

const PositionViewPage = () => {
  const dispatch = useDispatch()

  const {
    query: { tab }
  } = useRouter()

  const { data: position } = useSelector((state: any) => state.position)
  const { loading: statisticsResumeByStatesLoading, data: statisticsResumeByStates } = useSelector(
    (state: any) => state.positionStatisticsResumeByStates
  )
  const { loading: statisticsResumeStatesInLastMonthLoading, data: statisticsResumeStatesInLastMonth }: any =
    useSelector((state: any) => state.positionStatisticsResumeStatesInLastMonth)

  useEffect(() => {
    if (position?.id) {
      dispatch(getPositionStatisticsResumeByStates(position.id))
      dispatch(getPositionStatisticsResumeStatesInLastMonth(position.id))
      dispatch(getPositionLatestInterviews(position.id))
    }
  }, [position?.id])

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
                  stats='0'
                  color='primary'
                  trendNumber='0%'
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
                  stats='0'
                  color='error'
                  trendNumber='0%'
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
                  stats='0'
                  color='success'
                  trendNumber='0%'
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
                <CrmTotalGrowth statsData={statisticsResumeByStates} />
              )}
            </Grid>
          </Grid>
        )}

        <Grid item xs={12} md={12} lg={12}>
          <PositionViewRight />
        </Grid>
      </Grid>
    </ApexChartWrapper>
  )
}

export default PositionViewPage
