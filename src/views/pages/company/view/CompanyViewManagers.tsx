import Grid from '@mui/material/Grid'
import CompanyManagerListTable from './CompanyManagerListTable'
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
  Typography,
  useMediaQuery
} from '@mui/material'
import Icon from 'src/@core/components/icon'
import { useEffect, useState } from 'react'
import { styled } from '@mui/material/styles'
import Link from 'next/link'
import CustomChip from 'src/@core/components/mui/chip'
import { BootstrapTooltip } from 'src/pages/companies'
import { Stack } from '@mui/system'
import CompanySuspendDialog from './CompanySuspendDialog'
import { useSelector } from 'react-redux'
import { useDispatch } from 'react-redux'
import { addCompanyManager, getCompanyManagers } from 'src/store/company'
import { getUsers } from 'src/store/user'

const statusColors: any = {
  manager: 'success',
  owner: 'error'
}

interface DataType {
  name: string
  email: string
  value: string
  avatar: string
  type: string
}

interface OptionsType {
  name: string
  avatar: string
}

const data: DataType[] = [
  {
    avatar: '1.png',
    value: 'Can Edit',
    name: 'Lester Palmer',
    type: 'manager',
    email: 'pe@vogeiz.net'
  },
  {
    avatar: '2.png',
    value: 'owner',
    name: 'Mittie Blair',
    type: 'owner',
    email: 'peromak@zukedohik.gov'
  },
  {
    avatar: '3.png',
    value: 'Can Comment',
    name: 'Marvin Wheeler',
    type: 'manager',
    email: 'rumet@jujpejah.net'
  },
  {
    avatar: '4.png',
    value: 'Can View',
    name: 'Nannie Ford',
    type: 'manager',
    email: 'negza@nuv.io'
  },
  {
    avatar: '5.png',
    value: 'Can Edit',
    name: 'Julian Murphy',
    type: 'manager',
    email: 'lunebame@umdomgu.net'
  },
  {
    avatar: '6.png',
    value: 'Can View',
    name: 'Sophie Gilbert',
    type: 'manager',
    email: 'ha@sugit.gov'
  },
  {
    avatar: '7.png',
    value: 'Can Comment',
    name: 'Chris Watkins',
    type: 'manager',
    email: 'zokap@mak.org'
  },
  {
    avatar: '8.png',
    value: 'Can Edit',
    name: 'Adelaide Nichols',
    type: 'manager',
    email: 'ujinomu@jigo.com'
  }
]

const options: OptionsType[] = [
  {
    avatar: '1.png',
    name: 'Chandler Bing'
  },
  {
    avatar: '2.png',
    name: 'Rachel Green'
  },
  {
    avatar: '3.png',
    name: 'Joey Tribbiani'
  },
  {
    avatar: '4.png',
    name: 'Pheobe Buffay'
  },
  {
    avatar: '5.png',
    name: 'Ross Geller'
  },
  {
    avatar: '8.png',
    name: 'Monica Geller'
  }
]

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
  const [suspendDialogOpen, setSuspendDialogOpen] = useState<boolean>(false)
  // const [newManager, setNewManager] = useState<string>('')

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
  }, [statusAddCompanyManager])

  let managersArr = []
  companyData?.created_by ? managersArr.push({ ...companyData?.created_by, type: 'owner' }) : {}
  companyManagers?.user_id ? managersArr.push({ ...companyManagers?.user_id, type: 'manager' }) : {}

  const addNewManager = (newManager: any) => {
    dispatch(addCompanyManager({ companyId, manager_id: newManager?.id }))
  }

  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        {/* <CompanyManagerListTable /> */}
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
            <Typography variant='h6'>{`${managersArr.length} Members`}</Typography>
            <List dense sx={{ py: 4 }}>
              {managersArr.map((manager: any) => {
                return (
                  <ListItem
                    key={manager?.id}
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
                              href={`/companies/view/1/overview`}
                            >{`${manager?.firstname} ${manager?.lastname}`}</StyledLink>
                            <CustomChip
                              skin='light'
                              size='small'
                              label={manager?.type}
                              color={statusColors[manager?.type]}
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
                            onClick={() => setSuspendDialogOpen(true)}
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
      <CompanySuspendDialog open={suspendDialogOpen} setOpen={setSuspendDialogOpen} />
    </Grid>
  )
}

export default CompanyViewManagers
