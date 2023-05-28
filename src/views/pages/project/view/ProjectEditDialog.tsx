import {
  Autocomplete,
  Avatar,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormControl,
  FormHelperText,
  Grid,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText
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
import { ProjectFormData } from '../list/AddProjectDrawer'
import { clearProjectEdit, editProject, getProject, getProjects } from 'src/store/project'
import { getImagePath } from 'src/helpers/functions'
import { getCompanies } from 'src/store/company'

const schema = yup.object().shape(
  {
    name: yup.string().label('Name').required().min(3),
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

export interface ProjectEditData extends ProjectFormData {
  projectId?: string
}

const defaultValues = {
  name: '',
  description: ''
}

interface Props {
  open: boolean
  closeHandler: any
  project?: any
}

const ProjectEditDialog = (props: Props) => {
  const { closeHandler, open, project: projectDataFromList } = props

  const [files, setFiles] = useState<File[]>([])
  const [project, setProject] = useState<any>({})

  const [company, setCompany] = useState<any>({})
  const [companyErr, setCompanyErr] = useState<string>('')
  const { data: companies, loading: loadingSearchCompanies } = useSelector((state: any) => state.companiesList)

  const dispatch = useDispatch()

  const searchCompanies = (value: any) => {
    const query = value?.target?.value
    if (query?.length > 0) dispatch(getCompanies({ query }))
  }

  const { status } = useSelector((state: any) => state.projectEdit)
  const { data: projectDataFromView } = useSelector((state: any) => state.projectFind)

  useEffect(() => {
    if (projectDataFromList?.id?.length > 0) setProject(projectDataFromList)
    else if (projectDataFromView?.id?.length > 0) setProject(projectDataFromView)
  }, [projectDataFromList, projectDataFromView])

  useEffect(() => {
    if (status) {
      dispatch(getProjects())
      dispatch(getProject(project?.id))
      // clearInputs()
      dispatch(clearProjectEdit())
      closeHandler()
    }
  }, [status])

  const {
    reset,
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
    if (project?.id) {
      setValue('name', project?.name)
      setValue('description', project?.description)
      setCompany(project?.company_id)
    }
  }, [project])

  const clearInputs = () => {
    setValue('name', '')
    setValue('description', '')
    setCompany({})
    setCompanyErr('')
  }

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

  const onSubmit = (data: any) => {
    if (!company?.id) {
      setCompanyErr('Company cannot be empty!')
    } else {
      let projectEditData: ProjectEditData = { ...data, projectId: project?.id, company_id: company?.id }
      if (files[0]) {
        projectEditData = { ...projectEditData, logo: files[0] }
      }
      dispatch(editProject(projectEditData))
      // reset()
    }
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
        Edit Project Information
      </DialogTitle>
      <DialogContent>
        <DialogContentText variant='body2' id='user-view-edit-description' sx={{ textAlign: 'center', mb: 7 }}>
          Updating project details will receive a privacy audit.
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
                ) : project?.logo ? (
                  <CustomAvatar
                    src={getImagePath(project?.logo)}
                    variant='rounded'
                    alt={project?.name}
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
                    {getInitials(project?.name)}
                  </CustomAvatar>
                )}
              </Box>
            </div>
          </Fragment>
          <Grid container spacing={6}>
            <Grid item xs={12} sm={6}>
              <FormControl>
                <Controller
                  name='name'
                  control={control}
                  render={({ field: { value, onChange, onBlur } }) => (
                    <CustomTextField
                      label='Name'
                      placeholder='Example: BPM'
                      value={value}
                      onChange={onChange}
                      onBlur={onBlur}
                      error={Boolean(errors.name)}
                    />
                  )}
                />
                {errors.name && <FormHelperText sx={{ color: 'error.main' }}>{errors.name.message}</FormHelperText>}
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth sx={{ mb: 6 }}>
                <Autocomplete
                  autoHighlight
                  options={companies?.docs ?? []}
                  loading={loadingSearchCompanies}
                  onChange={(e, newValue) => setCompany(newValue)}
                  getOptionLabel={(company: any) => company?.name}
                  ListboxComponent={List}
                  defaultValue={{ name: projectDataFromList?.company_id?.name ?? company?.name }}
                  renderInput={params => (
                    <CustomTextField
                      label='Company'
                      {...params}
                      onChange={searchCompanies}
                      size='medium'
                      placeholder='Search For Companies ...'
                      error={!!companyErr}
                      InputProps={{
                        ...params.InputProps,
                        endAdornment: (
                          <Fragment>
                            {loadingSearchCompanies ? <CircularProgress color='inherit' size={20} /> : null}
                            {params.InputProps.endAdornment}
                          </Fragment>
                        )
                      }}
                    />
                  )}
                  renderOption={(props, company: any) => (
                    <ListItem {...props}>
                      <ListItemAvatar>
                        <Avatar src={getImagePath(company?.logo)} alt={company?.name} sx={{ height: 28, width: 28 }} />
                      </ListItemAvatar>
                      <ListItemText primary={company?.name} />
                    </ListItem>
                  )}
                />
                {companyErr && <FormHelperText sx={{ color: 'error.main' }}>{companyErr}</FormHelperText>}
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
            <Button type='submit' variant='contained' sx={{ mr: 1 }}>
              Submit
            </Button>
            <Button variant='outlined' color='secondary' onClick={closeHandler}>
              Cancel
            </Button>
          </DialogActions>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export default ProjectEditDialog
