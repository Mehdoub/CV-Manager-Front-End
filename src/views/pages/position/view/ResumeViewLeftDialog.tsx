import TabContext from '@mui/lab/TabContext'
import TabList from '@mui/lab/TabList'
import TabPanel from '@mui/lab/TabPanel'
import { Box, BoxProps, Grid, IconButton, Tab, Typography, styled } from '@mui/material'
import ResumeDetailsTab from './ResumeDetailsTab'
import ResumeCallsTab from './ResumeCallsTab'

import ResumeInterviewsTab from './ResumeInterviewsTab'
import Icon from 'src/@core/components/icon'
import { useDropzone } from 'react-dropzone'
import { toast } from 'react-hot-toast'
import { Fragment, useState } from 'react'

const UploadFileWrapper = styled(Grid)<BoxProps>(({ theme }) => ({
  display: 'flex',
  position: 'relative',
  alignItems: 'start',
  height: '65px',
  boxShadow: '-12px 0 22px 10px rgb(76 78 100 / 14%)',
  justifyContent: 'center',
  backgroundColor: theme.palette.background.paper
}))

const ResumeViewLeftDialog = ({ activeTab, handleTabChange }: any) => {
  const [files, setFiles] = useState<File[]>([])

  const { getRootProps, getInputProps } = useDropzone({
    maxFiles: 1,
    maxSize: 5000000,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.gif']
    },
    onDrop: (acceptedFiles: File[]) => {
      setFiles(acceptedFiles.map((file: File) => Object.assign(file)))
    },
    onDropRejected: () => {
      toast.error('You can only upload maximum size of 5 MB.', {
        duration: 2000
      })
    }
  })

  return (
    <>
      <Grid xs={12} item>
        <TabContext value={activeTab}>
          <div style={{ padding: '0' }}>
            <TabList
              variant='scrollable'
              scrollButtons='auto'
              onChange={handleTabChange}
              aria-label='forced scroll tabs example'
              sx={{
                borderBottom: theme => `1px solid ${theme.palette.divider}`
                // , width: '360px'
              }}
            >
              <Tab
                value='details'
                label='Details'
                className={`${activeTab == 'details' ? 'resume-active-tab' : ''} resume-tab`}
              />
              {/* <Tab
                value='file'
                label='File'
                className={`${activeTab == 'file' ? 'resume-active-tab' : ''} resume-tab`}
              /> */}
              <Tab
                value='interview'
                label='Interview'
                className={`${activeTab == 'interview' ? 'resume-active-tab' : ''} resume-tab`}
              />
              <Tab
                value='call'
                label='Call'
                className={`${activeTab == 'call' ? 'resume-active-tab' : ''} resume-tab`}
              />
            </TabList>
            <Box sx={{ height: '65vh', overflowY: 'scroll' }}>
              <>
                <TabPanel sx={{ p: 0, mt: 6 }} value='details'>
                  <ResumeDetailsTab />
                </TabPanel>
                {/* <TabPanel sx={{ p: 0 }} value='file'>
                  <Grid xs={12} container>
                    <h5>There Is Nothing To Show File ...</h5>
                  </Grid>
                </TabPanel> */}
                <TabPanel sx={{ p: 0 }} value='interview'>
                  <Grid xs={12} container>
                    <ResumeInterviewsTab />
                  </Grid>
                </TabPanel>
                <TabPanel sx={{ p: 0 }} value='call'>
                  <ResumeCallsTab />
                </TabPanel>
                <Grid item xs={12} sx={{ height: '64px' }}></Grid>
              </>
            </Box>
          </div>
        </TabContext>
        <Box sx={{ width: '100%', position: 'absolute', bottom: 0, zIndex: 10000, cursor: 'pointer' }}>
          <form onSubmit={() => console.log('hi')}>
            <Fragment>
              <div {...getRootProps({ className: 'dropzone' })}>
                <input {...getInputProps()} />
                <UploadFileWrapper tabIndex={1} container>
                  <Box sx={{ display: 'flex', alignItems: 'center', mt: 3, mr: 3 }}>
                    <IconButton size='small' sx={{ mr: 1.5, color: 'rgb(76 78 100 / 14%)' }}>
                      <Icon icon='ic:round-cloud-upload' fontSize='2.25rem' />
                    </IconButton>
                    <Typography sx={{ color: 'text.secondary' }}>Drop Resume File Or Click To Upload</Typography>
                  </Box>
                </UploadFileWrapper>
              </div>
            </Fragment>
          </form>
        </Box>
      </Grid>
    </>
  )
}

export default ResumeViewLeftDialog
