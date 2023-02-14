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
import ViewInterviews from 'src/views/pages/position/view/ViewInterviews'
import { Button } from '@mui/material'
import AddManagerDrawer from './AddManagerDrawer'
import ManagersView from 'src/views/common/ManagersView'
import { useSelector } from 'react-redux'
import {
  addPositionManager,
  clearPositionManagerAdd,
  clearPositionManagerRemove,
  getPositionManagers,
  removePositionManager
} from 'src/store/position'

// ** Types
// import { InvoiceType } from 'src/types/apps/invoiceTypes'

interface Props {
  tab: string
  positionId: string
}

// ** Styled Tab component
const Tab = styled(MuiTab)<TabProps>(({ theme }) => ({
  minHeight: 48,
  flexDirection: 'row',
  '& svg': {
    marginBottom: '0 !important',
    marginRight: theme.spacing(1)
  }
}))

const ViewRight = ({ tab, positionId }: Props) => {
  // ** State
  const [activeTab, setActiveTab] = useState<string>(tab)
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [addManagerOpen, setAddManagerOpen] = useState<boolean>(false)

  const toggleAddManagerDrawer = () => setAddManagerOpen(!addManagerOpen)

  // ** Hooks
  const router = useRouter()

  const positionStore = useSelector((state: any) => state.position)
  const { data: position, loading } = positionStore

  const positionManagersStore = useSelector((state: any) => state.positionManagers)
  const positionManagerAddStore = useSelector((state: any) => state.positionManagerAdd)
  const positionManagerRemoveStore = useSelector((state: any) => state.positionManagerRemove)

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

    // eslint-disable-next-line react-hooks/exhaustive-deps
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
          sx={{ borderBottom: theme => `1px solid ${theme.palette.divider}` }}
        >
          <Tab value='overview' label='Overview' icon={<Icon icon='mdi:account-outline' />} />
          <Tab value='interview' label='Interviews' icon={<Icon icon='mdi:virtual-meeting' />} />
          <Tab value='resume' label='Resumes' icon={<Icon icon='pepicons-pop:cv' />} />
          <Tab value='manager' label='Managers' icon={<Icon icon='grommet-icons:user-manager' />} />
          {activeTab == 'manager' ? (
            <Button
              onClick={toggleAddManagerDrawer}
              sx={{ mb: 2, position: 'absolute', right: '5px', top: '5px' }}
              variant='outlined'
            >
              Add Manager
            </Button>
          ) : activeTab == 'resume' ? (
            <Button sx={{ mb: 2, position: 'absolute', right: '5px', top: '5px' }} variant='outlined'>
              Add Resume
            </Button>
          ) : activeTab == 'interview' ? (
            <Button sx={{ mb: 2, position: 'absolute', right: '5px', top: '5px' }} variant='outlined'>
              Add Interview
            </Button>
          ) : (
            ''
          )}
        </TabList>
        <Box sx={{ mt: 6 }}>
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
              <TabPanel sx={{ p: 0 }} value='interview'>
                <ViewInterviews />
              </TabPanel>
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
        <AddManagerDrawer open={addManagerOpen} toggle={toggleAddManagerDrawer} />
      </TabContext>
    </>
  )
}

export default ViewRight
