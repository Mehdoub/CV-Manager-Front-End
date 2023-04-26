// ** React Imports
import { useState } from 'react'

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
  IconButton,
  InputLabel,
  ListItem,
  ListItemAvatar,
  ListItemText,
  MenuItem,
  Rating,
  Select,
  Typography,
  useMediaQuery,
  useTheme
} from '@mui/material'
import { getFullName, uppercaseFirstLetters } from 'src/helpers/functions'
import Language from 'src/helpers/Language'

let salaries: Array<number> = []
for (let salary = 10; salary <= 50; salary++) salaries.push(salary * 1000000)

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

interface ResumeHiringDialogProps {
  open: boolean
  handleClose: any
}
const ResumeHiringDialog = ({ open, handleClose }: ResumeHiringDialogProps) => {
  const [ratingValue, setRatingValue] = useState<any>(2)
  const [hoverRatingValue, setHoverRatingValue] = useState<any>(1)
  const [eventType, setEventType] = useState<string>('')
  const [eventTime, setEventTime] = useState<any>('')
  const [cooperationType, setCooperationType] = useState<any>('')
  const [salary, setSalary] = useState<any>('')

  const theme = useTheme()

  const language = Language.builder().getLanguage()

  const persianDate = language == 'fa' ? persian : undefined
  const persianDateFa = language == 'fa' ? persian_fa : undefined

  const isSmallScreen = useMediaQuery((theme: any) => theme.breakpoints.down('lg'))
  const overflowVisibility = isSmallScreen ? 'scroll' : 'visible'

  return (
    <>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby='form-dialog-title'
        PaperProps={{ style: { overflowY: overflowVisibility } }}
      >
        <IconButton size='small' onClick={handleClose} sx={{ position: 'absolute', right: '1rem', top: '1rem' }}>
          <Icon icon='mdi:close' />
        </IconButton>
        <DialogTitle id='form-dialog-title'>Resume Hiring Form</DialogTitle>
        <DialogContent sx={{ overflowY: overflowVisibility }}>
          <form onSubmit={e => e.preventDefault()} style={{ marginTop: '15px' }}>
            <Grid container spacing={3}>
              <Grid item md={6} xs={12}>
                <FormControl fullWidth>
                  <Typography fontSize={14} sx={{ fontWeight: 400, mb: 1, ml: 1, color: 'text.secondary' }}>
                    {`${uppercaseFirstLetters('Work Start Date')}`}
                  </Typography>
                  <DatePicker
                    value={eventTime}
                    onChange={setEventTime}
                    format='MM/DD/YYYY HH:mm:ss'
                    // plugins={[<TimePicker position='bottom' />]}
                    inputClass='rmdp-input'
                    placeholder='Click To Select Time'
                    calendar={persianDate}
                    locale={persianDateFa}
                    minDate={new DateObject()}
                    required
                    style={{
                      backgroundColor: theme.palette.mode == 'dark' ? '#30334E' : '#F7F7F9',
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
                </FormControl>
              </Grid>
              <Grid item md={6} xs={12}>
                <FormControl fullWidth>
                  <Typography fontSize={14} sx={{ fontWeight: 400, mb: 1, ml: 1, color: 'text.secondary' }}>
                    {`${uppercaseFirstLetters('Work End Date')}`}
                  </Typography>
                  <DatePicker
                    value={eventTime}
                    onChange={setEventTime}
                    format='MM/DD/YYYY HH:mm:ss'
                    // plugins={[<TimePicker position='bottom' />]}
                    inputClass='rmdp-input'
                    placeholder='Click To Select Time'
                    calendar={persianDate}
                    locale={persianDateFa}
                    minDate={new DateObject()}
                    required
                    style={{
                      backgroundColor: theme.palette.mode == 'dark' ? '#30334E' : '#F7F7F9',
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
                </FormControl>
              </Grid>
              <Grid item md={6} xs={12} mt={5}>
                <FormControl fullWidth>
                  <InputLabel>Cooperation Type</InputLabel>
                  <Select
                    label='Cooperation Type'
                    value={cooperationType}
                    onChange={(e: any) => setCooperationType(e.target.value)}
                  >
                    {['Full-Time', 'Half-Time', 'Remoot'].map((item: string, index: number) => (
                      <MenuItem key={`${item}-${index}`} value={item}>
                        {uppercaseFirstLetters(item)}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item md={6} xs={12} mt={5}>
                <FormControl fullWidth>
                  <InputLabel>Salary (Toman)</InputLabel>
                  <Select label='Salary (Toman)' value={salary} onChange={(e: any) => setSalary(e.target.value)}>
                    {salaries.map((item: any, index: number) => (
                      <MenuItem key={`max-salary-${index}`} value={item}>
                        {item.format()}
                      </MenuItem>
                    ))}
                  </Select>
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

export default ResumeHiringDialog
