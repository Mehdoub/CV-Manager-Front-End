// ** MUI Imports
import Grid from '@mui/material/Grid'

// ** Demo Components Imports
import CompanyViewLeft from 'src/views/pages/company/view/CompanyViewLeft'
import CompanyViewRight from 'src/views/pages/company/view/CompanyViewRight'
import CardStatisticsVertical from 'src/@core/components/card-statistics/card-stats-vertical'
import CrmTotalGrowth from 'src/views/statistics/CrmTotalGrowth'
import Icon from 'src/@core/components/icon'
import CrmAward from 'src/views/statistics/CrmAward'
import ApexChartWrapper from 'src/@core/styles/libs/react-apexcharts'
import { useSelector } from 'react-redux'
import { Skeleton } from '@mui/material'
import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { getCompanyResumeStatistics } from 'src/store/company'

type Props = {
  tab: string
  companyId: string
}

const CompanyView = ({ tab, companyId }: Props) => {
  const dispatch = useDispatch()

  const { data: company } = useSelector((state: any) => state.company)
  const { loading: resumeStatisticsLoading, data: resumeStatistics } = useSelector((state: any) => state.companyStatisticsResumes)

  useEffect(() => {
    if (company?.id) dispatch(getCompanyResumeStatistics())
  }, [company?.id])

  return (
    <ApexChartWrapper>
      <Grid container spacing={6}>
        <Grid item container spacing={6} className='match-height'>
          <Grid item xs={6} sm={3} md={4}>
            {resumeStatisticsLoading ? <Skeleton variant='rounded' height={200} /> : <CrmAward />}
          </Grid>
          <Grid item xs={6} sm={3} md={2}>
            {resumeStatisticsLoading ? (
              <Skeleton variant='rounded' height={200} />
            ) : (
              <CardStatisticsVertical
                stats='924'
                color='primary'
                trendNumber='+73%'
                title='Total Received Resumes'
                chipText='Last Month'
                icon={<Icon icon='material-symbols:quick-reference-all-outline-rounded' />}
                statsData={resumeStatistics?.resume_state_in_last_month}
                type='received'
              />
            )}
          </Grid>
          <Grid item xs={6} sm={3} md={2}>
            {resumeStatisticsLoading ? (
              <Skeleton variant='rounded' height={200} />
            ) : (
              <CardStatisticsVertical
                stats='568'
                color='error'
                trendNumber='+38%'
                title='Rejected Resumes'
                chipText='Last Month'
                icon={<Icon icon='mdi:account-cancel' />}
                statsData={resumeStatistics?.resume_state_in_last_month}
                type='rejected'
              />
            )}
          </Grid>
          <Grid item xs={6} sm={3} md={2}>
            {resumeStatisticsLoading ? (
              <Skeleton variant='rounded' height={200} />
            ) : (
              <CardStatisticsVertical
                stats='142'
                color='success'
                trendNumber='+22%'
                title='Hired Resumes'
                chipText='Last Month'
                icon={<Icon icon='mdi:user-check' />}
                statsData={resumeStatistics?.resume_state_in_last_month}
                type='hired'
              />
            )}
          </Grid>
          <Grid item xs={6} sm={3} md={2}>
            {resumeStatisticsLoading ? <Skeleton variant='rounded' height={200} /> : <CrmTotalGrowth statsData={resumeStatistics?.total_resume_by_states} />}
          </Grid>
        </Grid>
        <Grid item xs={12} md={5} lg={4}>
          <CompanyViewLeft companyId={companyId} />
        </Grid>
        <Grid item xs={12} md={7} lg={8}>
          <CompanyViewRight tab={tab} companyId={companyId} />
        </Grid>
      </Grid>
    </ApexChartWrapper>
  )
}

export default CompanyView
