import TabContext from '@mui/lab/TabContext'
import TabList from '@mui/lab/TabList'
import TabPanel from '@mui/lab/TabPanel'
import {
  Box,
  BoxProps,
  CircularProgress,
  Grid,
  IconButton,
  LinearProgress,
  Tab,
  Typography,
  styled
} from '@mui/material'
import ResumeDetailsTab from './ResumeDetailsTab'
import ResumeCallsTab from './ResumeCallsTab'
import ResumeFileTab from './ResumeFileTab'

import ResumeInterviewsTab from './ResumeInterviewsTab'
import Icon from 'src/@core/components/icon'
import { useDropzone } from 'react-dropzone'
import { Fragment, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { useDispatch } from 'react-redux'
import { addResumeFiles, clearResumeAddFiles } from 'src/store/resume'
import { toastError } from 'src/helpers/functions'

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
  const dispatch = useDispatch()

  const { status: uploadResumeFilesStatus, loading: uploadResumeFilesLoading } = useSelector(
    (state: any) => state.resumeAddFiles
  )

  useEffect(() => {
    if (uploadResumeFilesStatus) dispatch(clearResumeAddFiles())
  }, [uploadResumeFilesStatus])

  const { getRootProps, getInputProps } = useDropzone({
    maxFiles: 5,
    maxSize: 5000000,
    accept: {
      'application/*': ['.pdf']
    },
    onDropRejected: () => {
      toastError('You Can Nnly Upload 5 PDF Files With Maximum Size Of 5 MB.')
    },
    onDropAccepted(acceptedFiles) {
      dispatch(addResumeFiles({ resumeFiles: acceptedFiles, resumeId: '643e6f56fb07b43fa72a7176' }))
    }
  })

  const { data: constants } = useSelector((state: any) => state.constants)

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
              }}
            >
              <Tab
                value='details'
                label='Details'
                className={`${activeTab == 'details' ? 'resume-active-tab' : ''} resume-tab`}
              />
              <Tab
                value='file'
                label='File'
                className={`${activeTab == 'file' ? 'resume-active-tab' : ''} resume-tab`}
              />
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
                  {constants?.system && <ResumeDetailsTab />}
                </TabPanel>
                <TabPanel sx={{ p: 0 }} value='file'>
                  <ResumeFileTab />
                </TabPanel>
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
          {uploadResumeFilesLoading && <LinearProgress />}
          <Fragment>
            <div {...getRootProps({ className: 'dropzone' })}>
              <input {...getInputProps()} />
              <UploadFileWrapper tabIndex={1} container>
                <Box sx={{ display: 'flex', alignItems: 'center', mt: 3, mr: 3 }}>
                  {!uploadResumeFilesLoading ? (
                    <>
                      <IconButton size='small' sx={{ mr: 1.5, color: 'rgb(76 78 100 / 14%)' }}>
                        <Icon icon='ic:round-cloud-upload' fontSize='2.25rem' />
                      </IconButton>
                      <Typography sx={{ color: 'text.secondary' }}>Drop Resume File Or Click To Upload</Typography>
                    </>
                  ) : (
                    <CircularProgress />
                  )}
                </Box>
              </UploadFileWrapper>
            </div>
          </Fragment>
        </Box>
      </Grid>
    </>
  )
}

export default ResumeViewLeftDialog
