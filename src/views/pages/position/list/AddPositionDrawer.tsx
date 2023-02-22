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
import { Autocomplete, Avatar, CircularProgress, InputLabel, List, ListItem, ListItemAvatar, ListItemText, MenuItem, Select } from '@mui/material'
import { useDispatch } from 'react-redux'
import { clearPositionCreate, createPosition, getPositions } from 'src/store/position'
import { getImagePath, setServerValidationErrors } from 'src/helpers/functions'
import { useSelector } from 'react-redux'
import { getProjectPositions, getProjects } from 'src/store/project'

interface FileProp {
  name: string
  type: string
  size: number
}

const levelOptions = ['senior', 'mid', 'junior']

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

interface AddPositionDrawerType {
  open: boolean
  toggle: () => void
  dispatchProjectPositionsList?: boolean
}

const Header = styled(Box)<BoxProps>(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(3, 4),
  justifyContent: 'space-between',
  backgroundColor: theme.palette.background.default
}))

const schema = yup.object().shape({
  title: yup.string().label('Title').min(3).max(50).required(),
  // project: yup.string().label('Project').optional(),
  level: yup.string().label('Level').oneOf(levelOptions),
  description: yup.string().label('Description').min(10).max(100).required()
})

const defaultValues = {
  title: '',
  // project: '',
  level: '',
  description: ''
}

export interface PositionFormData {
  title: string
  project_id?: string
  description: string
  level: string
  logo?: any
}

const AddPositionDrawer = (props: AddPositionDrawerType) => {
  // ** Props
  const { open, toggle, dispatchProjectPositionsList } = props

  const [positionProject, setPositionProject] = useState<any>({})
  const [projectErr, setProjectErr] = useState<string>('')

  const dispatch = useDispatch()

  const positionCreateStore = useSelector((state: any) => state.positionCreate)
  const { status, errors: createErrors } = positionCreateStore

  const { data: project } = useSelector((state: any) => state.projectFind)

  const { data: projects, loading: loadingSearchProjects } = useSelector((state: any) => state.projectsList)

  const projectId = dispatchProjectPositionsList && project?.id ? project?.id : null

  const {
    reset,
    control,
    setError,
    handleSubmit,
    formState: { errors }
  } = useForm({
    defaultValues,
    mode: 'onChange',
    resolver: yupResolver(schema)
  })

  useEffect(() => {
    if (status) {
      if (dispatchProjectPositionsList) dispatch(getProjectPositions())
      else dispatch(getPositions())
      dispatch(clearPositionCreate())
      setProjectErr('')
      setPositionProject({})
      toggle()
      reset()
    }
    if (createErrors) {
      const validationErrors = createErrors?.data?.errors[0]
      setServerValidationErrors(validationErrors, setError)
    }
  }, [status, createErrors])

  const onSubmit = (data: any) => {
    const newProject = projectId ?? positionProject?.id
    if (!newProject) setProjectErr('Project Cannot Be Empty!')
    else dispatch(
      createPosition({ title: data?.title, project_id: newProject, level: data?.level, description: data?.description })
    )
  }

  const handleClose = () => {
    toggle()
    dispatch(clearPositionCreate())
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

  const searchProjects = (value: any) => {
    const query = value?.target?.value
    if (query?.length > 0) dispatch(getProjects({ query }))
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
        <Typography variant='h6'>Add Position</Typography>
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
                  Drop picture here or click to upload
                </HeadingTypography>
                {files[0] ? (
                  renderFilePreview(files[0])
                ) : (
                  <Img width={150} alt='Upload img' src='/images/logos/frontend-2.jpg' sx={{ borderRadius: '50%' }} />
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
              name='title'
              control={control}
              rules={{ required: true }}
              render={({ field: { value, onChange } }) => (
                <TextField
                  value={value}
                  label='Title'
                  onChange={onChange}
                  placeholder='Example: Front-end'
                  error={Boolean(errors.title)}
                />
              )}
            />
            {errors.title && <FormHelperText sx={{ color: 'error.main' }}>{errors.title.message}</FormHelperText>}
          </FormControl>
          {!projectId && (
            <FormControl fullWidth sx={{ mb: 6 }}>
              <Autocomplete
                autoHighlight
                loading={loadingSearchProjects}
                options={projects?.docs ?? []}
                onChange={(e, newValue) => setPositionProject(newValue)}
                getOptionLabel={(projectItem: any) => projectItem?.name}
                ListboxComponent={List}
                renderInput={params => (
                  <TextField
                    {...params}
                    label='Project'
                    onChange={searchProjects}
                    size='medium'
                    placeholder='Search For Projects ...'
                    error={!!projectErr}
                    InputProps={{
                      ...params.InputProps,
                      endAdornment: (
                        <Fragment>
                          {loadingSearchProjects ? <CircularProgress color='inherit' size={20} /> : null}
                          {params.InputProps.endAdornment}
                        </Fragment>
                      )
                    }}
                  />
                )}
                renderOption={(props, projectItem) => (
                  <ListItem {...props}>
                    <ListItemAvatar>
                      <Avatar src={getImagePath(projectItem?.logo)} alt={projectItem?.name} sx={{ height: 28, width: 28 }} />
                    </ListItemAvatar>
                    <ListItemText primary={projectItem?.name} />
                  </ListItem>
                )}
              />
              {projectErr && <FormHelperText sx={{ color: 'error.main' }}>{projectErr}</FormHelperText>}
            </FormControl>
          )}
          <FormControl fullWidth sx={{ mb: 6 }}>
            <Controller
              name='level'
              control={control}
              rules={{ required: true }}
              render={({ field: { value, onChange } }) => (
                <>
                  <InputLabel id='level-select'>Select Level</InputLabel>
                  <Select
                    fullWidth
                    label='Select Level'
                    labelId='level-select'
                    inputProps={{ placeholder: 'Select Level' }}
                    value={value}
                    onChange={onChange}
                    error={Boolean(errors.level)}
                  >
                    {levelOptions.map(item => (
                      <MenuItem value={item}>
                        <Typography sx={{ textTransform: 'capitalize' }}>{item}</Typography>
                      </MenuItem>
                    ))}
                  </Select>
                </>
              )}
            />
            {errors.level && <FormHelperText sx={{ color: 'error.main' }}>{errors.level.message}</FormHelperText>}
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
                  placeholder='We Are Searching For A Developer That ...'
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

export default AddPositionDrawer
