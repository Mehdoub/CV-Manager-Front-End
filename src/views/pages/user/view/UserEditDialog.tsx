import {
  Autocomplete,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  FormHelperText,
  Grid,
  ListItem,
  Typography,
  styled
} from '@mui/material'
import { Fragment, useEffect, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import { getAllowedFormats, getFullName, getImagePath, toastError } from 'src/helpers/functions'
import Icon from 'src/@core/components/icon'
import * as yup from 'yup'
import { Controller, useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { useSelector } from 'react-redux'
import { useDispatch } from 'react-redux'
import { checkUsername } from 'src/store/auth'
import { clearUserEdit, editUser, getUser, getUsers } from 'src/store/user'
import { getRoles } from 'src/store/role'
import CustomTextField from 'src/@core/components/custom-textfield'

interface UserEditDialogProps {
  open: boolean
  handleClose: any
  data: any
}

const ImgStyled: any = styled('img')(({ theme }) => ({
  width: 120,
  height: 120,
  marginRight: theme.spacing(5),
  borderRadius: theme.shape.borderRadius
}))

const defaultValues = {
  firstname: '',
  lastname: '',
  email: '',
  username: ''
}

const schema = yup.object().shape({
  firstname: yup.string().label('First name').min(3).required(),
  lastname: yup.string().label('Last name').min(3).required(),
  email: yup.string().label('Email').email().required(),
  username: yup.string().label('Username').min(5).max(10).required()
})

const UserEditDialog = ({ open, handleClose, data: userDataFromList }: UserEditDialogProps) => {
  const [avatar, setAvatar] = useState<File[]>([])
  const [user, setUser] = useState<any>({})
  const [usernameErr, setUsernameErr] = useState<string>('')

  const dispatch = useDispatch()

  const { data: userDataFromView } = useSelector((state: any) => state.user)
  const { isAvailable } = useSelector((state: any) => state.usernameCheck)
  const { status: userEditStatus, loading: userEditLoading } = useSelector((state: any) => state.userEdit)
  const { data: roles } = useSelector((state: any) => state.roles)

  const {
    control,
    setValue,
    formState: { errors },
    handleSubmit,
    setError,
    reset
  } = useForm({
    defaultValues,
    mode: 'onBlur',
    resolver: yupResolver(schema)
  })

  useEffect(() => {
    dispatch(getRoles())
  }, [])

  useEffect(() => {
    if (userDataFromList?.id?.length > 0) setUser(userDataFromList)
    else if (userDataFromView?.id?.length > 0) setUser(userDataFromView)
  }, [userDataFromList, userDataFromView])

  useEffect(() => {
    if (isAvailable === false) {
      setUsernameErr('Username Is Already Taken!')
    } else {
      setUsernameErr('')
    }
  }, [isAvailable])

  useEffect(() => {
    if (userEditStatus) {
      dispatch(getUsers())
      dispatch(getUser(user?.id))
      reset()
      dispatch(clearUserEdit())
      handleClose()
    }
  }, [userEditStatus])

  useEffect(() => {
    if (user?.id) {
      setValue('firstname', user?.firstname)
      setValue('lastname', user?.lastname)
      setValue('username', user?.username)
      setValue('email', user?.email ?? '')
    }
  }, [user])

  const { getRootProps, getInputProps } = useDropzone({
    maxFiles: 1,
    maxSize: 2000000,
    accept: {
      'image/*': getAllowedFormats('image', true)
    },
    onDrop: (acceptedFiles: File[]) => {
      setAvatar(acceptedFiles.map((file: File) => Object.assign(file)))
    },
    onDropRejected: () => {
      toastError('You can only upload image with maximum size of 2 MB.')
    }
  })

  const renderFilePreview = (file: any) => {
    if (file.type.startsWith('image')) {
      return <ImgStyled alt={file.name} src={URL.createObjectURL(file as any)} />
    } else {
      return <Icon icon='mdi:file-document-outline' />
    }
  }

  const usernameHandler = (value: string) => {
    if (value.length >= 5 && value.length <= 10 && value !== user?.username) {
      dispatch(checkUsername(value))
    }
  }

  const submitHandler = (data: any) => {
    if (avatar.length > 0) data = { ...data, avatar: avatar[0] }
    if (!usernameErr) dispatch(editUser({ ...data, userId: user?.id }))
  }

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      aria-labelledby='user-view-edit'
      sx={{ '& .MuiPaper-root': { width: '100%', maxWidth: 650, p: [2, 10] } }}
      aria-describedby='user-view-edit-description'
    >
      <DialogTitle id='user-view-edit' sx={{ textAlign: 'center', fontSize: '1.5rem !important' }}>
        Edit User Information
      </DialogTitle>
      <DialogContent>
        <form onSubmit={handleSubmit(submitHandler)}>
          <Fragment>
            <div {...getRootProps({ className: 'dropzone' })}>
              <input {...getInputProps()} />
              <Box sx={{ textAlign: 'center' }}>
                <Typography sx={{ marginBottom: '10px', fontWeight: 200 }} variant='h6'>
                  Drop Avatar Here Or Click To Upload
                </Typography>
                {avatar[0] ? (
                  renderFilePreview(avatar[0])
                ) : user?.avatar ? (
                  <ImgStyled src={getImagePath(user?.avatar)} alt={getFullName(user)} />
                ) : (
                  <ImgStyled src={'/images/avatars/1.png'} alt='Profile Pic' />
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
                    Allowed{getAllowedFormats()}
                  </Typography>
                  <Typography sx={{ fontSize: '12px' }} color='textSecondary'>
                    Max size of 2 MB
                  </Typography>
                </Box>
              </Box>
            </div>
          </Fragment>
          <Grid container spacing={6}>
            <Grid item xs={12} md={6} mt={3}>
              <FormControl fullWidth>
                <Controller
                  name='firstname'
                  control={control}
                  render={({ field: { onBlur, onChange, value } }) => (
                    <CustomTextField
                      label='First Name'
                      placeholder='John'
                      value={value}
                      onBlur={onBlur}
                      onChange={onChange}
                      error={Boolean(errors.firstname)}
                    />
                  )}
                />
                {errors.firstname && (
                  <FormHelperText sx={{ color: 'error.main' }}>{errors.firstname.message}</FormHelperText>
                )}
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6} mt={3}>
              <FormControl fullWidth>
                <Controller
                  name='lastname'
                  control={control}
                  render={({ field: { onBlur, onChange, value } }) => (
                    <CustomTextField
                      label='Last Name'
                      placeholder='Doe'
                      value={value}
                      onBlur={onBlur}
                      onChange={onChange}
                      error={Boolean(errors.lastname)}
                    />
                  )}
                />
                {errors.lastname && (
                  <FormHelperText sx={{ color: 'error.main' }}>{errors.lastname.message}</FormHelperText>
                )}
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6} mt={3}>
              <FormControl fullWidth>
                <Controller
                  name='email'
                  control={control}
                  render={({ field: { onBlur, onChange, value } }) => (
                    <CustomTextField
                      label='Email'
                      placeholder='Example@email.com'
                      value={value}
                      onBlur={onBlur}
                      onChange={onChange}
                      error={Boolean(errors.email)}
                    />
                  )}
                />
                {errors.email && <FormHelperText sx={{ color: 'error.main' }}>{errors.email.message}</FormHelperText>}
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6} mt={3}>
              <FormControl fullWidth>
                <Controller
                  name='username'
                  control={control}
                  rules={{ required: true }}
                  render={({ field: { value, onBlur, onChange } }) => (
                    <CustomTextField
                      value={value}
                      label='Username'
                      onBlur={e => {
                        onBlur(e)
                        usernameHandler(e.target.value)
                      }}
                      onChange={onChange}
                      error={Boolean(errors.username) || usernameErr.length > 0}
                      placeholder='john23'
                    />
                  )}
                />
                {usernameErr.length > 0 ? (
                  <FormHelperText sx={{ color: 'error.main' }}>{usernameErr}</FormHelperText>
                ) : errors.username ? (
                  <FormHelperText sx={{ color: 'error.main' }}>{errors.username.message}</FormHelperText>
                ) : (
                  ''
                )}
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <Autocomplete
                options={roles?.length > 0 ? roles : []}
                id='autocomplete-size-small-multi'
                defaultValue={{ name: user?.role ? user?.role[0] : '' }}
                renderInput={params => <CustomTextField {...params} label='Edit Role' placeholder='Search Roles ...' />}
                renderOption={(props, role: any) => <ListItem {...props}>{role?.name}</ListItem>}
                selectOnFocus
                clearOnBlur
                handleHomeEndKeys
                getOptionLabel={option => option?.name}
              />
            </Grid>
          </Grid>
          <DialogActions sx={{ justifyContent: 'center', pb: 0, mt: 5 }}>
            <Button disabled={userEditLoading} type='submit' variant='contained' sx={{ mr: 1 }}>
              Submit
            </Button>
            <Button disabled={userEditLoading} variant='outlined' color='secondary' onClick={handleClose}>
              Cancel
            </Button>
          </DialogActions>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export default UserEditDialog
