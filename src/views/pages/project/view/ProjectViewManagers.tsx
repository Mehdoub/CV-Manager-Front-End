// ** React Imports
import { useEffect, useState } from 'react'

// ** MUI Imports
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import { DataGrid } from '@mui/x-data-grid'
import { styled } from '@mui/material/styles'
import Typography from '@mui/material/Typography'
import CustomChip from 'src/@core/components/mui/chip'
import CustomAvatar from 'src/@core/components/mui/avatar'
import Icon from 'src/@core/components/icon'
import CustomTextField from 'src/@core/components/custom-textfield'

// ** Type Imports
import Link from 'next/link'
import {
  Autocomplete,
  Avatar,
  CardContent,
  Grid,
  InputLabel,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Skeleton
} from '@mui/material'
import { getInitials } from 'src/@core/utils/get-initials'
import { useDispatch } from 'react-redux'
import { useSelector } from 'react-redux'
import { addProjectManager, getProjectManagers } from 'src/store/project'
import { getFullName, getImagePath } from 'src/helpers/functions'
import { getUsers } from 'src/store/user'
import BootstrapTooltip from 'src/@core/components/bootstrap-tooltip'
import ProjectRemoveManagerDialog from './ProjectRemoveManagerDialog'

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

const ProjectViewManagers = () => {
  const [removeManagerDialogOpen, setRemoveManagerDialogOpen] = useState<boolean>(false)
  const [managerRemove, setManagerRemove] = useState<any>({})
  const [pageSize, setPageSize] = useState<number>(10)

  const dispatch = useDispatch()

  const projectStore = useSelector((state: any) => state.project)
  const { data: project } = projectStore

  const projectManagersStore = useSelector((state: any) => state.projectManagers)
  const { loading, data: managers } = projectManagersStore

  const usersListStore = useSelector((state: any) => state.usersList)
  const { data: users } = usersListStore

  const { status: addMnanagerStatus } = useSelector((state: any) => state.addProjectManager)

  const projectId = project?.id

  useEffect(() => {
    if (addMnanagerStatus) {
      dispatch(getProjectManagers(projectId))
    }
  }, [addMnanagerStatus])

  useEffect(() => {
    if (projectId) dispatch(getProjectManagers(projectId))
  }, [projectId])

  const addNewManager = (newManager: any) => {
    if (newManager?.id?.length > 0) {
      dispatch(addProjectManager({ projectId, manager_id: newManager?.id }))
    }
  }

  const searchUsers = (value: any) => {
    const query = value?.target?.value
    dispatch(getUsers({ query }))
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
      renderCell: ({ row }: any) => {
        return (
          <Typography variant='subtitle1' noWrap sx={{ textTransform: 'capitalize' }}>
            <StyledLink href={`/users/view/${row?.created_by}/overview`}>{row?.created_by}</StyledLink>
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
                  options={users?.docs ?? []}
                  onChange={(e, newValue) => addNewManager(newValue)}
                  ListboxComponent={List}
                  getOptionLabel={(user: any) => getFullName(user)}
                  renderInput={params => (
                    <CustomTextField
                      {...params}
                      onChange={searchUsers}
                      size='small'
                      placeholder='Search for managers...'
                    />
                  )}
                  renderOption={(props, user) => (
                    <ListItem {...props}>
                      <ListItemAvatar>
                        <Avatar
                          src={getImagePath(user?.avatar)}
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
                pageSize={pageSize}
                disableSelectionOnClick
                rowsPerPageOptions={[10]}
                onPageSizeChange={newPageSize => setPageSize(newPageSize)}
              />
            </Card>
          )}
        </Grid>
      </Grid>
      <ProjectRemoveManagerDialog
        open={removeManagerDialogOpen}
        setOpen={setRemoveManagerDialogOpen}
        manager={managerRemove}
      />
    </Grid>
  )
}

export default ProjectViewManagers
