// ** React Imports
import { SyntheticEvent, useState, useEffect } from 'react'

// ** Next Import
import { useRouter } from 'next/router'

// ** MUI Imports
import Box from '@mui/material/Box'
import TabList from '@mui/lab/TabList'
import TabPanel from '@mui/lab/TabPanel'
import TabContext from '@mui/lab/TabContext'
import { styled } from '@mui/material/styles'
import Typography from '@mui/material/Typography'
import MuiTab, { TabProps } from '@mui/material/Tab'
import CircularProgress from '@mui/material/CircularProgress'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Demo Components Imports
import ViewOverview from 'src/views/pages/position/view/ViewOverview'
import ViewResumes from 'src/views/pages/position/view/ViewResumes'
import { Button, ButtonProps } from '@mui/material'
import ManagersView from 'src/views/common/ManagersView'
import { useSelector } from 'react-redux'
import {
  addPositionManager,
  clearPositionManagerAdd,
  clearPositionManagerRemove,
  getPositionManagers,
  removePositionManager
} from 'src/store/position'
import AddResumeDialog from './AddResumeDialog'
import AssignmentIndIcon from '@mui/icons-material/AssignmentInd'
import WorkIcon from '@mui/icons-material/Work'
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts'
import { getObjectKeys } from 'src/helpers/functions'

// ** Styled Tab component
const Tab = styled(MuiTab)<TabProps>(({ theme }) => ({
  minHeight: 48,
  flexDirection: 'row',
  '& svg': {
    marginBottom: '0 !important',
    marginRight: theme.spacing(1)
  }
}))

const ResponsiveBtn = styled(Button)<ButtonProps>(({ theme }) => ({
  mb: 2,
  position: 'fixed',
  top: '90px',
  right: '20px',
  [theme.breakpoints.down('md')]: {
    position: 'unset',
    minWidth: 'auto',
    marginLeft: '35px',
    marginBottom: '5px'
  }
}))

const PositionViewRight: any = () => {
  const router = useRouter()

  const {
    query: { positionId, tab }
  } = router as any

  // ** State
  const [activeTab, setActiveTab] = useState<string>(tab)
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [openAddResumeDialog, setOpenAddResumeDialog] = useState<boolean>(false)

  const handleCloseAddResumeDialog = () => setOpenAddResumeDialog(false)

  const positionStore = useSelector((state: any) => state.position)
  const { data: position, loading } = positionStore

  const positionManagersStore = useSelector((state: any) => state.positionManagers)
  const positionManagerAddStore = useSelector((state: any) => state.positionManagerAdd)
  const positionManagerRemoveStore = useSelector((state: any) => state.positionManagerRemove)

  const { data: constants } = useSelector((state: any) => state.constants)
  const { data: provinces } = useSelector((state: any) => state.provinces)

  const handleChange = (event: SyntheticEvent, value: string) => {
    setIsLoading(true)
    setActiveTab(value)
    router
      .push({
        pathname: `/positions/view/${positionId}/${value.toLowerCase()}`
      })
      .then(() => setIsLoading(false))
  }

  useEffect(() => {
    if (tab && tab !== activeTab) {
      setActiveTab(tab)
    }
  }, [tab])

  useEffect(() => {
    if (positionId) {
      setIsLoading(false)
    }
  }, [positionId])

  return (
    <>
      <TabContext value={activeTab}>
        <TabList
          variant='scrollable'
          scrollButtons='auto'
          onChange={handleChange}
          aria-label='forced scroll tabs example'
          sx={{
            borderBottom: theme => `1px solid ${theme.palette.divider}`,
            position: activeTab == 'resume' ? 'fixed' : undefined,
            width: '100%'
          }}
        >
          <Tab value='overview' label='Overview' icon={<WorkIcon />} />
          {/* <Tab value='interview' label='Interviews' icon={<Icon icon='mdi:virtual-meeting' />} /> */}
          <Tab value='resume' label='Resumes' icon={<AssignmentIndIcon />} />
          <Tab value='manager' label='Managers' icon={<ManageAccountsIcon />} />
          {activeTab == 'resume' ? (
            <ResponsiveBtn variant='outlined' onClick={() => setOpenAddResumeDialog(true)}>
              Add Resume
            </ResponsiveBtn>
          ) : (
            // ) : activeTab == 'interview' ? (
            //   <ResponsiveBtn sx={{ mb: 2, position: 'absolute', right: '5px', top: '5px' }} variant='outlined'>
            //     Add Interview
            //   </ResponsiveBtn>
            ''
          )}
        </TabList>
        {activeTab == 'resume' && <Box sx={{ display: 'flex', width: '100%', height: '100px' }}></Box>}
        <Box sx={{ mt: activeTab != 'resume' ? 6 : 0 }}>
          {isLoading ? (
            <Box sx={{ mt: 6, display: 'flex', alignItems: 'center', flexDirection: 'column' }}>
              <CircularProgress sx={{ mb: 4 }} />
              <Typography>Loading...</Typography>
            </Box>
          ) : (
            <>
              <TabPanel sx={{ p: 0 }} value='overview'>
                <ViewOverview />
              </TabPanel>
              {/* <TabPanel sx={{ p: 0 }} value='interview'>
                <ViewInterviews />
              </TabPanel> */}
              <TabPanel sx={{ p: 0 }} value='resume'>
                <ViewResumes />
              </TabPanel>
              <TabPanel sx={{ p: 0 }} value='manager'>
                <ManagersView
                  entity={position}
                  entityManagersStore={positionManagersStore}
                  entityManagerAddStore={positionManagerAddStore}
                  addEntityManagerAction={addPositionManager}
                  clearEntityManagerAddAction={clearPositionManagerAdd}
                  entityManagerRemoveStore={positionManagerRemoveStore}
                  removeEntityManagerAction={removePositionManager}
                  clearEntityManagerRemoveAction={clearPositionManagerRemove}
                  getEntityManagersAction={getPositionManagers}
                />
              </TabPanel>
            </>
          )}
        </Box>
      </TabContext>
      {getObjectKeys(constants?.system)?.length > 0 && provinces?.length ? (
        <AddResumeDialog open={openAddResumeDialog} handleClose={handleCloseAddResumeDialog} />
      ) : null}
    </>
  )
}

export default PositionViewRight
