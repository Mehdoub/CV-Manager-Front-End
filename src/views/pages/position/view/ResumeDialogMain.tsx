import { Box, CircularProgress, Dialog, Grid, Skeleton, useMediaQuery } from '@mui/material'
import { useState } from 'react'
import AddCallHistoryDialog from './AddCallHistoryDialog'
import ResumeViewLeftDialog from './ResumeViewLeftDialog'
import ResumeViewRightDialog from './ResumeViewRightDialog'
import ResumeDialogHeader from './ResumeDialogHeader'
import AddInterviewDialog from './AddInterviewDialog'
import { useSelector } from 'react-redux'
import { getObjectKeys } from 'src/helpers/functions'

interface ResumeDialogMainProps {
  open: boolean
  handleClose: () => void
  handleExit: () => void
  allResumes: boolean
}

const tags = [
  {
    text: 'test',
    color: 'warning'
  },
  {
    text: 'hot',
    color: 'error'
  },
  {
    text: 'new',
    color: 'info'
  }
]

const ResumeDialogMain = ({ open, handleClose, allResumes, handleExit }: ResumeDialogMainProps) => {
  const [activeTab, setActiveTab] = useState<string>('details')
  const [smActiveTab, setSmActiveTab] = useState<string>('resumedata')
  const [openAddCallDialog, setOpenAddCallDialog] = useState<boolean>(false)
  const [openAddInterviewDialog, setOpenAddInterviewDialog] = useState<boolean>(false)

  const { data: constants } = useSelector((state: any) => state.constants)
  const { loading: resumeLoading } = useSelector((state: any) => state.resume)

  const isSmallScreen = useMediaQuery((theme: any) => theme.breakpoints.down('lg'))

  const handleClickOpenAddCallDialog = () => setOpenAddCallDialog(true)
  const handleClickOpenAddInterviewDialog = () => setOpenAddInterviewDialog(true)

  const handleCloseAddCallDialog = () => setOpenAddCallDialog(false)
  const handleCloseAddInterviewDialog = () => setOpenAddInterviewDialog(false)

  const handleTabChange = (e: any, value: string) => {
    setActiveTab(value)
  }

  const handleSmTabChange = (e: any, value: string) => {
    setSmActiveTab(value)
  }

  const handleCloseResumeDialog = () => {
    handleTabChange({}, 'details')
    handleClose()
  }

  return (
    <>
      <Dialog
        maxWidth='80%'
        fullWidth
        scroll='body'
        onClose={handleCloseResumeDialog}
        TransitionProps={{
          onExited: handleExit,
        }}
        open={open}
        // sx={{ height: '100vh' }}
        PaperProps={{ style: { margin: '1.5rem 0' } }}
      >
        <Grid container xs={12} flexDirection='row' sx={{ borderBottom: '1px solid rgba(76, 78, 100, 0.12)' }}>
          <Grid lg={12} item container sx={{ borderBottom: '1px solid rgba(76, 78, 100, 0.12)' }}>
            <ResumeDialogHeader
              handleClickOpenAddCallDialog={handleClickOpenAddCallDialog}
              handleClickOpenAddInterviewDialog={handleClickOpenAddInterviewDialog}
              tags={tags}
              closeToggle={handleCloseResumeDialog}
              smActiveTab={smActiveTab}
              handleSmTabChange={handleSmTabChange}
              isSmallScreen={isSmallScreen}
              allResumes={allResumes}
            />
          </Grid>
          {(!isSmallScreen || (isSmallScreen && smActiveTab == 'resumedata')) && (
            <Grid
              lg={6}
              item
              sx={{
                display: 'flex',
                flexDirection: 'column',
                borderRight: '1px solid rgba(76, 78, 100, 0.12)',
                position: 'relative'
              }}
            >
              <ResumeViewLeftDialog
                handleClickOpenAddCallDialog={handleClickOpenAddCallDialog}
                activeTab={activeTab}
                tags={tags}
                handleTabChange={handleTabChange}
                closeToggle={handleCloseResumeDialog}
              />
            </Grid>
          )}
          {(!isSmallScreen || (isSmallScreen && smActiveTab == 'comment')) && (
            <Grid lg={6} item sx={{ display: 'flex', flexDirection: 'column', position: 'relative' }}>
              {resumeLoading ? (
                <Box
                  sx={{
                    mt: 6,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '100%'
                  }}
                >
                  <CircularProgress sx={{ mb: 4 }} />
                </Box>
              ) : (
                <ResumeViewRightDialog />
              )}
            </Grid>
          )}
        </Grid>
      </Dialog>
      {getObjectKeys(constants?.resume)?.length > 0 && (
        <>
          <AddCallHistoryDialog open={openAddCallDialog} handleClose={handleCloseAddCallDialog} />
          <AddInterviewDialog open={openAddInterviewDialog} handleClose={handleCloseAddInterviewDialog} />
        </>
      )}
    </>
  )
}

export default ResumeDialogMain
