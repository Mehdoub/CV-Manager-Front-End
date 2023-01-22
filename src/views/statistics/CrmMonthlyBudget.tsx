// ** MUI Imports
import Card from '@mui/material/Card'
import { useTheme } from '@mui/material/styles'
import CardHeader from '@mui/material/CardHeader'
import Typography from '@mui/material/Typography'
import CardContent from '@mui/material/CardContent'

// ** Third Party Imports
import { ApexOptions } from 'apexcharts'

// ** Custom Components Imports
import OptionsMenu from 'src/@core/components/option-menu'
import ReactApexcharts from 'src/@core/components/react-apexcharts'

const CrmMonthlyBudget = () => {
  // ** Hook
  const theme = useTheme()

  const options: ApexOptions = {
    chart: {
      offsetY: -8,
      parentHeightOffset: 0,
      toolbar: { show: false }
    },
    tooltip: { enabled: true },
    dataLabels: { enabled: true },
    stroke: {
      width: 5,
      curve: 'smooth'
    },
    grid: {
      show: true,
      padding: {
        left: 10,
        top: -24,
        right: 12
      }
    },
    fill: {
      type: 'gradient',
      gradient: {
        opacityTo: 0.7,
        opacityFrom: 0.5,
        shadeIntensity: 1,
        stops: [0, 90, 100],
        colorStops: [
          [
            {
              offset: 0,
              opacity: 0.6,
              color: theme.palette.success.main
            },
            {
              offset: 100,
              opacity: 0.1,
              color: theme.palette.background.paper
            }
          ]
        ]
      }
    },
    theme: {
      monochrome: {
        enabled: true,
        shadeTo: 'light',
        shadeIntensity: 1,
        color: theme.palette.success.main
      }
    },
    xaxis: {
      // type: 'numeric',
      labels: { show: true },
      axisTicks: { show: false },
      categories: ['01', '05', '10', '15', '20', '25', '30'],
      axisBorder: { show: false }
    },
    yaxis: { show: false },
    markers: {
      size: 1,
      offsetY: 1,
      offsetX: -5,
      strokeWidth: 4,
      strokeOpacity: 1,
      colors: ['transparent'],
      strokeColors: 'transparent',
      // discrete: [
      //   {
      //     size: 7,
      //     seriesIndex: 0,
      //     dataPointIndex: 7,
      //     strokeColor: theme.palette.success.main,
      //     fillColor: theme.palette.background.paper
      //   }
      // ]
    }
  }

  return (
    <Card>
      <CardHeader
        title='Last Month'
        action={
          <OptionsMenu
            options={['Refresh', 'Edit', 'Update']}
            iconButtonProps={{ size: 'small', className: 'card-more-options' }}
          />
        }
      />
      <CardContent>
        <ReactApexcharts
          type='area'
          height={262}
          options={options}
          series={[{ name: 'Received Resumes', data: [0, 85, 25, 125, 90, 250, 200] }]}
        />
        <Typography variant='body2'>
          Last month you had 242 received resumes, 102 hired and 140 rejected.
        </Typography>
      </CardContent>
    </Card>
  )
}

export default CrmMonthlyBudget
