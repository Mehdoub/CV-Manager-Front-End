// ** MUI Imports
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import { useTheme } from '@mui/material/styles'
import Typography from '@mui/material/Typography'
import CardContent from '@mui/material/CardContent'

// ** Third Party Imports
import { ApexOptions } from 'apexcharts'

// ** Custom Components Imports
import ReactApexcharts from 'src/@core/components/react-apexcharts'

interface TotalGrothStatsProps {
  statsData?: any
}

const CrmTotalGrowth = ({ statsData }: TotalGrothStatsProps) => {
  // ** Hook
  const theme = useTheme()

  let statsLabels = []
  let statsNumbers: Array<number> = []
  let totalNumber = 0

  if (statsData) {
    for (let [label, value] of Object.entries(statsData)) {
      totalNumber += value as number
      statsLabels.push(label)
      statsNumbers.push(value as number)
    }
    statsNumbers = statsNumbers.map(item => item / (totalNumber > 0 ? totalNumber : 1) * 100)
  } else {
    statsLabels = [
      'Pending',
      'Hired',
      'Rejected',
      'Call Review',
      'Tech Review',
      'Wait Review',
      'Wait Reject',
      'Wait Hire'
    ]
    statsNumbers = [35, 30, 65, 20, 40, 45, 50, 30]
    totalNumber = 2796
  }

  const options: ApexOptions = {
    legend: { show: false },
    stroke: { width: 5, colors: [theme.palette.background.paper] },
    colors: [
      theme.palette.primary.main,
      theme.palette.success.main,
      theme.palette.error.main,
      theme.palette.warning.main,
      theme.palette.secondary.main,
      theme.palette.info.main
    ],
    labels: statsLabels,
    tooltip: {
      y: { formatter: (val: number) => `${val}%` }
    },
    dataLabels: {
      enabled: false
    },
    states: {
      hover: {
        filter: { type: 'none' }
      },
      active: {
        filter: { type: 'none' }
      }
    },
    plotOptions: {
      pie: {
        donut: {
          size: '70%',
          labels: {
            show: true,
            name: { show: false },
            total: {
              label: '',
              show: true,
              fontWeight: 600,
              fontSize: '1rem',
              color: theme.palette.text.secondary,
              formatter: val => (typeof val === 'string' ? `${val}%` : '---')
            },
            value: {
              offsetY: 6,
              fontWeight: 600,
              fontSize: '1rem',
              formatter: val => `${val}%`,
              color: theme.palette.text.secondary
            }
          }
        }
      }
    }
  }

  return (
    <Card>
      <CardContent>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center' }}>
          <Typography variant='h6' sx={{ mr: 1.5 }}>
            {totalNumber}
          </Typography>
        </Box>
        <Typography variant='body2'>Total Resumes</Typography>
        <ReactApexcharts type='donut' height={135} options={options} series={statsNumbers} />
      </CardContent>
    </Card>
  )
}

export default CrmTotalGrowth
