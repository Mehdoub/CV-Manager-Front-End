// ** React Imports
import {
  useState,
  useEffect,

  //  MouseEvent,
  useCallback
} from 'react'

// ** Next Imports
import Link from 'next/link'
import { GetStaticProps, InferGetStaticPropsType } from 'next/types'

// ** MUI Imports
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import Grid from '@mui/material/Grid'
import { DataGrid } from '@mui/x-data-grid'
import { styled } from '@mui/material/styles'
import Typography from '@mui/material/Typography'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Store Imports
import { useDispatch, useSelector } from 'react-redux'

// ** Custom Components Imports
import CustomAvatar from 'src/@core/components/mui/avatar'
import CardStatisticsHorizontal from 'src/@core/components/card-statistics/card-stats-horizontal'

// ** Utils Import
import { getInitials } from 'src/@core/utils/get-initials'

import { fetchData } from 'src/store/apps/project'
import { CardStatsHorizontalProps } from 'src/@core/components/card-statistics/types'

// ** Custom Table Components Imports
import TableHeader from 'src/views/pages/position/list/TableHeader'
import AddPositionDrawer from 'src/views/pages/position/list/AddPositionDrawer'
import { AvatarGroup, Stack } from '@mui/material'
import { BootstrapTooltip } from '../companies'

const StyledLink = styled(Link)(({ theme }) => ({
  fontWeight: 600,
  fontSize: '1rem',
  cursor: 'pointer',
  textDecoration: 'none',
  color: theme.palette.text.secondary,
  '&:hover': {
    color: theme.palette.primary.main
  }
}))

// ** renders client column
export const renderClient = (row: any, field = 'avatar') => {
  if (row[field].length) {
    return <CustomAvatar src={row[field]} sx={{ mr: 3, width: 34, height: 34 }} />
  } else {
    return (
      <CustomAvatar
        skin='light'
        color={row.avatarColor || 'primary'}
        sx={{ mr: 3, width: 34, height: 34, fontSize: '1rem' }}
      >
        {getInitials(row.fullName ? row.fullName : 'John Doe')}
      </CustomAvatar>
    )
  }
}

const ProjectList = ({ apiData }: InferGetStaticPropsType<typeof getStaticProps>) => {
  // ** State
  const [value, setValue] = useState<string>('')
  const [pageSize, setPageSize] = useState<number>(10)
  const [addProjectOpen, setaddProjectOpen] = useState<boolean>(false)

  // ** Hooks
  const dispatch = useDispatch<any>()
  const store = useSelector((state: any) => state.user)

  useEffect(() => {
    dispatch(fetchData())
  }, [dispatch, value])

  const handleFilter = useCallback((val: string) => {
    setValue(val)
  }, [])

  const toggleAddPositionDrawer = () => setaddProjectOpen(!addProjectOpen)

  const columns = [
    {
      flex: 0.2,
      minWidth: 230,
      field: 'position',
      headerName: 'Position',
      renderCell: ({ row }: any) => {
        const { position } = row

        return (
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            {renderClient(row)}
            <Box sx={{ display: 'flex', alignItems: 'flex-start', flexDirection: 'column' }}>
              <StyledLink href={`/positions/view/${row.id}/overview/`}>{position}</StyledLink>
            </Box>
          </Box>
        )
      }
    },
    {
      flex: 0.2,
      minWidth: 230,
      field: 'project_id',
      headerName: 'Project',
      renderCell: ({ row }: any) => {
        const { project_id } = row

        return (
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            {renderClient(row, 'logo')}
            <Box sx={{ display: 'flex', alignItems: 'flex-start', flexDirection: 'column' }}>
              <StyledLink href={`/projects/view/${row.id}/overview/`}>{project_id}</StyledLink>
            </Box>
          </Box>
        )
      }
    },
    {
      flex: 0.2,
      minWidth: 250,
      field: 'company',
      headerName: 'Company',
      renderCell: ({ row }: any) => {
        return (
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            {renderClient(row)}
            <Box sx={{ display: 'flex', alignItems: 'flex-start', flexDirection: 'column' }}>
              <StyledLink href={`/companies/view/${row.id}/overview/`}>{row.company}</StyledLink>
            </Box>
          </Box>
        )
      }
    },
    {
      flex: 0.1,
      field: 'team',
      minWidth: 150,
      headerName: 'Managers',
      renderCell: ({ row }: any) =>
        row?.avatarGroup.length > 0 ? (
          <AvatarGroup className='pull-up'>
            {row?.avatarGroup?.map((src: any, index: any) => (
              <BootstrapTooltip key={index} title='Manager Name' placement='top'>
                <CustomAvatar src={src} sx={{ height: 26, width: 26 }} />
              </BootstrapTooltip>
            ))}
          </AvatarGroup>
        ) : (
          '---'
        )
    },
    {
      flex: 0.15,
      minWidth: 120,
      headerName: 'User Create',
      field: 'username',
      renderCell: ({ row }: any) => {
        return (
          <Typography variant='subtitle1' noWrap sx={{ textTransform: 'capitalize' }}>
            <StyledLink href={`/users/view/${row.id}/overview`}>
              {row.username}
            </StyledLink>
          </Typography>
        )
      }
    },
    {
      flex: 0.15,
      minWidth: 120,
      headerName: 'Time Create',
      field: 'time_created',
      renderCell: ({ row }: any) => {
        return (
          <Typography variant='subtitle1' noWrap sx={{ textTransform: 'capitalize' }}>
            {row.time_created}
          </Typography>
        )
      }
    },
    {
      flex: 0.1,
      minWidth: 90,
      sortable: false,
      field: 'actions',
      headerName: 'Actions',
      renderCell: ({ row }: any) => (
        <Stack direction='row' spacing={2}>
          <BootstrapTooltip title='view' placement='top'>
            <StyledLink href={`/positions/view/${row.id}/overview`} onClick={e => e.preventDefault()}>
              <Icon icon='mdi:eye-outline' fontSize={20} />
            </StyledLink>
          </BootstrapTooltip>
          <BootstrapTooltip title='edit' placement='top'>
            <div style={{ cursor: 'pointer' }} onClick={toggleAddPositionDrawer}>
              <Icon icon='mdi:pencil-outline' fontSize={20} />
            </div>
          </BootstrapTooltip>
        </Stack>
      )
    }
  ]

  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        {apiData && (
          <Grid container spacing={6}>
            {apiData.statsHorizontal.map((item: CardStatsHorizontalProps, index: number) => {
              return (
                <Grid item xs={12} md={3} sm={6} key={index}>
                  <CardStatisticsHorizontal {...item} icon={<Icon icon={item.icon as string} />} />
                </Grid>
              )
            })}
          </Grid>
        )}
      </Grid>
      <Grid item xs={12}>
        <Card>
          <TableHeader value={value} handleFilter={handleFilter} toggle={toggleAddPositionDrawer} />
          <DataGrid
            autoHeight
            rows={store.data}
            columns={columns}
            pageSize={pageSize}
            disableSelectionOnClick
            rowsPerPageOptions={[10, 25, 50]}
            sx={{ '& .MuiDataGrid-columnHeaders': { borderRadius: 0 } }}
            onPageSizeChange={(newPageSize: number) => setPageSize(newPageSize)}
          />
        </Card>
      </Grid>

      <AddPositionDrawer open={addProjectOpen} toggle={toggleAddPositionDrawer} />
    </Grid>
  )
}

export const getStaticProps: GetStaticProps = async () => {
  const apiData = {
    statsHorizontal: [
      {
        stats: '8,458',
        trend: 'negative',
        trendNumber: '8.1%',
        title: 'New Customers',
        icon: 'mdi:account-outline'
      },
      {
        icon: 'mdi:poll',
        stats: '$28.5k',
        color: 'warning',
        trendNumber: '18.2%',
        title: 'Total Profit'
      },
      {
        color: 'info',
        stats: '2,450k',
        trend: 'negative',
        icon: 'mdi:trending-up',
        trendNumber: '24.6%',
        title: 'New Transactions'
      },
      {
        stats: '$48.2K',
        color: 'success',
        icon: 'mdi:currency-usd',
        trendNumber: '22.5%',
        title: 'Total Revenue'
      }
    ]
  }

  return {
    props: {
      apiData
    }
  }
}

export default ProjectList