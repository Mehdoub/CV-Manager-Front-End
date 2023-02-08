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
import CompanyViewManagers from 'src/views/pages/company/view/CompanyViewManagers'
import CompanyViewOverview from 'src/views/pages/company/view/CompanyViewOverview'
import AddProjectDrawer from 'src/views/pages/project/list/AddProjectDrawer'
import { Button } from '@mui/material'
import CompanyViewProjects from './CompanyViewProjects'
import CompanyViewResumes from './CompanyViewResumes'

// ** Types
// import { InvoiceType } from 'src/types/apps/invoiceTypes'

interface Props {
  tab: string
  companyId: string
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

const CompanyViewRight = ({ tab, companyId }: Props) => {
  // ** State
  const [activeTab, setActiveTab] = useState<string>(tab)
  const [isLoading, setIsLoading] = useState<boolean>(true)

  // ** Hooks
  const router = useRouter()

  const [addProjectOpen, setAddProjectOpen] = useState<boolean>(false)
  const toggleAddProjectDrawer = () => setAddProjectOpen(!addProjectOpen)

  const handleChange = (event: SyntheticEvent, value: string) => {
    setIsLoading(true)
    setActiveTab(value)
    router
      .push({
        pathname: `/companies/view/${companyId}/${value.toLowerCase()}`
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
    if (companyId) {
      setIsLoading(false)
    }
  }, [companyId])

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
          <Tab value='project' label='Projects' icon={<Icon icon='pajamas:project' />} />
          <Tab value='resume' label='Resumes' icon={<Icon icon='pepicons-pop:cv' />} />
          <Tab value='manager' label='Managers' icon={<Icon icon='grommet-icons:user-manager' />} />
          {activeTab == 'project' ? (
            <Button
              sx={{ mb: 2, position: 'absolute', right: '5px', top: '5px' }}
              onClick={toggleAddProjectDrawer}
              variant='outlined'
            >
              Add Project
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
                <CompanyViewOverview />
              </TabPanel>
              <TabPanel sx={{ p: 0 }} value='project'>
                <CompanyViewProjects companyId={companyId} />
              </TabPanel>
              <TabPanel sx={{ p: 0 }} value='resume'>
                <CompanyViewResumes companyId={companyId} />
              </TabPanel>
              <TabPanel sx={{ p: 0 }} value='manager'>
                <CompanyViewManagers />
              </TabPanel>
            </>
          )}
        </Box>
      </TabContext>
      <AddProjectDrawer open={addProjectOpen} toggle={toggleAddProjectDrawer} companyId={companyId} dispatchCompanyProjects={true} />
    </>
  )
}

export default CompanyViewRight
