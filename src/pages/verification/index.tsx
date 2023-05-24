// ** React Imports
import { ChangeEvent, useState, KeyboardEvent, useEffect } from 'react'

// ** Next Import
import Link from 'next/link'

// ** MUI Components
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import CardContent from '@mui/material/CardContent'
import { styled, useTheme } from '@mui/material/styles'
import MuiCard, { CardProps } from '@mui/material/Card'
import FormHelperText from '@mui/material/FormHelperText'

// ** Third Party Imports
import Cleave from 'cleave.js/react'
import { useForm, Controller } from 'react-hook-form'

// ** Configs
import themeConfig from 'src/configs/themeConfig'

// ** Custom Styled Component
import CleaveWrapper from 'src/@core/styles/libs/react-cleave'

// ** Util Import
import { hexToRGBA } from 'src/@core/utils/hex-to-rgba'

// ** Styles
import 'cleave.js/dist/addons/cleave-phone.us'
import { useAuth } from 'src/hooks/useAuth'
import { useRouter } from 'next/router'
import { getColorCodes } from 'src/helpers/functions'
import { useDispatch } from 'react-redux'
import {
  checkVerificationCode,
  clearVerificationCodeCheck,
  clearVerificationCodeSend,
  sendVerificationCode
} from 'src/store/auth'
import { useSelector } from 'react-redux'
import FallbackSpinner from 'src/@core/components/spinner'

// ** Styled Components
const Card = styled(MuiCard)<CardProps>(({ theme }) => ({
  [theme.breakpoints.up('sm')]: { width: 450 }
}))

const CleaveInput = styled(Cleave)(({ theme }) => ({
  maxWidth: 50,
  textAlign: 'center',
  height: '50px !important',
  fontSize: '150% !important',
  marginTop: theme.spacing(2),
  marginBottom: theme.spacing(2),
  '&:not(:last-child)': {
    marginRight: theme.spacing(2)
  },
  '&::-webkit-outer-spin-button, &::-webkit-inner-spin-button': {
    margin: 0,
    WebkitAppearance: 'none'
  }
}))

const defaultValues: { [key: string]: string } = {
  val1: '',
  val2: '',
  val3: '',
  val4: '',
  val5: ''
}

const Verification = () => {
  // ** State
  const [isBackspace, setIsBackspace] = useState<boolean>(false)
  const [showTimer, setShowTimer] = useState<any>(0)
  const [timerInterval, setTimerInterval] = useState<any>('')
  const [inputBorderColor, setInputBorderColor] = useState<string | undefined>(undefined)

  const timerSeconds = ((process.env.NEXT_PUBLIC_VERIFICATION_TIMER_MINUTE as any) ?? 5) * 60 * 1000

  const { status: sendVerificationCodeStatus, loading: sendVerificationCodeLoading } = useSelector(
    (state: any) => state.verificationCodeSend
  )
  const {
    status: checkVerificationCodeStatus,
    loading: checkVerificationCodeLoading,
    errors: checkVerificationCodeErrors
  } = useSelector((state: any) => state.verificationCodeCheck)

  // ** Hooks
  const router = useRouter()
  const dispatch = useDispatch()
  const theme = useTheme()
  const auth = useAuth()
  const { user } = useAuth()
  const {
    control,
    handleSubmit,
    formState: { errors }
  } = useForm({ defaultValues })

  const errorsArray = Object.keys(errors)

  useEffect(() => {
    if (auth?.user?._id && auth?.user?.mobile_verified_at) {
      router.push('/home')
    } else if (router.pathname == '/verification') {
      dispatch(sendVerificationCode())
    }
  }, [])

  useEffect(() => {
    if (sendVerificationCodeStatus) {
      if (timerInterval) clearTimer()
      timer()
      dispatch(clearVerificationCodeSend())
    }
  }, [sendVerificationCodeStatus])

  useEffect(() => {
    if (checkVerificationCodeStatus) {
      setInputBorderColor(`${getColorCodes('success')} !important`)
      if (timerInterval) clearTimer()
      setTimeout(() => {
        auth.getUserData()
        setInputBorderColor('')
        dispatch(clearVerificationCodeCheck())
        router.push('/home')
      }, 1000)
    } else if (checkVerificationCodeErrors?.data?.message) setInputBorderColor(`${getColorCodes('error')} !important`)
  }, [checkVerificationCodeStatus, checkVerificationCodeErrors])

  // ** Vars

  const handleChange = (event: ChangeEvent, onChange: (...event: any[]) => void) => {
    if (!isBackspace) {
      onChange(event)
      setInputBorderColor('')

      // @ts-ignore
      const form = event.target.form
      const index = [...form].indexOf(event.target)
      if (form[index]?.value && form[index]?.value?.length) {
        form?.elements[index + 1]?.focus()
      }
      let data: any = []
      for (let i = 0; i <= 5; i++) {
        if (form[i]?.value && form[i]?.value?.length) data.push(form[i]?.value?.trim())
      }
      if (data.length == 5) submitHandler(data)
      event.preventDefault()
    }
  }

  const handleKeyDown = (event: KeyboardEvent) => {
    if (event.key === 'Backspace') {
      setIsBackspace(true)

      // @ts-ignore
      const form = event.target.form
      const index = [...form].indexOf(event.target)
      if (index >= 1) {
        if (!(form[index].value && form[index].value.length)) {
          form.elements[index - 1].focus()
        }
      }
    } else {
      setIsBackspace(false)
    }
  }

  const renderInputs = () => {
    return Object.keys(defaultValues).map((val, index) => (
      <Controller
        key={val}
        name={val}
        control={control}
        rules={{ required: true }}
        render={({ field: { value, onChange } }) => (
          <Box
            type='tel'
            maxLength={1}
            value={value}
            autoFocus={index === 0}
            component={CleaveInput}
            onKeyDown={handleKeyDown}
            onChange={(event: ChangeEvent) => handleChange(event, onChange)}
            options={{ blocks: [1], numeral: true, numeralPositiveOnly: true }}
            sx={{
              [theme.breakpoints.down('sm')]: { px: `${theme.spacing(2)} !important` },
              borderColor: inputBorderColor ?? undefined
            }}
            disabled={checkVerificationCodeStatus}
          />
        )}
      />
    ))
  }

  const clearTimer = () => {
    setShowTimer(0)
    clearInterval(timerInterval)
  }

  const timer: any = () => {
    setShowTimer(timerSeconds)
    const countDownDate = new Date(new Date().getTime() + timerSeconds)
    setTimerInterval(
      setInterval(() => {
        const now = new Date()
        if (countDownDate.getTime() < now.getTime()) {
          clearTimer()
        } else {
          setShowTimer(countDownDate.getTime() - now.getTime())
        }
      }, 1000)
    )
  }

  const submitHandler = (data: any) => {
    let code = ''
    for (const [key, value] of Object.entries(data)) {
      if (value) {
        code += value
      }
    }
    if (code.length == 5) {
      dispatch(checkVerificationCode(code))
    }
  }

  const handleClickSendSms = (e: any) => {
    const form = e?.target?.form
    form?.elements[0]?.focus()
    dispatch(sendVerificationCode())
  }

  const disableBtn =
    checkVerificationCodeStatus ||
    sendVerificationCodeStatus ||
    checkVerificationCodeLoading ||
    sendVerificationCodeLoading

  return (
    <Box sx={{ display: 'flex', justifyContent: 'center' }}>
      {auth?.user?.mobile_verified_at ? (
        <FallbackSpinner />
      ) : (
        <Card sx={{ zIndex: 1, width: '100%', justifyContent: 'center' }}>
          <CardContent sx={{ p: theme => `${theme.spacing(15.5, 7, 9)} !important`, pb: '20px !important' }}>
            <Box sx={{ mb: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
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
              <Typography variant='h5' sx={{ mb: 2 }}>
                Two Step Verification 💬
              </Typography>
              <Typography sx={{ color: 'text.secondary' }}>
                We sent a verification code to your mobile. Enter the code from the mobile in the field below.
              </Typography>
              <Typography sx={{ mt: 2, fontWeight: 700 }}>+98 {user?.mobile?.substring(2)}</Typography>
            </Box>
            <Typography sx={{ fontWeight: 600, color: 'text.secondary' }}>Type your 5 digit security code</Typography>
            <form onSubmit={handleSubmit(submitHandler)}>
              <CleaveWrapper
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  ...(errorsArray.length && {
                    '& .invalid:focus': {
                      borderColor: theme => `${theme.palette.error.main} !important`,
                      boxShadow: theme => `0 1px 3px 0 ${hexToRGBA(theme.palette.error.main, 0.4)}`
                    }
                  })
                }}
              >
                {renderInputs()}
              </CleaveWrapper>
              {errorsArray.length ? (
                <FormHelperText sx={{ color: 'error.main' }}>Please enter a valid OTP</FormHelperText>
              ) : null}
              {/* <Button
                fullWidth
                type='submit'
                variant='contained'
                sx={{ mt: 4 }}
                disabled={checkVerificationCodeLoading}
              >
                Verify My Account
              </Button> */}
              <Box sx={{ mt: 4, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {showTimer > 0 ? (
                  <Typography sx={{ display: 'inline' }}>
                    Resend Code In{' '}
                    <Typography sx={{ color: getColorCodes('primary'), display: 'inline', fontWeight: 600 }}>
                      {Math.ceil(showTimer / 1000)}s
                    </Typography>
                  </Typography>
                ) : !disableBtn ? (
                  router.pathname !== '/verification' ? (
                    <Button sx={{ ml: 1 }} onClick={handleClickSendSms} size='small'>
                      Request To Get The Verification Code
                    </Button>
                  ) : (
                    <>
                      <Typography sx={{ color: 'text.secondary' }}>Didn't get the code?</Typography>
                      <Button sx={{ ml: 1 }} onClick={handleClickSendSms}>
                        Resend
                      </Button>
                    </>
                  )
                ) : null}
              </Box>
            </form>
          </CardContent>
        </Card>
      )}
    </Box>
  )
}

export default Verification
