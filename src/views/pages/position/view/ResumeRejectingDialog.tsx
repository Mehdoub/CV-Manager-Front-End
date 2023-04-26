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
  Box,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Rating,
  Select,
  Typography,
  useMediaQuery,
  useTheme
} from '@mui/material'
import { uppercaseFirstLetters } from 'src/helpers/functions'
import Language from 'src/helpers/Language'
import { useSelector } from 'react-redux'

const ratingLabels: { [index: string]: string } = {
  1: 'Useless',
  2: 'Poor',
  3: 'Ok',
  4: 'Good',
  5: 'Excellent!'
}

interface ResumeRejectingDialogProps {
  open: boolean
  handleClose: any
}
const ResumeRejectingDialog = ({ open, handleClose }: ResumeRejectingDialogProps) => {
  const [ratingValue, setRatingValue] = useState<any>(2)
  const [hoverRatingValue, setHoverRatingValue] = useState<any>(1)
  const [rejectionReason, setRejectionReason] = useState<string>('')
  const [callingDate, setCallingDate] = useState<any>('')
  const [recallDate, setRecallDate] = useState<any>('')

  // const {
  //   data: {
  //     resume: { call_history_status: rejectionReasonOptions }
  //   }
  // } = useSelector((state: any) => state.constants)

  const rejectionReasonOptions = ['lack of skills', 'improper personality', 'disagreement']

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
        PaperProps={{ style: { overflowY: overflowVisibility, maxHeight: '100% !important' } }}
      >
        <IconButton size='small' onClick={handleClose} sx={{ position: 'absolute', right: '1rem', top: '1rem' }}>
          <Icon icon='mdi:close' />
        </IconButton>
        <DialogTitle id='form-dialog-title'>Rejecting Resume Form</DialogTitle>
        <DialogContent sx={{ overflowY: overflowVisibility }}>
          <form onSubmit={e => e.preventDefault()} style={{ marginTop: '15px' }}>
            <Grid container spacing={3}>
              <Grid item xs={12} mt={5}>
                <FormControl fullWidth>
                  <InputLabel>Rejection Reason</InputLabel>
                  <Select
                    label='Rejection Reason'
                    value={rejectionReason}
                    onChange={(e: any) => setRejectionReason(e.target.value)}
                  >
                    {rejectionReasonOptions.map((item: string, index: number) => (
                      <MenuItem key={`${item}-${index}`} value={item}>
                        {uppercaseFirstLetters(item)}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} mt={5}>
                <TextField
                  fullWidth
                  multiline
                  minRows={3}
                  label='Description'
                  placeholder='Rejection Reason Is Described Here...'
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
              <Grid item xs={12} sx={{ textAlign: 'right', mt: 10 }}>
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

export default ResumeRejectingDialog
