import Grid from '@mui/material/Grid'
import ResumesPerItemsStats from 'src/views/statistics/ResumesPerItemsStats'
import Skelet from 'src/@core/components/loading/Skelet'
import { useSelector } from 'react-redux'
import AnalyticsWeeklySales from 'src/views/statistics/AnalyticsWeeklySales'
import { useDispatch } from 'react-redux'
import { useEffect } from 'react'
import { getProjectStatisticsResumeCountByPositions, getProjectStatisticsResumeCountFromMonth } from 'src/store/project'


const ProjectViewOverview = () => {
  const { data: project } = useSelector((state: any) => state.project)
  const { data: statisticsResumeCountByPositions, loading: loadingStatisticsResumeCountByPositions } = useSelector(
    (state: any) => state.projectStatisticsResumeCountByPositions
  )
  const { data: statisticsResumeCountFromMonth, loading: loadingStatisticsResumeCountFromMonth } = useSelector(
    (state: any) => state.projectStatisticsResumeCountFromMonth
  )

  const dispatch = useDispatch()

  useEffect(() => {
    if (project?.id) {
      dispatch(getProjectStatisticsResumeCountByPositions(project?.id))
      dispatch(getProjectStatisticsResumeCountFromMonth(project?.id))
    }
  }, [project?.id])

  return (
    <Grid container spacing={6} className='match-height'>
      <Grid item xs={12} sm={6} md={6}>
        <Skelet
          loading={loadingStatisticsResumeCountByPositions}
          height={425}
          component={
            <ResumesPerItemsStats
              items={statisticsResumeCountByPositions}
              title="Positions' Resumes Number"
              entity='position'
              nameField='title'
            />
          }
        />
      </Grid>
      <Grid item xs={12} sm={6} md={6}>
        <Skelet
          loading={loadingStatisticsResumeCountFromMonth}
          height={425}
          component={<AnalyticsWeeklySales statisticsResumeCountFromMonth={statisticsResumeCountFromMonth} />}
        />
      </Grid>
    </Grid>
  )
}

export default ProjectViewOverview
