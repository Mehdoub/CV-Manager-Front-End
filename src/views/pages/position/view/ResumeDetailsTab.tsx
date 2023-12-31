// ** React Imports
import { useState, Fragment, useEffect } from 'react'

// ** MUI Imports
import Grid from '@mui/material/Grid'
import Select from '@mui/material/Select'
import Divider from '@mui/material/Divider'
import { styled } from '@mui/material/styles'
import MenuItem from '@mui/material/MenuItem'
import CustomTextField from 'src/@core/components/custom-textfield'
import Typography from '@mui/material/Typography'
import InputLabel from '@mui/material/InputLabel'
import FormControl from '@mui/material/FormControl'
import CardContent from '@mui/material/CardContent'
import InputAdornment from '@mui/material/InputAdornment'
import Button from '@mui/material/Button'
import Icon from 'src/@core/components/icon'
import {
  Box,
  FormControlLabel,
  FormHelperText,
  Grow,
  Slider,
  Switch
} from '@mui/material'
import * as yup from 'yup'
import {
  constantReader,
  getAllowedFormats,
  getImagePath,
  getObjectKeys,
  mobileHandler,
  popObjectItemByKey,
  toastError,
  uppercaseFirstLetters
} from 'src/helpers/functions'
import { Controller, useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { useDropzone } from 'react-dropzone'
import { useDispatch } from 'react-redux'
import { clearEditResume, editResume, getResume, getResumes } from 'src/store/resume'
import { useSelector } from 'react-redux'
import { useRouter } from 'next/router'
import { getCitiesByProvince } from 'src/store/province'
import { getPositionResumes } from 'src/store/position'


let years: Array<any> = []
for (let year = 1970; year <= new Date().getFullYear(); year++) years.push(String(year))

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
  birth_year: any
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
  residence_province: '',
  residence_city: '',
  birth_year: '',
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

const ResumeDetailsTab = ({closeToggle}:any) => {
  const [avatar, setAvatar] = useState<File[]>([])
  const [gender, setGender] = useState<string>('')
  const [salaryRange, setSalaryRange] = useState<any>([9000000, 20000000])
  const [residenceCities, setResidenceCities] = useState([])
  const [fillCities, setFillCities] = useState('')
  const [fillResidenceCity, setFillResidenceCity] = useState<boolean>(true)
  const [closeAfterSave, setCloseAfterSave] = useState<boolean>(false)

  const { data: resume } = useSelector((state: any) => state.resume)
  const { data: provinceCities } = useSelector((state: any) => state.citiesByProvince)
  const { data: provinces } = useSelector((state: any) => state.provinces)
  const { status: statusResumeEdit, loading: loadingResumeEdit } = useSelector((state: any) => state.resumeEdit)
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

  const [isSalaryActive, setIsSalaryActive] = useState<boolean>(resume?.min_salary ? true : false)

  const handleChangeisSalaryActive = () => {
    setIsSalaryActive(!isSalaryActive)
  }

  const {
    query: { positionId }
  } = useRouter()

  useEffect(() => {
    if (provinceCities) {
      // if (fillCities == 'work') {
      //   setWorkCities(provinceCities)
      //   setFillCities('')
      // } else
      if (fillCities == 'residence') {
        setResidenceCities(provinceCities)
        if (fillResidenceCity) {
          setValue('residence_city', resume?.residence_city?._id)
          setFillResidenceCity(false)
        }
        setFillCities('')
      }
    }
  }, [provinceCities])

  const provincesValues = provinces.length > 0 ? provinces.map((province: any) => province._id) : []
  const residenceCitiesValues =
    residenceCities.length > 0 ? residenceCities.map((residenceCity: any) => residenceCity._id) : []

  const dispatch = useDispatch()

  const schema = yup.object().shape(
    {
      firstname: yup.string().label('First name').min(3).required(),
      lastname: yup.string().label('Last name').min(3).required(),
      gender: yup.string().label('Gender').oneOf(getObjectKeys(genderOptions)).required(),
      education: yup.string().label('Education').oneOf(['', ...getObjectKeys(educationOptions)]).optional(),
      marital_status: yup.string().label('Marital Status').oneOf(['', ...getObjectKeys(maritalOptions)]).optional(),
      military_status: yup.string().when('gender', (val: any) => {
        if (val == 'man') {
          return yup.string().label('Military Status').oneOf(['', ...getObjectKeys(militaryOptions)]).optional()
        } else {
          return yup.string().notRequired()
        }
      }),
      residence_province: yup.string().label('Residence Province').oneOf(['', ...provincesValues]).optional(),
      residence_city: yup.string().when('residence_province', (val: any) => {
        if (val?.length) {
          return yup.string().label('Residence City').oneOf(['', ...residenceCitiesValues]).required()
        } else {
          return yup.string().label('Residence City').oneOf(['', ...residenceCitiesValues]).optional()
        }
      }),
      birth_year: yup.string().label('Birth Year').oneOf(['', ...years]).optional(),
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
      email: yup.string().label('Email').email('Email Is Not Valid!').optional()
    },
    [
      ['military_status', 'military_status'],
      ['phone', 'phone']
    ]
  )

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
      if (positionId) dispatch(getPositionResumes(positionId))
      else dispatch(getResumes())
      dispatch(getResume(resume?.id))
      if (closeAfterSave) {
        closeToggle()
        setCloseAfterSave(false)
      }
    }
  }, [statusResumeEdit])

  const renderFilePreview = (file: any) => {
    if (file?.type?.startsWith('image')) {
      return <ImgStyled alt={file.name} src={URL.createObjectURL(file as any)} />
    } else {
      return <Icon icon='mdi:file-document-outline' />
    }
  }

  const {
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

  useEffect(() => {
    if (resume?._id) {
      setInitialValues()
    }
  }, [resume])

  const setInitialValues = () => {
    const provinceId = resume?.residence_city?.province_id?._id

    setValue('firstname', resume?.firstname)
    setValue('lastname', resume?.lastname)
    setValue('gender', resume?.gender)
    setValue('mobile', resume?.mobile.substring(2))
    setValue('email', resume?.email ?? '')
    setValue('phone', resume?.phone ?? '')
    setValue('birth_year', resume?.birth_year ?? '')
    setValue('marital_status', resume?.marital_status ?? '')
    setValue('education', resume?.education ?? '')
    setValue('military_status', resume?.military_status ?? '')
    setValue('residence_province', provinceId)
    setSalaryRange([resume?.min_salary, resume?.max_salary])
    setGender(resume?.gender)
    setIsSalaryActive(resume?.min_salary ? true : false)
    setFillResidenceCity(true)
    handleCities(provinceId, 'residence')
  }

  const submitHandler = (data: any) => {
    data.mobile = '98' + data.mobile
    if (avatar[0]) {
      data = { ...data, avatar: avatar[0] }
    }
    popObjectItemByKey(data, 'work_province')
    popObjectItemByKey(data, 'residence_province')
    if (!data?.residence_city) {
      popObjectItemByKey(data, 'residence_city')
    }
    if (gender == 'woman') data.military_status = null
    if (!isSalaryActive) {
      data.min_salary = null
      data.max_salary = null
    } else {
      ;[data.min_salary, data.max_salary] = salaryRange
    }
    dispatch(editResume({ ...data, resumeId: resume?._id }))
  }

  const handleCities = (provinceId: string, field: string) => {
    setFillCities(field)
    setValue('residence_city', '')
    if (provinceId) {
      dispatch(getCitiesByProvince(provinceId))
    } else {
      setResidenceCities([])
      setError('residence_city', { message: '' })
    }
  }

  const salaryRangeComponent = (
    <Grid item xs={12} px={7}>
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
      <Typography>{`${salaryRange[0]?.format() ?? 0} - ${salaryRange[1]?.format() ?? 0} Toman`}</Typography>
    </Grid>
  )

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
                            {constantReader(genderOptions)?.map(([key, value]: [string, string], index: number) => (
                              <MenuItem key={`gender-${index}`} value={key}>
                                {uppercaseFirstLetters(value)}
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
                            <MenuItem value=''>---</MenuItem>
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
                <Grid item xs={12} mt={5} md={gender == 'men' ? 4 : 6}>
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
                            <MenuItem value=''>---</MenuItem>
                            {constantReader(educationOptions)?.map(([key, value]: [string, string], index: number) => (
                              <MenuItem key={`education-${index}`} value={key}>
                                {uppercaseFirstLetters(value)}
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
                <Grid item xs={12} mt={5} md={gender == 'men' ? 4 : 6}>
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
                            <MenuItem value=''>---</MenuItem>
                            {constantReader(maritalOptions)?.map(([key, value]: [string, string], index: number) => (
                              <MenuItem key={`marital-${index}`} value={key}>
                                {uppercaseFirstLetters(value)}
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
                <Grid item xs={12} mt={5} md={6}>
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
                            disabled={gender == 'woman'}
                          >
                            <MenuItem value=''>---</MenuItem>
                            {constantReader(militaryOptions)?.map(([key, value]: [string, string], index: number) => (
                              <MenuItem key={`military-${index}`} value={key}>
                                {uppercaseFirstLetters(value)}
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
                              handleCities(e.target.value, 'residence')
                            }}
                            onBlur={onBlur}
                            error={Boolean(errors.residence_province)}
                          >
                            <MenuItem value=''>---</MenuItem>
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
                      <FormHelperText sx={{ color: 'error.main' }}>
                        {errors.residence_province.message}
                      </FormHelperText>
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
                          <InputLabel sx={{ color: !residenceCities?.length ? 'rgba(197, 197, 197, 0.87)' : undefined }}>Residence City</InputLabel>
                          <Select
                            label='Residence City'
                            value={value}
                            onChange={onChange}
                            onBlur={onBlur}
                            error={Boolean(errors.residence_city)}
                            disabled={!residenceCities?.length}
                          >
                            {residenceCities?.map((item: any, index: number) => (
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
                </Grid>
                <Grid item xs={12} mt={2} px={7}>
                  <FormControlLabel
                    label='Declare Requested Salary Range'
                    control={<Switch checked={isSalaryActive} onChange={handleChangeisSalaryActive} />}
                  />
                </Grid>
                {isSalaryActive && <Grow in={isSalaryActive}>{salaryRangeComponent}</Grow>}
                <Grid item xs={12} mt={3}>
                  <Button type='submit' variant='contained' sx={{ mr: 3, mt: 2 }} disabled={loadingResumeEdit}>
                    Save Changes
                  </Button>
                  <Button
                    variant='outlined'
                    color='secondary'
                    sx={{ mt: 2 }}
                    disabled={loadingResumeEdit}
                    type='submit'
                    onClick={() => setCloseAfterSave(true)}
                  >
                    Save And Close
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
