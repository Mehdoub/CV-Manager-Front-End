// ** MUI Imports
import Box from '@mui/material/Box'
import IconButton from '@mui/material/IconButton'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Type Import
import { Settings } from 'src/@core/context/settingsContext'
import LanguageDropdown from 'src/@core/layouts/components/shared-components/LanguageDropdown'

// ** Components
import ModeToggler from 'src/@core/layouts/components/shared-components/ModeToggler'
import NotificationDropdown from 'src/@core/layouts/components/shared-components/NotificationDropdown'
import UserDropdown from 'src/@core/layouts/components/shared-components/UserDropdown'
import AutocompleteComponent from '../Autocomplete'
import { useAuth } from 'src/hooks/useAuth'
import ShortcutsDropdown from 'src/@core/layouts/components/shared-components/ShortcutsDropdown'
import { Breadcrumbs } from '@mui/material'
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import { Typography } from '@mui/material'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { uppercaseFirstLetters } from 'src/helpers/functions'

interface Props {
  hidden: boolean
  settings: Settings
  toggleNavVisibility: () => void
  saveSettings: (values: Settings) => void
}

const AppBarContent = (props: Props) => {
  // ** Props
  const { hidden, settings, saveSettings, toggleNavVisibility } = props

  const { user } = useAuth()
  const router = useRouter()

  const breadcrumbs = [];

  const pathArr = router.pathname.split('/')
  if (pathArr.length > 0 && pathArr[0] == '') pathArr.shift()

  let middlePage = ''
  if (pathArr.length > 0 && !['', 'home'].includes(pathArr[0])) {
    middlePage = pathArr[0]
    breadcrumbs.push(
      <Link style={{ textDecoration: 'none', color: 'inherit' }} href="/home/">
        Home
      </Link>
    )

    if (pathArr.includes('view')) {
      breadcrumbs.push([
        <Link
          style={{ textDecoration: 'none', color: 'inherit' }}
          href={`/${middlePage}/`}
        >
          {uppercaseFirstLetters(middlePage, false, true)}
        </Link>,
        <Typography color="text.primary">
          View
        </Typography>
      ])
    } else {
      breadcrumbs.push(
        <Typography color="text.primary">
          {uppercaseFirstLetters(middlePage, false, true)}
        </Typography>
      )
    }

  } else {
    breadcrumbs.push([
      <Typography color="text.primary">
        Home
      </Typography>,
      <Typography color="text.primary"></Typography>
    ])
  }


  return (
    <Box sx={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
      <Box className='actions-left' sx={{ mr: 2, display: 'flex', alignItems: 'center' }}>
        {hidden ? (
          <IconButton color='inherit' sx={{ ml: -2.75 }} onClick={toggleNavVisibility}>
            <Icon icon='mdi:menu' />
          </IconButton>
        ) : null}
        {/* {user?.mobile_verified_at && <AutocompleteComponent hidden={hidden} settings={settings} />} */}
        <Breadcrumbs
          separator={<NavigateNextIcon fontSize="small" />}
          aria-label="breadcrumb"
        >
          {breadcrumbs}
        </Breadcrumbs>
      </Box>
      <Box className='actions-right' sx={{ display: 'flex', alignItems: 'center' }}>
        {/* <LanguageDropdown settings={settings} saveSettings={saveSettings} /> */}
        <ModeToggler settings={settings} saveSettings={saveSettings} />
        {user?.mobile_verified_at && (
          <>
            <ShortcutsDropdown />
            <NotificationDropdown settings={settings} />
          </>
        )}
        <UserDropdown settings={settings} />
      </Box>
    </Box>
  )
}

export default AppBarContent
