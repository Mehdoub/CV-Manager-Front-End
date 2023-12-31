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
import { useDropzone } from 'react-dropzone'
import { Fragment, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { useDispatch } from 'react-redux'
import { addResumeFiles, clearResumeAddFiles, getResume, getResumes } from 'src/store/resume'
import { getAllowedFormats, getObjectKeys, toastError } from 'src/helpers/functions'
import { getPositionResumes } from 'src/store/position'
import CloudUploadIcon from '@mui/icons-material/CloudUpload'
import { useRouter } from 'next/router'
import Skelet from 'src/@core/components/loading/Skelet'

const UploadFileWrapper = styled(Grid)<BoxProps>(({ theme }) => ({
  display: 'flex',
  position: 'relative',
  alignItems: 'start',
  height: '65px',
  boxShadow: '-12px 0 22px 10px rgb(76 78 100 / 14%)',
  justifyContent: 'center',
  backgroundColor: theme.palette.background.paper
}))

const ResumeViewLeftDialog = ({ activeTab, handleTabChange, closeToggle }: any) => {
  const dispatch = useDispatch()
  const router = useRouter()

  const positionId = router?.query?.positionId

  const { status: uploadResumeFilesStatus, loading: uploadResumeFilesLoading } = useSelector(
    (state: any) => state.resumeAddFiles
  )
  const { data: resume, loading: resumeLoading } = useSelector((state: any) => state.resume)

  useEffect(() => {
    if (uploadResumeFilesStatus) {
      dispatch(getResume(resume?._id))
      dispatch(clearResumeAddFiles())

      if (positionId?.length) dispatch(getPositionResumes(resume?.position_id?._id))
      else dispatch(getResumes())
    }
  }, [uploadResumeFilesStatus])

  const { getRootProps, getInputProps } = useDropzone({
    maxFiles: 5,
    maxSize: 2000000,
    accept: {
      'application/pdf': getAllowedFormats('file', true)
    },
    onDropRejected: () => {
      toastError('You Can Only Upload 5 .pdf Files With Maximum Size Of 2 MB.')
    },
    onDropAccepted(acceptedFiles) {
      dispatch(addResumeFiles({ resumeFiles: acceptedFiles, resumeId: resume?._id }))
    }
  })

  const { data: constants } = useSelector((state: any) => state.constants)

  const tabs = [
    {
      label: 'Details',
      value: 'details'
    },
    {
      label: 'File',
      value: 'file'
    },
    {
      label: 'Interview',
      value: 'interview'
    },
    {
      label: 'Call History',
      value: 'call'
    },
  ]

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
              {tabs.map((tabItem: any, index: number) => (
                <Tab
                  key={`tab-${index}`}
                  value={tabItem.value}
                  label={tabItem.label}
                  className={`${activeTab == tabItem.value ? 'resume-active-tab' : ''} resume-tab`}
                />
              ))}
            </TabList>
            <Box sx={{ height: '65vh', overflowY: 'scroll', position: 'relative' }}>
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
                <>
                  <TabPanel sx={{ p: 0, mt: 6 }} value='details'>
                    {getObjectKeys(constants?.system)?.length > 0 && <ResumeDetailsTab closeToggle={closeToggle} />}
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
              )}
            </Box>
          </div>
        </TabContext>
        <Box sx={{ width: '100%', position: 'absolute', bottom: 0, zIndex: 10000, cursor: 'pointer' }}>
          {uploadResumeFilesLoading && <LinearProgress />}
          {resumeLoading ? null : (
            <Fragment>
              <div {...getRootProps({ className: 'dropzone' })}>
                <input {...getInputProps()} />
                <UploadFileWrapper tabIndex={1} container>
                  <Box sx={{ display: 'flex', alignItems: 'center', mt: 3, mr: 3 }}>
                    {!uploadResumeFilesLoading ? (
                      <>
                        <IconButton size='small' sx={{ mr: 1.5, color: 'rgb(76 78 100 / 14%)' }}>
                          <CloudUploadIcon fontSize='large' />
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
          )}
        </Box>
      </Grid>
    </>
  )
}

export default ResumeViewLeftDialog
