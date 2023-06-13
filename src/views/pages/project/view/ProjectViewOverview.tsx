import Grid from '@mui/material/Grid'
import ResumesPerProjectsStats from 'src/views/statistics/ResumesPerProjectsStats'
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
  const { data: statisticsResumeCountByProjects, loading: loadingStatisticsResumeCountByProjects } = useSelector(
    (state: any) => state.companyStatisticsResumeCountByProjects
  )
  const { data: statisticsResumeCountFromMonth, loading: loadingStatisticsResumeCountFromMonth } = useSelector(
    (state: any) => state.companyStatisticsResumeCountFromMonth
  )

  return (
    <Grid container spacing={6} className='match-height'>
      <Grid item xs={12} sm={6} md={6}>
        <Skelet
          loading={loadingStatisticsResumeCountByProjects}
          height={425}
          component={<ResumesPerProjectsStats projects={fakeData} title="Positions' Resumes Number" />}
        />
      </Grid>
      <Grid item xs={12} sm={6} md={6}>
        <Skelet
          loading={loadingStatisticsResumeCountFromMonth}
          height={425}
          component={<AnalyticsWeeklySales statisticsResumeCountFromMonth={fakeMonthlyData} />}
        />
      </Grid>
    </Grid>
  )
}

export default ProjectViewOverview
