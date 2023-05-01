// ** React Imports
import { useEffect, useState } from 'react'

// ** MUI Imports
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import TextField from '@mui/material/TextField'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import Grid from '@mui/material/Grid'
import InputAdornment from '@mui/material/InputAdornment'

import DatePicker, { DateObject } from 'react-multi-date-picker'
import TimePicker from 'react-multi-date-picker/plugins/time_picker'
import persian from 'react-date-object/calendars/persian'
import persian_fa from 'react-date-object/locales/persian_fa'

import Icon from 'src/@core/components/icon'
import {
  Autocomplete,
  Avatar,
  Box,
  FormControl,
  FormHelperText,
  IconButton,
  InputLabel,
  ListItem,
  ListItemAvatar,
  ListItemText,
  MenuItem,
  Rating,
  Select,
  Typography,
  useTheme
} from '@mui/material'
import { getFullName, getImagePath, getIsoTime, uppercaseFirstLetters } from 'src/helpers/functions'
import Language from 'src/helpers/Language'
import { useSelector } from 'react-redux'
import * as yup from 'yup'
import { Controller, useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { useDispatch } from 'react-redux'
import { getUsers } from 'src/store/user'
import { addInterviewToResume, clearResumeAddInterview, getResume } from 'src/store/resume'
import { getPositionResumes } from 'src/store/position'

const fakeUsers = [
  {
    id: 1,
    firstname: 'Aliakbar',
    lastname: 'Rezaei',
    avatar: '/images/avatars/7.png'
  },
  {
    id: 2,
    firstname: 'Mahdi',
    lastname: 'Amereh',
    avatar: '/images/avatars/3.png'
  },
  {
    id: 3,
    firstname: 'Ali',
    lastname: 'Hamzehei',
    avatar: '/images/avatars/5.png'
  },
  {
    id: 4,
    firstname: 'Saeed',
    lastname: 'Esfehani',
    avatar: '/images/avatars/2.png'
  }
]

const ratingLabels: { [index: string]: string } = {
  1: 'Useless',
  2: 'Poor',
  3: 'Ok',
  4: 'Good',
  5: 'Excellent!'
}

interface AddInterviewDialogProps {
  open: boolean
  handleClose: any
}
const AddInterviewDialog = ({ open, handleClose }: AddInterviewDialogProps) => {
  const [ratingValue, setRatingValue] = useState<any>(0)
  const [hoverRatingValue, setHoverRatingValue] = useState<any>(0)
  const [eventStartTime, setEventStartTime] = useState<any>('')
  const [eventStartTimeErr, setEventStartTimeErr] = useState<any>('')
  const [eventEndTime, setEventEndTime] = useState<any>('')
  const [eventEndTimeErr, setEventEndTimeErr] = useState<any>('')
  const [contributors, setContributors] = useState<any>([])

  const { data: constants } = useSelector((state: any) => state.constants)
  const { data: users } = useSelector((state: any) => state.usersList)
  const { data: resume } = useSelector((state: any) => state.resume)
  const { status: resumeAddInterviewStatus, loading: resumeAddInterviewLoading } = useSelector(
    (state: any) => state.resumeAddInterview
  )

  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(getUsers())
  }, [])

  useEffect(() => {
    if (resumeAddInterviewStatus) {
      dispatch(getResume(resume?.id))
      dispatch(getPositionResumes(resume?.position_id))
      dispatch(clearResumeAddInterview())
      resetForm()
      handleClose()
    }
  }, [resumeAddInterviewStatus])

  const schema = yup.object().shape({
    event_type: yup.string().label('Event Type').oneOf(constants?.interview?.event_type).required(),
    status: yup.string().label('Status').oneOf(constants?.interview?.status).required(),
    type: yup.string().label('Interview Type').oneOf(constants?.interview?.type).required(),
    result: yup.string().label('Result').oneOf(constants?.interview?.result).optional(),
    description: yup.string().label('Description').optional()
  })

  const {
    control,
    formState: { errors },
    handleSubmit,
    setValue
  } = useForm({
    mode: 'onBlur',
    resolver: yupResolver(schema)
  })

  const resetForm = () => {
    setValue('event_type', '')
    setValue('status', '')
    setValue('type', '')
    setValue('result', '')
    setValue('description', '')
    setEventStartTimeErr('')
    setContributors([])
  }

  const theme = useTheme()

  const language = Language.builder().getLanguage()

  const persianDate = language == 'fa' ? persian : undefined
  const persianDateFa = language == 'fa' ? persian_fa : undefined

  const submitHandler = (data: any) => {
    setEventStartTimeErr('')
    if (!eventStartTime) setEventStartTimeErr('Event Start Time Cannot Be Empty')
    else {
      data.contribution = contributors.map((contributor: any) => contributor?._id)
      data.event_time = getIsoTime(eventStartTime?.unix)
      data.rating = ratingValue
      dispatch(addInterviewToResume({ ...data, resumeId: resume?.id }))
    }
  }

  return (
    <>
      <Dialog open={open} onClose={handleClose} aria-labelledby='form-dialog-title'>
        <IconButton size='small' onClick={handleClose} sx={{ position: 'absolute', right: '1rem', top: '1rem' }}>
          <Icon icon='mdi:close' />
        </IconButton>
        <DialogTitle id='form-dialog-title'>Add Interview</DialogTitle>
        <DialogContent>
          <form onSubmit={handleSubmit(submitHandler)} style={{ marginTop: '15px' }}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Box sx={{ display: 'flex', alignItems: 'left', flexDirection: 'column' }}>
                  <Typography sx={{ fontWeight: 500, ml: 1 }}>How Was The Interview?</Typography>
                  <Box sx={{ display: 'flex', alignItems: 'left', flexDirection: 'row', mt: 3 }}>
                    <Rating
                      value={ratingValue}
                      name='simple-controlled'
                      onChange={(event, newValue) => setRatingValue(newValue)}
                      onChangeActive={(e, newHover) => setHoverRatingValue(newHover)}
                    />
                    {ratingValue !== null && (
                      <Typography sx={{ ml: 3 }}>
                        {ratingLabels[hoverRatingValue !== -1 ? hoverRatingValue : ratingValue]}
                      </Typography>
                    )}
                  </Box>
                </Box>
              </Grid>
              <Grid item md={6} xs={12}>
                <FormControl fullWidth>
                  <Typography fontSize={14} sx={{ fontWeight: 400, mb: 1, ml: 1, color: 'text.secondary' }}>
                    {`${uppercaseFirstLetters('Event Start Time')}`}
                  </Typography>
                  <DatePicker
                    value={eventStartTime}
                    onChange={setEventStartTime}
                    format='MM/DD/YYYY HH:mm:ss'
                    plugins={[<TimePicker position='bottom' />]}
                    inputClass='rmdp-input'
                    placeholder='Click To Select Time'
                    calendar={persianDate}
                    locale={persianDateFa}
                    minDate={new DateObject()}
                    required
                    style={{
                      backgroundColor: theme.palette.mode == 'dark' ? '#30334E' : '',
                      color:
                        theme.palette.mode == 'light'
                          ? 'rgba(76, 78, 100, 0.87) !important'
                          : theme.palette.secondary.dark,
                      borderColor:
                        theme.palette.mode == 'light'
                          ? 'rgba(76, 78, 100, 0.22) !important'
                          : theme.palette.secondary.dark
                    }}
                  />
                  {eventStartTimeErr && (
                    <FormHelperText sx={{ color: 'error.main' }}>{eventStartTimeErr}</FormHelperText>
                  )}
                </FormControl>
              </Grid>
              <Grid item md={6} xs={12}>
                <FormControl fullWidth>
                  <Typography fontSize={14} sx={{ fontWeight: 400, mb: 1, ml: 1, color: 'text.secondary' }}>
                    {`${uppercaseFirstLetters('Event End Time')}`}
                  </Typography>
                  <DatePicker
                    value={eventEndTime}
                    onChange={setEventEndTime}
                    format='MM/DD/YYYY HH:mm:ss'
                    plugins={[<TimePicker position='bottom' />]}
                    inputClass='rmdp-input'
                    placeholder='Click To Select Time'
                    calendar={persianDate}
                    locale={persianDateFa}
                    minDate={new DateObject()}
                    required
                    style={{
                      backgroundColor: theme.palette.mode == 'dark' ? '#30334E' : '',
                      color:
                        theme.palette.mode == 'light'
                          ? 'rgba(76, 78, 100, 0.87) !important'
                          : theme.palette.secondary.dark,
                      borderColor:
                        theme.palette.mode == 'light'
                          ? 'rgba(76, 78, 100, 0.22) !important'
                          : theme.palette.secondary.dark
                    }}
                  />
                  {eventEndTimeErr && <FormHelperText sx={{ color: 'error.main' }}>{eventEndTimeErr}</FormHelperText>}
                </FormControl>
              </Grid>
              <Grid item xs={12} sx={{ mt: '26px' }}>
                <Autocomplete
                  multiple
                  options={users?.docs ?? []}
                  limitTags={2}
                  id='autocomplete-multi-contributors'
                  getOptionLabel={user => getFullName(user)}
                  onChange={(e: any, newValue: any) => setContributors(newValue)}
                  renderInput={params => <TextField {...params} label='Contributors' placeholder='Search Users ...' />}
                  renderOption={(props, user) => (
                    <ListItem {...props}>
                      <ListItemAvatar>
                        <Avatar
                          src={getImagePath(user?.avatar)}
                          alt={getFullName(user)}
                          sx={{ height: 28, width: 28 }}
                        />
                      </ListItemAvatar>
                      <ListItemText primary={getFullName(user)} />
                    </ListItem>
                  )}
                />
              </Grid>
              <Grid item md={6} xs={12} mt={5}>
                <FormControl fullWidth>
                  <Controller
                    name='type'
                    control={control}
                    render={({ field: { value, onChange, onBlur } }) => (
                      <>
                        <InputLabel>Interview Type</InputLabel>
                        <Select
                          label='Interview Type'
                          value={value}
                          onChange={onChange}
                          onBlur={onBlur}
                          error={Boolean(errors?.type)}
                        >
                          {constants?.interview?.type.map((item: string, index: number) => (
                            <MenuItem key={`${item}-${index}`} value={item}>
                              {uppercaseFirstLetters(item)}
                            </MenuItem>
                          ))}
                        </Select>
                      </>
                    )}
                  />
                  {errors?.type && (
                    <FormHelperText sx={{ color: 'error.main' }}>{errors?.type?.message}</FormHelperText>
                  )}
                </FormControl>
              </Grid>
              <Grid item md={6} xs={12} mt={5}>
                <FormControl fullWidth>
                  <Controller
                    name='event_type'
                    control={control}
                    render={({ field: { value, onChange, onBlur } }) => (
                      <>
                        <InputLabel>Event Type</InputLabel>
                        <Select
                          label='Event Type'
                          value={value}
                          onChange={onChange}
                          onBlur={onBlur}
                          error={Boolean(errors?.event_type)}
                        >
                          {constants?.interview?.event_type.map((item: string, index: number) => (
                            <MenuItem key={`${item}-${index}`} value={item}>
                              {uppercaseFirstLetters(item)}
                            </MenuItem>
                          ))}
                        </Select>
                      </>
                    )}
                  />
                  {errors?.event_type && (
                    <FormHelperText sx={{ color: 'error.main' }}>{errors?.event_type?.message}</FormHelperText>
                  )}
                </FormControl>
              </Grid>
              <Grid item md={6} xs={12} mt={5}>
                <FormControl fullWidth>
                  <Controller
                    name='result'
                    control={control}
                    render={({ field: { value, onChange, onBlur } }) => (
                      <>
                        <InputLabel>Result</InputLabel>
                        <Select
                          label='Result'
                          value={value}
                          onChange={onChange}
                          onBlur={onBlur}
                          error={Boolean(errors?.result)}
                        >
                          {constants?.interview?.result.map((item: string, index: number) => (
                            <MenuItem key={`${item}-${index}`} value={item}>
                              {uppercaseFirstLetters(item)}
                            </MenuItem>
                          ))}
                        </Select>
                      </>
                    )}
                  />
                  {errors?.result && (
                    <FormHelperText sx={{ color: 'error.main' }}>{errors?.result?.message}</FormHelperText>
                  )}
                </FormControl>
              </Grid>
              <Grid item md={6} xs={12} mt={5}>
                <FormControl fullWidth>
                  <Controller
                    name='status'
                    control={control}
                    render={({ field: { value, onChange, onBlur } }) => (
                      <>
                        <InputLabel>Status</InputLabel>
                        <Select
                          label='Status'
                          value={value}
                          onChange={onChange}
                          onBlur={onBlur}
                          error={Boolean(errors?.status)}
                        >
                          {constants?.interview?.status.map((item: string, index: number) => (
                            <MenuItem key={`${item}-${index}`} value={item}>
                              {uppercaseFirstLetters(item)}
                            </MenuItem>
                          ))}
                        </Select>
                      </>
                    )}
                  />
                  {errors?.status && (
                    <FormHelperText sx={{ color: 'error.main' }}>{errors?.status?.message}</FormHelperText>
                  )}
                </FormControl>
              </Grid>
              <Grid item xs={12} mt={5}>
                <FormControl fullWidth>
                  <Controller
                    name='description'
                    control={control}
                    render={({ field: { value, onChange, onBlur } }) => (
                      <TextField
                        value={value}
                        onChange={onChange}
                        onBlur={onBlur}
                        error={Boolean(errors?.description)}
                        fullWidth
                        multiline
                        minRows={3}
                        label='Description'
                        placeholder='Call Is Described Here...'
                        sx={{ '& .MuiOutlinedInput-root': { alignItems: 'baseline' } }}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position='start'>
                              <Icon icon='fluent:text-description-24-filled' />
                            </InputAdornment>
                          )
                        }}
                      />
                    )}
                  />
                  {errors?.description && (
                    <FormHelperText sx={{ color: 'error.main' }}>{errors?.description?.message}</FormHelperText>
                  )}
                </FormControl>
              </Grid>
              <Grid item xs={12} sx={{ textAlign: 'right', mt: 8 }}>
                <Button onClick={handleClose} sx={{ mt: 2 }} variant='outlined' size='large' color='secondary'>
                  Cancel
                </Button>
                <Button type='submit' variant='contained' size='large' sx={{ ml: 2, mt: 2 }}>
                  Submit
                </Button>
              </Grid>
            </Grid>
          </form>
        </DialogContent>
      </Dialog>
    </>
  )
}

export default AddInterviewDialog
