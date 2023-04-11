// ** React Imports
import { useState, ElementType, ChangeEvent, Fragment, useEffect } from 'react'

// ** MUI Imports
import Grid from '@mui/material/Grid'
import Select from '@mui/material/Select'
import Dialog from '@mui/material/Dialog'
import Divider from '@mui/material/Divider'
import { styled } from '@mui/material/styles'
import MenuItem from '@mui/material/MenuItem'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import InputLabel from '@mui/material/InputLabel'
import CardHeader from '@mui/material/CardHeader'
import FormControl from '@mui/material/FormControl'
import CardContent from '@mui/material/CardContent'
import InputAdornment from '@mui/material/InputAdornment'
import Button, { ButtonProps } from '@mui/material/Button'
import Icon from 'src/@core/components/icon'
import { Box, FormHelperText, IconButton } from '@mui/material'
import * as yup from 'yup'
import { mobileHandler, uppercaseFirstLetters } from 'src/helpers/functions'
import { Controller, useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { useDropzone } from 'react-dropzone'
import { toast } from 'react-hot-toast'
import { useDispatch } from 'react-redux'
import { clearCreateResume, createResume } from 'src/store/resume'
import { useSelector } from 'react-redux'
import { useRouter } from 'next/router'

interface FileProp {
  name: string
  type: string
  size: number
}

const genderOptions = ['men', 'women']
const educationOptions = ['diploma', 'bachelors_degree', 'associate_degree', 'masters', 'phd']
const maritalOptions = ['single', 'married', 'isolated', 'unknow']
const militaryOptions = ['included', 'end', 'exemption-edu', 'exemption-spo']
const cityOptions = [
  { value: 'tehran', label: 'Tehran' },
  { value: 'alborz', label: 'Alborz' },
  { value: 'qazvin', label: 'Qazvin' },
  { value: 'khorasaan_razavi', label: 'Khorasaan Razavi' }
]
const cityValues = cityOptions.map(item => item.value)

let years: Array<number> = []
for (let year = 1970; year <= new Date().getFullYear(); year++) years.push(year)

let salaries: Array<number> = []
for (let salary = 10; salary <= 50; salary++) salaries.push(salary * 1000000)

export interface ResumeFormData {
  firstname: string
  lastname: string
  gender: string
  education: string
  marital_status: string
  military_status?: string
  work_city: string
  residence_city: string
  birth_year: number
  work_experience?: number
  min_salary?: number
  max_salary?: number
  mobile: string
  phone?: string
  email: string
  avatar?: any
  position_id?: any
}

const defaultValues = {
  firstname: '',
  lastname: '',
  gender: '',
  education: '',
  marital_status: '',
  military_status: undefined,
  work_city: '',
  residence_city: '',
  birth_year: years.at(-1) as number,
  work_experience: undefined,
  min_salary: undefined,
  max_salary: undefined,
  mobile: '',
  phone: '',
  email: ''
}

const schema = yup.object().shape(
  {
    firstname: yup.string().label('First name').min(3).required(),
    lastname: yup.string().label('Last name').min(3).required(),
    gender: yup.string().label('Gender').oneOf(genderOptions).required(),
    education: yup.string().label('Education').oneOf(educationOptions).required(),
    marital_status: yup.string().label('Marital Status').oneOf(maritalOptions).required(),
    military_status: yup.string().when('military_status', (val: any) => {
      if (val) {
        return yup.string().label('Military Status').oneOf(militaryOptions).required()
      } else {
        return yup.string().notRequired()
      }
    }),
    work_city: yup.string().label('Work City').oneOf(cityValues).required(),
    residence_city: yup.string().label('Residence City').oneOf(cityValues).required(),
    birth_year: yup.number().label('Birth Year').oneOf(years).required(),
    work_experience: yup.number().when('work_experience', (val: any) => {
      if (val) {
        return yup.number().label('Work Started Year').oneOf(years).required()
      } else {
        return yup.number().notRequired()
      }
    }),
    min_salary: yup.number().when('min_salary', (val: any) => {
      if (val) {
        return yup.number().label('Minimum Requested Salary').oneOf(salaries).required()
      } else {
        return yup.number().notRequired()
      }
    }),
    max_salary: yup.number().when('max_salary', (val: any) => {
      if (val) {
        return yup.number().label('Maximum Requested Salary').oneOf(salaries).required()
      } else {
        return yup.number().notRequired()
      }
    }),
    mobile: yup
      .string()
      .label('Mobile')
      .matches(/^[\d]{10}$/, 'Mobile Is Not Valid (example: 912 345 6789)')
      .required(),
    phone: yup.string().when('phone', (val: any) => {
      if (val) {
        return yup
          .string()
          .label('Phone Number')
          .matches(/^[\d]{10}$/, 'Phone Number Is Not Valid (example: 21 8844 6623)')
          .required()
      } else {
        return yup.string().notRequired()
      }
    }),
    email: yup.string().label('Email').email('Email Is Not Valid!').required()
  },
  [
    ['military_status', 'military_status'],
    ['work_experience', 'work_experience'],
    ['min_salary', 'min_salary'],
    ['max_salary', 'max_salary'],
    ['phone', 'phone']
  ]
)

interface AddResumeDialogProps {
  open: boolean
  handleClose: any
}

const ImgStyled = styled('img')(({ theme }) => ({
  width: 120,
  height: 120,
  marginRight: theme.spacing(5),
  borderRadius: theme.shape.borderRadius
}))

const AddResumeDialog = ({ open, handleClose }: AddResumeDialogProps) => {
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

  const dispatch = useDispatch()

  const { status: statusResumeCreate } = useSelector((state: any) => state.resumeCreate)

  const {
    query: { positionId }
  } = useRouter()

  useEffect(() => {
    if (statusResumeCreate) {
      reset()
      dispatch(clearCreateResume())
      handleClose()
      setFiles([])
    }
  }, [statusResumeCreate])

  const renderFilePreview = (file: FileProp) => {
    if (file.type.startsWith('image')) {
      return <ImgStyled alt={file.name} src={URL.createObjectURL(file as any)} />
    } else {
      return <Icon icon='mdi:file-document-outline' />
    }
  }

  const {
    reset,
    control,
    handleSubmit,
    formState: { errors },
    setValue,
    setError
  } = useForm({
    defaultValues,
    mode: 'onBlur',
    resolver: yupResolver(schema)
  })

  const submitHandler = (data: ResumeFormData) => {
    if (data?.min_salary && data?.max_salary && data?.min_salary > data?.max_salary) {
      setError('min_salary', {
        type: 'manual',
        message: 'Minimum Requested Salary Cannot Be Greater Than Maximum Requested Salary!'
      })
    } else {
      data = { ...data, position_id: positionId }
      data.mobile = '98' + data.mobile
      if (files[0]) {
        data = { ...data, avatar: files[0] }
      }
      dispatch(createResume(data))
    }
  }

  return (
    <>
      <Dialog fullWidth scroll='body' onClose={handleClose} open={open} maxWidth='md'>
        <IconButton size='small' onClick={handleClose} sx={{ position: 'absolute', right: '0.5rem', top: '0.5rem' }}>
          <Icon icon='mdi:close' />
        </IconButton>
        <Grid
          container
          spacing={6}
          sx={{
            p: '0 20px'
          }}
        >
          <Grid item xs={12}>
            <>
              <CardHeader title='Add Resume' />
              <form onSubmit={handleSubmit(submitHandler)}>
                <Fragment>
                  <div {...getRootProps({ className: 'dropzone' })}>
                    <input {...getInputProps()} />
                    <Box sx={{ textAlign: 'center' }}>
                      <Typography sx={{ marginBottom: '10px', fontWeight: 200 }} variant='h6'>
                        Drop Avatar Here Or Click To Upload
                      </Typography>
                      {files[0] ? (
                        renderFilePreview(files[0])
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
                          Allowed *.jpeg, *.jpg, *.png, *.gif
                        </Typography>
                        <Typography sx={{ fontSize: '12px' }} color='textSecondary'>
                          Max size of 2 MB
                        </Typography>
                      </Box>
                    </Box>
                  </div>
                </Fragment>
                <Divider />
                <CardContent>
                  <Grid container spacing={6}>
                    <Grid item xs={12} mt={5} sm={6}>
                      <FormControl fullWidth>
                        <Controller
                          name='firstname'
                          control={control}
                          rules={{ required: true }}
                          render={({ field: { value, onChange, onBlur } }) => (
                            <TextField
                              value={value}
                              fullWidth
                              label='First Name'
                              placeholder='John'
                              onChange={onChange}
                              onBlur={onBlur}
                              error={Boolean(errors.firstname)}
                            />
                          )}
                        />
                        {errors.firstname && (
                          <FormHelperText sx={{ color: 'error.main' }}>{errors.firstname.message}</FormHelperText>
                        )}
                      </FormControl>
                    </Grid>
                    <Grid item xs={12} mt={5} sm={6}>
                      <FormControl fullWidth>
                        <Controller
                          name='lastname'
                          control={control}
                          render={({ field: { value, onChange, onBlur } }) => (
                            <TextField
                              value={value}
                              fullWidth
                              label='Last Name'
                              placeholder='Doe'
                              onChange={onChange}
                              onBlur={onBlur}
                              error={Boolean(errors.lastname)}
                            />
                          )}
                        />
                        {errors.lastname && (
                          <FormHelperText sx={{ color: 'error.main' }}>{errors.lastname.message}</FormHelperText>
                        )}
                      </FormControl>
                    </Grid>
                    <Grid item xs={12} mt={5} sm={6}>
                      <FormControl fullWidth>
                        <Controller
                          name='gender'
                          control={control}
                          render={({ field: { value, onChange, onBlur } }) => (
                            <>
                              <InputLabel>Gender</InputLabel>
                              <Select
                                label='Gender'
                                value={value}
                                onChange={onChange}
                                onBlur={onBlur}
                                error={Boolean(errors.gender)}
                              >
                                {genderOptions.map((item: any, index: number) => (
                                  <MenuItem key={`gender-${index}`} value={item}>
                                    {uppercaseFirstLetters(item)}
                                  </MenuItem>
                                ))}
                              </Select>
                            </>
                          )}
                        />
                        {errors.gender && (
                          <FormHelperText sx={{ color: 'error.main' }}>{errors.gender.message}</FormHelperText>
                        )}
                      </FormControl>
                    </Grid>
                    <Grid item xs={12} mt={5} sm={6}>
                      <FormControl fullWidth>
                        <Controller
                          name='mobile'
                          control={control}
                          render={({ field: { value, onChange, onBlur } }) => (
                            <TextField
                              value={value}
                              fullWidth
                              type='number'
                              label='Mobile'
                              placeholder='919 123 4567'
                              InputProps={{
                                startAdornment: <InputAdornment position='start'>IR (+98)</InputAdornment>
                              }}
                              onChange={e => {
                                onChange(e)
                                mobileHandler(e.target.value, value, setValue)
                              }}
                              onBlur={onBlur}
                              error={Boolean(errors.mobile)}
                            />
                          )}
                        />
                        {errors.mobile && (
                          <FormHelperText sx={{ color: 'error.main' }}>{errors.mobile.message}</FormHelperText>
                        )}
                      </FormControl>
                    </Grid>
                    <Grid item xs={12} mt={5} sm={6}>
                      <FormControl fullWidth>
                        <Controller
                          name='email'
                          control={control}
                          render={({ field: { value, onChange, onBlur } }) => (
                            <TextField
                              value={value}
                              fullWidth
                              type='email'
                              label='Email'
                              placeholder='john.doe@example.com'
                              onChange={onChange}
                              onBlur={onBlur}
                              error={Boolean(errors.email)}
                            />
                          )}
                        />
                        {errors.email && (
                          <FormHelperText sx={{ color: 'error.main' }}>{errors.email.message}</FormHelperText>
                        )}
                      </FormControl>
                    </Grid>
                    <Grid item xs={12} mt={5} sm={6}>
                      <FormControl fullWidth>
                        <Controller
                          name='phone'
                          control={control}
                          render={({ field: { value, onChange, onBlur } }) => (
                            <TextField
                              value={value}
                              fullWidth
                              type='number'
                              label='Phone Number'
                              placeholder='21 8846 7889'
                              InputProps={{
                                startAdornment: <InputAdornment position='start'>IR (+98)</InputAdornment>
                              }}
                              onChange={onChange}
                              onBlur={onBlur}
                              error={Boolean(errors.phone)}
                            />
                          )}
                        />
                        {errors.phone && (
                          <FormHelperText sx={{ color: 'error.main' }}>{errors.phone.message}</FormHelperText>
                        )}
                      </FormControl>
                    </Grid>
                    <Grid item xs={12} mt={5} sm={4}>
                      <FormControl fullWidth>
                        <Controller
                          name='birth_year'
                          control={control}
                          render={({ field: { value, onChange, onBlur } }) => (
                            <>
                              <InputLabel>Birth Year</InputLabel>
                              <Select
                                label='Birth Year'
                                value={value}
                                onChange={onChange}
                                onBlur={onBlur}
                                error={Boolean(errors.birth_year)}
                              >
                                {years.map((item: number, index: number) => (
                                  <MenuItem key={index} value={item}>
                                    {item}
                                  </MenuItem>
                                ))}
                              </Select>
                            </>
                          )}
                        />
                        {errors.birth_year && (
                          <FormHelperText sx={{ color: 'error.main' }}>{errors.birth_year.message}</FormHelperText>
                        )}
                      </FormControl>
                    </Grid>
                    <Grid item xs={12} mt={5} sm={4}>
                      <FormControl fullWidth>
                        <Controller
                          name='work_experience'
                          control={control}
                          render={({ field: { value, onChange, onBlur } }) => (
                            <>
                              <InputLabel>Work Started Year</InputLabel>
                              <Select
                                label='Work Started Year'
                                value={value}
                                onChange={onChange}
                                onBlur={onBlur}
                                error={Boolean(errors.work_experience)}
                              >
                                {years.map(
                                  (item: number, index: number) =>
                                    item >= 1980 && (
                                      <MenuItem key={index} value={item}>
                                        {item}
                                      </MenuItem>
                                    )
                                )}
                              </Select>
                            </>
                          )}
                        />
                        {errors.work_experience && (
                          <FormHelperText sx={{ color: 'error.main' }}>{errors.work_experience.message}</FormHelperText>
                        )}
                      </FormControl>
                    </Grid>
                    <Grid item xs={12} mt={5} sm={4}>
                      <FormControl fullWidth>
                        <Controller
                          name='education'
                          control={control}
                          render={({ field: { value, onChange, onBlur } }) => (
                            <>
                              <InputLabel>Education</InputLabel>
                              <Select
                                label='Education'
                                value={value}
                                onChange={onChange}
                                onBlur={onBlur}
                                error={Boolean(errors.education)}
                              >
                                {educationOptions.map((item: any, index: number) => (
                                  <MenuItem key={`education-${index}`} value={item}>
                                    {uppercaseFirstLetters(item)}
                                  </MenuItem>
                                ))}
                              </Select>
                            </>
                          )}
                        />
                        {errors.education && (
                          <FormHelperText sx={{ color: 'error.main' }}>{errors.education.message}</FormHelperText>
                        )}
                      </FormControl>
                    </Grid>
                    <Grid item xs={12} mt={5} sm={6}>
                      <FormControl fullWidth>
                        <Controller
                          name='marital_status'
                          control={control}
                          render={({ field: { value, onChange, onBlur } }) => (
                            <>
                              <InputLabel>Marital Status</InputLabel>
                              <Select
                                label='Marital Status'
                                value={value}
                                onChange={onChange}
                                onBlur={onBlur}
                                error={Boolean(errors.marital_status)}
                              >
                                {maritalOptions.map((item: any, index: number) => (
                                  <MenuItem key={`marital-${index}`} value={item}>
                                    {uppercaseFirstLetters(item)}
                                  </MenuItem>
                                ))}
                              </Select>
                            </>
                          )}
                        />
                        {errors.marital_status && (
                          <FormHelperText sx={{ color: 'error.main' }}>{errors.marital_status.message}</FormHelperText>
                        )}
                      </FormControl>
                    </Grid>
                    <Grid item xs={12} mt={5} sm={6}>
                      <FormControl fullWidth>
                        <Controller
                          name='military_status'
                          control={control}
                          render={({ field: { value, onChange, onBlur } }) => (
                            <>
                              <InputLabel>Military Status</InputLabel>
                              <Select
                                label='Military Status'
                                value={value}
                                onChange={onChange}
                                onBlur={onBlur}
                                error={Boolean(errors.military_status)}
                              >
                                {militaryOptions.map((item: any, index: number) => (
                                  <MenuItem key={`military-${index}`} value={item}>
                                    {uppercaseFirstLetters(item)}
                                  </MenuItem>
                                ))}
                              </Select>
                            </>
                          )}
                        />
                        {errors.military_status && (
                          <FormHelperText sx={{ color: 'error.main' }}>{errors.military_status.message}</FormHelperText>
                        )}
                      </FormControl>
                    </Grid>
                    <Grid item xs={12} mt={5} sm={6}>
                      <FormControl fullWidth>
                        <Controller
                          name='work_city'
                          control={control}
                          render={({ field: { value, onChange, onBlur } }) => (
                            <>
                              <InputLabel>Work City</InputLabel>
                              <Select
                                label='Work City'
                                value={value}
                                onChange={onChange}
                                onBlur={onBlur}
                                error={Boolean(errors.work_city)}
                              >
                                {cityOptions.map(({ value, label }: any, index: number) => (
                                  <MenuItem key={`work-city-${index}`} value={value}>
                                    {label}
                                  </MenuItem>
                                ))}
                              </Select>
                            </>
                          )}
                        />
                        {errors.work_city && (
                          <FormHelperText sx={{ color: 'error.main' }}>{errors.work_city.message}</FormHelperText>
                        )}
                      </FormControl>
                    </Grid>
                    <Grid item xs={12} mt={5} sm={6}>
                      <FormControl fullWidth>
                        <Controller
                          name='residence_city'
                          control={control}
                          render={({ field: { value, onChange, onBlur } }) => (
                            <>
                              <InputLabel>Residence City</InputLabel>
                              <Select
                                label='Residence City'
                                value={value}
                                onChange={onChange}
                                onBlur={onBlur}
                                error={Boolean(errors.residence_city)}
                              >
                                {cityOptions.map(({ value, label }: any, index: number) => (
                                  <MenuItem key={`residence-city-${index}`} value={value}>
                                    {label}
                                  </MenuItem>
                                ))}
                              </Select>
                            </>
                          )}
                        />
                        {errors.residence_city && (
                          <FormHelperText sx={{ color: 'error.main' }}>{errors.residence_city.message}</FormHelperText>
                        )}
                      </FormControl>
                    </Grid>
                    <Grid item xs={12} mt={5} sm={6}>
                      <FormControl fullWidth>
                        <Controller
                          name='min_salary'
                          control={control}
                          render={({ field: { value, onChange, onBlur } }) => (
                            <>
                              <InputLabel>Minimum Requested Salary (Toman)</InputLabel>
                              <Select
                                label='Minimum Requested Salary (Toman)'
                                value={value}
                                onChange={onChange}
                                onBlur={onBlur}
                                error={Boolean(errors.min_salary)}
                              >
                                {salaries.map((item: any, index: number) => (
                                  <MenuItem key={`min-salary-${index}`} value={item}>
                                    {item.format()}
                                  </MenuItem>
                                ))}
                              </Select>
                            </>
                          )}
                        />
                        {errors.min_salary && (
                          <FormHelperText sx={{ color: 'error.main' }}>{errors.min_salary.message}</FormHelperText>
                        )}
                      </FormControl>
                    </Grid>
                    <Grid item xs={12} mt={5} sm={6}>
                      <FormControl fullWidth>
                        <Controller
                          name='max_salary'
                          control={control}
                          render={({ field: { value, onChange, onBlur } }) => (
                            <>
                              <InputLabel>Maximum Requested Salary (Toman)</InputLabel>
                              <Select
                                label='Maximum Requested Salary (Toman)'
                                value={value}
                                onChange={onChange}
                                onBlur={onBlur}
                                error={Boolean(errors.max_salary)}
                              >
                                {salaries.map((item: any, index: number) => (
                                  <MenuItem key={`max-salary-${index}`} value={item}>
                                    {item.format()}
                                  </MenuItem>
                                ))}
                              </Select>
                            </>
                          )}
                        />
                        {errors.max_salary && (
                          <FormHelperText sx={{ color: 'error.main' }}>{errors.max_salary.message}</FormHelperText>
                        )}
                      </FormControl>
                    </Grid>

                    <Grid item xs={12} mt={5}>
                      <Button type='submit' variant='contained' sx={{ mr: 3 }}>
                        Save Changes
                      </Button>
                      <Button variant='outlined' color='secondary' onClick={handleClose}>
                        Cancel
                      </Button>
                    </Grid>
                  </Grid>
                </CardContent>
              </form>
            </>
          </Grid>
        </Grid>
      </Dialog>
    </>
  )
}

export default AddResumeDialog
