// ** React Imports
import {
  useState,
  useEffect,
  ReactElement,
  SyntheticEvent

  //  SyntheticEvent
} from 'react'

// ** Next Import
// import { useRouter } from 'next/router'

// ** MUI Components
// import Tab from '@mui/material/Tab'
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import TabPanel from '@mui/lab/TabPanel'
import TabContext from '@mui/lab/TabContext'
import Typography from '@mui/material/Typography'

// import useMediaQuery from '@mui/material/useMediaQuery'
import CircularProgress from '@mui/material/CircularProgress'
import Icon from 'src/@core/components/icon'
import NotificationsIcon from '@mui/icons-material/Notifications'

import Profile from 'src/views/pages/user-profile/profile'
import PersonIcon from '@mui/icons-material/Person'
import ShieldIcon from '@mui/icons-material/Shield'
import AccountCircleIcon from '@mui/icons-material/AccountCircle'
import TranslateIcon from '@mui/icons-material/Translate'
import CallIcon from '@mui/icons-material/Call'
import EmailIcon from '@mui/icons-material/Email'
import UserProfileHeader from 'src/views/pages/user-profile/UserProfileHeader'
import { useRouter } from 'next/router'
import { Tab, Theme, useMediaQuery } from '@mui/material'
import TabList from '@mui/lab/TabList'
import NotificationsTab from './NotificationsTab'
import { useAuth } from 'src/hooks/useAuth'
import { getFullName } from 'src/helpers/functions'
import Language from 'src/helpers/Language'
import AboutOverivew from './profile/AboutOverivew'

const UserProfile = ({ data }: { data: any }) => {
  const {
    query: { tab }
  } = useRouter() as any
  // ** State
  const [activeTab, setActiveTab] = useState<string>(tab)
  const [isLoading, setIsLoading] = useState<boolean>(true)

  // ** Hooks
  const router = useRouter()

  const hideText = useMediaQuery((theme: Theme) => theme.breakpoints.down('sm'))

  const handleChange = (event: SyntheticEvent, value: string) => {
    setIsLoading(true)
    setActiveTab(value)
    router
      .push({
        pathname: `/profile/${value.toLowerCase()}`
      })
      .then(() => setIsLoading(false))
  }

  useEffect(() => {
    if (data) {
      setIsLoading(false)
    }
  }, [data])

  useEffect(() => {
    if (tab && tab !== activeTab) {
      setActiveTab(tab)
    }
  }, [tab])

  const tabContentList: { [key: string]: ReactElement } = {
    view: <Profile data={data as any} />,
    notifications: <NotificationsTab />
  }
  const [about, setAbout] = useState<any>([])
  const { user } = useAuth()

  useEffect(() => {
    if (user?.id) {
      setAbout([
        { property: 'Full Name', value: getFullName(user), icon: PersonIcon },
        { property: 'Role', value: user?.role[0]?.name, icon: ShieldIcon },
        { property: 'Username', value: user?.username, icon: AccountCircleIcon },
        { property: 'Language', value: Language.builder().lang, icon: TranslateIcon },
        { property: 'Mobile', value: `+98 ${user?.mobile?.substring(2)}`, icon: CallIcon },
        { property: 'Email', value: user?.email ?? '---', icon: EmailIcon }
      ])
    }
  }, [user])
  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <UserProfileHeader />
      </Grid>
      {activeTab === undefined ? null : (
        <Grid item xs={12}>
          <TabContext value={activeTab}>
            <Grid container spacing={6}>
              <Grid item xl={4} md={5} xs={12}>
                <AboutOverivew about={about} overview={data?.overview} />
              </Grid>
              <Grid item xs={12} md={8}>
                <TabList
                  variant='scrollable'
                  scrollButtons='auto'
                  onChange={handleChange}
                  aria-label='customized tabs example'
                  sx={{ borderBottom: theme => `1px solid ${theme.palette.divider}` }}
                >
                  <Tab
                    value='view'
                    label={
                      <Box sx={{ display: 'flex', alignItems: 'center', ...(!hideText && { '& svg': { mr: 2 } }) }}>
                        <PersonIcon />
                        {!hideText && 'Profile'}
                      </Box>
                    }
                  />
                  <Tab
                    value='notifications'
                    label={
                      <Box sx={{ display: 'flex', alignItems: 'center', ...(!hideText && { '& svg': { mr: 2 } }) }}>
                        <NotificationsIcon />
                        {!hideText && 'Notifications'}
                      </Box>
                    }
                  />
                </TabList>
                {isLoading ? (
                  <Box sx={{ mt: 6, display: 'flex', alignItems: 'center', flexDirection: 'column' }}>
                    <CircularProgress sx={{ mb: 4 }} />
                    <Typography>Loading...</Typography>
                  </Box>
                ) : (
                  <TabPanel sx={{ p: 0, mt: 5 }} value={activeTab}>
                    {tabContentList[activeTab]}
                  </TabPanel>
                )}
              </Grid>
            </Grid>
          </TabContext>
        </Grid>
      )}
    </Grid>
  )
}

export default UserProfile
