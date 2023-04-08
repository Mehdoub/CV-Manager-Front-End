import { Dialog, Grid, useMediaQuery } from '@mui/material'
import { useState } from 'react'
import AddCallHistoryDialog from './AddCallHistoryDialog'
import ResumeViewLeftDialog from './ResumeViewLeftDialog'
import ResumeViewRightDialog from './ResumeViewRightDialog'
import cahtExample from 'src/data/chatData.json'
import ResumeCardHeader from './ResumeCardHeader'
import AddInterviewDialog from './AddInterviewDialog'

interface ResumeCardViewDialogProps {
  open: boolean
  toggle: () => void
  resumeData: any
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

const ResumeCardViewDialog = ({ open, toggle, resumeData }: ResumeCardViewDialogProps) => {
  const [activeTab, setActiveTab] = useState<string>('details')
  const [smActiveTab, setSmActiveTab] = useState<string>('resumedata')
  const [openAddCallDialog, setOpenAddCallDialog] = useState<boolean>(false)
  const [openAddInterviewDialog, setOpenAddInterviewDialog] = useState<boolean>(false)

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

  return (
    <>
      <Dialog
        maxWidth='80%'
        fullWidth
        scroll='body'
        onClose={toggle}
        open={open}
        // sx={{ height: '100vh' }}
        PaperProps={{ style: { margin: '1.5rem 0' } }}
      >
        <Grid container xs={12} flexDirection='row' sx={{ borderBottom: '1px solid rgba(76, 78, 100, 0.12)' }}>
          <Grid lg={12} item container sx={{ borderBottom: '1px solid rgba(76, 78, 100, 0.12)' }}>
            <ResumeCardHeader
              handleClickOpenAddCallDialog={handleClickOpenAddCallDialog}
              handleClickOpenAddInterviewDialog={handleClickOpenAddInterviewDialog}
              tags={tags}
              closeToggle={toggle}
              smActiveTab={smActiveTab}
              handleSmTabChange={handleSmTabChange}
              isSmallScreen={isSmallScreen}
            />
          </Grid>
          {(!isSmallScreen || (isSmallScreen && smActiveTab == 'resumedata')) && (
            <Grid
              lg={6}
              item
              sx={{ display: 'flex', flexDirection: 'column', borderRight: '1px solid rgba(76, 78, 100, 0.12)' }}
            >
              <ResumeViewLeftDialog
                handleClickOpenAddCallDialog={handleClickOpenAddCallDialog}
                activeTab={activeTab}
                tags={tags}
                handleTabChange={handleTabChange}
              />
            </Grid>
          )}
          {(!isSmallScreen || (isSmallScreen && smActiveTab == 'comment')) && (
            <Grid lg={6} item sx={{ display: 'flex', flexDirection: 'column', position: 'relative' }}>
              <ResumeViewRightDialog
                handleClickOpenAddCallDialog={handleClickOpenAddCallDialog}
                cahtExample={cahtExample}
              />
            </Grid>
          )}
        </Grid>
      </Dialog>
      <AddCallHistoryDialog open={openAddCallDialog} handleClose={handleCloseAddCallDialog} />
      <AddInterviewDialog open={openAddInterviewDialog} handleClose={handleCloseAddInterviewDialog} />
    </>
  )
}

export default ResumeCardViewDialog
