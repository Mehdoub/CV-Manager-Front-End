// ** React Imports
import { useEffect, useState } from 'react'

// ** MUI Imports
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import Grid from '@mui/material/Grid'

import DatePicker, { DateObject } from 'react-multi-date-picker'
import persian from 'react-date-object/calendars/persian'
import persian_fa from 'react-date-object/locales/persian_fa'

import Icon from 'src/@core/components/icon'
import {
  FormControl,
  FormHelperText,
  IconButton,
  InputLabel,
  Slider,
  Typography,
  useMediaQuery,
  useTheme
} from '@mui/material'
import { getIsoTime, uppercaseFirstLetters } from 'src/helpers/functions'
import Language from 'src/helpers/Language'
import { useSelector } from 'react-redux'
import { useDispatch } from 'react-redux'
import { clearResumeHire, getResume, hireResume } from 'src/store/resume'
import { getPositionResumes } from 'src/store/position'

let salaries: Array<number> = []
for (let salary = 10; salary <= 50; salary++) salaries.push(salary * 1000000)
interface ResumeHiringDialogProps {
  open: boolean
  handleClose: any
}
const ResumeHiringDialog = ({ open, handleClose }: ResumeHiringDialogProps) => {
  const [income, setIncome] = useState<any>(10000000)
  const [incomeErr, setIncomeErr] = useState<string>('')
  const [startDate, setStartDate] = useState<any>('')
  const [startDateErr, setStartDateErr] = useState<string>('')

  const { data: resume } = useSelector((state: any) => state.resume)
  const { status: resumeHireStatus, loading: resumeHireLoading } = useSelector((state: any) => state.resumeHire)

  const dispatch = useDispatch()

  useEffect(() => {
    if (resumeHireStatus) {
      dispatch(clearResumeHire())
      dispatch(getResume(resume?.id))
      dispatch(getPositionResumes(resume?.position_id?._id))
      resetFormErrors(true)
      handleClose()
    }
  }, [resumeHireStatus])

  const theme = useTheme()

  const language = Language.builder().getLanguage()

  const persianDate = language == 'fa' ? persian : undefined
  const persianDateFa = language == 'fa' ? persian_fa : undefined

  const isSmallScreen = useMediaQuery((theme: any) => theme.breakpoints.down('lg'))
  const overflowVisibility = isSmallScreen ? 'scroll' : 'visible'

  const resetFormErrors = (resetValues: boolean = false) => {
    setStartDateErr('')
    setIncomeErr('')
    if (resetValues) {
      setIncome(10000000)
      setStartDate('')
    }
  }

  const submitHandler = (e: any) => {
    e.preventDefault()
    resetFormErrors()
    if (!startDate) setStartDateErr('Work Start Date Cannot Be Empty')
    else if (!income) setIncomeErr('Income Cannot Be Empty')
    else {
      const data = {
        resumeId: resume?.id,
        hired_from_date: getIsoTime(startDate.unix),
        income
      }
      dispatch(hireResume(data))
    }
  }

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
          <form onSubmit={submitHandler} style={{ marginTop: '15px' }}>
            <Grid container spacing={3}>
              <Grid item md={6} xs={12}>
                <FormControl fullWidth>
                  <Typography fontSize={14} sx={{ fontWeight: 400, mb: 1, ml: 1, color: 'text.secondary' }}>
                    {`${uppercaseFirstLetters('Work Start Date')}`}
                  </Typography>
                  <DatePicker
                    value={startDate}
                    onChange={setStartDate}
                    format='MM/DD/YYYY'
                    inputClass='rmdp-input'
                    placeholder='Click To Select Time'
                    calendar={persianDate}
                    locale={persianDateFa}
                    minDate={new DateObject()}
                    required
                    style={{
                      backgroundColor: theme.palette.mode == 'dark' ? '#30334E' : undefined,
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
                  {startDateErr && <FormHelperText sx={{ color: 'error.main' }}>{startDateErr}</FormHelperText>}
                </FormControl>
              </Grid>
              <Grid item md={12} xs={12} mt={5}>
                <InputLabel sx={{ pl: '4px' }}>Income (Toman)</InputLabel>
                <Slider
                  sx={{ mt: 4 }}
                  defaultValue={10000000}
                  value={income}
                  onChange={(e, value) => setIncome(value as number)}
                  valueLabelDisplay='auto'
                  aria-labelledby='range-slider'
                  min={8000000}
                  max={80000000}
                  step={1000000}
                  valueLabelFormat={(value: any) => value.format()}
                />
                <Typography>{`${income.format()} Toman`}</Typography>
                {incomeErr && <FormHelperText sx={{ color: 'error.main' }}>{incomeErr}</FormHelperText>}
              </Grid>
              <Grid item xs={12} sx={{ textAlign: 'right', mt: 8 }}>
                <Button
                  disabled={resumeHireLoading}
                  onClick={handleClose}
                  sx={{ mt: 2 }}
                  variant='outlined'
                  size='large'
                  color='secondary'
                >
                  Cancel
                </Button>
                <Button
                  disabled={resumeHireLoading}
                  type='submit'
                  variant='contained'
                  size='large'
                  sx={{ ml: 2, mt: 2 }}
                >
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
