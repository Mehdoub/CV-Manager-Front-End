// ** React Imports
import { useEffect, useState } from 'react'

// ** MUI Imports
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import Typography from '@mui/material/Typography'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'

// ** Icon Imports
import Icon from 'src/@core/components/icon'
import { useDispatch } from 'react-redux'

type Props = {
  open: boolean
  setOpen: (val: boolean) => void
  type: 'company' | 'project' | 'position' | 'user'
  entity: any
  activeStore: any
  deactiveStore: any
  getEntityAction: any
  activeAction: any
  deactiveAction: any
  clearActiveAction: any
  clearDeactiveAction: any
  activeField?: string
}

const SuspendDialog = (props: Props) => {
  // ** Props
  const {
    open,
    setOpen,
    type,
    entity,
    activeStore,
    deactiveStore,
    getEntityAction,
    activeAction,
    deactiveAction,
    clearActiveAction,
    clearDeactiveAction
  } = props

  const activeField = props?.activeField
    ? ['is_banned'].includes(props.activeField)
      ? !entity[props.activeField]
      : entity[props.activeField]
    : entity?.is_active

  // ** States
  const [userInput, setUserInput] = useState<string>('yes')
  const [secondDialogOpen, setSecondDialogOpen] = useState<boolean>(false)

  const dispatch = useDispatch()

  const { status: activeStatus, errors: activeErrors } = activeStore

  const { status: deactiveStatus, errors: deactiveErrors } = deactiveStore

  const entityId = entity?.id

  useEffect(() => {
    if (deactiveStatus) {
      setSecondDialogOpen(true)
      dispatch(clearDeactiveAction())
      dispatch(getEntityAction(entityId))
    }
    handleClose()
  }, [deactiveStatus, deactiveErrors])

  useEffect(() => {
    if (activeStatus) {
      setSecondDialogOpen(true)
      dispatch(clearActiveAction())
      dispatch(getEntityAction(entityId))
    }
    handleClose()
  }, [activeStatus, activeErrors])

  const handleClose = () => setOpen(false)

  const handleSecondDialogClose = () => setSecondDialogOpen(false)

  const handleConfirmation = (value: string) => {
    if (value == 'yes') {
      if (activeField) dispatch(deactiveAction())
      else dispatch(activeAction())
    } else {
      handleClose()
      setSecondDialogOpen(true)
    }
    setUserInput(value)
  }

  const action = activeField ? 'Suspend' : 'Activate'
  const operation = !activeField ? 'Suspention' : 'Activation'
  const operationStatus = !activeField ? 'Suspended' : 'Activated'

  return (
    <>
      <Dialog fullWidth open={open} onClose={handleClose} sx={{ '& .MuiPaper-root': { width: '100%', maxWidth: 512 } }}>
        <DialogContent>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}>
            <Box sx={{ mb: 4, maxWidth: '85%', textAlign: 'center', '& svg': { mb: 12.25, color: 'warning.main' } }}>
              <Icon icon='mdi:alert-circle-outline' fontSize='5.5rem' />
              <Typography variant='h4' sx={{ color: 'text.secondary' }}>
                Are you sure?
              </Typography>
            </Box>
            <Typography>You won't be able to revert {type}!</Typography>
          </Box>
        </DialogContent>
        <DialogActions sx={{ justifyContent: 'center' }}>
          <Button variant='contained' onClick={() => handleConfirmation('yes')}>
            Yes, {action} {type}!
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
            <Icon
              fontSize='5.5rem'
              icon={userInput === 'yes' ? 'mdi:check-circle-outline' : 'mdi:close-circle-outline'}
            />
            <Typography variant='h4' sx={{ mb: 8 }}>
              {userInput === 'yes' ? operationStatus + '!' : 'Cancelled'}
            </Typography>
            <Typography>
              {userInput === 'yes' ? `${type} has been ${operationStatus}.` : `Cancelled ${operation} :)`}
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

export default SuspendDialog
