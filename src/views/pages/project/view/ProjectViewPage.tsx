// ** MUI Imports
import Grid from '@mui/material/Grid'

// ** Demo Components Imports
import ProjectViewLeft from 'src/views/pages/project/view/ProjectViewLeft'
import ProjectViewRight from 'src/views/pages/project/view/ProjectViewRight'
import CardStatisticsVertical from 'src/@core/components/card-statistics/card-stats-vertical'
import CrmTotalGrowth from 'src/views/statistics/CrmTotalGrowth'
import CrmAward from 'src/views/statistics/CrmAward'
import ApexChartWrapper from 'src/@core/styles/libs/react-apexcharts'
import { useSelector } from 'react-redux'
import { Skeleton } from '@mui/material'
import PersonSearchIcon from '@mui/icons-material/PersonSearch'
import PersonOffIcon from '@mui/icons-material/PersonOff'
import TaskIcon from '@mui/icons-material/Task'
import { useDispatch } from 'react-redux'
import { useEffect } from 'react'
import { getProjectStatisticsResumeByStates, getProjectStatisticsResumeStatesInLastMonth } from 'src/store/project'

const ProjectView = () => {
  const dispatch = useDispatch()

  const { data: project } = useSelector((state: any) => state.project)
  const { loading: statisticsResumeByStatesLoading, data: statisticsResumeByStates } = useSelector(
    (state: any) => state.projectStatisticsResumeByStates
  )
  const { loading: statisticsResumeStatesInLastMonthLoading, data: statisticsResumeStatesInLastMonth }: any =
    useSelector((state: any) => state.projectStatisticsResumeStatesInLastMonth)

  useEffect(() => {
    if (project?.id) {
      dispatch(getProjectStatisticsResumeByStates(project.id))
      dispatch(getProjectStatisticsResumeStatesInLastMonth(project.id))
    }
  }, [project?.id])

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
        <Grid item xs={12} md={5} lg={4}>
          <ProjectViewLeft />
        </Grid>
        <Grid item xs={12} md={7} lg={8}>
          <ProjectViewRight />
        </Grid>
      </Grid>
    </ApexChartWrapper>
  )
}

export default ProjectView
