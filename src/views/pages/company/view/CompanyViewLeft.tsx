// ** React Imports
import { Fragment, useEffect, useState } from 'react'

// ** MUI Imports
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import Divider from '@mui/material/Divider'
import { styled } from '@mui/material/styles'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import CardContent from '@mui/material/CardContent'
import CardActions from '@mui/material/CardActions'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import DialogContentText from '@mui/material/DialogContentText'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Custom Components
import CustomChip from 'src/@core/components/mui/chip'
import CustomAvatar from 'src/@core/components/mui/avatar'
import CompanySuspendDialog from 'src/views/pages/company/view/CompanySuspendDialog'

// ** Types
import { ThemeColor } from 'src/@core/layouts/types'

// ** Utils Import
import { getInitials } from 'src/@core/utils/get-initials'
import { useDropzone } from 'react-dropzone'
import { toast } from 'react-hot-toast'
import { useDispatch } from 'react-redux'
import { getCompany } from 'src/store/company'
import { useSelector } from 'react-redux'
import { Avatar, Chip, Skeleton } from '@mui/material'

interface ColorsType {
  [key: string]: ThemeColor
}

const Img = styled('img')(({ theme }) => ({
  // [theme.breakpoints.up('md')]: {
  //   marginRight: theme.spacing(10)
  // },
  [theme.breakpoints.down('md')]: {
    marginBottom: theme.spacing(4)
  },
  [theme.breakpoints.down('sm')]: {
    width: 250
  }
}))

const data: any = {
  id: 1,
  role: 'admin',
  managers: 'Ali Fallah',
  status: 'active',
  username: 'fatertejarat',
  avatarColor: 'primary',
  country: 'El Salvador',
  company: 'Yotz PVT LTD',
  contact: '(21) 232-9151',
  currentPlan: 'enterprise',
  description: 'Hello, We Are A Company That ...',
  address: 'Tehran, Abbas Abad, Sarafraz Street',
  fullName: 'Favin',
  email: 'favin@abc.net.ir',
  avatar: '/images/logos/sample-logo.jpeg'
}

const roleColors: ColorsType = {
  admin: 'error',
  editor: 'info',
  author: 'warning',
  maintainer: 'success',
  subscriber: 'primary'
}

const statusColors: ColorsType = {
  active: 'success',
  inactive: 'secondary'
}

interface Props {
  companyId: string
}

const CompanyViewLeft = ({ companyId }: Props) => {
  // ** States
  const [openEdit, setOpenEdit] = useState<boolean>(false)
  const [suspendDialogOpen, setSuspendDialogOpen] = useState<boolean>(false)
  const [files, setFiles] = useState<File[]>([])

  const dispatch = useDispatch()
  const store = useSelector((state: any) => state.company)
  const {
    data: company,
    // managers,
    loading
  } = store

  useEffect(() => {
    if (companyId) {
      dispatch(getCompany(companyId))
    }
  }, [companyId])

  // Handle Edit dialog
  const handleEditClickOpen = () => setOpenEdit(true)
  const handleEditClose = () => setOpenEdit(false)

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

  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <Card>
          <CardContent sx={{ pt: 15, display: 'flex', alignItems: 'center', flexDirection: 'column' }}>
            {loading ? (
              <Skeleton animation='wave' variant='circular' width={150} height={150} />
            ) : company?.logo ? (
              <CustomAvatar
                src={company?.logo}
                variant='rounded'
                alt={company?.name}
                sx={{ width: 150, height: 150, fontWeight: 600, mb: 4, fontSize: '3rem', borderRadius: '50%' }}
              />
            ) : (
              <CustomAvatar
                skin='light'
                variant='rounded'
                color='primary'
                sx={{ width: 150, height: 150, fontWeight: 600, mb: 4, fontSize: '3rem', borderRadius: '50%' }}
              >
                {getInitials(company?.name)}
              </CustomAvatar>
            )}
            <Typography variant='h6' sx={{ mb: 2 }}>
              {company?.name}
            </Typography>
            {loading && <Skeleton animation='wave' width='35%' height={30} style={{ marginBottom: '7px' }} />}
            {loading ? (
              <Skeleton animation='wave' width='15%' height={30} style={{ marginBottom: '7px' }} />
            ) : (
              <CustomChip
                skin='light'
                size='small'
                label={data.role}
                color={roleColors[data.role]}
                sx={{
                  height: 20,
                  fontWeight: 600,
                  borderRadius: '5px',
                  fontSize: '0.875rem',
                  textTransform: 'capitalize',
                  '& .MuiChip-label': { mt: -0.25 }
                }}
              />
            )}
          </CardContent>
          <CardContent>
            <Typography variant='h6'>Details</Typography>
            <Divider sx={{ mt: theme => `${theme.spacing(4)} !important` }} />
            <Box sx={{ pt: 2, pb: 1 }}>
              <Box sx={{ display: 'flex', mb: 2.7 }}>
                <Typography variant='subtitle2' sx={{ mr: 2, color: 'text.primary' }}>
                  Status:
                </Typography>
                {loading ? (
                  <Skeleton animation='wave' width='15%' />
                ) : (
                  <CustomChip
                    skin='light'
                    size='small'
                    label={company?.is_active ? 'active' : 'inactive'}
                    color={statusColors[company?.is_active ? 'active' : 'inactive']}
                    sx={{
                      height: 20,
                      fontWeight: 500,
                      fontSize: '0.75rem',
                      borderRadius: '5px',
                      textTransform: 'capitalize'
                    }}
                  />
                )}
              </Box>
              <Box sx={{ display: 'flex', mb: 2.7 }}>
                <Typography sx={{ mr: 2, fontWeight: 500, fontSize: '0.875rem' }}>Phone:</Typography>
                {loading ? (
                  <Skeleton animation='wave' width='50%' />
                ) : (
                  <Typography variant='body2'>{company?.phone?.length > 0 ? company?.phone : '---'}</Typography>
                )}
              </Box>
              <Box sx={{ display: 'flex', mb: 2.7 }}>
                <Typography sx={{ mr: 2, fontWeight: 500, fontSize: '0.875rem' }}>Address:</Typography>
                {loading ? (
                  <Skeleton animation='wave' width='50%' />
                ) : (
                  <Typography variant='body2'>{company?.address?.length > 0 ? company?.address : '---'}</Typography>
                )}
              </Box>
              <Box sx={{ display: 'flex' }}>
                <Typography sx={{ mr: 2, fontWeight: 500, fontSize: '0.875rem' }}>Description:</Typography>
                {loading ? (
                  <Skeleton animation='wave' width='50%' />
                ) : (
                  <Typography variant='body2'>
                    {company?.description?.length > 0 ? company?.description : '---'}
                  </Typography>
                )}
              </Box>
              {/* <Box sx={{ display: 'flex', mb: 2.7 }}>
                <Typography variant='subtitle2' sx={{ mr: 2, color: 'text.primary', mt: '10px' }}>
                  Manager(s):
                </Typography>
                <Typography variant='body2' style={{ marginTop: '5px' }}>
                  {managers.map((manager: any, index: number) => (
                    <Chip
                      key={index}
                      label={`${manager?.firstname} ${manager?.lastname}`}
                      avatar={<Avatar src={manager?.avatar} />}
                      style={{ marginTop: '3px' }}
                    />
                  ))}
                </Typography>
                {loading && <Skeleton animation='wave' width='50%' style={{ marginTop: '9px' }} />}
              </Box> */}
            </Box>
          </CardContent>
          {!loading && (
            <CardActions sx={{ display: 'flex', justifyContent: 'center' }}>
              <Button variant='contained' sx={{ mr: 2 }} onClick={handleEditClickOpen}>
                Edit
              </Button>
              <Button color='error' variant='outlined' onClick={() => setSuspendDialogOpen(true)}>
                Suspend
              </Button>
            </CardActions>
          )}

          <Dialog
            open={openEdit}
            onClose={handleEditClose}
            aria-labelledby='user-view-edit'
            sx={{ '& .MuiPaper-root': { width: '100%', maxWidth: 650, p: [2, 10] } }}
            aria-describedby='user-view-edit-description'
          >
            <DialogTitle id='user-view-edit' sx={{ textAlign: 'center', fontSize: '1.5rem !important' }}>
              Edit Company Information
            </DialogTitle>
            <DialogContent>
              <DialogContentText variant='body2' id='user-view-edit-description' sx={{ textAlign: 'center', mb: 7 }}>
                Updating company details will receive a privacy audit.
              </DialogContentText>
              <form>
                <Fragment>
                  <div {...getRootProps({ className: 'dropzone' })}>
                    <input {...getInputProps()} />
                    <Box sx={{ textAlign: 'center' }}>
                      {files[0] ? (
                        renderFilePreview(files[0])
                      ) : (
                        <Img
                          width={140}
                          alt='Upload img'
                          src='/images/logos/facebook-round.png'
                          sx={{ borderRadius: '50%', marginBottom: '25px' }}
                        />
                      )}
                    </Box>
                  </div>
                </Fragment>
                <Grid container spacing={6}>
                  <Grid item xs={12} sm={6}>
                    <TextField fullWidth label='Name' defaultValue={data.fullName} />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField fullWidth label='Phone' defaultValue={`+98 ${data.contact}`} />
                  </Grid>
                  <Grid item xs={12} sm={12} md={12}>
                    <TextField
                      fullWidth
                      defaultValue={`${data.address}`}
                      multiline
                      rows={4}
                      label='Address'
                      placeholder='Company Address Shuould Be Here ...'
                    />
                  </Grid>
                  <Grid item xs={12} sm={12} md={12}>
                    <TextField
                      fullWidth
                      defaultValue={`${data.description}`}
                      multiline
                      rows={4}
                      label='Description'
                      placeholder='Company Description Shuould Be Here ...'
                    />
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

          <CompanySuspendDialog open={suspendDialogOpen} setOpen={setSuspendDialogOpen} />
        </Card>
      </Grid>
    </Grid>
  )
}

export default CompanyViewLeft
