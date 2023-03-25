// ** React Imports
import { Fragment, useEffect, useState } from 'react'

// ** MUI Imports
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import Select from '@mui/material/Select'
import Divider from '@mui/material/Divider'
import MenuItem from '@mui/material/MenuItem'
import { styled } from '@mui/material/styles'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import InputLabel from '@mui/material/InputLabel'
import CardContent from '@mui/material/CardContent'
import CardActions from '@mui/material/CardActions'
import DialogTitle from '@mui/material/DialogTitle'
import FormControl from '@mui/material/FormControl'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import DialogContentText from '@mui/material/DialogContentText'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Custom Components
import CustomChip from 'src/@core/components/mui/chip'
import CustomAvatar from 'src/@core/components/mui/avatar'
import UserSuspendDialog from 'src/views/pages/user/view/UserSuspendDialog'

// ** Types
import { ThemeColor } from 'src/@core/layouts/types'
import { UsersType } from 'src/types/apps/userTypes'

// ** Utils Import
import { getInitials } from 'src/@core/utils/get-initials'
import { useDropzone } from 'react-dropzone'
import { toast } from 'react-hot-toast'
import { useDispatch } from 'react-redux'
import { getUser } from 'src/store/user'
import { useSelector } from 'react-redux'
import { getFullName, getImagePath } from 'src/helpers/functions'
import Skelet from 'src/@core/components/loading/Skelet'

interface ColorsType {
  [key: string]: ThemeColor
}

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

const Img = styled('img')(({ theme }) => ({
  [theme.breakpoints.down('md')]: {
    marginBottom: theme.spacing(4)
  },
  [theme.breakpoints.down('sm')]: {
    width: 250
  }
}))

// ** Styled <sub> component
const Sub = styled('sub')({
  fontWeight: 300,
  fontSize: '1rem',
  alignSelf: 'flex-end'
})

interface Props {
  userId: string
}

const UserViewLeft = ({ userId }: Props) => {
  // ** States
  const [openEdit, setOpenEdit] = useState<boolean>(false)
  const [files, setFiles] = useState<File[]>([])
  const [suspendDialogOpen, setSuspendDialogOpen] = useState<boolean>(false)

  const dispatch = useDispatch()

  const { data: user, loading, errors } = useSelector((state: any) => state.user)

  useEffect(() => {
    if ([404].includes(errors?.status)) location.href = '/404'
  }, [errors])

  useEffect(() => {
    if (userId) dispatch(getUser(userId))
  }, [userId])

  const { getRootProps, getInputProps } = useDropzone({
    maxFiles: 1,
    maxSize: 2000000,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.gif']
    },
    onDrop: (acceptedFiles: File[]) => {
      setFiles(acceptedFiles.map((file: File) => Object.assign(file)))
    },
    onDropRejected: () => {
      toast.error('You can only upload maximum size of 2 MB.', {
        duration: 2000
      })
    }
  })

  const renderFilePreview = (file: any) => {
    if (file.type.startsWith('image')) {
      return (
        <img
          style={{ borderRadius: '50%', width: '150px', height: '150px' }}
          alt={file.name}
          src={URL.createObjectURL(file as any)}
        />
      )
    } else {
      return <Icon icon='mdi:file-document-outline' />
    }
  }

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
            <Button color='error' variant='outlined' onClick={() => setSuspendDialogOpen(true)}>
              Suspend
            </Button>
          </CardActions>

          <Dialog
            open={openEdit}
            onClose={handleEditClose}
            aria-labelledby='user-view-edit'
            sx={{ '& .MuiPaper-root': { width: '100%', maxWidth: 650, p: [2, 10] } }}
            aria-describedby='user-view-edit-description'
          >
            <DialogTitle id='user-view-edit' sx={{ textAlign: 'center', fontSize: '1.5rem !important' }}>
              Edit User Information
            </DialogTitle>
            <DialogContent>
              <DialogContentText variant='body2' id='user-view-edit-description' sx={{ textAlign: 'center', mb: 7 }}>
                Updating user details will receive a privacy audit.
              </DialogContentText>
              <form>
                <Fragment>
                  <div {...getRootProps({ className: 'dropzone' })}>
                    <input {...getInputProps()} />
                    <Box sx={{ textAlign: 'center', marginBottom: '35px' }}>
                      {files[0] ? (
                        renderFilePreview(files[0])
                      ) : (
                        <Img width={150} alt='Upload img' src='/images/avatars/1.png' sx={{ borderRadius: '50%' }} />
                      )}
                    </Box>
                  </div>
                </Fragment>
                <Grid container spacing={6}>
                  <Grid item xs={12} sm={6}>
                    <TextField fullWidth label='First Name' defaultValue={data.fullName} />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField fullWidth label='Last Name' defaultValue={data.fullName} />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField fullWidth type='email' label='Email' defaultValue={data.email} />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField fullWidth label='Mobile' defaultValue={`+98 ${data.contact}`} />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <FormControl fullWidth>
                      <InputLabel id='user-view-language-label'>Language</InputLabel>
                      <Select
                        label='Language'
                        defaultValue='English'
                        id='user-view-language'
                        labelId='user-view-language-label'
                      >
                        <MenuItem value='English'>English</MenuItem>
                        <MenuItem value='Spanish'>Spanish</MenuItem>
                        <MenuItem value='Portuguese'>Portuguese</MenuItem>
                        <MenuItem value='Russian'>Russian</MenuItem>
                        <MenuItem value='French'>French</MenuItem>
                        <MenuItem value='German'>German</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                </Grid>
              </form>
            </DialogContent>
            <DialogActions sx={{ justifyContent: 'center' }}>
              <Button variant='contained' sx={{ mr: 1 }} onClick={handleEditClose}>
                Submit
              </Button>
              <Button variant='outlined' color='secondary' onClick={handleEditClose}>
                Cancel
              </Button>
            </DialogActions>
          </Dialog>

          <UserSuspendDialog open={suspendDialogOpen} setOpen={setSuspendDialogOpen} />
        </Card>
      </Grid>
    </Grid>
  )
}

export default UserViewLeft
