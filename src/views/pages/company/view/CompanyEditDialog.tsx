import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormControl,
  FormHelperText,
  Grid,
  TextField
} from '@mui/material'
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
import { CompanyFormData } from '../list/AddCompanyDrawer'
import { useDispatch } from 'react-redux'
import { clearEditCompany, editCompany, getCompany } from 'src/store/company'

const schema = yup.object().shape({
  name: yup.string().label('Name').min(3).required()
})

interface Props {
  open: boolean
  closeHandler: any
  companyId: string
}

export interface CompanyEditData extends CompanyFormData {
  companyId?: string
}

const CompanyEditDialog = (props: Props) => {
  const { closeHandler, open, companyId } = props

  const [files, setFiles] = useState<File[]>([])

  const companyStore = useSelector((state: any) => state.company)
  const { data: company } = companyStore

  const dispatch = useDispatch()

  const editCompanyStore = useSelector((state: any) => state.editCompany)
  const { status } = editCompanyStore

  useEffect(() => {
    if (status) {
      dispatch(getCompany(companyId))
      toast.success('Company Information Edited Successfully', { position: 'bottom-left', duration: 5000 })
      clearInputs()
      dispatch(clearEditCompany())
      closeHandler()
    }
  }, [status])

  useEffect(() => {
    if (company?.name)
      [
        setValue('name', company?.name),
        setValue('phone', company?.phone),
        setValue('address', company?.address),
        setValue('description', company?.description)
      ]
  }, [company])

  const defaultValues = {
    name: '',
    phone: '',
    address: '',
    description: ''
  }

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

  const clearInputs = () => {
    setValue('name', '')
    setValue('phone', '')
    setValue('address', '')
    setValue('description', '')
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

  const onSubmit = (data: CompanyFormData) => {
    const editCompanyData: CompanyEditData = { ...data, companyId }
    dispatch(editCompany(editCompanyData))
    reset()
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
        Edit Company Information
      </DialogTitle>
      <DialogContent>
        <DialogContentText variant='body2' id='user-view-edit-description' sx={{ textAlign: 'center', mb: 7 }}>
          Updating company details will receive a privacy audit.
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
                ) : company?.logo ? (
                  <CustomAvatar
                    src={company?.logo}
                    variant='rounded'
                    alt={company?.name}
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
                    {getInitials(company?.name)}
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
                    <TextField
                      label='Name'
                      placeholder='Example: PSP'
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
              <FormControl>
                <Controller
                  name='phone'
                  control={control}
                  render={({ field: { value, onBlur, onChange } }) => (
                    <TextField
                      label='Phone'
                      placeholder='02188651256'
                      value={value}
                      onChange={onChange}
                      onBlur={onBlur}
                      error={Boolean(errors.phone)}
                    />
                  )}
                />
                {errors.phone && <FormHelperText sx={{ color: 'error.main' }}>{errors.phone.message}</FormHelperText>}
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={12} md={12}>
              <FormControl fullWidth>
                <Controller
                  name='address'
                  control={control}
                  render={({ field: { value, onBlur, onChange } }) => (
                    <TextField
                      label='Address'
                      placeholder='Company Address Shuould Be Here ...'
                      multiline
                      rows={4}
                      value={value}
                      onChange={onChange}
                      onBlur={onBlur}
                      error={Boolean(errors.address)}
                    />
                  )}
                />
                {errors.address && (
                  <FormHelperText sx={{ color: 'error.main' }}>{errors.address.message}</FormHelperText>
                )}
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={12} md={12}>
              <FormControl fullWidth>
                <Controller
                  name='description'
                  control={control}
                  render={({ field: { value, onBlur, onChange } }) => (
                    <TextField
                      label='Description'
                      placeholder='Company Description Shuould Be Here ...'
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

export default CompanyEditDialog
