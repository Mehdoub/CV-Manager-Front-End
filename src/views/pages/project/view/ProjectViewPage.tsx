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

type Props = {
  tab: string
  projectId: string
}

const ProjectView = ({ tab, projectId }: Props) => {
  return (
    <ApexChartWrapper>
      <Grid container spacing={6}>
        <Grid item container spacing={6}>
          <Grid item xs={6} sm={3} md={4}>
            <CrmAward />
          </Grid>
          <Grid item xs={6} sm={3} md={2}>
            <CardStatisticsVertical
              stats='155k'
              color='primary'
              trendNumber='+22%'
              title='Total Orders'
              chipText='Last 4 Month'
              icon={<Icon icon='mdi:cart-plus' />}
            />
          </Grid>
          <Grid item xs={6} sm={3} md={2}>
            <CardStatisticsVertical
              stats='$13.4k'
              color='success'
              trendNumber='+38%'
              title='Total Sales'
              chipText='Last Six Month'
              icon={<Icon icon='mdi:currency-usd' />}
            />
          </Grid>
          <Grid item xs={6} sm={3} md={2}>
            <CrmTotalProfit />
          </Grid>
          <Grid item xs={6} sm={3} md={2}>
            <CrmTotalGrowth />
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
