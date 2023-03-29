import { Dialog, Divider, Grid, IconButton } from '@mui/material'
import { useState } from 'react'
import Icon from 'src/@core/components/icon'
import AddCallHistoryDialog from './AddCallHistoryDialog'
import ResumeViewLeftDialog from './ResumeViewLeftDialog'
import ResumeViewRightDialog from './ResumeViewRightDialog'
import cahtExample from 'src/data/chatData.json'

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
  const [openAddCallDialog, setOpenAddCallDialog] = useState<boolean>(false)

  const handleClickOpenAddCallDialog = () => setOpenAddCallDialog(true)

  const handleCloseAddCallDialog = () => setOpenAddCallDialog(false)

  const handleTabChange = (e: any, value: string) => {
    setActiveTab(value)
  }

  return (
    <>
      <Dialog
        maxWidth='80%'
        fullWidth
        scroll='body'
        onClose={toggle}
        open={open}
        sx={{ margin: '0 100px' }}
        // PaperProps={{ style: { margin: '30px 100px' } }}
      >
        <Grid container xs={12} flexDirection='row'>
          <IconButton size='small' onClick={toggle} sx={{ position: 'absolute', right: '1rem', top: '1rem' }}>
            <Icon icon='mdi:close' />
          </IconButton>
          <Grid
            md={6}
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
          <Grid md={6} item sx={{ position: 'relative' }}>
            <ResumeViewRightDialog
              handleClickOpenAddCallDialog={handleClickOpenAddCallDialog}
              cahtExample={cahtExample}
            />
          </Grid>
        </Grid>
      </Dialog>
      <AddCallHistoryDialog open={openAddCallDialog} handleClose={handleCloseAddCallDialog} />
    </>
  )
}

export default ResumeCardViewDialog
