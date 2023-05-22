// ** MUI Components
import Grid from '@mui/material/Grid'
import { useEffect, useState } from 'react'
import Language from 'src/helpers/Language'
import { getFullName } from 'src/helpers/functions'
import { useAuth } from 'src/hooks/useAuth'

// ** Demo Components
import AboutOverivew from 'src/views/pages/user-profile/profile/AboutOverivew'

// import ProjectsTable from 'src/views/pages/user-profile/profile/ProjectsTable'
import ActivityTimeline from 'src/views/pages/user-profile/profile/ActivityTimeline'
import ConnectionsTeams from 'src/views/pages/user-profile/profile/ConnectionsTeams'

import PersonIcon from '@mui/icons-material/Person'
import ShieldIcon from '@mui/icons-material/Shield'
import AccountCircleIcon from '@mui/icons-material/AccountCircle'
import TranslateIcon from '@mui/icons-material/Translate'
import CallIcon from '@mui/icons-material/Call'
import EmailIcon from '@mui/icons-material/Email'

// ** Types
// import { ProfileTabType } from 'src/@fake-db/types'

const ProfileTab = ({ data }: { data: any }) => {
  const [about, setAbout] = useState<any>([])
  const [contact, setContact] = useState<any>([])
  const { user } = useAuth()

  useEffect(() => {
    if (user?.id) {
      setAbout([
        { property: 'Full Name', value: getFullName(user), icon: PersonIcon },
        { property: 'Role', value: user?.role[0]?.name, icon: ShieldIcon },
        { property: 'Username', value: user?.username, icon: AccountCircleIcon },
        { property: 'Language', value: Language.builder().lang, icon: TranslateIcon }
      ])
      setContact([
        { property: 'Contact', value: `+${user?.mobile}`, icon: CallIcon },
        { property: 'Email', value: user?.email ?? 'john.doe@example.com', icon: EmailIcon }
      ])
    }
  }, [user])

  return data && Object.values(data).length ? (
    <Grid container spacing={6}>
      <Grid item xl={4} md={5} xs={12}>
        <AboutOverivew about={about} contacts={contact} overview={data.overview} />
      </Grid>
      <Grid item xl={8} md={7} xs={12}>
        <Grid container spacing={6}>
          <Grid item xs={12}>
            <ActivityTimeline />
          </Grid>
          <ConnectionsTeams connections={data.connections} teams={data.teamsTech} />
        </Grid>
      </Grid>
    </Grid>
  ) : null
}

export default ProfileTab
