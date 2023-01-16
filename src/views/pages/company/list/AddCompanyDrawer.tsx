// ** React Imports
import { Fragment, useEffect, useState } from 'react'

// ** MUI Imports
import Drawer from '@mui/material/Drawer'
import Button from '@mui/material/Button'
import { styled } from '@mui/material/styles'
import TextField from '@mui/material/TextField'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import Box, { BoxProps } from '@mui/material/Box'
import FormControl from '@mui/material/FormControl'
import FormHelperText from '@mui/material/FormHelperText'

// ** Third Party Imports
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import { useForm, Controller } from 'react-hook-form'

import { TypographyProps } from '@mui/material/Typography'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Third Party Components
import toast from 'react-hot-toast'
import { useDropzone } from 'react-dropzone'
import { useDispatch } from 'react-redux'
import { clearCreateCompany, createCompany, getCompanies } from 'src/store/company'
import { useSelector } from 'react-redux'

interface FileProp {
  name: string
  type: string
  size: number
}

// Styled component for the upload image inside the dropzone area
const Img = styled('img')(({ theme }) => ({
  [theme.breakpoints.down('md')]: {
    marginBottom: theme.spacing(4)
  },
  [theme.breakpoints.down('sm')]: {
    width: 250
  }
}))

// Styled component for the heading inside the dropzone area
const HeadingTypography = styled(Typography)<TypographyProps>(({ theme }) => ({
  marginBottom: theme.spacing(5),
  [theme.breakpoints.down('sm')]: {
    marginBottom: theme.spacing(4)
  }
}))

interface SidebarAddProjectType {
  open: boolean
  toggle: () => void
}

const Header = styled(Box)<BoxProps>(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(3, 4),
  justifyContent: 'space-between',
  backgroundColor: theme.palette.background.default
}))

const schema = yup.object().shape(
  {
    name: yup.string().label('Name').required().min(3),
    phone: yup.string().when('phone', (val, schema) => {
      if (val?.length > 0) {
        return yup
          .string()
          .matches(/^0[\d]{10}$/, 'Phone Is Not Valid (example: 02123456789)')
          .required()
      } else {
        return yup.string().notRequired()
      }
    }),
    address: yup.string().when('address', (val, schema) => {
      if (val?.length > 0) {
        return yup.string().label('Address').min(10).max(100).required()
      } else {
        return yup.string().notRequired()
      }
    }),
    description: yup.string().when('description', (val, schema) => {
      if (val?.length > 0) {
        return yup.string().label('Description').min(10).max(100).required()
      } else {
        return yup.string().notRequired()
      }
    })
  },
  [
    ['phone', 'phone'],
    ['address', 'address'],
    ['description', 'description']
  ]
)

export interface CompanyFormData {
  name: string
  phone: string | null
  address: string | null
  description: string | null
}

const defaultValues = {
  name: '',
  phone: '',
  address: '',
  description: '',
}

const SidebarAddProject = (props: SidebarAddProjectType) => {
  // ** Props
  const { open, toggle } = props

  const dispatch = useDispatch()
  const store = useSelector((state: any) => state.createCompany)
  const { status } = store

  const {
    reset,
    control,
    setValue,
    handleSubmit,
    formState: { errors }
  } = useForm({
    defaultValues,
    mode: 'onBlur',
    resolver: yupResolver(schema)
  })

  const clearInputs = () => {
    setValue('name', '')
    setValue('phone', '')
    setValue('address', '')
    setValue('description', '')
  }

  useEffect(() => {
    if (status) {
      dispatch(getCompanies())
      toast.success('Company Created Successfully', { position: 'bottom-left', duration: 5000 })
      clearInputs()
      dispatch(clearCreateCompany())
    }
  }, [status])

  const onSubmit = (data: CompanyFormData) => {
    dispatch(createCompany(data))
    toggle()
    reset()
  }

  const handleClose = () => {
    clearInputs()
    setFiles([])
    toggle()
    reset()
  }

  // ** State
  const [files, setFiles] = useState<File[]>([])

  // ** Hooks
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

  const renderFilePreview = (file: FileProp) => {
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
    <Drawer
      open={open}
      anchor='right'
      variant='temporary'
      onClose={handleClose}
      ModalProps={{ keepMounted: true }}
      sx={{ '& .MuiDrawer-paper': { width: { xs: 300, sm: 400 } } }}
    >
      <Header>
        <Typography variant='h6'>Add Company</Typography>
        <IconButton size='small' onClick={handleClose} sx={{ color: 'text.primary' }}>
          <Icon icon='mdi:close' fontSize={20} />
        </IconButton>
      </Header>
      <Box sx={{ p: 5 }}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Fragment>
            <div {...getRootProps({ className: 'dropzone' })}>
              <input {...getInputProps()} />
              <Box sx={{ textAlign: 'center' }}>
                <HeadingTypography sx={{ marginBottom: '10px' }} variant='h6'>
                  Drop logo here or click to upload
                </HeadingTypography>
                {files[0] ? (
                  renderFilePreview(files[0])
                ) : (
                  <Img width={150} alt='Upload img' src='/images/avatars/1.png' sx={{ borderRadius: '50%' }} />
                )}
                <Box
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    textAlign: ['center', 'center', 'inherit'],
                    margin: '10px 0'
                  }}
                >
                  <Typography sx={{ fontSize: '12px' }} color='textSecondary'>
                    Allowed *.jpeg, *.jpg, *.png, *.gif
                  </Typography>
                  <Typography sx={{ fontSize: '12px' }} color='textSecondary'>
                    Max size of 2 MB
                  </Typography>
                </Box>
              </Box>
            </div>
          </Fragment>
          <FormControl fullWidth sx={{ mb: 6 }}>
            <Controller
              name='name'
              control={control}
              rules={{ required: true }}
              render={({ field: { value, onChange, onBlur } }) => (
                <TextField
                  value={value}
                  label='Name'
                  onBlur={onBlur}
                  onChange={onChange}
                  placeholder='PSP'
                  error={Boolean(errors.name)}
                />
              )}
            />
            {errors.name && <FormHelperText sx={{ color: 'error.main' }}>{errors.name.message}</FormHelperText>}
          </FormControl>
          <FormControl fullWidth sx={{ mb: 6 }}>
            <Controller
              name='phone'
              control={control}
              render={({ field: { value, onChange } }) => (
                <TextField
                  value={value}
                  label='Phone'
                  onChange={onChange}
                  placeholder='02188651256'
                  error={Boolean(errors.phone)}
                />
              )}
            />
            {errors.phone && <FormHelperText sx={{ color: 'error.main' }}>{errors.phone.message}</FormHelperText>}
          </FormControl>
          <FormControl fullWidth sx={{ mb: 6 }}>
            <Controller
              name='address'
              control={control}
              render={({ field: { value, onChange } }) => (
                <TextField
                  value={value}
                  multiline
                  rows={4}
                  label='Address'
                  onChange={onChange}
                  placeholder='Tehran, Vanak ...'
                  error={Boolean(errors.address)}
                />
              )}
            />
            {errors.address && <FormHelperText sx={{ color: 'error.main' }}>{errors.address.message}</FormHelperText>}
          </FormControl>
          <FormControl fullWidth sx={{ mb: 6 }}>
            <Controller
              name='description'
              control={control}
              render={({ field: { value, onChange } }) => (
                <TextField
                  value={value}
                  multiline
                  rows={4}
                  label='Description'
                  onChange={onChange}
                  placeholder='A Company For ...'
                  error={Boolean(errors.description)}
                />
              )}
            />
            {errors.description && (
              <FormHelperText sx={{ color: 'error.main' }}>{errors.description.message}</FormHelperText>
            )}
          </FormControl>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Button size='large' type='submit' variant='contained' sx={{ mr: 3 }}>
              Submit
            </Button>
            <Button size='large' variant='outlined' color='secondary' onClick={handleClose}>
              Cancel
            </Button>
          </Box>
        </form>
      </Box>
    </Drawer>
  )
}

export default SidebarAddProject
