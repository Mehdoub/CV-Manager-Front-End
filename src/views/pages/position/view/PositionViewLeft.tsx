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
import SuspendDialog from 'src/views/common/SuspendDialog'

// ** Types
import { ThemeColor } from 'src/@core/layouts/types'

// ** Utils Import
import { getInitials } from 'src/@core/utils/get-initials'
import { useDropzone } from 'react-dropzone'
import { toast } from 'react-hot-toast'
import { useDispatch } from 'react-redux'
import { useSelector } from 'react-redux'
import {
  activePosition,
  clearPositionActive,
  clearPositionDeactive,
  deactivePosition,
  getPosition
} from 'src/store/position'
import { getImagePath } from 'src/helpers/functions'
import { Skeleton } from '@mui/material'
import Link from 'next/link'
import Translations from 'src/layouts/components/Translations'

interface ColorsType {
  [key: string]: ThemeColor
}

const statusColors: ColorsType = {
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

const Img = styled('img')(({ theme }) => ({
  [theme.breakpoints.down('md')]: {
    marginBottom: theme.spacing(4)
  },
  [theme.breakpoints.down('sm')]: {
    width: 250
  }
}))

const data: any = {
  id: 1,
  role: 'owner',
  managers: 'Emad Rahnama, Mahdi Amereh',
  status: 'active',
  username: 'bpm-psp',
  avatarColor: 'primary',
  country: 'El Salvador',
  company: 'Favin',
  contact: '(21) 232-9151',
  currentPlan: 'enterprise',
  description: 'Hello, We Are A Company That ...',
  address: 'Tehran, Abbas Abad, Sarafraz Street',
  fullName: 'BPM',
  email: 'favin@abc.net.ir',
  avatar: '/images/logos/github.png'
}

interface Props {
  positionId: string
}

const ProjectViewLeft = ({ positionId }: Props) => {
  // ** States
  const [openEdit, setOpenEdit] = useState<boolean>(false)
  const [suspendDialogOpen, setSuspendDialogOpen] = useState<boolean>(false)
  const [files, setFiles] = useState<File[]>([])

  // Handle Edit dialog
  const handleEditClickOpen = () => setOpenEdit(true)
  const handleEditClose = () => setOpenEdit(false)

  const dispatch = useDispatch()

  const positionStore = useSelector((state: any) => state.position)
  const { data: position, loading } = positionStore

  useEffect(() => {
    if (positionId) dispatch(getPosition(positionId))
  }, [positionId])

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
            {position?.logo?.length ? (
              <CustomAvatar
                src={getImagePath(position?.logo)}
                variant='rounded'
                alt={position?.title}
                sx={{ width: 150, height: 150, fontWeight: 600, mb: 4, fontSize: '3rem', borderRadius: '50%' }}
              />
            ) : (
              <CustomAvatar
                skin='light'
                variant='rounded'
                color='primary'
                sx={{ width: 150, height: 150, fontWeight: 600, mb: 4, fontSize: '3rem', borderRadius: '50%' }}
              >
                {getInitials(position?.title)}
              </CustomAvatar>
            )}
            {loading && <Skeleton animation='wave' width='35%' height={30} style={{ marginBottom: '7px' }} />}
            <Typography variant='h6' sx={{ mb: 2 }}>
              {position?.title}
            </Typography>
            {loading ? (
              <Skeleton animation='wave' width='15%' height={30} style={{ marginBottom: '7px' }} />
            ) : (
              <CustomChip
                skin='light'
                size='small'
                label={position?.is_active ? 'active' : 'inactive'}
                color={statusColors[position?.is_active ? 'active' : 'inactive']}
                sx={{
                  height: 20,
                  fontWeight: 500,
                  fontSize: '0.75rem',
                  borderRadius: '5px',
                  textTransform: 'capitalize'
                }}
              />
            )}
          </CardContent>
          <CardContent>
            <Typography variant='h6'>Details</Typography>
            <Divider sx={{ mt: theme => `${theme.spacing(4)} !important` }} />
            <Box sx={{ display: 'flex', mb: 2.7 }}>
              <Typography sx={{ mr: 2, fontWeight: 500, fontSize: '0.875rem' }}>Company:</Typography>
              <StyledLink href={`/companies/view/${position?.company_id}/overview`}>{position?.company_id}</StyledLink>
            </Box>
            <Box sx={{ display: 'flex', mb: 2.7 }}>
              <Typography sx={{ mr: 2, fontWeight: 500, fontSize: '0.875rem' }}>Project:</Typography>
              <StyledLink href={`/projects/view/${position?.project_id}/overview`}>{position?.project_id}</StyledLink>
            </Box>
            <Box sx={{ display: 'flex', mb: 2.7 }}>
              <Typography sx={{ mr: 2, fontWeight: 500, fontSize: '0.875rem' }}>Level:</Typography>
              <Typography variant='body2'>{position?.level}</Typography>
            </Box>
            <Box sx={{ display: 'flex', mb: 2.7 }}>
              <Typography sx={{ mr: 2, fontWeight: 500, fontSize: '0.875rem' }}>Description:</Typography>
              <Typography variant='body2'>{position?.description}</Typography>
            </Box>
          </CardContent>

          <CardActions sx={{ display: 'flex', justifyContent: 'center' }}>
            <Button variant='contained' sx={{ mr: 2 }} onClick={handleEditClickOpen}>
              Edit
            </Button>
            {position?.is_active ? (
              <Button color='error' variant='outlined' onClick={() => setSuspendDialogOpen(true)}>
                <Translations text='companies.view.suspend' />
              </Button>
            ) : (
              <Button color='success' variant='outlined' onClick={() => setSuspendDialogOpen(true)}>
                <Translations text='companies.view.activate' />
              </Button>
            )}
          </CardActions>

          <Dialog
            open={openEdit}
            onClose={handleEditClose}
            aria-labelledby='user-view-edit'
            sx={{ '& .MuiPaper-root': { width: '100%', maxWidth: 650, p: [2, 10] } }}
            aria-describedby='user-view-edit-description'
          >
            <DialogTitle id='user-view-edit' sx={{ textAlign: 'center', fontSize: '1.5rem !important' }}>
              Edit Project Information
            </DialogTitle>
            <DialogContent>
              <DialogContentText variant='body2' id='user-view-edit-description' sx={{ textAlign: 'center', mb: 7 }}>
                Updating project details will receive a privacy audit.
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
                  <Grid item xs={12} sm={6}>
                    <TextField fullWidth label='Company' defaultValue={data.company} />
                  </Grid>
                  <Grid item xs={12} sm={12} md={12}>
                    <TextField
                      fullWidth
                      defaultValue={`${data.description}`}
                      multiline
                      rows={4}
                      label='Description'
                      placeholder='Project Description Shuould Be Here ...'
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

          <SuspendDialog
            open={suspendDialogOpen}
            setOpen={setSuspendDialogOpen}
            type='position'
            entity={position}
            activeStore={useSelector((state: any) => state.positionActive)}
            deactiveStore={useSelector((state: any) => state.positionDeactive)}
            getEntityAction={getPosition}
            activeAction={activePosition}
            deactiveAction={deactivePosition}
            clearActiveAction={clearPositionActive}
            clearDeactiveAction={clearPositionDeactive}
          />
        </Card>
      </Grid>
    </Grid>
  )
}

export default ProjectViewLeft
