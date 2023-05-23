// ** React Imports
import { useEffect, useState } from 'react'

// ** MUI Imports
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import Grid from '@mui/material/Grid'
import Alert from '@mui/material/Alert'
import Table from '@mui/material/Table'
import Button from '@mui/material/Button'
import Divider from '@mui/material/Divider'
import TableRow from '@mui/material/TableRow'
import TableHead from '@mui/material/TableHead'
import TableCell from '@mui/material/TableCell'
import TableBody from '@mui/material/TableBody'
import CardHeader from '@mui/material/CardHeader'
import AlertTitle from '@mui/material/AlertTitle'
import InputLabel from '@mui/material/InputLabel'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import CardContent from '@mui/material/CardContent'
import FormControl from '@mui/material/FormControl'
import OutlinedInput from '@mui/material/OutlinedInput'
import InputAdornment from '@mui/material/InputAdornment'
import TableContainer from '@mui/material/TableContainer'
import Icon from 'src/@core/components/icon'
import UserRemoveSessionDialog from './UserRemoveSessionDialog'
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import { Controller, useForm } from 'react-hook-form'
import { FormHelperText } from '@mui/material'
import { useDispatch } from 'react-redux'
import { ChangePasswordParams, changePassword, clearChangePassword, getUserLoginHistory } from 'src/store/user'
import { useSelector } from 'react-redux'
import Skelet from 'src/@core/components/loading/Skelet'
import { passwordVisibilityIcon, showDate } from 'src/helpers/functions'

const schema = yup.object().shape({
  old_password: yup.string().label('Old Password').min(8).max(10).required(),
  password: yup.string().label('New Password').min(8).max(10).required(),
  repeat_password: yup.string().label('Repeat Password').min(8).max(10).required()
})

const defaultValues = {
  old_password: '',
  password: '',
  repeat_password: ''
}

const UserViewSecurity = () => {
  // ** States
  const [removeSessionDialogOpen, setRemoveSessionDialogOpen] = useState<boolean>(false)

  const [showPassword, setShowPassword] = useState<boolean>(false)
  const [showRepeatPassword, setShowRepeatPassword] = useState<boolean>(false)
  const [showOldPassword, setShowOldPassword] = useState<boolean>(false)

  const dispatch = useDispatch()

  const { data: user } = useSelector((state: any) => state.user)
  const { status } = useSelector((state: any) => state.userChangePassword)
  const { data: loginHistories, loading: loadingLoginHistory } = useSelector((state: any) => state.userLoginHistory)

  useEffect(() => {
    if (user?.id) dispatch(getUserLoginHistory())
  }, [user?.id])

  useEffect(() => {
    if (status) {
      dispatch(clearChangePassword())
      reset()
    }
  }, [status])

  const {
    control,
    reset,
    setError,
    handleSubmit,
    formState: { errors }
  } = useForm({
    defaultValues,
    mode: 'onBlur',
    resolver: yupResolver(schema)
  })

  const submitHandler = (data: any) => {
    const { password, repeat_password } = data
    if (password !== repeat_password) {
      setError('repeat_password', {
        type: 'manual',
        message: 'New Password and Repeat New Password should be the same'
      })
    } else if (user?.id) {
      delete data.repeat_password
      const submitData: ChangePasswordParams = { ...data, user_id: user?.id }
      dispatch(changePassword(submitData))
    }
  }

  const PasswordIconComponent = passwordVisibilityIcon(showPassword)
  const RepeatPasswordIconComponent = passwordVisibilityIcon(showRepeatPassword)
  const OldPasswordIconComponent = passwordVisibilityIcon(showOldPassword)

  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <Card>
          <CardHeader title='Change Password' />
          <CardContent>
            <Alert icon={false} severity='warning' sx={{ mb: 6 }}>
              <AlertTitle sx={{ fontWeight: 600, mb: theme => `${theme.spacing(1)} !important` }}>
                Ensure that these requirements are met
              </AlertTitle>
              Minimum 8 and maximum 10 characters long
            </Alert>

            <form onSubmit={handleSubmit(submitHandler)}>
              <Grid container spacing={6}>
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth sx={{ mb: 4 }}>
                    <InputLabel htmlFor='auth-login-v2-password' error={Boolean(errors.password)}>
                      New Password
                    </InputLabel>
                    <Controller
                      name='password'
                      control={control}
                      render={({ field: { value, onChange, onBlur } }) => (
                        <OutlinedInput
                          value={value}
                          onBlur={onBlur}
                          onChange={onChange}
                          label='New Password'
                          error={Boolean(errors.password)}
                          type={showPassword ? 'text' : 'password'}
                          endAdornment={
                            <InputAdornment position='end'>
                              <IconButton
                                edge='end'
                                tabIndex={-1}
                                onMouseDown={e => e.preventDefault()}
                                onClick={() => setShowPassword(!showPassword)}
                              >
                                <PasswordIconComponent />
                              </IconButton>
                            </InputAdornment>
                          }
                        />
                      )}
                    />
                    {errors.password && (
                      <FormHelperText sx={{ color: 'error.main' }} id=''>
                        {errors.password.message}
                      </FormHelperText>
                    )}
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth sx={{ mb: 4 }}>
                    <InputLabel htmlFor='auth-login-v2-password' error={Boolean(errors.repeat_password)}>
                      Repeat New Password
                    </InputLabel>
                    <Controller
                      name='repeat_password'
                      control={control}
                      render={({ field: { value, onChange, onBlur } }) => (
                        <OutlinedInput
                          value={value}
                          onBlur={onBlur}
                          onChange={onChange}
                          label='Repeat New Password'
                          error={Boolean(errors.repeat_password)}
                          type={showRepeatPassword ? 'text' : 'password'}
                          endAdornment={
                            <InputAdornment position='end'>
                              <IconButton
                                edge='end'
                                tabIndex={-1}
                                onMouseDown={e => e.preventDefault()}
                                onClick={() => setShowRepeatPassword(!showRepeatPassword)}
                              >
                                <RepeatPasswordIconComponent />
                              </IconButton>
                            </InputAdornment>
                          }
                        />
                      )}
                    />
                    {errors.repeat_password && (
                      <FormHelperText sx={{ color: 'error.main' }} id=''>
                        {errors.repeat_password.message}
                      </FormHelperText>
                    )}
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth sx={{ mb: 4 }}>
                    <InputLabel htmlFor='auth-login-v2-password' error={Boolean(errors.old_password)}>
                      Old Password
                    </InputLabel>
                    <Controller
                      name='old_password'
                      control={control}
                      render={({ field: { value, onChange, onBlur } }) => (
                        <OutlinedInput
                          value={value}
                          onBlur={onBlur}
                          onChange={onChange}
                          label='Old Password'
                          error={Boolean(errors.old_password)}
                          type={showOldPassword ? 'text' : 'password'}
                          endAdornment={
                            <InputAdornment position='end'>
                              <IconButton
                                edge='end'
                                tabIndex={-1}
                                onMouseDown={e => e.preventDefault()}
                                onClick={() => setShowOldPassword(!showOldPassword)}
                              >
                                <OldPasswordIconComponent />
                              </IconButton>
                            </InputAdornment>
                          }
                        />
                      )}
                    />
                    {errors.old_password && (
                      <FormHelperText sx={{ color: 'error.main' }} id=''>
                        {errors.old_password.message}
                      </FormHelperText>
                    )}
                  </FormControl>
                </Grid>
                <Grid item xs={12}>
                  <Button type='submit' variant='contained'>
                    Change Password
                  </Button>
                </Grid>
              </Grid>
            </form>
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={12}>
        <Card>
          <TableContainer>
            <Skelet
              loading={loadingLoginHistory}
              height={400}
              component={
                <>
                  <Box
                    sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between' }}
                  >
                    <CardHeader title='Recent Devices' />
                  </Box>

                  <Divider sx={{ m: '0 !important' }} />
                  <Table sx={{ minWidth: 500 }}>
                    <TableHead
                      sx={{
                        backgroundColor: theme => (theme.palette.mode === 'light' ? 'grey.50' : 'background.default')
                      }}
                    >
                      <TableRow>
                        <TableCell>Browser</TableCell>
                        <TableCell>OS</TableCell>
                        <TableCell>IP</TableCell>
                        <TableCell>Logged In At</TableCell>
                      </TableRow>
                    </TableHead>

                    <TableBody>
                      {loginHistories?.docs?.map((item: any, index: number) => (
                        <TableRow hover key={index} sx={{ '&:last-of-type td': { border: 0 } }}>
                          <TableCell>
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                              <img width='22' height='22' alt='Chrome' src='/images/logos/chrome.png' />
                              <Typography sx={{ ml: 2, fontWeight: 500, fontSize: '0.875rem' }}>
                                {item.browser}
                              </Typography>
                            </Box>
                          </TableCell>
                          <TableCell>{item?.os}</TableCell>
                          <TableCell>{item?.ip4}</TableCell>
                          <TableCell>{showDate(item?.createdAt)}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </>
              }
            />
          </TableContainer>
        </Card>
      </Grid>
      <UserRemoveSessionDialog open={removeSessionDialogOpen} setOpen={setRemoveSessionDialogOpen} />
    </Grid>
  )
}

export default UserViewSecurity
