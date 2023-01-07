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
import UserViewOverview from 'src/views/pages/user/view/UserViewOverview'
import AddCompanyDrawer from 'src/views/pages/company/list/AddCompanyDrawer'
import UserViewSecurity from 'src/views/pages/user/view/UserViewSecurity'
import UserViewProject from 'src/views/pages/user/view/UserViewProject'
import UserViewCompany from './UserViewCompany'
import AddProjectDrawer from '../../project/list/AddProjectDrawer'
import { Button } from '@mui/material'

// ** Types
// import { InvoiceType } from 'src/types/apps/invoiceTypes'

// interface Props {
//   tab: string
//   invoiceData: any[]
// }

// ** Styled Tab component
const Tab = styled(MuiTab)<TabProps>(({ theme }) => ({
  minHeight: 48,
  flexDirection: 'row',
  '& svg': {
    marginBottom: '0 !important',
    marginRight: theme.spacing(1)
  }
}))

const UserViewRight = ({ tab, invoiceData }: any) => {
  // ** State
  const [activeTab, setActiveTab] = useState<string>(tab)
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [addCompanyOpen, setAddCompanyOpen] = useState<boolean>(false)
  const [addProjectOpen, setAddProjectOpen] = useState<boolean>(false)

  const toggleAddProjectDrawer = () => setAddProjectOpen(!addProjectOpen)
  const toggleAddCompanyDrawer = () => setAddCompanyOpen(!addCompanyOpen)

  // ** Hooks
  const router = useRouter()

  const handleChange = (event: SyntheticEvent, value: string) => {
    setIsLoading(true)
    setActiveTab(value)
    router
      .push({
        pathname: `/users/view/${invoiceData?.id}/${value.toLowerCase()}`
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
          sx={{ borderBottom: theme => `1px solid ${theme.palette.divider}`, position: 'relative' }}
        >
          <Tab value='overview' label='Overview' icon={<Icon icon='mdi:account-outline' />} />
          <Tab value='project' label='Projects' icon={<Icon icon='pajamas:project' />} />
          <Tab value='company' label='Companies' icon={<Icon icon='carbon:location-company' />} />
          <Tab value='security' label='Security' icon={<Icon icon='mdi:lock-outline' />} />
          {activeTab == 'company' ? (
              <Button sx={{ mb: 2, position: 'absolute', right: '0', top: '5px' }} onClick={toggleAddCompanyDrawer} variant='contained'>
                Add Company
              </Button>
          ) : activeTab == 'project' ? (
            <Button sx={{ mb: 2, position: 'absolute', right: '0', top: '5px' }} onClick={toggleAddProjectDrawer} variant='contained'>
                Add Project
              </Button>
          ) : ''}
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
                <UserViewOverview invoiceData={invoiceData} />
              </TabPanel>
              <TabPanel sx={{ p: 0 }} value='project'>
                <UserViewProject />
              </TabPanel>
              <TabPanel sx={{ p: 0 }} value='company'>
                <UserViewCompany />
              </TabPanel>
              <TabPanel sx={{ p: 0 }} value='security'>
                <UserViewSecurity />
              </TabPanel>
            </>
          )}
        </Box>
      </TabContext>
      <AddCompanyDrawer open={addCompanyOpen} toggle={toggleAddCompanyDrawer} />
      <AddProjectDrawer open={addProjectOpen} toggle={toggleAddProjectDrawer} />
    </>
  )
}

export default UserViewRight
