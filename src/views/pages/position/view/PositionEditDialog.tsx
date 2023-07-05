import {
  // Autocomplete,
  // Avatar,
  Button,
  // CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormControl,
  FormHelperText,
  Grid,
  InputLabel,
  // List,
  // ListItem,
  // ListItemAvatar,
  // ListItemText,
  MenuItem,
  Select,
  Typography
} from '@mui/material'
import CustomTextField from 'src/@core/components/custom-textfield'
import * as yup from 'yup'
import CustomAvatar from 'src/@core/components/mui/avatar'
import { getInitials } from 'src/@core/utils/get-initials'
import Icon from 'src/@core/components/icon'
import { Box } from '@mui/system'
import { Fragment, useEffect, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import { useSelector } from 'react-redux'
import { toast } from 'react-hot-toast'
import { Controller, useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { useDispatch } from 'react-redux'
// import { getProjects } from 'src/store/project'
import { constantReader, getAllowedFormats, getImagePath, getObjectKeys } from 'src/helpers/functions'
import { clearPositionEdit, editPosition, getPosition, getPositions } from 'src/store/position'
import { PositionFormData } from '../list/AddPositionDrawer'

const defaultValues = {
  title: '',
  level: '',
  description: ''
}

interface Props {
  open: boolean
  closeHandler: any
  position?: any
}

export interface PositionEditData extends PositionFormData {
  positionId?: string
}

const PositionEditDialog = (props: Props) => {
  const { closeHandler, open, position: positionDataFromList } = props

  const [files, setFiles] = useState<File[]>([])
  const [position, setPosition] = useState<any>({})

  // const [project, setProject] = useState<any>({})
  // const [projectErr, setProjectErr] = useState<string>('')
  // const { data: projects, loading: loadingSearchProjects } = useSelector((state: any) => state.projectsList)

  const dispatch = useDispatch()

  // const searchProjects = (value: any) => {
  //   const query = value?.target?.value
  //   if (query?.length > 0) dispatch(getProjects({ query }))
  // }

  const { status, loading: positionEditLoading } = useSelector((state: any) => state.positionEdit)
  const { data: positionDataFromView } = useSelector((state: any) => state.position)
  const {
    data: {
      position: { level: levelOptions }
    }
  } = useSelector((state: any) => state.constants)

  const schema = yup.object().shape(
    {
      title: yup.string().label('Title').required().min(3),
      level: yup.string().label('Level').oneOf(getObjectKeys(levelOptions)),
      description: yup.string().when('description', (val, schema) => {
        if (val?.length > 0) {
          return yup.string().label('Description').min(10).max(100).required()
        } else {
          return yup.string().notRequired()
        }
      })
    },
    [['description', 'description']]
  )

  useEffect(() => {
    if (positionDataFromList?.id?.length > 0) setPosition(positionDataFromList)
    else if (positionDataFromView?.id?.length > 0) setPosition(positionDataFromView)
  }, [positionDataFromList, positionDataFromView])

  useEffect(() => {
    if (status) {
      dispatch(getPositions())
      dispatch(getPosition(position?.id))
      // clearInputs()
      dispatch(clearPositionEdit())
      closeHandler()
    }
  }, [status])

  const {
    setValue,
    control,
    handleSubmit,
    formState: { errors }
  } = useForm({
    defaultValues,
    mode: 'onBlur',
    resolver: yupResolver(schema)
  })

  useEffect(() => {
    if (position?.id) {
      setValue('title', position?.title)
      setValue('level', position?.level)
      setValue('description', position?.description)
      // setProject(position?.project_id)
    }
  }, [position])

  // const clearInputs = () => {
  //   setValue('title', '')
  //   setValue('level', '')
  //   setValue('description', '')
  //   setProject({})
  //   setProjectErr('')
  //   setFiles([])
  // }

  const { getRootProps, getInputProps } = useDropzone({
    maxFiles: 1,
    maxSize: 2000000,
    accept: {
      'image/*': getAllowedFormats('image', true) as string[]
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

  const onSubmit = (data: PositionFormData) => {
    // setProjectErr('')
    // if (!project?.id) {
    //   setProjectErr('Project cannot be empty!')
    // } else {
    // }
    let projectEditData: PositionEditData = { ...data, positionId: position?.id }
    if (files[0]) {
      projectEditData = { ...projectEditData, logo: files[0] }
    }
    dispatch(editPosition(projectEditData))
  }

  return (
    <Dialog
      open={open}
      onClose={closeHandler}
      aria-labelledby='user-view-edit'
      sx={{ '& .MuiPaper-root': { width: '100%', maxWidth: 650, p: [2, 10] } }}
      aria-describedby='user-view-edit-description'
    >
      <DialogTitle id='user-view-edit' sx={{ textAlign: 'center', fontSize: '1.5rem !important' }}>
        Edit Position Information
      </DialogTitle>
      <DialogContent>
        <DialogContentText variant='body2' id='user-view-edit-description' sx={{ textAlign: 'center', mb: 7 }}>
          Updating position details will receive a privacy audit.
        </DialogContentText>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Fragment>
            <div {...getRootProps({ className: 'dropzone' })}>
              <input {...getInputProps()} />
              <Box
                sx={{
                  textAlign: 'center',
                  display: 'flex',
                  alignItems: 'center',
                  flexDirection: 'column',
                  marginBottom: '15px'
                }}
              >
                {files[0] ? (
                  renderFilePreview(files[0])
                ) : position?.logo ? (
                  <CustomAvatar
                    src={getImagePath(position?.logo)}
                    variant='rounded'
                    alt={position?.name}
                    sx={{
                      width: 150,
                      height: 150,
                      fontWeight: 600,
                      mb: 4,
                      fontSize: '3rem',
                      borderRadius: '50%'
                    }}
                  />
                ) : (
                  <CustomAvatar
                    skin='light'
                    variant='rounded'
                    color='primary'
                    sx={{
                      width: 150,
                      height: 150,
                      fontWeight: 600,
                      mb: 4,
                      fontSize: '3rem',
                      borderRadius: '50%'
                    }}
                  >
                    {getInitials(position?.name)}
                  </CustomAvatar>
                )}
              </Box>
            </div>
          </Fragment>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <FormControl>
                <Controller
                  name='title'
                  control={control}
                  render={({ field: { value, onChange, onBlur } }) => (
                    <CustomTextField
                      label='Title'
                      placeholder='Example: BPM'
                      value={value}
                      onChange={onChange}
                      onBlur={onBlur}
                      error={Boolean(errors.title)}
                    />
                  )}
                />
                {errors.title && <FormHelperText sx={{ color: 'error.main' }}>{errors.title.message}</FormHelperText>}
              </FormControl>
            </Grid>
            {/* <Grid item xs={12} sm={6}>
              <FormControl fullWidth sx={{ mb: 6 }}>
                <Autocomplete
                  autoHighlight
                  options={projects?.docs ?? []}
                  loading={loadingSearchProjects}
                  onChange={(e, newValue) => setProject(newValue)}
                  getOptionLabel={(projectItem: any) => projectItem?.name}
                  ListboxComponent={List}
                  defaultValue={{ name: positionDataFromList?.project_id?.name ?? project?.name }}
                  renderInput={params => (
                    <CustomTextField
                      label='Project'
                      {...params}
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
                  renderOption={(props, projectItem: any) => (
                    <ListItem {...props}>
                      <ListItemAvatar>
                        <Avatar
                          src={getImagePath(projectItem?.logo)}
                          alt={projectItem?.name}
                          sx={{ height: 28, width: 28 }}
                        />
                      </ListItemAvatar>
                      <ListItemText primary={projectItem?.name} />
                    </ListItem>
                  )}
                />
                {projectErr && <FormHelperText sx={{ color: 'error.main' }}>{projectErr}</FormHelperText>}
              </FormControl>
            </Grid> */}
            <Grid item xs={12} sm={6}>
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
                        {constantReader(levelOptions)?.map(([key, value]: [string, string], index:number) => (
                          <MenuItem key={`level-${index}`} value={key}>
                            <Typography sx={{ textTransform: 'capitalize' }}>{value}</Typography>
                          </MenuItem>
                        ))}
                      </Select>
                    </>
                  )}
                />
                {errors.level && <FormHelperText sx={{ color: 'error.main' }}>{errors.level.message}</FormHelperText>}
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={12} md={12}>
              <FormControl fullWidth>
                <Controller
                  name='description'
                  control={control}
                  render={({ field: { value, onBlur, onChange } }) => (
                    <CustomTextField
                      label='Description'
                      placeholder='Project Description Shuould Be Here ...'
                      multiline
                      rows={4}
                      value={value}
                      onChange={onChange}
                      onBlur={onBlur}
                      error={Boolean(errors.description)}
                    />
                  )}
                />
                {errors.description && (
                  <FormHelperText sx={{ color: 'error.main' }}>{errors.description.message}</FormHelperText>
                )}
              </FormControl>
            </Grid>
          </Grid>
          <DialogActions sx={{ justifyContent: 'center' }}>
            <Button type='submit' variant='contained' sx={{ mr: 1 }} disabled={positionEditLoading}>
              Submit
            </Button>
            <Button variant='outlined' color='secondary' onClick={closeHandler} disabled={positionEditLoading}>
              Cancel
            </Button>
          </DialogActions>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export default PositionEditDialog
