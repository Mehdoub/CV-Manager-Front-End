// ** React Imports
import { useEffect, useState } from 'react'

// ** MUI Imports
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import CustomTextField from 'src/@core/components/custom-textfield'
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
  FormHelperText,
  IconButton,
  InputLabel,
  MenuItem,
  Rating,
  Select,
  Typography,
  useMediaQuery,
  useTheme
} from '@mui/material'
import { constantReader, getIsoTime, ratingTextsObj, uppercaseFirstLetters } from 'src/helpers/functions'
import Language from 'src/helpers/Language'
import { useSelector } from 'react-redux'
import { useDispatch } from 'react-redux'
import { addCallHistoryToResume, clearResumeAddCallHistory, getResume } from 'src/store/resume'
import * as yup from 'yup'
import { Controller, useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { getPositionResumes } from 'src/store/position'
import CloseIcon from '@mui/icons-material/Close'

interface AddCallHistoryDialogProps {
  open: boolean
  handleClose: any
}
const AddCallHistoryDialog = ({ open, handleClose }: AddCallHistoryDialogProps) => {
  const [ratingValue, setRatingValue] = useState<number>(0)
  const [ratingErr, setRatingErr] = useState<string>('')
  const [hoverRatingValue, setHoverRatingValue] = useState<number>(0)
  const [callResult, setCallResult] = useState<string>('')
  const [callResultErr, setCallResultErr] = useState<string>('')
  const [description, setDescription] = useState<string>('')
  const [descriptionErr, setDescriptionErr] = useState<string>('')
  const [callingDate, setCallingDate] = useState<any>('')
  const [callingDateErr, setCallingDateErr] = useState<string>('')
  const [recallDate, setRecallDate] = useState<any>('')
  const [recallDateErr, setRecallDateErr] = useState<string>('')

  const dispatch = useDispatch()

  const {
    data: {
      resume: { call_history_status: callHistoryStatusOptions }
    }
  } = useSelector((state: any) => state.constants)

  const { data: resume } = useSelector((state: any) => state.resume)
  const { status: addCallHistoryStatus, loading: addCallHistoryLoading } = useSelector(
    (state: any) => state.resumeAddCallHistory
  )

  useEffect(() => {
    if (addCallHistoryStatus) {
      dispatch(getResume(resume.id))
      dispatch(getPositionResumes(resume?.position_id?._id))
      dispatch(clearResumeAddCallHistory())
      resetErrors(true)
      handleClose()
    }
  }, [addCallHistoryStatus])

  const theme = useTheme()

  const language = Language.builder().getLanguage()

  const persianDate = language == 'fa' ? persian : undefined
  const persianDateFa = language == 'fa' ? persian_fa : undefined

  const isSmallScreen = useMediaQuery((theme: any) => theme.breakpoints.down('lg'))
  const overflowVisibility = isSmallScreen ? 'scroll' : 'visible'

  const resetErrors = (resetValues: boolean = false) => {
    setRecallDateErr('')
    setCallingDateErr('')
    setRatingErr('')
    setCallResultErr('')
    setDescriptionErr('')
    if (resetValues) {
      setRatingValue(0)
      setHoverRatingValue(0)
      setCallResult('')
      setDescription('')
      setCallingDate('')
      setRecallDate('')
    }
  }

  const submitHandler = (e: any) => {
    resetErrors()
    e.preventDefault()
    let data: any = {}
    if (data.result == 'recall' && !recallDate) setRecallDateErr('Recall Date Cannot Be Empty!')
    else if (!callingDate) setCallingDateErr('Calling Date Cannot Be Empty!')
    else if (description.length > 1000) setDescriptionErr('Description Must Be Lower Than 1000 Characters')
    else if (!ratingValue) setRatingErr('Please Rate This Call!')
    else if (!callResult) setCallResultErr('Call Result Cannot Be Empty!')
    else {
      if (callResult == 'recall') data.recall_at = getIsoTime(recallDate?.unix)
      data.calling_date = getIsoTime(callingDate?.unix)
      dispatch(
        addCallHistoryToResume({ ...data, resumeId: resume?.id, rating: ratingValue, result: callResult, description })
      )
    }
  }

  return (
    <>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby='form-dialog-title'
        PaperProps={{ style: { overflowY: overflowVisibility, maxHeight: '100% !important' } }}
      >
        <IconButton size='small' onClick={handleClose} sx={{ position: 'absolute', right: '1rem', top: '1rem' }}>
          <CloseIcon />
        </IconButton>
        <DialogTitle id='form-dialog-title'>Add Call History</DialogTitle>
        <DialogContent sx={{ overflowY: overflowVisibility }}>
          <form onSubmit={submitHandler} style={{ marginTop: '15px' }}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Box sx={{ display: 'flex', alignItems: 'left', flexDirection: 'column' }}>
                  <Typography sx={{ fontWeight: 500, ml: 1 }}>How Was The Call?</Typography>
                  <Box sx={{ display: 'flex', alignItems: 'left', flexDirection: 'row', mt: 3 }}>
                    <Rating
                      value={ratingValue}
                      name='simple-controlled'
                      onChange={(event, newValue) => setRatingValue(newValue as number)}
                      onChangeActive={(e, newHover) => setHoverRatingValue(newHover)}
                    />
                    {ratingValue !== null && (
                      <Typography sx={{ ml: 3 }}>
                        {ratingTextsObj[hoverRatingValue !== -1 ? hoverRatingValue : ratingValue]}
                      </Typography>
                    )}
                  </Box>
                  {ratingErr && <FormHelperText sx={{ color: 'error.main' }}>{ratingErr}</FormHelperText>}
                </Box>
              </Grid>
              <Grid item xs={6}>
                <FormControl fullWidth>
                  <Typography fontSize={14} sx={{ fontWeight: 400, mb: 1, ml: 1, color: 'text.secondary' }}>
                    {`${uppercaseFirstLetters('Calling Date')}`}
                  </Typography>
                  <DatePicker
                    value={callingDate}
                    onChange={setCallingDate}
                    format='MM/DD/YYYY HH:mm:ss'
                    plugins={[<TimePicker position='bottom' />]}
                    inputClass='rmdp-input'
                    placeholder='Click To Select Time'
                    calendar={persianDate}
                    locale={persianDateFa}
                    maxDate={new DateObject()}
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
                  {callingDateErr && <FormHelperText sx={{ color: 'error.main' }}>{callingDateErr}</FormHelperText>}
                </FormControl>
              </Grid>
              <Grid item xs={6}>
                <FormControl fullWidth>
                  <Typography fontSize={14} sx={{ fontWeight: 400, mb: 1, ml: 1, color: 'text.secondary' }}>
                    {`${uppercaseFirstLetters('Recall Date')}`}
                  </Typography>
                  <DatePicker
                    disabled={callResult !== 'recall'}
                    value={recallDate}
                    onChange={setRecallDate}
                    format='MM/DD/YYYY HH:mm:ss'
                    plugins={[<TimePicker position='bottom' />]}
                    inputClass='rmdp-input'
                    placeholder='Click To Select Time'
                    minDate={new DateObject()}
                    calendar={persianDate}
                    locale={persianDateFa}
                    required
                    style={{
                      backgroundColor:
                        callResult !== 'recall' ? '#F7F7F9' : theme.palette.mode == 'dark' ? '#30334E' : '',
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
                  {recallDateErr && <FormHelperText sx={{ color: 'error.main' }}>{recallDateErr}</FormHelperText>}
                </FormControl>
              </Grid>
              <Grid item xs={12} mt={5}>
                <FormControl fullWidth>
                  <InputLabel>Result</InputLabel>
                  <Select
                    label='Result'
                    value={callResult}
                    onChange={(e: any) => setCallResult(e.target.value)}
                    error={Boolean(callResultErr)}
                  >
                    {constantReader(callHistoryStatusOptions)?.map(([key, value]: any, index: number) => (
                      <MenuItem key={`${key}-${index}`} value={key}>
                        {uppercaseFirstLetters(value)}
                      </MenuItem>
                    ))}
                  </Select>
                  {callResultErr && <FormHelperText sx={{ color: 'error.main' }}>{callResultErr}</FormHelperText>}
                </FormControl>
              </Grid>

              <Grid item xs={12} mt={5}>
                <FormControl fullWidth>
                  <CustomTextField
                    fullWidth
                    value={description}
                    onChange={(e: any) => setDescription(e.target.value)}
                    error={Boolean(descriptionErr)}
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
                  {descriptionErr && <FormHelperText sx={{ color: 'error.main' }}>{descriptionErr}</FormHelperText>}
                </FormControl>
              </Grid>
              <Grid item xs={12} sx={{ textAlign: 'right', mt: 10 }}>
                <Button
                  disabled={addCallHistoryLoading}
                  onClick={handleClose}
                  variant='outlined'
                  size='large'
                  color='secondary'
                >
                  Cancel
                </Button>
                <Button disabled={addCallHistoryLoading} type='submit' variant='contained' size='large' sx={{ ml: 2 }}>
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
