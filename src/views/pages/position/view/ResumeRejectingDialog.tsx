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
import { uppercaseFirstLetters } from 'src/helpers/functions'
import Language from 'src/helpers/Language'
import { useSelector } from 'react-redux'
import * as yup from 'yup'
import { Controller, useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { useDispatch } from 'react-redux'
import { clearResumeReject, getResume, rejectResume } from 'src/store/resume'
import { getPositionResumes } from 'src/store/position'

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
  const { data: constants } = useSelector((state: any) => state.constants)
  const { data: resume } = useSelector((state: any) => state.resume)
  const { status: resumeRejectStatus, loading: resumeRejectLoading } = useSelector((state: any) => state.resumeReject)

  const dispatch = useDispatch()

  const schema = yup.object().shape({
    reject_reason: yup.string().label('Reject Reason').oneOf(constants?.resume?.reject_reason).required(),
    reject_description: yup.string().label('Reject Description').max(1000).optional()
  })

  const {
    control,
    formState: { errors },
    handleSubmit,
    reset
  } = useForm({ mode: 'onBlur', resolver: yupResolver(schema) })

  useEffect(() => {
    if (resumeRejectStatus) {
      dispatch(getResume(resume?._id))
      dispatch(getPositionResumes(resume?.position_id?._id))
      dispatch(clearResumeReject())
      reset()
      handleClose()
    }
  }, [resumeRejectStatus])

  const isSmallScreen = useMediaQuery((theme: any) => theme.breakpoints.down('lg'))
  const overflowVisibility = isSmallScreen ? 'scroll' : 'visible'

  const submitHandler = (data: any) => {
    dispatch(rejectResume({ ...data, resumeId: resume?._id }))
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
          <Icon icon='mdi:close' />
        </IconButton>
        <DialogTitle id='form-dialog-title'>Rejecting Resume Form</DialogTitle>
        <DialogContent sx={{ overflowY: overflowVisibility }}>
          <form onSubmit={handleSubmit(submitHandler)} style={{ marginTop: '15px' }}>
            <Grid container spacing={3}>
              <Grid item xs={12} mt={5}>
                <FormControl fullWidth>
                  <Controller
                    name='reject_reason'
                    control={control}
                    render={({ field: { value, onChange, onBlur } }) => (
                      <>
                        <InputLabel>Rejection Reason</InputLabel>
                        <Select
                          label='Rejection Reason'
                          value={value}
                          onChange={onChange}
                          onBlur={onBlur}
                          error={Boolean(errors?.reject_reason)}
                        >
                          {constants?.resume?.reject_reason.map((item: string, index: number) => (
                            <MenuItem key={`${item}-${index}`} value={item}>
                              {uppercaseFirstLetters(item, true)}
                            </MenuItem>
                          ))}
                        </Select>
                      </>
                    )}
                  />
                  {errors?.reject_reason && (
                    <FormHelperText sx={{ color: 'error.main' }}>{errors?.reject_reason?.message}</FormHelperText>
                  )}
                </FormControl>
              </Grid>

              <Grid item xs={12} mt={5}>
                <FormControl fullWidth>
                  <Controller
                    name='reject_description'
                    control={control}
                    render={({ field: { value, onChange, onBlur } }) => (
                      <TextField
                        value={value}
                        onChange={onChange}
                        onBlur={onBlur}
                        error={Boolean(errors?.reject_description)}
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
                    )}
                  />
                  {errors?.reject_description && (
                    <FormHelperText sx={{ color: 'error.main' }}>{errors?.reject_description?.message}</FormHelperText>
                  )}
                </FormControl>
              </Grid>
              <Grid item xs={12} sx={{ textAlign: 'right', mt: 10 }}>
                <Button
                  disabled={resumeRejectLoading}
                  onClick={handleClose}
                  variant='outlined'
                  size='large'
                  color='secondary'
                >
                  Cancel
                </Button>
                <Button disabled={resumeRejectLoading} type='submit' variant='contained' size='large' sx={{ ml: 2 }}>
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