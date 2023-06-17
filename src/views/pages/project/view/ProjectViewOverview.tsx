import Grid from '@mui/material/Grid'
import ResumesPerItemsStats from 'src/views/statistics/ResumesPerItemsStats'
import Icon from 'src/@core/components/icon'
import CardStatisticsVertical from 'src/@core/components/card-statistics/card-stats-vertical'
import AnalyticsTotalRevenue from 'src/views/statistics/AnalyticsTotalRevenue'
import AnalyticsOverview from 'src/views/statistics/AnalyticsOverview'
import AnalyticsSessions from 'src/views/statistics/AnalyticsSessions'
import CrmMeetingSchedule from 'src/views/statistics/CrmMeetingSchedule'
import CrmMonthlyBudget from 'src/views/statistics/CrmMonthlyBudget'
import Skelet from 'src/@core/components/loading/Skelet'
import { useSelector } from 'react-redux'
import AnalyticsWeeklySales from 'src/views/statistics/AnalyticsWeeklySales'
import { useDispatch } from 'react-redux'
import { useEffect } from 'react'
import { getProjectStatisticsResumeCountByPositions, getProjectStatisticsResumeCountFromMonth } from 'src/store/project'

const fakeData = [
  {
    count: 14,
    project: {
      name: 'Front-end'
    }
  },
  {
    count: 36,
    project: {
      name: 'Back-end'
    }
  },
  {
    count: 24,
    project: {
      name: 'UI/UX'
    }
  }
]

const fakeMonthlyData = {
  data: {
    '01-2023': 22,
    '02-2023': 19,
    '03-2023': 28,
    '04-2023': 65,
    '05-2023': 52,
    '06-2023': 38,
    '07-2023': 32
  }
}

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
