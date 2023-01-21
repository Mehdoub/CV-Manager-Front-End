import Grid from '@mui/material/Grid'
import {
  Autocomplete,
  Avatar,
  Card,
  CardContent,
  CardHeader,
  InputLabel,
  List,
  ListItem,
  ListItemAvatar,
  ListItemSecondaryAction,
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
import { toast } from 'react-hot-toast'

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

interface Props {
  companyId: string
}

const CompanyViewManagers = ({ companyId }: Props) => {
  const [removeManagerDialogOpen, setRemoveManagerDialogOpen] = useState<boolean>(false)
  const [managerRemove, setManagerRemove] = useState<any>({})

  const companyStore = useSelector((state: any) => state.company)
  const { loading, data: companyData } = companyStore

  const companyManagersStore = useSelector((state: any) => state.companyManagers)
  const { data: companyManagers } = companyManagersStore

  const usersListStore = useSelector((state: any) => state.usersList)
  const { data: users } = usersListStore

  const addCompanyManagerStore = useSelector((state: any) => state.addCompanyManager)
  const { status: statusAddCompanyManager } = addCompanyManagerStore

  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(getCompanyManagers(companyId))
    dispatch(getUsers())
    if (statusAddCompanyManager) {
      toast.success('Manager Added To Company Successfully!', {position: 'bottom-left', duration: 5000})
      dispatch(clearAddCompanyManager())
    }
  }, [statusAddCompanyManager])

  let managersList = []
  managersList = companyManagers?.length > 0 ? [...companyManagers] : []
  companyData?.created_by ? managersList.push({ ...companyData?.created_by, type: 'owner' }) : {}

  const addNewManager = (newManager: any) => {
    if (newManager?.id?.length > 0) {
      dispatch(addCompanyManager({ companyId, manager_id: newManager?.id }))
    }
  }

  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <Card>
          <CardContent sx={{ position: 'relative' }}>
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
              sx={{ mb: 8 }}
              id='add-members'
              options={users?.docs}
              onChange={(e, newValue) => addNewManager(newValue)}
              ListboxComponent={List}
              getOptionLabel={(user: any) => `${user?.firstname} ${user?.lastname}`}
              renderInput={params => <TextField {...params} size='small' placeholder='Add project managers...' />}
              renderOption={(props, user) => (
                <ListItem {...props}>
                  <ListItemAvatar>
                    <Avatar
                      src={`/images/avatars/${user?.avatar}`}
                      alt={`${user?.firstname} ${user?.lastname}`}
                      sx={{ height: 28, width: 28 }}
                    />
                  </ListItemAvatar>
                  <ListItemText primary={`${user?.firstname} ${user?.lastname}`} />
                </ListItem>
              )}
            />
            <Typography variant='h6'>{`${managersList.length} Members`}</Typography>
            <List dense sx={{ py: 4 }}>
              {managersList.map((manager: any, index: number) => {
                manager = manager?.type == 'owner' ? manager : manager?.user_id
                return (
                  <ListItem
                    key={manager?.id + index}
                    sx={{
                      p: 0,
                      display: 'flex',
                      flexWrap: 'wrap',
                      '.MuiListItem-container:not(:last-child) &': { mb: 4 }
                    }}
                  >
                    <ListItemAvatar>
                      <Avatar
                        src={`/images/avatars/${manager?.avatar}`}
                        alt={`${manager?.firstname} ${manager?.lastname}`}
                      />
                    </ListItemAvatar>
                    <ListItemText
                      primary={
                        <>
                          <Typography variant='subtitle1' noWrap sx={{ textTransform: 'capitalize' }}>
                            <StyledLink
                              href={`/users/view/${manager?.id}/overview`}
                            >{`${manager?.firstname} ${manager?.lastname}`}</StyledLink>
                            <CustomChip
                              skin='light'
                              size='small'
                              label={manager?.type == 'owner' ? 'owner' : 'manager'}
                              color={manager?.type == 'owner' ? 'error' : 'success'}
                              sx={{
                                height: 20,
                                fontWeight: 500,
                                fontSize: '0.75rem',
                                borderRadius: '5px',
                                textTransform: 'capitalize',
                                marginLeft: '5px'
                              }}
                            />
                          </Typography>
                        </>
                      }
                      secondary={manager?.email}
                      sx={{
                        m: 0,
                        '& .MuiListItemText-primary, & .MuiListItemText-secondary': { lineHeight: '1.25rem' }
                      }}
                    />
                    <ListItemSecondaryAction sx={{ right: 0 }}>
                      {manager?.type !== 'owner' && (
                        <BootstrapTooltip title='delete' placement='top'>
                          <div
                            style={{ cursor: 'pointer', marginTop: '4px' }}
                            onClick={() => {
                              setRemoveManagerDialogOpen(true)
                              setManagerRemove(manager)
                            }}
                          >
                            <Icon color='gray' icon='mdi:delete-outline' fontSize={20} />
                          </div>
                        </BootstrapTooltip>
                      )}
                    </ListItemSecondaryAction>
                  </ListItem>
                )
              })}
              {loading && (
                <>
                  <CardHeader
                    avatar={<Skeleton animation='wave' variant='circular' width={50} height={50} />}
                    title={<Skeleton animation='wave' width='35%' />}
                    subheader={<Skeleton animation='wave' width='25%' />}
                  />
                  <CardHeader
                    avatar={<Skeleton animation='wave' variant='circular' width={50} height={50} />}
                    title={<Skeleton animation='wave' width='35%' />}
                    subheader={<Skeleton animation='wave' width='25%' />}
                  />
                </>
              )}
            </List>
          </CardContent>
        </Card>
      </Grid>
      <CompanyRemoveManagerDialog
        open={removeManagerDialogOpen}
        setOpen={setRemoveManagerDialogOpen}
        manager={managerRemove}
        companyId={companyId}
      />
    </Grid>
  )
}

export default CompanyViewManagers
