// ** React Imports
import { ReactNode, useEffect, useState } from 'react'

// ** Next Import
import Link from 'next/link'

// ** MUI Components
import Button from '@mui/material/Button'
import CustomTextField from 'src/@core/components/custom-textfield'
import InputLabel from '@mui/material/InputLabel'
import IconButton from '@mui/material/IconButton'
import Box, { BoxProps } from '@mui/material/Box'
import FormControl from '@mui/material/FormControl'
import useMediaQuery from '@mui/material/useMediaQuery'
import OutlinedInput from '@mui/material/OutlinedInput'
import { styled, useTheme } from '@mui/material/styles'
import FormHelperText from '@mui/material/FormHelperText'
import InputAdornment from '@mui/material/InputAdornment'
import Typography, { TypographyProps } from '@mui/material/Typography'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Third Party Imports
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import { useForm, Controller } from 'react-hook-form'

// ** Configs
import themeConfig from 'src/configs/themeConfig'

// ** Layout Import
import BlankLayout from 'src/@core/layouts/BlankLayout'

// ** Hooks
import { useAuth } from 'src/hooks/useAuth'
import { useSettings } from 'src/@core/hooks/useSettings'

// ** Demo Imports
import FooterIllustrationsV2 from 'src/views/pages/auth/FooterIllustrationsV2'
import { useDispatch } from 'react-redux'
import { checkUsername } from 'src/store/auth'
import { useSelector } from 'react-redux'
import {
  convertPersianNumsToEnglish,
  mobileHandler,
  passwordVisibilityIcon,
  setServerValidationErrors,
  toastError
} from 'src/helpers/functions'

const defaultValues = {
  firstname: '',
  lastname: '',
  username: '',
  mobile: '',
  password: '',
  repeatpassword: ''
}
interface FormData {
  firstname: string
  lastname: string
  username: string
  mobile: string
  password: string
  repeatpassword: string
}

// ** Styled Components
const RegisterIllustrationWrapper = styled(Box)<BoxProps>(({ theme }) => ({
  padding: theme.spacing(20),
  paddingRight: '0 !important',
  [theme.breakpoints.down('lg')]: {
    padding: theme.spacing(10)
  }
}))

const RegisterIllustration = styled('img')(({ theme }) => ({
  maxWidth: '48rem',
  [theme.breakpoints.down('xl')]: {
    maxWidth: '38rem'
  },
  [theme.breakpoints.down('lg')]: {
    maxWidth: '30rem'
  }
}))

const RightWrapper = styled(Box)<BoxProps>(({ theme }) => ({
  width: '100%',
  [theme.breakpoints.up('md')]: {
    maxWidth: 400
  },
  [theme.breakpoints.up('lg')]: {
    maxWidth: 450
  }
}))

const BoxWrapper = styled(Box)<BoxProps>(({ theme }) => ({
  width: '100%',
  [theme.breakpoints.down('md')]: {
    maxWidth: 400
  }
}))

const TypographyStyled = styled(Typography)<TypographyProps>(({ theme }) => ({
  fontWeight: 600,
  letterSpacing: '0.18px',
  marginBottom: theme.spacing(1.5),
  [theme.breakpoints.down('md')]: { marginTop: theme.spacing(8) }
}))

const Register = () => {
  // ** States
  const [showPassword, setShowPassword] = useState<boolean>(false)
  const [showRepeatPassword, setShowRepeatPassword] = useState<boolean>(false)
  const [usernameErr, setUsernameErr] = useState<string>('')
  const [disabled, setDisabled] = useState<boolean>(false)

  // ** Hooks
  const theme = useTheme()
  const { register } = useAuth()
  const { settings } = useSettings()
  const hidden = useMediaQuery(theme.breakpoints.down('md'))

  const dispatch = useDispatch()
  const { isAvailable } = useSelector((state: any) => state.usernameCheck)

  // ** Vars
  const { skin } = settings
  const schema = yup.object().shape({
    firstname: yup.string().label('First name').min(3).required(),
    lastname: yup.string().label('Last name').min(3).required(),
    username: yup.string().label('Username').min(3).max(30).required(),
    mobile: yup
      .string()
      .label('Mobile')
      .matches(/^9[\d]{9}$/, 'Mobile Is Not Valid (example: 9123456789)')
      .required(),
    password: yup.string().label('Password').min(8).required(),
    repeatpassword: yup.string().label('Repeat Password').min(8).required()
  })

  const {
    control,
    setError,
    handleSubmit,
    formState: { errors },
    setValue
  } = useForm({
    defaultValues,
    mode: 'onBlur',
    resolver: yupResolver(schema)
  })

  const onSubmit = (data: FormData) => {
    let { firstname, lastname, mobile, password, repeatpassword, username } = data
    if (password !== repeatpassword) {
      setError('repeatpassword', {
        type: 'manual',
        message: 'Password and repeat password should be the same'
      })
    } else if (isAvailable) {
      mobile = '98' + mobile
      setDisabled(true)
      register({ firstname, lastname, mobile, password, repeatpassword, username }, (err: any) => {
        const errors = err?.response?.data?.errors[0]
        if (errors) setServerValidationErrors(errors, setError)
        toastError(err?.response?.data?.message)
        setDisabled(false)
      })
    }
  }

  const imageSource = skin === 'bordered' ? 'auth-v2-register-illustration-bordered' : 'auth-v2-register-illustration'

  useEffect(() => {
    if (isAvailable === false) {
      setUsernameErr('Username Is Already Taken!')
    } else {
      setUsernameErr('')
    }
  }, [isAvailable])

  const usernameHandler = (value: string) => {
    if (value.length >= 3 && value.length <= 10) {
      dispatch(checkUsername(value))
    }
  }

  const PasswordIconComponent = passwordVisibilityIcon(showPassword)
  const RepeatPasswordIconComponent = passwordVisibilityIcon(showRepeatPassword)

  return (
    <Box className='content-right'>
      {!hidden ? (
        <Box sx={{ flex: 1, display: 'flex', position: 'relative', alignItems: 'center', justifyContent: 'center' }}>
          <RegisterIllustrationWrapper>
            <RegisterIllustration
              alt='register-illustration'
              src={`/images/pages/${imageSource}-${theme.palette.mode}.png`}
            />
          </RegisterIllustrationWrapper>
          <FooterIllustrationsV2 image={`/images/pages/auth-v2-register-mask-${theme.palette.mode}.png`} />
        </Box>
      ) : null}
      <RightWrapper sx={skin === 'bordered' && !hidden ? { borderLeft: `1px solid ${theme.palette.divider}` } : {}}>
        <Box
          sx={{
            p: 7,
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'background.paper'
          }}
        >
          <BoxWrapper>
            <Box
              sx={{
                top: 30,
                left: 40,
                display: 'flex',
                position: 'absolute',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <svg width={47} fill='none' height={26} viewBox='0 0 268 150' xmlns='http://www.w3.org/2000/svg'>
                <rect
                  rx='25.1443'
                  width='50.2886'
                  height='143.953'
                  fill={theme.palette.primary.main}
                  transform='matrix(-0.865206 0.501417 0.498585 0.866841 195.571 0)'
                />
                <rect
                  rx='25.1443'
                  width='50.2886'
                  height='143.953'
                  fillOpacity='0.4'
                  fill='url(#paint0_linear_7821_79167)'
                  transform='matrix(-0.865206 0.501417 0.498585 0.866841 196.084 0)'
                />
                <rect
                  rx='25.1443'
                  width='50.2886'
                  height='143.953'
                  fill={theme.palette.primary.main}
                  transform='matrix(0.865206 0.501417 -0.498585 0.866841 173.147 0)'
                />
                <rect
                  rx='25.1443'
                  width='50.2886'
                  height='143.953'
                  fill={theme.palette.primary.main}
                  transform='matrix(-0.865206 0.501417 0.498585 0.866841 94.1973 0)'
                />
                <rect
                  rx='25.1443'
                  width='50.2886'
                  height='143.953'
                  fillOpacity='0.4'
                  fill='url(#paint1_linear_7821_79167)'
                  transform='matrix(-0.865206 0.501417 0.498585 0.866841 94.1973 0)'
                />
                <rect
                  rx='25.1443'
                  width='50.2886'
                  height='143.953'
                  fill={theme.palette.primary.main}
                  transform='matrix(0.865206 0.501417 -0.498585 0.866841 71.7728 0)'
                />
                <defs>
                  <linearGradient
                    y1='0'
                    x1='25.1443'
                    x2='25.1443'
                    y2='143.953'
                    id='paint0_linear_7821_79167'
                    gradientUnits='userSpaceOnUse'
                  >
                    <stop />
                    <stop offset='1' stopOpacity='0' />
                  </linearGradient>
                  <linearGradient
                    y1='0'
                    x1='25.1443'
                    x2='25.1443'
                    y2='143.953'
                    id='paint1_linear_7821_79167'
                    gradientUnits='userSpaceOnUse'
                  >
                    <stop />
                    <stop offset='1' stopOpacity='0' />
                  </linearGradient>
                </defs>
              </svg>
              <Typography variant='h6' sx={{ ml: 2, lineHeight: 1, fontWeight: 700, fontSize: '1.5rem !important' }}>
                {themeConfig.templateName}
              </Typography>
            </Box>
            <Box sx={{ mb: 6 }}>
              <TypographyStyled variant='h5'>Adventure starts here 🚀</TypographyStyled>
              <Typography variant='body2'>Take control of your resume management process with CVManager. Sign up today and revolutionize the way your company manages resumes!</Typography>
            </Box>
            <form onSubmit={handleSubmit(onSubmit)}>
              <FormControl fullWidth sx={{ mb: 4 }}>
                <Controller
                  name='firstname'
                  control={control}
                  rules={{ required: true }}
                  render={({ field: { value, onChange, onBlur } }) => (
                    <CustomTextField
                      autoFocus
                      value={value}
                      onBlur={onBlur}
                      label='First Name'
                      onChange={onChange}
                      placeholder='John'
                      error={Boolean(errors.firstname)}
                    />
                  )}
                />
                {errors.firstname && (
                  <FormHelperText sx={{ color: 'error.main' }}>{errors.firstname.message}</FormHelperText>
                )}
              </FormControl>
              <FormControl fullWidth sx={{ mb: 4 }}>
                <Controller
                  name='lastname'
                  control={control}
                  rules={{ required: true }}
                  render={({ field: { value, onChange, onBlur } }) => (
                    <CustomTextField
                      value={value}
                      label='Last Name'
                      onBlur={onBlur}
                      onChange={onChange}
                      error={Boolean(errors.lastname)}
                      placeholder='Doe'
                    />
                  )}
                />
                {errors.lastname && (
                  <FormHelperText sx={{ color: 'error.main' }}>{errors.lastname.message}</FormHelperText>
                )}
              </FormControl>
              <FormControl fullWidth sx={{ mb: 4 }}>
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
              <FormControl fullWidth sx={{ mb: 4 }}>
                <Controller
                  name='mobile'
                  control={control}
                  render={({ field: { value, onChange, onBlur } }) => (
                    <CustomTextField
                      label='Mobile'
                      value={value?.substring(0, 10)}
                      onBlur={onBlur}
                      onChange={e => {
                        onChange(e)
                        mobileHandler(e.target.value, setValue)
                      }}
                      InputProps={{
                        startAdornment: <InputAdornment position='start'>IR (+98)</InputAdornment>
                      }}
                      error={Boolean(errors.mobile)}
                      placeholder='9123456789'
                    />
                  )}
                />
                {errors.mobile && <FormHelperText sx={{ color: 'error.main' }}>{errors.mobile.message}</FormHelperText>}
              </FormControl>
              <FormControl fullWidth sx={{ mb: 4 }}>
                <InputLabel htmlFor='auth-login-v2-password' error={Boolean(errors.password)}>
                  Password
                </InputLabel>
                <Controller
                  name='password'
                  control={control}
                  rules={{
                    required: 'Password cannot be empty',
                    minLength: { value: 8, message: 'Password should at least has 8 characters' },
                    maxLength: { value: 16, message: 'Password maximum can be 16 characters' }
                  }}
                  render={({ field: { value, onChange, onBlur } }) => (
                    <OutlinedInput
                      value={value}
                      onBlur={onBlur}
                      label='Password'
                      onChange={onChange}
                      id='auth-login-v2-password'
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
              <FormControl fullWidth sx={{ mb: 8 }}>
                <InputLabel htmlFor='auth-login-v2-repeatpassword' error={Boolean(errors.repeatpassword)}>
                  Repeat Password
                </InputLabel>
                <Controller
                  name='repeatpassword'
                  control={control}
                  rules={{ required: true }}
                  render={({ field: { value, onChange, onBlur } }) => (
                    <OutlinedInput
                      value={value}
                      label='Repeat Password'
                      onBlur={onBlur}
                      onChange={onChange}
                      id='auth-login-v2-repeatpassword'
                      error={Boolean(errors.repeatpassword)}
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
                {errors.repeatpassword && (
                  <FormHelperText sx={{ color: 'error.main' }}>{errors.repeatpassword.message}</FormHelperText>
                )}
              </FormControl>

              {/* <FormControl sx={{ my: 0 }} error={Boolean(errors.terms)}>
                <Controller
                  name='terms'
                  control={control}
                  rules={{ required: true }}
                  render={({ field: { value, onChange } }) => {
                    return (
                      <FormControlLabel
                        sx={{
                          ...(errors.terms ? { color: 'error.main' } : null),
                          '& .MuiFormControlLabel-label': { fontSize: '0.875rem' }
                        }}
                        control={
                          <Checkbox
                            checked={value}
                            onChange={onChange}
                            sx={errors.terms ? { color: 'error.main' } : null}
                          />
                        }
                        label={
                          <Fragment>
                            <Typography
                              variant='body2'
                              component='span'
                              sx={{ color: errors.terms ? 'error.main' : '' }}
                            >
                              I agree to{' '}
                            </Typography>
                            <Typography
                              href='/'
                              variant='body2'
                              component={Link}
                              sx={{ color: 'primary.main', textDecoration: 'none' }}
                              onClick={(e: MouseEvent<HTMLElement>) => e.preventDefault()}
                            >
                              privacy policy & terms
                            </Typography>
                          </Fragment>
                        }
                      />
                    )
                  }}
                />
                {errors.terms && (
                  <FormHelperText sx={{ mb: 3, mt: 0, color: 'error.main' }}>{errors.terms.message}</FormHelperText>
                )}
              </FormControl> */}
              <Button fullWidth size='large' type='submit' variant='contained' sx={{ mb: 7 }} disabled={disabled}>
                Sign up
              </Button>
              <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', justifyContent: 'center' }}>
                <Typography sx={{ mr: 2, color: 'text.secondary' }}>Already have an account?</Typography>
                <Typography href='/login' component={Link} sx={{ color: 'primary.main', textDecoration: 'none' }}>
                  Sign in instead
                </Typography>
              </Box>
            </form>
          </BoxWrapper>
        </Box>
      </RightWrapper>
    </Box>
  )
}

Register.getLayout = (page: ReactNode) => <BlankLayout>{page}</BlankLayout>

Register.guestGuard = true

export default Register
