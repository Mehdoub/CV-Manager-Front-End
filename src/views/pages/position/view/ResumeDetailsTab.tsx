// ** React Imports
import { useState, Fragment, useEffect } from 'react'

// ** MUI Imports
import Grid from '@mui/material/Grid'
import Select from '@mui/material/Select'
import Divider from '@mui/material/Divider'
import { styled } from '@mui/material/styles'
import MenuItem from '@mui/material/MenuItem'
import CustomTextField from 'src/@core/components/custom-textfield'
import Typography, { TypographyProps } from '@mui/material/Typography'
import InputLabel from '@mui/material/InputLabel'
import CardHeader from '@mui/material/CardHeader'
import FormControl from '@mui/material/FormControl'
import CardContent from '@mui/material/CardContent'
import InputAdornment from '@mui/material/InputAdornment'
import Button from '@mui/material/Button'
import Icon from 'src/@core/components/icon'
import {
  Autocomplete,
  Avatar,
  Box,
  CircularProgress,
  FormHelperText,
  IconButton,
  Link,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Slider
} from '@mui/material'
import * as yup from 'yup'
import {
  getAllowedFormats,
  getImagePath,
  mobileHandler,
  popObjectItemByKey,
  toastError,
  uppercaseFirstLetters
} from 'src/helpers/functions'
import { Controller, useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { useDropzone } from 'react-dropzone'
import { useDispatch } from 'react-redux'
import { clearCreateResume, clearEditResume, createResume, editResume, getResume } from 'src/store/resume'
import { useSelector } from 'react-redux'
import { useRouter } from 'next/router'
import { getCitiesByProvince } from 'src/store/province'
import { getPositionResumes } from 'src/store/position'

interface FileProp {
  name: string
  type: string
  size: number
}

let years: Array<number> = []
for (let year = 1970; year <= new Date().getFullYear(); year++) years.push(year)

export interface ResumeFormData {
  firstname: string
  lastname: string
  gender: string
  education: string
  marital_status: string
  military_status?: string
  work_province: string
  work_city: string
  residence_province: string
  residence_city: string
  birth_year: number
  work_experience?: number
  min_salary?: number
  max_salary?: number
  mobile: string
  phone?: string
  email: string
  avatar?: any
  resumeFiles?: any
  position_id?: any
}

const defaultValues = {
  firstname: '',
  lastname: '',
  gender: '',
  education: '',
  marital_status: '',
  military_status: '',
  // work_province: '',
  // work_city: '',
  // residence_province: '',
  // residence_city: '',
  birth_year: years.at(-1) as number,
  work_experience: years.at(-1) as number,
  mobile: '',
  phone: '',
  email: ''
}

const ImgStyled = styled('img')(({ theme }) => ({
  width: 120,
  height: 120,
  marginRight: theme.spacing(5),
  borderRadius: theme.shape.borderRadius
}))

const HeadingTypography = styled(Typography)<TypographyProps>(({ theme }) => ({
  marginBottom: theme.spacing(5),
  [theme.breakpoints.down('sm')]: {
    marginBottom: theme.spacing(4)
  }
}))

const ResumeDetailsTab = () => {
  const [avatar, setAvatar] = useState<File[]>([])
  const [resumeFiles, setResumeFiles] = useState<File[]>([])
  const [gender, setGender] = useState<string>('')
  const [salaryRange, setSalaryRange] = useState<any>([9000000, 20000000] || '')
  const [workCities, setWorkCities] = useState([])
  const [residanceCities, setResidanceCities] = useState([])
  const [fillCities, setFillCities] = useState('')
  const [resumePosition, setResumePosition] = useState<any>({})
  const [positionErr, setPositionErr] = useState<string>('')

  const { data: resume } = useSelector((state: any) => state.resume)
  const { data: provinceCities } = useSelector((state: any) => state.citiesByProvince)
  const { data: provinces } = useSelector((state: any) => state.provinces)
  const { data: positions, loading: loadingSearchPositions } = useSelector((state: any) => state.projectPositions)
  const { status: statusResumeEdit, loading: loadingResumeEdit } = useSelector((state: any) => state.resumeEdit)
  const { data: projects, loading: loadingSearchProjects } = useSelector((state: any) => state.projectsList)
  const {
    data: {
      system: {
        gender: genderOptions,
        education: educationOptions,
        military_status: militaryOptions,
        marital_status: maritalOptions
      }
    }
  } = useSelector((state: any) => state.constants)

  const {
    query: { positionId }
  } = useRouter()

  const provincesValues = provinces.length > 0 ? provinces.map((province: any) => province._id) : []
  const workCitiesValues = workCities.length > 0 ? workCities.map((workCity: any) => workCity._id) : []
  const residanceCitiesValues =
    residanceCities.length > 0 ? residanceCities.map((residanceCity: any) => residanceCity._id) : []

  useEffect(() => {
    if (provinceCities) {
      if (fillCities == 'work') {
        setWorkCities(provinceCities)
        setFillCities('')
      } else if (fillCities == 'residance') {
        setResidanceCities(provinceCities)
        setFillCities('')
      }
    }
  }, [provinceCities])

  const dispatch = useDispatch()

  const schema = yup.object().shape(
    {
      firstname: yup.string().label('First name').min(3).required(),
      lastname: yup.string().label('Last name').min(3).required(),
      gender: yup.string().label('Gender').oneOf(genderOptions).required(),
      education: yup.string().label('Education').oneOf(educationOptions).required(),
      marital_status: yup.string().label('Marital Status').oneOf(maritalOptions).required(),
      military_status: yup.string().when('gender', (val: any) => {
        if (val == 'men') {
          return yup.string().label('Military Status').oneOf(militaryOptions).required()
        } else {
          return yup.string().notRequired()
        }
      }),
      // work_province: yup.string().label('Work Province').oneOf(provincesValues).required(),
      // work_city: yup.string().label('Work City').oneOf(workCitiesValues).required(),
      // residence_province: yup.string().label('Residence Province').oneOf(provincesValues).required(),
      // residence_city: yup.string().label('Residence City').oneOf(residanceCitiesValues).required(),
      birth_year: yup.number().label('Birth Year').oneOf(years).required(),
      work_experience: yup.number().when('work_experience', (val: any) => {
        if (val) {
          return yup.number().label('Work Started Year').oneOf(years).required()
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
      ['phone', 'phone']
    ]
  )

  // ** Hooks
  // Upload Avatar
  const { getRootProps, getInputProps } = useDropzone({
    maxFiles: 1,
    multiple: false,
    maxSize: 2000000,
    accept: {
      'image/*': getAllowedFormats('image', true)
    },
    onDrop: (acceptedFiles: File[]) => {
      setAvatar(acceptedFiles.map((file: File) => Object.assign(file)))
    },
    onDropRejected: () => {
      toastError('You can only upload maximum size of 2 MB.')
    }
  })

  useEffect(() => {
    if (statusResumeEdit) {
      dispatch(clearEditResume())
      dispatch(getPositionResumes(positionId))
      dispatch(getResume(resume?.id))
    }
  }, [statusResumeEdit])

  const renderFilePreview = (file: any) => {
    if (file?.type?.startsWith('image')) {
      return <ImgStyled alt={file.name} src={URL.createObjectURL(file as any)} />
    } else {
      return <Icon icon='mdi:file-document-outline' />
    }
  }

  const handleRemoveFile = (file: FileProp) => {
    const uploadedFiles = resumeFiles
    const filtered = uploadedFiles.filter((i: FileProp) => i.name !== file.name)
    setResumeFiles([...filtered])
  }

  const fileList = resumeFiles.map((file: FileProp) => (
    <ListItem key={file.name} style={{ border: '1px solid #e2e2e2', borderRadius: '16px', marginTop: '8px' }}>
      <Grid item xs={4} sm={1} className='file-preview'>
        {renderFilePreview(file)}
      </Grid>
      <Grid item xs={12}>
        <Typography className='file-name'>{file.name}</Typography>
        <Typography className='file-size' variant='body2'>
          {Math.round(file.size / 100) / 10 > 1000
            ? (Math.round(file.size / 100) / 10000).toFixed(1) + ' MB'
            : (Math.round(file.size / 100) / 10).toFixed(1)}{' '}
          KB
        </Typography>
      </Grid>
      <Grid item xs={4} sx={{ display: 'flex', justifyContent: 'right' }}>
        <IconButton onClick={() => handleRemoveFile(file)}>
          <Icon icon='mdi:close' fontSize={20} />
        </IconButton>
      </Grid>
    </ListItem>
  ))

  const {
    reset,
    control,
    handleSubmit,
    formState: { errors },
    setValue
  } = useForm({
    defaultValues,
    mode: 'onBlur',
    resolver: yupResolver(schema)
  })

  useEffect(() => {
    if (resume?._id) {
      setInitialValues()
    }
  }, [resume])

  const setInitialValues = () => {
    setValue('firstname', resume?.firstname)
    setValue('lastname', resume?.lastname)
    setValue('gender', resume?.gender)
    setValue('mobile', resume?.mobile.substring(2))
    setValue('email', resume?.email)
    setValue('phone', resume?.phone)
    setValue('birth_year', resume?.birth_year)
    setValue('work_experience', resume?.work_experience)
    setValue('marital_status', resume?.marital_status)
    setValue('education', resume?.education)
    setValue('military_status', resume?.military_status)
    // setValue('work_city', resume?.work_city)
    // setValue('residence_city', resume?.residence_city)
    setSalaryRange([resume?.min_salary, resume?.max_salary])
    setGender(resume?.gender)
  }

  const submitHandler = (data: any) => {
    data.mobile = '98' + data.mobile
    if (avatar[0]) {
      data = { ...data, avatar: avatar[0] }
    }
    popObjectItemByKey(data, 'work_province')
    popObjectItemByKey(data, 'residence_province')
    ;[data.min_salary, data.max_salary] = salaryRange
    dispatch(editResume({ ...data, resumeId: resume?._id }))
  }

  const handleCities = (provinceId: string, field: string) => {
    setFillCities(field)
    dispatch(getCitiesByProvince(provinceId))
  }

  return (
    <Grid
      container
      spacing={6}
      sx={{
        p: '0 20px'
      }}
    >
      <Grid item xs={12}>
        <>
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
                  ) : resume?.avatar ? (
                    <ImgStyled src={getImagePath(resume?.avatar)} alt='Profile Pic' />
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
            <Divider />
            <CardContent>
              <Grid container spacing={6}>
                <Grid item xs={12} mt={5} md={4}>
                  <FormControl fullWidth>
                    <Controller
                      name='firstname'
                      control={control}
                      rules={{ required: true }}
                      render={({ field: { value, onChange, onBlur } }) => (
                        <CustomTextField
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
                <Grid item xs={12} mt={5} md={4}>
                  <FormControl fullWidth>
                    <Controller
                      name='lastname'
                      control={control}
                      render={({ field: { value, onChange, onBlur } }) => (
                        <CustomTextField
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
                <Grid item xs={12} mt={5} md={4}>
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
                            onChange={e => {
                              onChange(e)
                              setGender(e.target.value)
                            }}
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
                <Grid item xs={12} mt={5} md={4}>
                  <FormControl fullWidth>
                    <Controller
                      name='mobile'
                      control={control}
                      render={({ field: { value, onChange, onBlur } }) => (
                        <CustomTextField
                          value={value?.substring(0, 10)}
                          fullWidth
                          label='Mobile'
                          placeholder='919 123 4567'
                          InputProps={{
                            startAdornment: <InputAdornment position='start'>IR (+98)</InputAdornment>
                          }}
                          onChange={e => {
                            onChange(e)
                            mobileHandler(e.target.value, setValue)
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
                <Grid item xs={12} mt={5} md={4}>
                  <FormControl fullWidth>
                    <Controller
                      name='email'
                      control={control}
                      render={({ field: { value, onChange, onBlur } }) => (
                        <CustomTextField
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
                <Grid item xs={12} mt={5} md={4}>
                  <FormControl fullWidth>
                    <Controller
                      name='phone'
                      control={control}
                      render={({ field: { value, onChange, onBlur } }) => (
                        <CustomTextField
                          value={value?.substring(0, 10)}
                          fullWidth
                          label='Phone Number'
                          placeholder='21 8846 7889'
                          InputProps={{
                            startAdornment: <InputAdornment position='start'>IR (+98)</InputAdornment>
                          }}
                          onChange={e => {
                            onChange(e)
                            mobileHandler(e.target.value, setValue, 'phone')
                          }}
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
                <Grid item xs={12} mt={5} md={6}>
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
                <Grid item xs={12} mt={5} md={6}>
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
                <Grid item xs={12} mt={5} md={4}>
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
                <Grid item xs={12} mt={5} md={4}>
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
                <Grid item xs={12} mt={5} md={4}>
                  {gender != 'women' && (
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
                  )}
                </Grid>
                {/* <Grid item xs={12} mt={5} md={6}>
                  <FormControl fullWidth>
                    <Controller
                      name='work_province'
                      control={control}
                      render={({ field: { value, onChange, onBlur } }) => (
                        <>
                          <InputLabel>Work Province</InputLabel>
                          <Select
                            label='Work Province'
                            value={value}
                            onChange={e => {
                              onChange(e)
                              handleCities(e.target.value, 'work')
                            }}
                            onBlur={onBlur}
                            error={Boolean(errors.work_province)}
                          >
                            {provinces.map((item: any, index: number) => (
                              <MenuItem key={`work-province-${index}`} value={item._id}>
                                {item.name}
                              </MenuItem>
                            ))}
                          </Select>
                        </>
                      )}
                    />
                    {errors.work_province && (
                      <FormHelperText sx={{ color: 'error.main' }}>{errors.work_province.message}</FormHelperText>
                    )}
                  </FormControl>
                </Grid>
                <Grid item xs={12} mt={5} md={6}>
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
                            {workCities.map((item: any, index: number) => (
                              <MenuItem key={`work-city-${index}`} value={item._id}>
                                {item.name}
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
                <Grid item xs={12} mt={5} md={6}>
                  <FormControl fullWidth>
                    <Controller
                      name='residence_province'
                      control={control}
                      render={({ field: { value, onChange, onBlur } }) => (
                        <>
                          <InputLabel>Residence Province</InputLabel>
                          <Select
                            label='Residence Province'
                            value={value}
                            onChange={e => {
                              onChange(e)
                              handleCities(e.target.value, 'residance')
                            }}
                            onBlur={onBlur}
                            error={Boolean(errors.residence_province)}
                          >
                            {provinces.map((item: any, index: number) => (
                              <MenuItem key={`residence-province-${index}`} value={item._id}>
                                {item.name}
                              </MenuItem>
                            ))}
                          </Select>
                        </>
                      )}
                    />
                    {errors.residence_province && (
                      <FormHelperText sx={{ color: 'error.main' }}>{errors.residence_province.message}</FormHelperText>
                    )}
                  </FormControl>
                </Grid>
                <Grid item xs={12} mt={5} md={6}>
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
                            {residanceCities.map((item: any, index: number) => (
                              <MenuItem key={`residence-city-${index}`} value={item._id}>
                                {item.name}
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
                </Grid> */}
                <Grid item xs={12} mt={5} px={7}>
                  <InputLabel>Requested Salary Range (Toman)</InputLabel>
                  <Slider
                    sx={{ mt: 4 }}
                    defaultValue={[9000000, 20000000]}
                    value={salaryRange}
                    onChange={(e, value) => setSalaryRange(value)}
                    valueLabelDisplay='auto'
                    aria-labelledby='range-slider'
                    min={8000000}
                    max={80000000}
                    step={1000000}
                    valueLabelFormat={(value: any) => value.format()}
                  />
                  <Typography>{`${salaryRange[0].format()} - ${salaryRange[1].format()} Toman`}</Typography>
                </Grid>
                <Grid item xs={12} mt={3}>
                  <Button type='submit' variant='contained' sx={{ mr: 3, mt: 2 }} disabled={loadingResumeEdit}>
                    Save Changes
                  </Button>
                  <Button
                    variant='outlined'
                    color='secondary'
                    sx={{ mt: 2 }}
                    disabled={loadingResumeEdit}
                    onClick={() => setInitialValues()}
                  >
                    Reset
                  </Button>
                </Grid>
              </Grid>
            </CardContent>
          </form>
        </>
      </Grid>
    </Grid>
  )
}

export default ResumeDetailsTab
