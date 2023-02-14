// ** React Imports
import {
  useState,
  useEffect,

  //  MouseEvent,
  useCallback
} from 'react'

// ** Next Imports
import Link from 'next/link'

// ** MUI Imports
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import Grid from '@mui/material/Grid'
import { DataGrid } from '@mui/x-data-grid'
import { styled } from '@mui/material/styles'
import Typography from '@mui/material/Typography'
import CustomChip from 'src/@core/components/mui/chip'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Store Imports
import { useDispatch, useSelector } from 'react-redux'

// ** Custom Components Imports
import CustomAvatar from 'src/@core/components/mui/avatar'
import CardStatisticsHorizontal from 'src/@core/components/card-statistics/card-stats-horizontal'

// ** Utils Import
import { getInitials } from 'src/@core/utils/get-initials'

// ** Custom Table Components Imports
import TableHeader from 'src/views/pages/position/list/TableHeader'
import AddPositionDrawer from 'src/views/pages/position/list/AddPositionDrawer'
import { AvatarGroup, Stack } from '@mui/material'
import { BootstrapTooltip } from '../companies'
import { getPositions } from 'src/store/position'

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

const statusColors : any = {
  active: 'success',
  inactive: 'error'
}

// ** renders client column
export const renderClient = (row: any, field = 'logo') => {
  if (row[field]?.length) {
    return <CustomAvatar src={row[field]} sx={{ mr: 3, width: 34, height: 34 }} />
  } else {
    return (
      <CustomAvatar
        skin='light'
        color={'primary'}
        sx={{ mr: 3, width: 34, height: 34, fontSize: '1rem' }}
      >
        {getInitials(row?.title ?? 'John Doe')}
      </CustomAvatar>
    )
  }
}

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

const PositionList = () => {
  // ** State
  const [searchQuery, setSearchQuery] = useState<string>('')
  const [pageSize, setPageSize] = useState<number>(10)
  const [page, setPage] = useState<number>(0)
  const [addPositionOpen, setaddPositionOpen] = useState<boolean>(false)

  // ** Hooks
  const dispatch = useDispatch<any>()

  const { data: positions, loading } = useSelector((state: any) => state.positionsList)

  useEffect(() => {
    dispatch(getPositions({ size: pageSize, query: searchQuery, page }))
  }, [])

  const handlePageChange = (newPage: number) => {
    setPage(newPage++)
    dispatch(getPositions({ page: newPage, size: pageSize, query: searchQuery }))
  }
  const handleFilter = useCallback((val: string) => {
    setSearchQuery(val)
    dispatch(getPositions({ query: val, size: pageSize }))
  }, [])

  const toggleAddPositionDrawer = () => setaddPositionOpen(!addPositionOpen)

  const columns = [
    {
      flex: 0.2,
      minWidth: 230,
      field: 'position',
      headerName: 'Position',
      renderCell: ({ row }: any) => {
        const { id, title } = row

        return (
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            {renderClient(row)}
            <Box sx={{ display: 'flex', alignItems: 'flex-start', flexDirection: 'column' }}>
              <StyledLink href={`/positions/view/${id}/overview/`}>{title}</StyledLink>
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
            {renderClient(project_id)}
            <Box sx={{ display: 'flex', alignItems: 'flex-start', flexDirection: 'column' }}>
              <StyledLink href={`/projects/view/${project_id}/overview/`}>{project_id}</StyledLink>
            </Box>
          </Box>
        )
      }
    },
    {
      flex: 0.2,
      minWidth: 230,
      field: 'company_id',
      headerName: 'Company',
      renderCell: ({ row }: any) => {
        const { company_id } = row

        return (
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            {renderClient(company_id)}
            <Box sx={{ display: 'flex', alignItems: 'flex-start', flexDirection: 'column' }}>
              <StyledLink href={`/companies/view/${company_id}/overview/`}>{company_id}</StyledLink>
            </Box>
          </Box>
        )
      }
    },
    {
      flex: 0.1,
      field: 'managers',
      minWidth: 120,
      headerName: 'Managers',
      renderCell: ({ row }: any) =>
        row?.managers?.length > 0 ? (
          <AvatarGroup className='pull-up'>
            {row?.managers?.map((manager: any, index: any) => (
              <BootstrapTooltip
                key={index}
                title={`${manager?.user_id?.firstname} ${manager?.user_id?.lastname}`}
                placement='top'
              >
                <CustomAvatar src={manager?.user_id?.avatar} sx={{ height: 26, width: 26 }} />
              </BootstrapTooltip>
            ))}
          </AvatarGroup>
        ) : (
          '---'
        )
    },
    {
      flex: 0.15,
      minWidth: 90,
      headerName: 'Status',
      field: 'is_active',
      renderCell: ({ row }: any) => {
        return (
          <CustomChip
            skin='light'
            size='small'
            label={row?.is_active ? 'active' : 'inactive'}
            color={statusColors[row?.is_active ? 'active' : 'inactive']}
            sx={{
              height: 20,
              fontWeight: 500,
              fontSize: '0.75rem',
              borderRadius: '5px',
              textTransform: 'capitalize'
            }}
          />
        )
      }
    },
    {
      flex: 0.2,
      minWidth: 230,
      field: 'created_by',
      headerName: 'User Create',
      renderCell: ({ row }: any) => {
        const { created_by } = row

        return (
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Box sx={{ display: 'flex', alignItems: 'flex-start', flexDirection: 'column' }}>
              <StyledLink href={`/users/view/${created_by}/overview/`}>{created_by}</StyledLink>
            </Box>
          </Box>
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
            {new Date(row?.createdAt).toDateString()}
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
            <StyledLink href={`/positions/view/${row?.id}/overview`}>
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
            {apiData.statsHorizontal.map((item: any, index: number) => {
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
          <TableHeader value={searchQuery} handleFilter={handleFilter} toggle={toggleAddPositionDrawer} />
          {!loading && positions?.docs?.length > 0 && (
            <DataGrid
              autoHeight
              rows={positions?.docs ?? []}
              columns={columns}
              pageSize={pageSize}
              disableSelectionOnClick
              rowsPerPageOptions={[10]}
              sx={{ '& .MuiDataGrid-columnHeaders': { borderRadius: 0 } }}
              onPageSizeChange={(newPageSize: number) => setPageSize(newPageSize)}
              pagination
              paginationMode='server'
              rowCount={positions?.totalDocs}
              page={page}
              onPageChange={newPage => handlePageChange(newPage)}
            />
          )}
        </Card>
      </Grid>

      <AddPositionDrawer open={addPositionOpen} toggle={toggleAddPositionDrawer} />
    </Grid>
  )
}

export default PositionList
