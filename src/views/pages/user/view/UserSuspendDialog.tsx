// ** React Imports
import { useState } from 'react'

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

type Props = {
  open: boolean
  setOpen: (val: boolean) => void
}

const UserSuspendDialog = (props: Props) => {
  // ** Props
  const { open, setOpen } = props

  // ** States
  const [userInput, setUserInput] = useState<string>('yes')
  const [secondDialogOpen, setSecondDialogOpen] = useState<boolean>(false)

  const handleClose = () => setOpen(false)

  const handleSecondDialogClose = () => setSecondDialogOpen(false)

  const handleConfirmation = (value: string) => {
    handleClose()
    setUserInput(value)
    setSecondDialogOpen(true)
  }

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
            <Typography>You won't be able to revert user!</Typography>
          </Box>
        </DialogContent>
        <DialogActions sx={{ justifyContent: 'center' }}>
          <Button variant='contained' onClick={() => handleConfirmation('yes')}>
            Yes, Suspend user!
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
              {userInput === 'yes' ? 'Suspended!' : 'Cancelled'}
            </Typography>
            <Typography>{userInput === 'yes' ? 'User has been suspended.' : 'Cancelled Suspension :)'}</Typography>
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

export default UserSuspendDialog
