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
  useMediaQuery
} from '@mui/material'
import { getFullName, getImagePath, uppercaseFirstLetters } from 'src/helpers/functions'
import Language from 'src/helpers/Language'

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
  const [ratingValue, setRatingValue] = useState<any>(2)
  const [hoverRatingValue, setHoverRatingValue] = useState<any>(1)
  const [eventType, setEventType] = useState<string>('')
  const [eventTime, setEventTime] = useState<any>('')
  const [interviewType, setInterviewType] = useState<any>('')
  const [result, setResult] = useState<any>('')
  const [status, setStatus] = useState<any>('')

  const language = Language.builder().getLanguage()

  const persianDate = language == 'fa' ? persian : undefined
  const persianDateFa = language == 'fa' ? persian_fa : undefined

  return (
    <>
      <Dialog open={open} onClose={handleClose} aria-labelledby='form-dialog-title'>
        <IconButton size='small' onClick={handleClose} sx={{ position: 'absolute', right: '1rem', top: '1rem' }}>
          <Icon icon='mdi:close' />
        </IconButton>
        <DialogTitle id='form-dialog-title'>Add Interview</DialogTitle>
        <DialogContent>
          <form onSubmit={e => e.preventDefault()} style={{ marginTop: '15px' }}>
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
              <Grid item xs={12}>
                <Grid item md={6} xs={12}>
                  <FormControl fullWidth>
                    <Typography fontSize={14} sx={{ fontWeight: 400, mb: 1, ml: 1, color: 'text.secondary' }}>
                      {`${uppercaseFirstLetters('Event Time')}`}
                    </Typography>
                    <DatePicker
                      value={eventTime}
                      onChange={setEventTime}
                      format='MM/DD/YYYY HH:mm:ss'
                      plugins={[<TimePicker position='bottom' />]}
                      inputClass='rmdp-input'
                      placeholder='Click To Select Time'
                      calendar={persianDate}
                      locale={persianDateFa}
                      required
                      containerStyle={{ marginRight: '8px' }}
                    />
                  </FormControl>
                </Grid>
              </Grid>
              <Grid item md={6} xs={12} mt={5}>
                <FormControl fullWidth>
                  <InputLabel>Interview Type</InputLabel>
                  <Select
                    label='Interview Type'
                    value={interviewType}
                    onChange={(e: any) => setInterviewType(e.target.value)}
                  >
                    {['Person', 'Personality'].map((item: string, index: number) => (
                      <MenuItem key={`${item}-${index}`} value={item}>
                        {uppercaseFirstLetters(item)}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item md={6} xs={12} mt={5}>
                <FormControl fullWidth>
                  <InputLabel>Event Type</InputLabel>
                  <Select label='Event Type' value={eventType} onChange={(e: any) => setEventType(e.target.value)}>
                    {['online', 'inperson', 'inphone'].map((item: string, index: number) => (
                      <MenuItem key={`${item}-${index}`} value={item}>
                        {uppercaseFirstLetters(item)}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item md={6} xs={12} mt={5}>
                <FormControl fullWidth>
                  <InputLabel>Result</InputLabel>
                  <Select label='Result' value={result} onChange={(e: any) => setResult(e.target.value)}>
                    {['accepted', 'rejected'].map((item: string, index: number) => (
                      <MenuItem key={`${item}-${index}`} value={item}>
                        {uppercaseFirstLetters(item)}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item md={6} xs={12} mt={5}>
                <FormControl fullWidth>
                  <InputLabel>Status</InputLabel>
                  <Select label='Status' value={status} onChange={(e: any) => setStatus(e.target.value)}>
                    {['pending', 'done', 'canceled'].map((item: string, index: number) => (
                      <MenuItem key={`${item}-${index}`} value={item}>
                        {uppercaseFirstLetters(item)}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} mt={5}>
                <Autocomplete
                  multiple
                  options={fakeUsers}
                  id='autocomplete-size-small-multi'
                  getOptionLabel={user => getFullName(user)}
                  renderInput={params => <TextField {...params} label='Contributers' placeholder='Search Users ...' />}
                  renderOption={(props, user) => (
                    <ListItem {...props}>
                      <ListItemAvatar>
                        <Avatar src={user?.avatar} alt={getFullName(user)} sx={{ height: 28, width: 28 }} />
                      </ListItemAvatar>
                      <ListItemText primary={getFullName(user)} />
                    </ListItem>
                  )}
                />
              </Grid>

              <Grid item xs={12} mt={5}>
                <TextField
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
