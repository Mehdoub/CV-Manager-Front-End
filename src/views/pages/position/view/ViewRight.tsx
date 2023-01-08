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
import ViewManagers from 'src/views/pages/position/view/ViewManagers'
import ViewOverview from 'src/views/pages/position/view/ViewOverview'
import ViewResumes from 'src/views/pages/position/view/ViewResumes'
import ViewInterviews from 'src/views/pages/position/view/ViewInterviews'
import { Button } from '@mui/material'
import AddManagerDrawer from './AddManagerDrawer'

// ** Types
// import { InvoiceType } from 'src/types/apps/invoiceTypes'

interface Props {
  tab: string
  invoiceData: any
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

const ViewRight = ({ tab, invoiceData }: Props) => {
  // ** State
  const [activeTab, setActiveTab] = useState<string>(tab)
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [addManagerOpen, setAddManagerOpen] = useState<boolean>(false)

  const toggleAddManagerDrawer = () => setAddManagerOpen(!addManagerOpen)

  // ** Hooks
  const router = useRouter()

  const handleChange = (event: SyntheticEvent, value: string) => {
    setIsLoading(true)
    setActiveTab(value)
    router
      .push({
        pathname: `/positions/view/${invoiceData.id}/${value.toLowerCase()}`
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
    if (invoiceData) {
      setIsLoading(false)
    }
  }, [invoiceData])

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
                <ViewManagers />
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
