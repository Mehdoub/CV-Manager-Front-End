import Grid from '@mui/material/Grid'
import ResumesPerItemsStats from 'src/views/statistics/ResumesPerItemsStats'
import Icon from 'src/@core/components/icon'
import CardStatisticsVertical from 'src/@core/components/card-statistics/card-stats-vertical'
import AnalyticsTotalRevenue from 'src/views/statistics/AnalyticsTotalRevenue'
import AnalyticsOverview from 'src/views/statistics/AnalyticsOverview'
import AnalyticsSessions from 'src/views/statistics/AnalyticsSessions'
import CrmMeetingSchedule from 'src/views/statistics/CrmMeetingSchedule'
import CrmMonthlyBudget from 'src/views/statistics/CrmMonthlyBudget'
import { Skeleton } from '@mui/material'
import { useSelector } from 'react-redux'
import AnalyticsWeeklySales from 'src/views/statistics/AnalyticsWeeklySales'
import { useDispatch } from 'react-redux'
import { useEffect } from 'react'
import { getCompanyStatisticsResumeCountByProjects, getCompanyStatisticsResumeCountFromMonth } from 'src/store/company'
import Skelet from 'src/@core/components/loading/Skelet'
import LinkIcon from '@mui/icons-material/Link'

const CompanyViewOverview = () => {
  const { data: company } = useSelector((state: any) => state.company)
  const { data: statisticsResumeCountByProjects, loading: loadingStatisticsResumeCountByProjects } = useSelector(
    (state: any) => state.companyStatisticsResumeCountByProjects
  )
  const { data: statisticsResumeCountFromMonth, loading: loadingStatisticsResumeCountFromMonth } = useSelector(
    (state: any) => state.companyStatisticsResumeCountFromMonth
  )

  const dispatch = useDispatch()

  useEffect(() => {
    if (company?.id) {
      dispatch(getCompanyStatisticsResumeCountByProjects())
      dispatch(getCompanyStatisticsResumeCountFromMonth())
    }
  }, [company?.id])
  return (
    <Grid container spacing={6} className='match-height'>
      <Grid item xs={12} sm={6} md={6}>
        <Skelet
          loading={loadingStatisticsResumeCountByProjects}
          height={425}
          component={
            <ResumesPerItemsStats
              items={statisticsResumeCountByProjects}
              title="Projects' Resumes Number"
              entity='project'
              nameField='name'
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
      {/* <Grid item xs={12} sm={6} md={6}>
        <Grid container spacing={6}>
          <Grid item xs={6}>
            {loadingStatisticsResumeCountByProjects ? (
              <Skeleton variant='rounded' height={200} />
            ) : (
              <CardStatisticsVertical
                color='info'
                stats='242'
                trendNumber='+62%'
                chipText='Last One Year'
                title='Total Positions'
                icon={<LinkIcon />}
              />
            )}
          </Grid>
          <Grid item xs={6}>
            {loadingStatisticsResumeCountByProjects ? (
              <Skeleton variant='rounded' height={200} />
            ) : (
              <AnalyticsOverview />
            )}
          </Grid>
          <Grid item xs={6}>
            {loadingStatisticsResumeCountByProjects ? (
              <Skeleton variant='rounded' height={200} />
            ) : (
              <AnalyticsTotalRevenue />
            )}
          </Grid>
          <Grid item xs={6}>
            {loadingStatisticsResumeCountByProjects ? (
              <Skeleton variant='rounded' height={200} />
            ) : (
              <AnalyticsSessions />
            )}
          </Grid>
        </Grid>
      </Grid>
      <Grid item xs={12} sm={6} md={6}>
        {loadingStatisticsResumeCountByProjects ? <Skeleton variant='rounded' height={425} /> : <CrmMonthlyBudget />}
      </Grid> */}
    </Grid>
  )
}

export default CompanyViewOverview
