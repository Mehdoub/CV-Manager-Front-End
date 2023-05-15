// ** React Imports
import { useEffect, useState } from 'react'

// ** MUI Imports
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import Button from '@mui/material/Button'
import Divider from '@mui/material/Divider'
import Typography from '@mui/material/Typography'
import CardContent from '@mui/material/CardContent'
import CardActions from '@mui/material/CardActions'

// ** Custom Components
import CustomChip from 'src/@core/components/mui/chip'
import CustomAvatar from 'src/@core/components/mui/avatar'
import UserSuspendDialog from 'src/views/pages/user/view/UserSuspendDialog'

// ** Types
import { ThemeColor } from 'src/@core/layouts/types'
import { UsersType } from 'src/types/apps/userTypes'

// ** Utils Import
import { getInitials } from 'src/@core/utils/get-initials'
import { useDispatch } from 'react-redux'
import { banUser, clearUserBan, clearUserPermit, getUser, permitUser } from 'src/store/user'
import { useSelector } from 'react-redux'
import { getFullName, getImagePath } from 'src/helpers/functions'
import Skelet from 'src/@core/components/loading/Skelet'
import UserEditDialog from './UserEditDialog'
import SuspendDialog from 'src/views/common/SuspendDialog'

const data: UsersType = {
  id: 1,
  role: 'admin',
  status: 'active',
  username: 'gslixby0',
  avatarColor: 'primary',
  country: 'El Salvador',
  company: 'Yotz PVT LTD',
  contact: '(479) 232-9151',
  currentPlan: 'enterprise',
  fullName: 'Daisy Patterson',
  email: 'gslixby0@abc.net.au',
  avatar: '/images/avatars/1.png'
}
interface Props {
  userId: string
}

const UserViewLeft = ({ userId }: Props) => {
  // ** States
  const [openEdit, setOpenEdit] = useState<boolean>(false)
  const [suspendDialogOpen, setSuspendDialogOpen] = useState<boolean>(false)

  const dispatch = useDispatch()

  const { data: user, loading, errors } = useSelector((state: any) => state.user)

  useEffect(() => {
    if ([404].includes(errors?.status)) location.href = '/404'
  }, [errors])

  useEffect(() => {
    if (userId) dispatch(getUser(userId))
  }, [userId])

  // Handle Edit dialog
  const handleEditClickOpen = () => setOpenEdit(true)
  const handleEditClose = () => setOpenEdit(false)

  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <Card>
          <CardContent sx={{ pt: 15, display: 'flex', alignItems: 'center', flexDirection: 'column' }}>
            <Skelet
              loading={loading}
              sx={{ mb: '20px' }}
              variant='circular'
              width={150}
              height={150}
              component={
                user?.avatar?.length ? (
                  <CustomAvatar
                    src={getImagePath(user?.avatar)}
                    variant='rounded'
                    alt={getFullName(user)}
                    sx={{ width: 150, height: 150, fontWeight: 600, mb: 4, fontSize: '3rem', borderRadius: '50%' }}
                  />
                ) : (
                  <CustomAvatar
                    skin='light'
                    variant='rounded'
                    color='primary'
                    sx={{ width: 150, height: 150, fontWeight: 600, mb: 4, fontSize: '3rem', borderRadius: '50%' }}
                  >
                    {getInitials(getFullName(user))}
                  </CustomAvatar>
                )
              }
            />
            <Skelet
              loading={loading}
              sx={{ mb: '20px' }}
              width='35%'
              component={
                <Typography variant='h6' sx={{ mb: 2 }}>
                  {getFullName(user)}
                </Typography>
              }
            />
            <Skelet
              loading={loading}
              width='15%'
              component={
                <CustomChip
                  skin='light'
                  size='small'
                  label={user?.is_banned ? 'Banned' : 'Active'}
                  color={user?.is_banned ? 'error' : 'success'}
                  sx={{
                    height: 20,
                    fontWeight: 600,
                    borderRadius: '5px',
                    fontSize: '0.875rem',
                    textTransform: 'capitalize',
                    '& .MuiChip-label': { mt: -0.25 }
                  }}
                />
              }
            />
          </CardContent>
          <CardContent>
            <Typography variant='h6'>Details</Typography>
            <Divider sx={{ mt: theme => `${theme.spacing(4)} !important` }} />
            <Box sx={{ pt: 2, pb: 1 }}>
              <Box sx={{ display: 'flex', mb: 2.7 }}>
                <Typography variant='subtitle2' sx={{ mr: 2, color: 'text.primary' }}>
                  Username:
                </Typography>
                <Skelet
                  loading={loading}
                  width='50%'
                  component={<Typography variant='body2'>@{user?.username}</Typography>}
                />
              </Box>
              <Box sx={{ display: 'flex', mb: 2.7 }}>
                <Typography variant='subtitle2' sx={{ mr: 2, color: 'text.primary' }}>
                  Email:
                </Typography>
                <Skelet
                  loading={loading}
                  width='50%'
                  component={<Typography variant='body2'>{user?.email ?? '---'}</Typography>}
                />
              </Box>
              <Box sx={{ display: 'flex', mb: 2.7 }}>
                <Typography sx={{ mr: 2, fontWeight: 500, fontSize: '0.875rem' }}>Mobile:</Typography>
                <Skelet
                  loading={loading}
                  width='50%'
                  component={<Typography variant='body2'>+98 {user?.mobile}</Typography>}
                />
              </Box>
              <Box sx={{ display: 'flex', mb: 2.7 }}>
                <Typography sx={{ mr: 2, fontWeight: 500, fontSize: '0.875rem' }}>Language:</Typography>
                <Typography variant='body2'>English</Typography>
              </Box>
            </Box>
          </CardContent>

          <CardActions sx={{ display: 'flex', justifyContent: 'center' }}>
            <Button variant='contained' sx={{ mr: 2 }} onClick={handleEditClickOpen}>
              Edit
            </Button>
            <Button
              color={user?.is_banned ? 'success' : 'error'}
              variant='outlined'
              onClick={() => setSuspendDialogOpen(true)}
            >
              {user?.is_banned ? 'Avtivate' : 'Suspend'}
            </Button>
          </CardActions>

          <UserEditDialog open={openEdit} handleClose={handleEditClose} data={data} />
          <SuspendDialog
            open={suspendDialogOpen}
            setOpen={setSuspendDialogOpen}
            type='user'
            entity={user}
            activeStore={useSelector((state: any) => state.userPermit)}
            deactiveStore={useSelector((state: any) => state.userBan)}
            getEntityAction={getUser}
            activeAction={permitUser}
            deactiveAction={banUser}
            clearActiveAction={clearUserPermit}
            clearDeactiveAction={clearUserBan}
            activeField='is_banned'
          />
        </Card>
      </Grid>
    </Grid>
  )
}

export default UserViewLeft
