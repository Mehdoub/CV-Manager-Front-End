// ** React Imports
import { useEffect, useState } from 'react'

// ** MUI Imports
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import Typography from '@mui/material/Typography'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline'
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline'
import HighlightOffIcon from '@mui/icons-material/HighlightOff'
// ** Icon Imports
import Icon from 'src/@core/components/icon'
import { useDispatch } from 'react-redux'
import { activeCompany, clearActiveCompany, clearDeactiveCompany, deactiveCompany, getCompany } from 'src/store/company'
import { useSelector } from 'react-redux'

type Props = {
  open: boolean
  setOpen: (val: boolean) => void
  // companyId: string
}

const CompanySuspendDialog = (props: Props) => {
  // ** Props
  const { open, setOpen } = props

  // ** States
  const [userInput, setUserInput] = useState<string>('yes')
  const [secondDialogOpen, setSecondDialogOpen] = useState<boolean>(false)

  const dispatch = useDispatch()

  const companyDeactiveStore = useSelector((state: any) => state.companyDeactive)
  const { status: companyDeactiveStatus, errors: deactivaErrors } = companyDeactiveStore

  const companyActiveStore = useSelector((state: any) => state.companyActive)
  const { status: companyActiveStatus, errors: activaErrors } = companyActiveStore

  const store = useSelector((state: any) => state.company)
  const { data: company } = store

  const companyId = company?.id

  useEffect(() => {
    if (companyDeactiveStatus) {
      setSecondDialogOpen(true)
      dispatch(clearDeactiveCompany())
      dispatch(getCompany(companyId))
    }
    handleClose()
  }, [companyDeactiveStatus, deactivaErrors])

  useEffect(() => {
    if (companyActiveStatus) {
      setSecondDialogOpen(true)
      dispatch(clearActiveCompany())
      dispatch(getCompany(companyId))
    }
    handleClose()
  }, [companyActiveStatus, activaErrors])

  const handleClose = () => setOpen(false)

  const handleSecondDialogClose = () => setSecondDialogOpen(false)

  const handleConfirmation = (value: string) => {
    if (value == 'yes') {
      if (company?.is_active) dispatch(deactiveCompany(companyId))
      else dispatch(activeCompany(companyId))
    } else {
      handleClose()
      setSecondDialogOpen(true)
    }
    setUserInput(value)
  }

  const action = company?.is_active ? 'Suspend' : 'Activate'
  const operation = !company?.is_active ? 'Suspention' : 'Activation'
  const operationStatus = !company?.is_active ? 'Suspended' : 'Activated'

  return (
    <>
      <Dialog fullWidth open={open} onClose={handleClose} sx={{ '& .MuiPaper-root': { width: '100%', maxWidth: 512 } }}>
        <DialogContent>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}>
            <Box sx={{ mb: 4, maxWidth: '85%', textAlign: 'center', '& svg': { mb: 12.25, color: 'warning.main' } }}>
              <ErrorOutlineIcon sx={{ fontSize: '5.5rem' }} />
              <Typography variant='h4' sx={{ color: 'text.secondary' }}>
                Are you sure?
              </Typography>
            </Box>
            <Typography>You won't be able to revert company!</Typography>
          </Box>
        </DialogContent>
        <DialogActions sx={{ justifyContent: 'center' }}>
          <Button variant='contained' onClick={() => handleConfirmation('yes')}>
            Yes, {action} company!
          </Button>
          <Button variant='outlined' color='secondary' onClick={() => handleConfirmation('cancel')}>
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog
        fullWidth
        open={secondDialogOpen}
        onClose={handleSecondDialogClose}
        sx={{ '& .MuiPaper-root': { width: '100%', maxWidth: 512 } }}
      >
        <DialogContent>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              flexDirection: 'column',
              '& svg': {
                mb: 14,
                color: userInput === 'yes' ? 'success.main' : 'error.main'
              }
            }}
          >
            {userInput === 'yes' ? (
              <CheckCircleOutlineIcon sx={{ fontSize: '5.5rem' }} />
            ) : (
              <HighlightOffIcon sx={{ fontSize: '5.5rem' }} />
            )}
            <Typography variant='h4' sx={{ mb: 8 }}>
              {userInput === 'yes' ? operationStatus + '!' : 'Cancelled'}
            </Typography>
            <Typography>
              {userInput === 'yes' ? `Company has been ${operationStatus}.` : `Cancelled ${operation} :)`}
            </Typography>
          </Box>
        </DialogContent>
        <DialogActions sx={{ justifyContent: 'center' }}>
          <Button variant='contained' color='success' onClick={handleSecondDialogClose}>
            OK
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}

export default CompanySuspendDialog
