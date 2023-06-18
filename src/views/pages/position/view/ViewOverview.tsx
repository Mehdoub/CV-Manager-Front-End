import Grid from '@mui/material/Grid'
import CrmMeetingSchedule from 'src/views/statistics/CrmMeetingSchedule'
import PositionViewLeft from 'src/views/pages/position/view/PositionViewLeft'
import Skelet from 'src/@core/components/loading/Skelet'
import AnalyticsWeeklySales from 'src/views/statistics/AnalyticsWeeklySales'
import { useSelector } from 'react-redux'
import { useDispatch } from 'react-redux'
import { useEffect } from 'react'
import { getPositionStatisticsResumeCountFromMonth } from 'src/store/position'

const ViewOverview = () => {
  const { data: position } = useSelector((state: any) => state.position)

  const { data: statisticsResumeCountFromMonth, loading: loadingStatisticsResumeCountFromMonth } = useSelector(
    (state: any) => state.positionStatisticsResumeCountFromMonth
  )

  const dispatch = useDispatch()

  useEffect(() => {
    if (position?.id) {
      dispatch(getPositionStatisticsResumeCountFromMonth(position?.id))
    }
  }, [position?.id])
  return (
    <>
      <Grid container spacing={6}>
        <Grid item xs={4} md={4} lg={4}>
          <PositionViewLeft />
        </Grid>
        <Grid container item xs={8} md={8} lg={8} spacing={6}>
          <Grid item xs={12} sm={6} md={6}>
            <CrmMeetingSchedule />
          </Grid>
          <Grid item xs={12} sm={6} md={6}>
            <Skelet
              loading={loadingStatisticsResumeCountFromMonth}
              height={425}
              component={<AnalyticsWeeklySales statisticsResumeCountFromMonth={statisticsResumeCountFromMonth} />}
            />
          </Grid>
        </Grid>
      </Grid>
    </>
  )
}

export default ViewOverview
