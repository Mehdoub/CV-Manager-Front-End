import {
  Button,
  ButtonGroup,
  Grid,
  IconButton,
  Rating,
  Tab,
} from '@mui/material'
import {
  ratingTextsObj,
  roundNumber,
} from 'src/helpers/functions'
import BootstrapTooltip from 'src/@core/components/bootstrap-tooltip'
import TabContext from '@mui/lab/TabContext'
import TabList from '@mui/lab/TabList'
import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import {
  getResume,
} from 'src/store/resume'
import { useDispatch } from 'react-redux'
import InterpreterModeIcon from '@mui/icons-material/InterpreterMode'
import CallIcon from '@mui/icons-material/Call'
import CloseIcon from '@mui/icons-material/Close'
import Skelet from 'src/@core/components/loading/Skelet'
import StatusNavigation from '../../resume/components/StatusNavigation'
import TagsManagement from '../../resume/components/TagsManagement'
import AssigneesManagement from '../../resume/components/AssigneesManagement'
import ViewsHistory from '../../resume/components/ViewsHistory'
import HeadInfo from '../../resume/components/HeadInfo'


const ResumeDialogHeader = ({
  handleClickOpenAddCallDialog,
  handleClickOpenAddInterviewDialog,
  closeToggle,
  smActiveTab,
  handleSmTabChange,
  isSmallScreen,
  allResumes = false
}: any) => {

  const [boardResumes, setBoardResumes] = useState<any>([])

  const dispatch = useDispatch()

  const { data: resume, loading: resumeLoading } = useSelector((state: any) => state.resume)
  const { data: positionResumes } = useSelector((state: any) => state.positionResumes)
  const { data: resumes } = useSelector((state: any) => state.resumesList)
  const { status: resumeStateUpdateStatus } = useSelector((state: any) => state.resumeUpdateStatus)

  useEffect(() => {
    if (allResumes) {
      setBoardResumes(resumes)
    } else {
      setBoardResumes(positionResumes)
    }
  }, [resumes, positionResumes])

  useEffect(() => {
    if (resumeStateUpdateStatus) {
      dispatch(getResume(resume.id))
    }
  }, [resumeStateUpdateStatus])

  return (
    <>
      <IconButton size='small' onClick={closeToggle} sx={{ position: 'absolute', right: '0.05rem', top: '0.05rem' }}>
        <CloseIcon />
      </IconButton>
      {isSmallScreen && (
        <Grid
          xs={12}
          item
          sx={{
            p: '5px 15px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            borderRight: '1px solid rgba(76, 78, 100, 0.12)'
          }}
        >
          <TabContext value={smActiveTab}>
            <div style={{ padding: '0' }}>
              <TabList
                scrollButtons='auto'
                onChange={handleSmTabChange}
                aria-label='forced scroll tabs example'
                sx={{
                  borderBottom: theme => `1px solid ${theme.palette.divider}`
                }}
                centered
              >
                <Tab
                  value='resumedata'
                  label='Resume Data'
                  className={`${smActiveTab == 'resumedata' ? 'resume-active-tab' : ''} resume-tab`}
                />
                <Tab
                  value='comment'
                  label='Comment'
                  className={`${smActiveTab == 'comment' ? 'resume-active-tab' : ''} resume-tab`}
                />
              </TabList>
            </div>
          </TabContext>
        </Grid>
      )}
      <Grid
        lg={6}
        xs={12}
        item
        container
        sx={{
          textAlign: 'left',
          p: '5px 15px',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          borderRight: '1px solid rgba(76, 78, 100, 0.12)'
        }}
      >
        <Grid item mt={4} lg={7} xs={12}>
          <HeadInfo />
        </Grid>
        <Grid
          item
          mt={4}
          lg={3}
          xs={12}
          sx={{ textAlign: 'right', display: 'flex', flexDirection: 'column', alignItems: 'center', minWidth: '225px' }}
        >
          <Skelet
            loading={resumeLoading}
            width={180}
            height={25}
            component={<StatusNavigation boardResumes={boardResumes} />}
          />
        </Grid>
        <Grid item mt={4} lg={6} xs={12}>
          <Skelet
            loading={resumeLoading}
            width={180}
            height={25}
            component={<TagsManagement allResumes={allResumes} />}
          />
        </Grid>
        <Grid item mt={7} lg={6} xs={12} sx={{ textAlign: 'right' }}>
          <BootstrapTooltip placement='top' title={ratingTextsObj[roundNumber(resume?.rating) ?? 0]}>
            <div style={{ display: 'inline', cursor: 'pointer' }}>
              <Rating readOnly value={roundNumber(resume?.rating) ?? 0} sx={{ mr: 5 }} name='read-only' size='small' />
            </div>
          </BootstrapTooltip>
        </Grid>
      </Grid>
      <Grid lg={6} xs={12} item container sx={{ textAlign: 'left', p: 5 }}>
        <Grid item container lg={7} xs={12}>
          <Grid item container xs={12} sx={{ textAlign: 'left', alignItems: 'end' }} spacing={2}>
            <Skelet
              loading={resumeLoading}
              width={180}
              height={25}
              component={<AssigneesManagement allResumes={allResumes} />}
            />
          </Grid>
        </Grid>
        <Grid
          item
          container
          lg={5}
          xs={12}
          mt={3}
          sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'inherit', flexDirection: 'column' }}
        >
          <Grid item sx={{ textAlign: 'right' }}>
            <ViewsHistory />
          </Grid>
          <ButtonGroup sx={{ justifyContent: 'end' }}>
            <Skelet
              loading={resumeLoading}
              width={180}
              height={30}
              component={
                <>
                  <Button
                    onClick={handleClickOpenAddCallDialog}
                    variant='outlined'
                    color='secondary'
                    startIcon={<CallIcon />}
                    sx={{ fontSize: '0.75rem', p: 2 }}
                  >
                    Call History
                  </Button>
                  <Button
                    onClick={handleClickOpenAddInterviewDialog}
                    sx={{ fontSize: '0.75rem', p: 2 }}
                    variant='outlined'
                    color='secondary'
                    startIcon={<InterpreterModeIcon />}
                  >
                    Add Interview
                  </Button>
                </>
              }
            />
          </ButtonGroup>
        </Grid>
      </Grid>
    </>
  )
}

export default ResumeDialogHeader
