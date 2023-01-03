// ** React Imports
import { Fragment, useState } from 'react'

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

// ** Store Imports
// import { useDispatch } from 'react-redux'

// ** Actions Imports
// import { addUser } from 'src/store/apps/user'

// ** Types Imports
// import { AppDispatch } from 'src/store'

// import List from '@mui/material/List'
// import ListItem from '@mui/material/ListItem'
import { TypographyProps } from '@mui/material/Typography'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Third Party Components
import toast from 'react-hot-toast'
import { useDropzone } from 'react-dropzone'

interface FileProp {
  name: string
  type: string
  size: number
}

// Styled component for the upload image inside the dropzone area
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

// interface UserData {
//   email: string
//   company: string
//   country: string
//   contact: number
//   fullName: string
//   username: string
// }

// const showErrors = (field: string, valueLen: number, min: number) => {
//   if (valueLen === 0) {
//     return `${field} field is required`
//   } else if (valueLen > 0 && valueLen < min) {
//     return `${field} must be at least ${min} characters`
//   } else {
//     return ''
//   }
// }

const Header = styled(Box)<BoxProps>(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(3, 4),
  justifyContent: 'space-between',
  backgroundColor: theme.palette.background.default
}))

const schema = yup.object().shape({
  company: yup.string().required(),
  name: yup.string().required(),
  description: yup.string().required(),
})

// const defaultValues = {
//   email: '',
//   company: '',
//   country: '',
//   fullName: '',
//   username: '',
//   contact: Number('')
// }

const SidebarAddProject = (props: SidebarAddProjectType) => {
  // ** Props
  const { open, toggle } = props

  // ** State
  // const [plan, setPlan] = useState<string>('basic')
  // const [role, setRole] = useState<string>('subscriber')

  // // ** Hooks
  // const dispatch = useDispatch()
  const {
    reset,
    control,
    setValue,
    handleSubmit,
    formState: { errors }
  } = useForm({
    // defaultValues,
    mode: 'onChange',
    resolver: yupResolver(schema)
  })

  const onSubmit = () => {
    toggle()
    reset()
  }

  const handleClose = () => {
    // setPlan('basic')
    // setRole('subscriber')
    setValue('contact', Number(''))
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

  // const handleRemoveFile = (file: FileProp) => {
  //   const uploadedFiles = files
  //   const filtered = uploadedFiles.filter((i: FileProp) => i.name !== file.name)
  //   setFiles([...filtered])
  // }

  // const fileList = files.map((file: FileProp) => (
  //   <ListItem key={file.name}>
  //     <div className='file-details'>
  //       <div className='file-preview'>{renderFilePreview(file)}</div>
  //       <div>
  //         <Typography className='file-name'>{file.name}</Typography>
  //         <Typography className='file-size' variant='body2'>
  //           {Math.round(file.size / 100) / 10 > 1000
  //             ? `${(Math.round(file.size / 100) / 10000).toFixed(1)} mb`
  //             : `${(Math.round(file.size / 100) / 10).toFixed(1)} kb`}
  //         </Typography>
  //       </div>
  //     </div>
  //     <IconButton onClick={() => handleRemoveFile(file)}>
  //       <Icon icon='mdi:close' fontSize={20} />
  //     </IconButton>
  //   </ListItem>
  // ))

  // const handleRemoveAllFiles = () => {
  //   setFiles([])
  // }

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
              render={({ field: { value, onChange } }) => (
                <TextField
                  value={value}
                  label='Name'
                  onChange={onChange}
                  placeholder='PSP'
                  error={Boolean(errors.fullName)}
                />
              )}
            />
            {errors.fullName && <FormHelperText sx={{ color: 'error.main' }}>{errors.fullName.message}</FormHelperText>}
          </FormControl>
          <FormControl fullWidth sx={{ mb: 6 }}>
            <Controller
              name='phone'
              control={control}
              rules={{ required: true }}
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
              name='description'
              control={control}
              rules={{ required: true }}
              render={({ field: { value, onChange } }) => (
                <TextField
                  value={value}
                  multiline
                  rows={4}
                  label='Address'
                  onChange={onChange}
                  placeholder='Tehran, Vanak ...'
                  error={Boolean(errors.username)}
                />
              )}
            />
            {errors.username && <FormHelperText sx={{ color: 'error.main' }}>{errors.username.message}</FormHelperText>}
          </FormControl>
          <FormControl fullWidth sx={{ mb: 6 }}>
            <Controller
              name='description'
              control={control}
              rules={{ required: true }}
              render={({ field: { value, onChange } }) => (
                <TextField
                  value={value}
                  multiline
                  rows={4}
                  label='Description'
                  onChange={onChange}
                  placeholder='A Company For ...'
                  error={Boolean(errors.username)}
                />
              )}
            />
            {errors.username && <FormHelperText sx={{ color: 'error.main' }}>{errors.username.message}</FormHelperText>}
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
