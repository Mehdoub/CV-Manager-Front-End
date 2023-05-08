// ** React Imports
import {
  useState,
  useEffect,

  //  MouseEvent,
  useCallback,
  useRef
} from 'react'

// ** Next Imports
import Link from 'next/link'
import { GetStaticProps, InferGetStaticPropsType } from 'next/types'

// ** MUI Imports
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import CustomChip from 'src/@core/components/mui/chip'

// import Menu from '@mui/material/Menu'
import Grid from '@mui/material/Grid'
import { DataGrid } from '@mui/x-data-grid'
import { styled } from '@mui/material/styles'
import Typography from '@mui/material/Typography'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Store Imports
import { useDispatch, useSelector } from 'react-redux'

// ** Custom Components Imports
// import CustomChip from 'src/@core/components/mui/chip'
import CustomAvatar from 'src/@core/components/mui/avatar'
import CardStatisticsHorizontal from 'src/@core/components/card-statistics/card-stats-horizontal'

// ** Utils Import
import { getInitials } from 'src/@core/utils/get-initials'
// ** Custom Table Components Imports
import TableHeader from 'src/views/pages/project/list/TableHeader'
import AddProjectDrawer from 'src/views/pages/project/list/AddProjectDrawer'
import { AvatarGroup, Skeleton, Stack } from '@mui/material'
import BootstrapTooltip from 'src/@core/components/bootstrap-tooltip'
import { getProjects } from 'src/store/project'
import ProjectEditDialog from 'src/views/pages/project/view/ProjectEditDialog'
import { getImagePath, showDate, uppercaseFirstLetters } from 'src/helpers/functions'

const statusColors: any = {
  active: 'success',
  inactive: 'error'
}

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
export const renderClient = (row: any, field = 'logo') => {
  if (row[field]?.length) {
    return <CustomAvatar src={getImagePath(row[field])} sx={{ mr: 3, width: 34, height: 34 }} />
  } else {
    return (
      <CustomAvatar skin='light' color='primary' sx={{ mr: 3, width: 34, height: 34, fontSize: '1rem' }}>
        {getInitials(row.name ? row.name : 'John Doe')}
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

const ProjectList = () => {
  // ** State
  const [searchQuery, setSearchQuery] = useState<string>('')
  const [pageSize, setPageSize] = useState<number>(10)
  const [page, setPage] = useState<number>(0)
  const [project, setProject] = useState<any>({})
  const [addProjectOpen, setAddProjectOpen] = useState<boolean>(false)
  const [editProjectOpen, setEditProjectOpen] = useState<boolean>(false)

  // ** Hooks
  const dispatch = useDispatch<any>()
  const { data: projects, loading: projectsListLoading } = useSelector((state: any) => state.projectsList)

  const handlePageChange = (newPage: number) => {
    setPage(newPage++)
    dispatch(getProjects({ page: newPage, size: pageSize, query: searchQuery }))
  }

  useEffect(() => {
    dispatch(getProjects({ size: pageSize, query: searchQuery, page }))
  }, [])

  const clearTimerRef: any = useRef()
  const handleFilter = useCallback((val: string) => {
    setSearchQuery(val)
    clearTimeout(clearTimerRef.current)
    const serachTimeout = setTimeout(() => {
      dispatch(getProjects({ query: val, size: pageSize }))
    }, 1500)
    clearTimerRef.current = serachTimeout
  }, [])

  const toggleAddProjectDrawer = () => setAddProjectOpen(!addProjectOpen)
  const toggleEditProjectDialog = () => setEditProjectOpen(!editProjectOpen)

  const columns = [
    {
      flex: 0.2,
      minWidth: 230,
      field: 'name',
      headerName: 'Project',
      renderCell: ({ row }: any) => {
        const { name, id } = row

        return (
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            {renderClient(row)}
            <Box sx={{ display: 'flex', alignItems: 'flex-start', flexDirection: 'column' }}>
              <StyledLink href={`/projects/view/${id}/overview/`}>{uppercaseFirstLetters(name)}</StyledLink>
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
            {renderClient(row?.company_id)}
            <Box sx={{ display: 'flex', alignItems: 'flex-start', flexDirection: 'column' }}>
              <StyledLink href={`/companies/view/${row?.company_id?.id}/overview/`}>{row?.company_id?.name}</StyledLink>
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
      minWidth: 120,
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
      flex: 0.15,
      minWidth: 120,
      headerName: 'User Create',
      field: 'created_by',
      renderCell: ({ row }: any) => {
        return (
          <Typography variant='subtitle1' noWrap sx={{ textTransform: 'capitalize' }}>
            <StyledLink href={`/users/view/${row?.created_by?.id}/overview`}>
              {row?.created_by?.firstname} {row?.created_by?.lastname}
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
            {showDate(row?.createdAt)}
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
            <StyledLink href={`/projects/view/${row.id}/overview`} onClick={e => e.preventDefault()}>
              <Icon icon='mdi:eye-outline' fontSize={20} />
            </StyledLink>
          </BootstrapTooltip>
          <BootstrapTooltip title='edit' placement='top'>
            <div
              style={{ cursor: 'pointer' }}
              onClick={() => {
                setProject(row)
                toggleEditProjectDialog()
              }}
            >
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
          <TableHeader searchQuery={searchQuery} handleFilter={handleFilter} toggle={toggleAddProjectDrawer} />
          {projectsListLoading ? (
            <Skeleton variant='rounded' height={600} />
          ) : (
            <DataGrid
              autoHeight
              rows={projects?.docs ?? []}
              columns={columns}
              pageSize={pageSize}
              disableSelectionOnClick
              rowsPerPageOptions={[10]}
              sx={{ '& .MuiDataGrid-columnHeaders': { borderRadius: 0 } }}
              onPageSizeChange={(newPageSize: number) => setPageSize(newPageSize)}
              pagination
              paginationMode='server'
              rowCount={projects?.totalDocs}
              page={page}
              onPageChange={newPage => handlePageChange(newPage)}
            />
          )}
        </Card>
      </Grid>
      <ProjectEditDialog open={editProjectOpen} closeHandler={toggleEditProjectDialog} project={project} />
      <AddProjectDrawer open={addProjectOpen} toggle={toggleAddProjectDrawer} />
    </Grid>
  )
}

export default ProjectList
