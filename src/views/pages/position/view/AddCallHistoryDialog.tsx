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

import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'

import Icon from 'src/@core/components/icon'
import { Box, FormControl, IconButton, InputLabel, MenuItem, Rating, Select, Typography } from '@mui/material'
import { uppercaseFirstLetters } from 'src/helpers/functions'
import { EventRepeat } from '@mui/icons-material'

const ratingLabels: { [index: string]: string } = {
  1: 'Useless',
  2: 'Poor',
  3: 'Ok',
  4: 'Good',
  5: 'Excellent!'
}

interface AddCallHistoryDialogProps {
  open: boolean
  handleClose: any
}
const AddCallHistoryDialog = ({ open, handleClose }: AddCallHistoryDialogProps) => {
  const [ratingValue, setRatingValue] = useState<any>(2)
  const [hoverRatingValue, setHoverRatingValue] = useState<any>(1)
  return (
    <>
      <Dialog open={open} onClose={handleClose} aria-labelledby='form-dialog-title'>
        <IconButton size='small' onClick={handleClose} sx={{ position: 'absolute', right: '1rem', top: '1rem' }}>
          <Icon icon='mdi:close' />
        </IconButton>
        <DialogTitle id='form-dialog-title'>Add Call History</DialogTitle>
        <DialogContent>
          <form onSubmit={e => e.preventDefault()} style={{ marginTop: '15px' }}>
            <Grid container spacing={5}>
              <Grid item xs={12}>
                <Box sx={{ display: 'flex', alignItems: 'left', flexDirection: 'column' }}>
                  <Typography sx={{ fontWeight: 500, ml: 1 }}>How Was The Call?</Typography>
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
                <FormControl fullWidth>
                  <InputLabel>Result</InputLabel>
                  <Select label='Result'>
                    {['rejected', 'answered', 'busy', 'wrong-number', 'recall'].map((item: string, index: number) => (
                      <MenuItem key={`${item}-${index}`} value={item}>
                        {uppercaseFirstLetters(item)}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker label='Calling Date' />
                  </LocalizationProvider>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker slots={{ openPickerIcon: EventRepeat }} label='Recall Date' />
                  </LocalizationProvider>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
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
              <Grid item xs={12} sx={{ textAlign: 'right' }}>
                <Button onClick={handleClose} variant='outlined' size='large' color='secondary'>
                  Cancel
                </Button>
                <Button type='submit' variant='contained' size='large' sx={{ ml: 2 }}>
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

export default AddCallHistoryDialog
