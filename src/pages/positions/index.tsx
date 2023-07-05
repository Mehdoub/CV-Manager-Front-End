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

// ** MUI Imports
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import Grid from '@mui/material/Grid'
import { DataGrid } from '@mui/x-data-grid'
import { styled } from '@mui/material/styles'
import Typography from '@mui/material/Typography'
import CustomChip from 'src/@core/components/mui/chip'

// ** Store Imports
import { useDispatch, useSelector } from 'react-redux'

// ** Custom Components Imports
import CustomAvatar from 'src/@core/components/mui/avatar'

// ** Utils Import
import { getInitials } from 'src/@core/utils/get-initials'

// ** Custom Table Components Imports
import TableHeader from 'src/views/pages/position/list/TableHeader'
import AddPositionDrawer from 'src/views/pages/position/list/AddPositionDrawer'
import { AvatarGroup, Skeleton, Stack } from '@mui/material'
import { getPositions } from 'src/store/position'
import PositionEditDialog from 'src/views/pages/position/view/PositionEditDialog'
import { getFullName, getImagePath, getMaxTextLen, getObjectKeys, showDate } from 'src/helpers/functions'
import BootstrapTooltip from 'src/@core/components/bootstrap-tooltip'
import EditIcon from '@mui/icons-material/Edit'
import VisibilityIcon from '@mui/icons-material/Visibility'

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

const statusColors: any = {
  active: 'success',
  inactive: 'error'
}

// ** renders client column
export const renderClient = (row: any, imgField = 'logo', nameField = 'name') => {
  if (row && row[imgField]?.length) {
    return <CustomAvatar src={getImagePath(row[imgField])} sx={{ mr: 3, width: 34, height: 34 }} />
  } else {
    return (
      <CustomAvatar skin='light' color={'primary'} sx={{ mr: 3, width: 34, height: 34, fontSize: '1rem' }}>
        {getInitials(row && row[nameField] ? row[nameField] : 'John Doe')}
      </CustomAvatar>
    )
  }
}

const PositionList = () => {
  // ** State
  const [searchQuery, setSearchQuery] = useState<string>('')
  const [pageSize, setPageSize] = useState<number>(10)
  const [page, setPage] = useState<number>(0)
  const [position, setPosition] = useState<any>({})
  const [addPositionOpen, setAddPositionOpen] = useState<boolean>(false)
  const [editPositionOpen, setEditPositionOpen] = useState<boolean>(false)

  // ** Hooks
  const dispatch = useDispatch<any>()

  const { data: positions, loading } = useSelector((state: any) => state.positionsList)

  const { data: constants } = useSelector((state: any) => state.constants)

  useEffect(() => {
    dispatch(getPositions({ size: pageSize, query: searchQuery, page }))
  }, [])

  const handlePageChange = (newPage: number) => {
    setPage(newPage++)
    dispatch(getPositions({ page: newPage, size: pageSize, query: searchQuery }))
  }
  const clearTimerRef: any = useRef()
  const handleFilter = useCallback((val: string) => {
    setSearchQuery(val)
    clearTimeout(clearTimerRef.current)
    const serachTimeout = setTimeout(() => {
      dispatch(getPositions({ query: val, size: pageSize }))
    }, 1500)
    clearTimerRef.current = serachTimeout
  }, [])

  const toggleAddPositionDrawer = () => setAddPositionOpen(!addPositionOpen)
  const toggleEditPositionDialog = () => setEditPositionOpen(!editPositionOpen)

  const columns = [
    {
      flex: 0.2,
      minWidth: 200,
      field: 'position',
      headerName: 'Position',
      renderCell: ({ row }: any) => {
        const { id, title } = row

        return (
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            {renderClient(row, 'logo', 'title')}
            <Box sx={{ display: 'flex', alignItems: 'flex-start', flexDirection: 'column' }}>
              <BootstrapTooltip title={title} placement='top'>
                <StyledLink href={`/positions/view/${id}/overview/`}>{getMaxTextLen(title)}</StyledLink>
              </BootstrapTooltip>
            </Box>
          </Box>
        )
      }
    },
    {
      flex: 0.2,
      minWidth: 200,
      field: 'company_id',
      headerName: 'Company',
      renderCell: ({ row }: any) => {
        const { company_id } = row

        return (
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            {renderClient(company_id)}
            <Box sx={{ display: 'flex', alignItems: 'flex-start', flexDirection: 'column' }}>
              <BootstrapTooltip title={company_id?.name} placement='top'>
                <StyledLink href={`/companies/view/${company_id?.id}/overview/`}>
                  {getMaxTextLen(company_id?.name)}
                </StyledLink>
              </BootstrapTooltip>
            </Box>
          </Box>
        )
      }
    },
    {
      flex: 0.2,
      minWidth: 200,
      field: 'project_id',
      headerName: 'Project',
      renderCell: ({ row }: any) => {
        const { project_id } = row

        return (
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            {renderClient(project_id)}
            <Box sx={{ display: 'flex', alignItems: 'flex-start', flexDirection: 'column' }}>
              <BootstrapTooltip title={project_id?.name} placement='top'>
                <StyledLink href={`/projects/view/${project_id?.id}/overview/`}>
                  {getMaxTextLen(project_id?.name)}
                </StyledLink>
              </BootstrapTooltip>
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
                <CustomAvatar src={getImagePath(manager?.user_id?.avatar)} sx={{ height: 26, width: 26 }} />
              </BootstrapTooltip>
            ))}
          </AvatarGroup>
        ) : (
          '---'
        )
    },
    {
      flex: 0.1,
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
      minWidth: 200,
      field: 'created_by',
      headerName: 'User Create',
      renderCell: ({ row }: any) => {
        const { created_by } = row

        return (
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Box sx={{ display: 'flex', alignItems: 'flex-start', flexDirection: 'column' }}>
              <StyledLink href={`/users/view/${created_by?.id}/overview/`}>{getFullName(created_by)}</StyledLink>
            </Box>
          </Box>
        )
      }
    },
    {
      flex: 0.2,
      minWidth: 160,
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
            <StyledLink href={`/positions/view/${row?.id}/overview`}>
              <VisibilityIcon />
            </StyledLink>
          </BootstrapTooltip>
          <BootstrapTooltip title='edit' placement='top'>
            <div
              style={{ cursor: 'pointer' }}
              onClick={() => {
                setPosition(row)
                toggleEditPositionDialog()
              }}
            >
              <EditIcon />
            </div>
          </BootstrapTooltip>
        </Stack>
      )
    }
  ]

  return (
    <Grid container spacing={6}>
      {/* <Grid item xs={12}>
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
      </Grid> */}
      <Grid item xs={12}>
        <Card>
          <TableHeader value={searchQuery} handleFilter={handleFilter} toggle={toggleAddPositionDrawer} />
          {!loading && positions?.docs ? (
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
          ) : (
            <Skeleton variant='rounded' height={650} />
          )}
        </Card>
      </Grid>
      {getObjectKeys(constants?.position)?.length > 0 ? (
        <>
          <AddPositionDrawer open={addPositionOpen} toggle={toggleAddPositionDrawer} />
          <PositionEditDialog open={editPositionOpen} closeHandler={toggleEditPositionDialog} position={position} />
        </>
      ) : null}
    </Grid>
  )
}

export default PositionList
