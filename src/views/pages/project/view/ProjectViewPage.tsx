// ** MUI Imports
import Grid from '@mui/material/Grid'

// ** Demo Components Imports
import ProjectViewLeft from 'src/views/pages/project/view/ProjectViewLeft'
import ProjectViewRight from 'src/views/pages/project/view/ProjectViewRight'
import CardStatisticsVertical from 'src/@core/components/card-statistics/card-stats-vertical'
import CrmTotalGrowth from 'src/views/statistics/CrmTotalGrowth'
import CrmTotalProfit from 'src/views/statistics/CrmTotalProfit'
import Icon from 'src/@core/components/icon'
import CrmAward from 'src/views/statistics/CrmAward'
import ApexChartWrapper from 'src/@core/styles/libs/react-apexcharts'
import { useSelector } from 'react-redux'
import { Skeleton } from '@mui/material'
import PersonSearchIcon from '@mui/icons-material/PersonSearch'
import PersonOffIcon from '@mui/icons-material/PersonOff'
import TaskIcon from '@mui/icons-material/Task'

type Props = {
  tab: string
  projectId: string
}

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

const ProjectView = ({ tab, projectId }: Props) => {
  const { loading: statisticsResumeByStatesLoading, data: statisticsResumeByStates } = useSelector(
    (state: any) => state.companyStatisticsResumeByStates
  )
  const { loading: statisticsResumeStatesInLastMonthLoading, data: statisticsResumeStatesInLastMonth }: any =
    useSelector((state: any) => state.companyStatisticsResumeStatesInLastMonth)

  return (
    <ApexChartWrapper>
      <Grid container spacing={6}>
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
        <Grid item xs={12} md={5} lg={4}>
          <ProjectViewLeft projectId={projectId} />
        </Grid>
        <Grid item xs={12} md={7} lg={8}>
          <ProjectViewRight tab={tab} projectId={projectId} />
        </Grid>
      </Grid>
    </ApexChartWrapper>
  )
}

export default ProjectView
