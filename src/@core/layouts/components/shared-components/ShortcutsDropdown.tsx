// ** React Imports
import { useState, SyntheticEvent, Fragment, ReactNode } from 'react'

// ** Next Import
import Link from 'next/link'

// ** MUI Imports
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Divider from '@mui/material/Divider'
import Tooltip from '@mui/material/Tooltip'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import { styled, Theme } from '@mui/material/styles'
import useMediaQuery from '@mui/material/useMediaQuery'
import MuiMenu, { MenuProps } from '@mui/material/Menu'
import MuiMenuItem, { MenuItemProps } from '@mui/material/MenuItem'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Third Party Components
import PerfectScrollbarComponent from 'react-perfect-scrollbar'

// ** Type Imports
import { Settings } from 'src/@core/context/settingsContext'

// ** Custom Components Imports
import CustomAvatar from 'src/@core/components/mui/avatar'
import { useSelector } from 'react-redux'
import { getEntityIcon, getObjectKeys } from 'src/helpers/functions'
import AddCompanyDrawer from 'src/views/pages/company/list/AddCompanyDrawer'
import SidebarAddProject from 'src/views/pages/project/list/AddProjectDrawer'
import AddPositionDrawer from 'src/views/pages/position/list/AddPositionDrawer'
import { useSettings } from 'src/@core/hooks/useSettings'
import AddResumeDialog from 'src/views/pages/position/view/AddResumeDialog'

export type ShortcutsType = {
  onclick: () => void
  icon: string
  title: string
}

// ** Styled Menu component
const Menu = styled(MuiMenu)<MenuProps>(({ theme }) => ({
  '& .MuiMenu-paper': {
    width: 350,
    overflow: 'hidden',
    marginTop: theme.spacing(4),
    [theme.breakpoints.down('sm')]: {
      width: '100%'
    }
  },
  '& .MuiMenu-list': {
    padding: 0
  }
}))

// ** Styled MenuItem component
const MenuItem = styled(MuiMenuItem)<MenuItemProps>(({ theme }) => ({
  paddingTop: theme.spacing(3),
  paddingBottom: theme.spacing(3),
  '&:not(:last-of-type)': {
    borderBottom: `1px solid ${theme.palette.divider}`
  }
}))

// ** Styled PerfectScrollbar component
const PerfectScrollbar = styled(PerfectScrollbarComponent)({
  maxHeight: '30rem'
})

const ScrollWrapper = ({ children, hidden }: { children: ReactNode; hidden: boolean }) => {
  if (hidden) {
    return <Box sx={{ maxHeight: '30rem', overflowY: 'auto', overflowX: 'hidden' }}>{children}</Box>
  } else {
    return <PerfectScrollbar options={{ wheelPropagation: false, suppressScrollX: true }}>{children}</PerfectScrollbar>
  }
}

const ShortcutsDropdown = () => {
  // ** States
  const [anchorEl, setAnchorEl] = useState<(EventTarget & Element) | null>(null)
  const [addCompanyOpen, setAddCompanyOpen] = useState<boolean>(false)
  const [addProjectOpen, setAddProjectOpen] = useState<boolean>(false)
  const [addPositionOpen, setAddPositionOpen] = useState<boolean>(false)
  const [addResumeOpen, setAddResumeOpen] = useState<boolean>(false)

  const toggleAddCompanyDrawer = () => setAddCompanyOpen(!addCompanyOpen)
  const toggleAddProjectDrawer = () => setAddProjectOpen(!addProjectOpen)
  const toggleAddPositionDrawer = () => setAddPositionOpen(!addPositionOpen)
  const toggleAddResumeDialog = () => setAddResumeOpen(!addResumeOpen)

  const shortcuts = [
    { icon: getEntityIcon('companies'), title: 'Create New Company', onclick: toggleAddCompanyDrawer },
    { icon: getEntityIcon('projects'), title: 'Create New Project', onclick: toggleAddProjectDrawer },
    { icon: getEntityIcon('positions'), title: 'Create New Position', onclick: toggleAddPositionDrawer },
    { icon: getEntityIcon('resumes'), title: 'Create New Resume', onclick: toggleAddResumeDialog }
  ]

  // ** Hook
  const hidden = useMediaQuery((theme: Theme) => theme.breakpoints.down('lg'))
  const { data: constants } = useSelector((state: any) => state.constants)
  const { data: provinces } = useSelector((state: any) => state.provinces)

  // ** Vars
  const settings: any = useSettings()
  const { direction } = settings

  const handleDropdownOpen = (event: SyntheticEvent) => {
    setAnchorEl(event.currentTarget)
  }

  const handleDropdownClose = () => {
    setAnchorEl(null)
  }

  return (
    <Fragment>
      <IconButton color='inherit' aria-haspopup='true' onClick={handleDropdownOpen} aria-controls='customized-menu'>
        <Icon icon='mdi:view-grid-outline' />
      </IconButton>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleDropdownClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: direction === 'ltr' ? 'right' : 'left' }}
        transformOrigin={{ vertical: 'top', horizontal: direction === 'ltr' ? 'right' : 'left' }}
      >
        <MenuItem
          disableRipple
          disableTouchRipple
          sx={{ cursor: 'default', userSelect: 'auto', backgroundColor: 'transparent !important' }}
        >
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
            <Typography sx={{ fontSize: '1.125rem', color: 'text.secondary', fontWeight: 600 }}>Shortcuts</Typography>
            {/* <Tooltip title='Add Shortcut' placement='top'>
              <IconButton disableRipple>
                <Icon icon='mdi:plus-circle-outline' />
              </IconButton>
            </Tooltip> */}
          </Box>
        </MenuItem>
        <Divider sx={{ my: '0 !important' }} />
        {/* <ScrollWrapper hidden={hidden}> */}
          <Grid
            container
            spacing={0}
            sx={{
              '& .MuiGrid-root': {
                borderBottom: theme => `1px solid ${theme.palette.divider}`,
                '&:nth-of-type(odd)': { borderRight: theme => `1px solid ${theme.palette.divider}` }
              }
            }}
          >
            {shortcuts.map((shortcut: any) => {
              const IconComponent = shortcut.icon
              return (
                <Grid
                  item
                  xs={6}
                  key={shortcut.title}
                  onClick={handleDropdownClose}
                  sx={{ cursor: 'pointer', '&:hover': { backgroundColor: 'action.hover' } }}
                >
                  <Box
                    // component={Link}
                    // href={shortcut.url}
                    onClick={() => shortcut.onclick()}
                    sx={{
                      p: 6,
                      display: 'flex',
                      textAlign: 'center',
                      alignItems: 'center',
                      textDecoration: 'none',
                      flexDirection: 'column',
                      justifyContent: 'center'
                    }}
                  >
                    <CustomAvatar skin='light' color='secondary' sx={{ mb: 2, width: 50, height: 50 }}>
                      <IconComponent />
                    </CustomAvatar>
                    <Typography sx={{ fontWeight: 600, color: 'text.secondary' }}>{shortcut.title}</Typography>
                    {/* <Typography variant='body2' sx={{ color: 'text.disabled' }}>
                      {shortcut.subtitle}
                    </Typography> */}
                  </Box>
                </Grid>
              )
            })}
          </Grid>
        {/* </ScrollWrapper> */}
      </Menu>
      {getObjectKeys(constants?.system)?.length > 0 && (
        <>
          <AddCompanyDrawer open={addCompanyOpen} toggle={toggleAddCompanyDrawer} />
          <SidebarAddProject open={addProjectOpen} toggle={toggleAddProjectDrawer} />
          <AddPositionDrawer open={addPositionOpen} toggle={toggleAddPositionDrawer} />
          {provinces?.length && <AddResumeDialog open={addResumeOpen} handleClose={toggleAddResumeDialog} />}
        </>
      )}
    </Fragment>
  )
}

export default ShortcutsDropdown
