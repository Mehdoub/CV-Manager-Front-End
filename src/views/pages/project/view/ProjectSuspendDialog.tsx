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
import { activeProject, clearActiveProject, clearDeactiveProject, deactiveProject, getProject } from 'src/store/project'
import { useSelector } from 'react-redux'

type Props = {
  open: boolean
  setOpen: (val: boolean) => void
}

const ProjectSuspendDialog = (props: Props) => {
  // ** Props
  const { open, setOpen } = props

  // ** States
  const [userInput, setUserInput] = useState<string>('yes')
  const [secondDialogOpen, setSecondDialogOpen] = useState<boolean>(false)

  const dispatch = useDispatch()

  const projectStore = useSelector((state: any) => state.projectFind)
  const { data: project } = projectStore

  const projectDeactiveStore = useSelector((state: any) => state.projectDeactive)
  const { status: projectDeactiveStatus, errors: deactiveErrors } = projectDeactiveStore

  const projectActiveStore = useSelector((state: any) => state.projectActive)
  const { status: projectActiveStatus, errors: activeErrors } = projectActiveStore

  const projectId = project?.id

  useEffect(() => {
    if (projectDeactiveStatus) {
      setSecondDialogOpen(true)
      dispatch(clearDeactiveProject())
      dispatch(getProject(projectId))
    }
    handleClose()
  }, [projectDeactiveStatus, deactiveErrors])

  useEffect(() => {
    if (projectActiveStatus) {
      setSecondDialogOpen(true)
      dispatch(clearActiveProject())
      dispatch(getProject(projectId))
    }
    handleClose()
  }, [projectActiveStatus, activeErrors])

  const handleClose = () => setOpen(false)

  const handleSecondDialogClose = () => setSecondDialogOpen(false)

  const handleConfirmation = (value: string) => {
    if (value == 'yes') {
      if (project?.is_active) dispatch(deactiveProject(projectId))
      else dispatch(activeProject(projectId))
    } else {
      handleClose()
      setSecondDialogOpen(true)
    }
    setUserInput(value)
  }

  const action = project?.is_active ? 'Suspend' : 'Activate'
  const operation = !project?.is_active ? 'Suspention' : 'Activation'
  const operationStatus = !project?.is_active ? 'Suspended' : 'Activated'

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
            Yes, {action} project!
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
            <Typography>{userInput === 'yes' ? `Project has been ${operationStatus}.` : `Cancelled ${operation} :)`}</Typography>
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
