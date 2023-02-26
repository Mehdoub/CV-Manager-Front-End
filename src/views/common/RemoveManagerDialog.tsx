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
  manager: any
  entity: any
  getEntityManagersAction: any
  entityManagerRemoveStore: any
  removeEntityManagerAction: any
  clearEntityManagerRemoveAction: any
}

const RemoveManagerDialog = (props: Props) => {
  // ** Props
  const {
    open,
    setOpen,
    manager,
    entity,
    getEntityManagersAction,
    entityManagerRemoveStore,
    removeEntityManagerAction,
    clearEntityManagerRemoveAction
  } = props

  // ** States
  const [userInput, setUserInput] = useState<string>('yes')
  const [secondDialogOpen, setSecondDialogOpen] = useState<boolean>(false)

  const dispatch = useDispatch()

  const { status: managerRemoveStatus } = entityManagerRemoveStore

  const entityId = entity?.id

  useEffect(() => {
    if (managerRemoveStatus) {
      handleClose()
      setSecondDialogOpen(true)
      dispatch(clearEntityManagerRemoveAction())
      dispatch(getEntityManagersAction(entityId))
    }
  }, [managerRemoveStatus])

  const handleClose = () => setOpen(false)

  const handleSecondDialogClose = () => setSecondDialogOpen(false)

  const handleConfirmation = (value: string) => {
    if (value == 'yes') {
      dispatch(removeEntityManagerAction(manager?.id))
    } else {
      handleClose()
      setSecondDialogOpen(true)
    }
    setUserInput(value)
  }

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
            <Typography align='center'>
              Do You Want To Remove{' '}
              <Typography variant={'caption'} fontSize={16} color='error'>
                {manager?.firstname} {manager?.lastname}
              </Typography>{' '}
              From{' '}
              <Typography variant={'caption'} fontSize={16} color='error'>
                {entity?.name}
              </Typography>{' '}
              Managers?
            </Typography>
          </Box>
        </DialogContent>
        <DialogActions sx={{ justifyContent: 'center' }}>
          <Button variant='contained' onClick={() => handleConfirmation('yes')}>
            Yes, Delete Manager!
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
              {userInput === 'yes' ? 'Removed!' : 'Cancelled'}
            </Typography>
            <Typography>
              {userInput === 'yes' ? 'Manager has been successfully removed.' : 'Remove Manager Cancelled :)'}
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

export default RemoveManagerDialog