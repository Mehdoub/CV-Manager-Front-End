// ** React Imports
import { Fragment, useEffect, useState } from 'react'

// ** MUI Imports
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import Button from '@mui/material/Button'
import Divider from '@mui/material/Divider'
import Typography from '@mui/material/Typography'
import CardContent from '@mui/material/CardContent'
import CardActions from '@mui/material/CardActions'

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
import { Skeleton } from '@mui/material'
import CompanyEditDialog from './CompanyEditDialog'

interface ColorsType {
  [key: string]: ThemeColor
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
          </CardContent>
          <CardContent>
            <Typography variant='h6'>Details</Typography>
            <Divider sx={{ mt: theme => `${theme.spacing(4)} !important` }} />
            <Box sx={{ pt: 2, pb: 1 }}>

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
          <CompanyEditDialog open={openEdit} closeHandler={handleEditClose} companyId={companyId} />
          <CompanySuspendDialog open={suspendDialogOpen} setOpen={setSuspendDialogOpen} />
        </Card>
      </Grid>
    </Grid>
  )
}

export default CompanyViewLeft
