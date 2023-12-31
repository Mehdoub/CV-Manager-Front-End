// ** React Imports
import { useState, useEffect, useCallback, useRef } from 'react'

// ** Next Imports
import Link from 'next/link'

// ** MUI Imports
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import Grid from '@mui/material/Grid'
import { DataGrid } from '@mui/x-data-grid'
import { styled } from '@mui/material/styles'
import CustomChip from 'src/@core/components/mui/chip'
import Typography from '@mui/material/Typography'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Store Imports
import { useDispatch, useSelector } from 'react-redux'

// ** Custom Components Imports
import CustomAvatar from 'src/@core/components/mui/avatar'

// ** Utils Import
import { getInitials } from 'src/@core/utils/get-initials'

// ** Types Imports
import { AppDispatch } from 'src/store'

// ** Custom Table Components Imports
import TableHeader from 'src/views/pages/user/list/TableHeader'
// import AddUserDrawer from 'src/views/pages/user/list/AddUserDrawer'
import { Autocomplete, ListItem, Popover, Skeleton, Stack } from '@mui/material'
import BootstrapTooltip from 'src/@core/components/bootstrap-tooltip'
import { getUsers } from 'src/store/user'
import { getFullName, getImagePath, showDate, showIsActiveColor, uppercaseFirstLetters } from 'src/helpers/functions'
import UserEditDialog from 'src/views/pages/user/view/UserEditDialog'
import { getRoles } from 'src/store/role'
import CustomTextField from 'src/@core/components/custom-textfield'

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
const renderClient = (row: any) => {
  if (row?.avatar?.length) {
    return <CustomAvatar src={getImagePath(row?.avatar)} sx={{ mr: 3, width: 34, height: 34 }} alt={getFullName(row)} />
  } else {
    return (
      <CustomAvatar
        skin='light'
        color='primary'
        sx={{ mr: 3, width: 34, height: 34, fontSize: '1rem' }}
        alt={getFullName(row)}
      >
        {getInitials(getFullName(row))}
      </CustomAvatar>
    )
  }
}

const UserList = () => {
  // ** State
  const [pageSize, setPageSize] = useState<number>(10)
  const [searchQuery, setSearchQuery] = useState<string>('')
  const [page, setPage] = useState<number>(0)
  const [addUserOpen, setAddUserOpen] = useState<boolean>(false)
  const [editUserOpen, setEditUserOpen] = useState<boolean>(false)
  const [user, setUser] = useState<any>({})
  const [anchorElAddRole, setAnchorElAddRole] = useState<HTMLButtonElement | null>(null)
  const handleClickAddRole = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorElAddRole(event.currentTarget)
  }

  const handleCloseAddRole = () => {
    setAnchorElAddRole(null)
  }
  const openAddRole = Boolean(anchorElAddRole)

  // ** Hooks
  const dispatch = useDispatch<AppDispatch>()

  const { data: users, loading } = useSelector((state: any) => state.usersList)
  const { data: roles, loading: loadingRoles } = useSelector((state: any) => state.roles)

  useEffect(() => {
    dispatch(getRoles())
  }, [])

  useEffect(() => {
    dispatch(getUsers({ page, size: pageSize, query: searchQuery }))
  }, [])

  const toggleAddUserDrawer = () => setAddUserOpen(!addUserOpen)
  const closeEditUserDialog = () => setEditUserOpen(false)

  const handlePageChange = (newPage: number) => {
    setPage(newPage++)
    dispatch(getUsers({ page: newPage, size: pageSize, query: searchQuery }))
  }

  const clearTimerRef: any = useRef()
  const handleFilter = useCallback((val: string) => {
    setSearchQuery(val)
    clearTimeout(clearTimerRef.current)
    const serachTimeout = setTimeout(() => {
      dispatch(getUsers({ query: val, size: pageSize }))
    }, 1500)
    clearTimerRef.current = serachTimeout
  }, [])

  const columns = [
    {
      flex: 0.2,
      minWidth: 230,
      field: 'fullName',
      headerName: 'User',
      renderCell: ({ row }: any) => {
        const { username, id } = row

        return (
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            {renderClient(row)}
            <Box sx={{ display: 'flex', alignItems: 'flex-start', flexDirection: 'column' }}>
              <StyledLink href={`/users/view/${id}/overview`}>{getFullName(row)}</StyledLink>
              <Typography noWrap variant='caption'>
                {`@${username}`}
              </Typography>
            </Box>
          </Box>
        )
      }
    },
    {
      flex: 0.2,
      minWidth: 250,
      field: 'role',
      headerName: 'role',
      renderCell: ({ row }: any) => {
        return (
          <Typography noWrap variant='body2'>
            {row?.role[0] ?? '---'}
          </Typography>
        )
      }
    },
    {
      flex: 0.2,
      minWidth: 250,
      field: 'email',
      headerName: 'Email',
      renderCell: ({ row }: any) => {
        return (
          <Typography noWrap variant='body2'>
            {uppercaseFirstLetters(row?.email) ?? '---'}
          </Typography>
        )
      }
    },
    {
      flex: 0.2,
      minWidth: 250,
      field: 'mobile',
      headerName: 'Mobile',
      renderCell: ({ row }: any) => {
        return (
          <Typography noWrap variant='body2'>
            {row?.mobile ?? '---'}
          </Typography>
        )
      }
    },
    {
      flex: 0.1,
      minWidth: 110,
      field: 'is_baned',
      headerName: 'Is Banned',
      renderCell: ({ row }: any) => {
        return (
          <CustomChip
            skin='light'
            size='small'
            label={!row?.is_banned ? 'Active' : 'Banned'}
            color={showIsActiveColor(!row?.is_banned)}
            sx={{ textTransform: 'capitalize', '& .MuiChip-label': { lineHeight: '18px' } }}
          />
        )
      }
    },
    {
      flex: 0.15,
      minWidth: 120,
      headerName: 'Time Join',
      field: 'createdAt',
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
            <StyledLink href={`/users/view/${row.id}/overview`}>
              <Icon icon='mdi:eye-outline' fontSize={20} />
            </StyledLink>
          </BootstrapTooltip>
          <BootstrapTooltip title='edit' placement='top'>
            <div
              style={{ cursor: 'pointer' }}
              onClick={() => {
                setUser(row)
                setEditUserOpen(true)
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
        <Card>
          <TableHeader value={searchQuery} handleFilter={handleFilter} />
          {users?.docs && !loading ? (
            <DataGrid
              autoHeight
              rows={users?.docs ?? []}
              columns={columns}
              pageSize={pageSize}
              disableSelectionOnClick
              rowsPerPageOptions={[10]}
              sx={{ '& .MuiDataGrid-columnHeaders': { borderRadius: 0 } }}
              onPageSizeChange={(newPageSize: number) => setPageSize(newPageSize)}
              pagination
              paginationMode='server'
              rowCount={users?.totalDocs}
              page={page}
              onPageChange={newPage => handlePageChange(newPage)}
            />
          ) : (
            <Skeleton variant='rounded' height={600} />
          )}
        </Card>
      </Grid>
      <UserEditDialog open={editUserOpen} handleClose={closeEditUserDialog} data={user} />
      {/* <AddUserDrawer open={addUserOpen} toggle={toggleAddUserDrawer} /> */}
    </Grid>
  )
}

export default UserList
