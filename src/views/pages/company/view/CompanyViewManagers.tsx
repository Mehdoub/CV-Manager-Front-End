import Grid from '@mui/material/Grid'
import {
  Autocomplete,
  Avatar,
  Box,
  Card,
  CardContent,
  InputLabel,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Skeleton,
  TextField,
  Typography
} from '@mui/material'
import Icon from 'src/@core/components/icon'
import { useEffect, useState } from 'react'
import { styled } from '@mui/material/styles'
import Link from 'next/link'
import CustomChip from 'src/@core/components/mui/chip'
import { BootstrapTooltip } from 'src/pages/companies'
import { useSelector } from 'react-redux'
import { useDispatch } from 'react-redux'
import { addCompanyManager, clearAddCompanyManager, getCompanyManagers } from 'src/store/company'
import { getUsers } from 'src/store/user'
import CompanyRemoveManagerDialog from './CompanyRemoveManagerDialog'
import { getFullName, getImagePath } from 'src/helpers/functions'
import { getInitials } from 'src/@core/utils/get-initials'
import CustomAvatar from 'src/@core/components/mui/avatar'
import { DataGrid } from '@mui/x-data-grid'

const statusColors: any = {
  moderator: 'success',
  owner: 'error'
}

const renderClient = (row: any) => {
  if (row?.avatar) {
    return <CustomAvatar src={getImagePath(row?.avatar)} alt={getFullName(row)} sx={{ mr: 3, width: 34, height: 34 }} />
  } else {
    return (
      <CustomAvatar
        skin='light'
        color={row.avatarColor || 'primary'}
        sx={{ mr: 3, width: 34, height: 34, fontSize: '1rem' }}
      >
        {getInitials(row?.firstname ? getFullName(row) : 'John Doe')}
      </CustomAvatar>
    )
  }
}

const StyledLink = styled(Link)(({ theme }: any) => ({
  fontWeight: 600,
  fontSize: '1rem',
  cursor: 'pointer',
  textDecoration: 'none',
  color: theme.palette.text.secondary,
  '&:hover': {
    color: theme.palette.primary.main
  }
}))


const CompanyViewManagers = () => {
  const [removeManagerDialogOpen, setRemoveManagerDialogOpen] = useState<boolean>(false)
  const [managerRemove, setManagerRemove] = useState<any>({})

  const companyStore = useSelector((state: any) => state.company)
  const { data: companyData } = companyStore

  const companyManagersStore = useSelector((state: any) => state.companyManagers)
  const { loading, data: managers } = companyManagersStore

  const usersListStore = useSelector((state: any) => state.usersList)
  const { data: users } = usersListStore

  const addCompanyManagerStore = useSelector((state: any) => state.addCompanyManager)
  const { status: statusAddCompanyManager } = addCompanyManagerStore

  const companyId = companyData?.id

  const dispatch = useDispatch()

  useEffect(() => {
    if (companyId) dispatch(getCompanyManagers(companyId))
    if (statusAddCompanyManager) {
      dispatch(clearAddCompanyManager())
    }
    dispatch(getUsers())
  }, [statusAddCompanyManager, companyId])

  const addNewManager = (newManager: any) => {
    if (newManager?.id?.length > 0) {
      dispatch(addCompanyManager({ companyId, manager_id: newManager?.id }))
    }
  }

  const columns = [
    {
      flex: 0.2,
      minWidth: 230,
      field: 'firstname',
      headerName: 'Name',
      renderCell: ({ row: { user_id } }: any) => {
        return (
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            {renderClient(user_id)}
            <Box sx={{ display: 'flex', alignItems: 'flex-start', flexDirection: 'column' }}>
              <StyledLink href={`/users/view/${user_id?.id}/overview`}>{getFullName(user_id)}</StyledLink>
              <Typography noWrap variant='caption'>{`@${user_id?.username}`}</Typography>
            </Box>
          </Box>
        )
      }
    },
    {
      flex: 0.15,
      minWidth: 120,
      headerName: 'Type',
      field: 'type',
      renderCell: ({ row }: any) => {
        return (
          <Typography variant='subtitle1' noWrap sx={{ textTransform: 'capitalize' }}>
            <CustomChip
              skin='light'
              size='small'
              label={row?.type}
              color={statusColors[row?.type]}
              sx={{
                height: 20,
                fontWeight: 500,
                fontSize: '0.75rem',
                borderRadius: '5px',
                textTransform: 'capitalize'
              }}
            />
          </Typography>
        )
      }
    },
    {
      flex: 0.15,
      minWidth: 120,
      headerName: 'Assign Time',
      field: 'createdAt',
      renderCell: ({ row }: any) => {
        return (
          <Typography variant='subtitle1' noWrap sx={{ textTransform: 'capitalize' }}>
            {new Date(row?.createdAt).toDateString()}
          </Typography>
        )
      }
    },
    {
      flex: 0.15,
      minWidth: 120,
      headerName: 'Assigned By',
      field: 'created_by',
      renderCell: ({ row : { created_by } }: any) => {
        return (
          <Typography variant='subtitle1' noWrap sx={{ textTransform: 'capitalize' }}>
            <StyledLink href={`/users/view/${created_by?.id}/overview`}>{getFullName(created_by)}</StyledLink>
          </Typography>
        )
      }
    },
    {
      flex: 0.1,
      minWidth: 80,
      headerName: ' ',
      field: ' ',
      renderCell: ({ row }: any) => {
        return (
          row?.type !== 'owner' && (
            <BootstrapTooltip title='delete' placement='top'>
              <div
                style={{ cursor: 'pointer', marginTop: '4px' }}
                onClick={() => {
                  setRemoveManagerDialogOpen(true)
                  setManagerRemove(row?.user_id)
                }}
              >
                <Icon color='gray' icon='mdi:delete-outline' fontSize={20} />
              </div>
            </BootstrapTooltip>
          )
        )
      }
    }
  ]

  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <Grid>
          {loading ? (
            <Skeleton variant='rounded' height={400} />
          ) : (
            <Card>
              <CardContent>
                <InputLabel
                  htmlFor='add-members'
                  sx={{
                    mb: 1.5,
                    fontWeight: 500,
                    lineHeight: '2rem',
                    display: 'inline-flex',
                    fontSize: ['1.125rem', '1.25rem']
                  }}
                >
                  Add Managers
                </InputLabel>
                <Autocomplete
                  autoHighlight
                  sx={{ mb: 4 }}
                  id='add-members'
                  options={users?.docs}
                  onChange={(e, newValue) => addNewManager(newValue)}
                  ListboxComponent={List}
                  getOptionLabel={(user: any) => getFullName(user)}
                  renderInput={params => <TextField {...params} size='small' placeholder='Add project managers...' />}
                  renderOption={(props, user) => (
                    <ListItem {...props}>
                      <ListItemAvatar>
                        <Avatar
                          src={`/images/avatars/${user?.avatar}`}
                          alt={getFullName(user)}
                          sx={{ height: 28, width: 28 }}
                        />
                      </ListItemAvatar>
                      <ListItemText primary={getFullName(user)} />
                    </ListItem>
                  )}
                />
                <Typography variant='h6'>{`${managers?.length} Members`}</Typography>
              </CardContent>

              <DataGrid
                autoHeight
                rows={managers}
                columns={columns}
                pageSize={10}
                disableSelectionOnClick
                rowsPerPageOptions={[10]}
              />
            </Card>
          )}
        </Grid>
      </Grid>
      <CompanyRemoveManagerDialog
        open={removeManagerDialogOpen}
        setOpen={setRemoveManagerDialogOpen}
        manager={managerRemove}
      />
    </Grid>
  )
}

export default CompanyViewManagers
