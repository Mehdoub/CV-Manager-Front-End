// ** React Imports
import { useState, ElementType, ChangeEvent } from 'react'

// ** MUI Imports
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import Select from '@mui/material/Select'
import Dialog from '@mui/material/Dialog'
import Divider from '@mui/material/Divider'
import { styled } from '@mui/material/styles'
import Checkbox from '@mui/material/Checkbox'
import MenuItem from '@mui/material/MenuItem'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import InputLabel from '@mui/material/InputLabel'
import CardHeader from '@mui/material/CardHeader'
import FormControl from '@mui/material/FormControl'
import CardContent from '@mui/material/CardContent'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import FormHelperText from '@mui/material/FormHelperText'
import InputAdornment from '@mui/material/InputAdornment'
import Button, { ButtonProps } from '@mui/material/Button'
import FormControlLabel from '@mui/material/FormControlLabel'

// ** Third Party Imports
import { useForm, Controller } from 'react-hook-form'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

interface Data {
  email: string
  state: string
  address: string
  country: string
  lastName: string
  currency: string
  language: string
  timezone: string
  firstName: string
  organization: string
  number: number | string
  zipCode: number | string
}

const initialData: Data = {
  state: '',
  number: '',
  address: '',
  zipCode: '',
  lastName: 'Doe',
  currency: 'usd',
  firstName: 'John',
  language: 'arabic',
  timezone: 'gmt-12',
  country: 'australia',
  email: 'john.doe@example.com',
  organization: 'ThemeSelection'
}

const ImgStyled = styled('img')(({ theme }) => ({
  width: 120,
  height: 120,
  marginRight: theme.spacing(5),
  borderRadius: theme.shape.borderRadius
}))

const ButtonStyled = styled(Button)<ButtonProps & { component?: ElementType; htmlFor?: string }>(({ theme }) => ({
  [theme.breakpoints.down('sm')]: {
    width: '100%',
    textAlign: 'center'
  }
}))

const ResetButtonStyled = styled(Button)<ButtonProps>(({ theme }) => ({
  marginLeft: theme.spacing(4),
  [theme.breakpoints.down('sm')]: {
    width: '100%',
    marginLeft: 0,
    textAlign: 'center',
    marginTop: theme.spacing(4)
  }
}))

const ResumeDetailsTab = () => {
  // ** State
  const [open, setOpen] = useState<boolean>(false)
  const [inputValue, setInputValue] = useState<string>('')
  const [userInput, setUserInput] = useState<string>('yes')
  const [formData, setFormData] = useState<any>(initialData)
  const [imgSrc, setImgSrc] = useState<string>('/images/avatars/1.png')
  const [secondDialogOpen, setSecondDialogOpen] = useState<boolean>(false)

  // ** Hooks
  const {
    control,
    handleSubmit,
    formState: { errors }
  } = useForm({ defaultValues: { checkbox: false } })

  const handleClose = () => setOpen(false)

  const handleSecondDialogClose = () => setSecondDialogOpen(false)

  const onSubmit = () => setOpen(true)

  const handleConfirmation = (value: string) => {
    handleClose()
    setUserInput(value)
    setSecondDialogOpen(true)
  }

  const handleInputImageChange = (file: ChangeEvent) => {
    const reader = new FileReader()
    const { files } = file.target as HTMLInputElement
    if (files && files.length !== 0) {
      reader.onload = () => setImgSrc(reader.result as string)
      reader.readAsDataURL(files[0])

      if (reader.result !== null) {
        setInputValue(reader.result as string)
      }
    }
  }
  const handleInputImageReset = () => {
    setInputValue('')
    setImgSrc('/images/avatars/1.png')
  }

  const handleFormChange = (field: any, value: any) => {
    setFormData({ ...formData, [field]: value })
  }

  let years = []
  for (let year = 1970; year <= new Date().getFullYear(); year++) years.push(year)

  let salaries = []
  for (let salary = 10; salary <= 50; salary++) salaries.push(salary * 1000000)

  return (
    <Grid container spacing={6} sx={{ maxHeight: '700px', overflowY: 'scroll' }}>
      {/* Account Details Card */}
      <Grid item xs={12}>
        <>
          <CardHeader title='Personal Information' />
          <form>
            <CardContent sx={{ pt: 0 }}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <ImgStyled src={imgSrc} alt='Profile Pic' />
                <div>
                  <ButtonStyled component='label' variant='contained' htmlFor='account-settings-upload-image'>
                    Upload New Photo
                    <input
                      hidden
                      type='file'
                      value={inputValue}
                      accept='image/png, image/jpeg'
                      onChange={handleInputImageChange}
                      id='account-settings-upload-image'
                    />
                  </ButtonStyled>
                  <ResetButtonStyled color='secondary' variant='outlined' onClick={handleInputImageReset}>
                    Reset
                  </ResetButtonStyled>
                  <Typography sx={{ mt: 5, color: 'text.disabled' }}>Allowed PNG or JPEG. Max size of 800K.</Typography>
                </div>
              </Box>
            </CardContent>
            {/* <Divider /> */}
            <CardContent>
              <Grid container spacing={6}>
                <Grid item xs={12} mt={5} sm={6}>
                  <TextField
                    fullWidth
                    label='First Name'
                    placeholder='John'
                    value={formData.firstName}
                    onChange={e => handleFormChange('firstname', e.target.value)}
                  />
                </Grid>
                <Grid item xs={12} mt={5} sm={6}>
                  <TextField
                    fullWidth
                    label='Last Name'
                    placeholder='Doe'
                    value={formData.lastName}
                    onChange={e => handleFormChange('lastname', e.target.value)}
                  />
                </Grid>
                <Grid item xs={12} mt={5} sm={6}>
                  <FormControl fullWidth>
                    <InputLabel>Gender</InputLabel>
                    <Select label='Gender' value='man' onChange={e => handleFormChange('gender', e.target.value)}>
                      <MenuItem value='man'>Man</MenuItem>
                      <MenuItem value='woman'>Woman</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} mt={5} sm={6}>
                  <TextField
                    fullWidth
                    type='number'
                    label='Mobile'
                    value={formData.number}
                    placeholder='919 123 4567'
                    onChange={e => handleFormChange('mobile', e.target.value)}
                    InputProps={{ startAdornment: <InputAdornment position='start'>IR (+98)</InputAdornment> }}
                  />
                </Grid>
                <Grid item xs={12} mt={5} sm={6}>
                  <TextField
                    fullWidth
                    type='email'
                    label='Email'
                    value={formData.email}
                    placeholder='john.doe@example.com'
                    onChange={e => handleFormChange('email', e.target.value)}
                  />
                </Grid>
                <Grid item xs={12} mt={5} sm={6}>
                  <TextField
                    fullWidth
                    type='number'
                    label='Phone Number'
                    value={formData.number}
                    placeholder='8846 7889'
                    onChange={e => handleFormChange('phone', e.target.value)}
                    InputProps={{ startAdornment: <InputAdornment position='start'>IR (+98)</InputAdornment> }}
                  />
                </Grid>
                <Grid item xs={12} mt={5} sm={4}>
                  <FormControl fullWidth>
                    <InputLabel>Birth Year</InputLabel>
                    <Select
                      label='Birth Year'
                      value={2000}
                      onChange={e => handleFormChange('birth_year', e.target.value)}
                    >
                      {years.map((item: number, index: number) => (
                        <MenuItem key={index} value={item}>
                          {item}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} mt={5} sm={4}>
                  <FormControl fullWidth>
                    <InputLabel>Work Started Year</InputLabel>
                    <Select
                      label='Work Started Year'
                      value={2018}
                      onChange={e => handleFormChange('work_experience', e.target.value)}
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
                  </FormControl>
                </Grid>
                <Grid item xs={12} mt={5} sm={4}>
                  <FormControl fullWidth>
                    <InputLabel>Education</InputLabel>
                    <Select
                      label='Education'
                      value={'masters'}
                      onChange={e => handleFormChange('education', e.target.value)}
                    >
                      {[
                        { value: 'diploma', label: 'Diploma' },
                        { value: 'bachelors_degree', label: 'Bachelors Degree' },
                        { value: 'associate_degree', label: 'Associate Degree' },
                        { value: 'masters', label: 'Masters' },
                        { value: 'phd', label: 'Phd' }
                      ].map(({ value, label }: any, index: number) => (
                        <MenuItem key={index} value={value}>
                          {label}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} mt={5} sm={6}>
                  <FormControl fullWidth>
                    <InputLabel>Marital Status</InputLabel>
                    <Select
                      label='Marital Status'
                      value={'married'}
                      onChange={e => handleFormChange('marital_status', e.target.value)}
                    >
                      {[
                        { value: 'single', label: 'Single' },
                        { value: 'married', label: 'Married' },
                        { value: 'isolated', label: 'Isolated' },
                        { value: 'unknow', label: 'Unknow' }
                      ].map(({ value, label }: any, index: number) => (
                        <MenuItem key={index} value={value}>
                          {label}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} mt={5} sm={6}>
                  <FormControl fullWidth>
                    <InputLabel>Military Status</InputLabel>
                    <Select
                      label='Military Status'
                      value={'exemption-edu'}
                      onChange={e => handleFormChange('military_status', e.target.value)}
                    >
                      {[
                        { value: 'included', label: 'Included' },
                        { value: 'end', label: 'End' },
                        { value: 'exemption-edu', label: 'Exemption-Edu' },
                        { value: 'exemption-spo', label: 'Exemption-Spo' }
                      ].map(({ value, label }: any, index: number) => (
                        <MenuItem key={index} value={value}>
                          {label}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} mt={5} sm={6}>
                  <FormControl fullWidth>
                    <InputLabel>Work City</InputLabel>
                    <Select
                      label='Work City'
                      value={'tehran'}
                      onChange={e => handleFormChange('Work_city', e.target.value)}
                    >
                      {[
                        { value: 'tehran', label: 'Tehran' },
                        { value: 'alborz', label: 'Alborz' },
                        { value: 'qazvin', label: 'Qazvin' },
                        { value: 'khorasaan_razavi', label: 'Khorasaan Razavi' }
                      ].map(({ value, label }: any, index: number) => (
                        <MenuItem key={index} value={value}>
                          {label}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} mt={5} sm={6}>
                  <FormControl fullWidth>
                    <InputLabel>Residence City</InputLabel>
                    <Select
                      label='Residence City'
                      value={'tehran'}
                      onChange={e => handleFormChange('residence_city', e.target.value)}
                    >
                      {[
                        { value: 'tehran', label: 'Tehran' },
                        { value: 'alborz', label: 'Alborz' },
                        { value: 'qazvin', label: 'Qazvin' },
                        { value: 'khorasaan_razavi', label: 'Khorasaan Razavi' }
                      ].map(({ value, label }: any, index: number) => (
                        <MenuItem key={index} value={value}>
                          {label}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} mt={5} sm={6}>
                  <FormControl fullWidth>
                    <InputLabel>Minimum Requested Salary (Toman)</InputLabel>
                    <Select
                      label='Minimum Requested Salary (Toman)'
                      value={30000000}
                      onChange={e => handleFormChange('min_salary', e.target.value)}
                    >
                      {salaries.map((item: any, index: number) => (
                        <MenuItem key={index} value={item}>
                          {item.format()}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} mt={5} sm={6}>
                  <FormControl fullWidth>
                    <InputLabel>Maximum Requested Salary (Toman)</InputLabel>
                    <Select
                      label='Maximum Requested Salary (Toman)'
                      value={35000000}
                      onChange={e => handleFormChange('max_salary', e.target.value)}
                    >
                      {salaries.map((item: any, index: number) => (
                        <MenuItem key={index} value={item}>
                          {item.format()}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>

                <Grid item xs={12} mt={5}>
                  <Button variant='contained' sx={{ mr: 3 }}>
                    Save Changes
                  </Button>
                  <Button type='reset' variant='outlined' color='secondary' onClick={() => setFormData(initialData)}>
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
