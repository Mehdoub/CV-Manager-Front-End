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
import { clearDeactiveProject, deactiveProject, getProject } from 'src/store/project'
import { useSelector } from 'react-redux'

type Props = {
  open: boolean
  setOpen: (val: boolean) => void
  projectId: string
}

const ProjectSuspendDialog = (props: Props) => {
  // ** Props
  const { open, setOpen, projectId } = props

  // ** States
  const [userInput, setUserInput] = useState<string>('yes')
  const [secondDialogOpen, setSecondDialogOpen] = useState<boolean>(false)

  const dispatch = useDispatch()

  const projectDeactiveStore = useSelector((state: any) => state.projectDeactive)
  const { status: projectDeactiveStatus, errors } = projectDeactiveStore

  useEffect(() => {
    if (projectDeactiveStatus) {
      setSecondDialogOpen(true)
      dispatch(clearDeactiveProject())
      dispatch(getProject(projectId))
    }
    handleClose()
  }, [projectDeactiveStatus, errors])

  const handleClose = () => setOpen(false)

  const handleSecondDialogClose = () => setSecondDialogOpen(false)

  const handleConfirmation = (value: string) => {
    if (value == 'yes') {
      dispatch(deactiveProject(projectId))
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
            <Typography>You won't be able to revert project!</Typography>
          </Box>
        </DialogContent>
        <DialogActions sx={{ justifyContent: 'center' }}>
          <Button variant='contained' onClick={() => handleConfirmation('yes')}>
            Yes, Suspend project!
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
              {userInput === 'yes' ? 'Suspended!' : 'Cancelled'}
            </Typography>
            <Typography>{userInput === 'yes' ? 'Project has been suspended.' : 'Cancelled Suspension :)'}</Typography>
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

export default ProjectSuspendDialog
