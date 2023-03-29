import TabContext from '@mui/lab/TabContext'
import TabList from '@mui/lab/TabList'
import TabPanel from '@mui/lab/TabPanel'
import CustomAvatar from 'src/@core/components/mui/avatar'
import CustomChip from 'src/@core/components/mui/chip'
import { Box, Button, CircularProgress, Grid, IconButton, Rating, Stack, Tab, Typography, styled } from '@mui/material'
import { SyntheticEvent, useEffect, useRef, useState, MouseEvent } from 'react'
import { useDispatch } from 'react-redux'
import Icon from 'src/@core/components/icon'
import { getInitials } from 'src/@core/utils/get-initials'
import { getMaxTextLen } from 'src/helpers/functions'
import { BootstrapTooltip } from 'src/pages/companies'
import ResumeDetailsTab from './ResumeDetailsTab'
import ResumeCallsTab from './ResumeCallsTab'

import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import MuiMenu, { MenuProps } from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'

// Styled Menu component
const Menu = styled(MuiMenu)<MenuProps>(({ theme }) => ({
  '& .MuiMenu-paper': {
    border: `1px solid ${theme.palette.divider}`
  }
}))

const ResumeViewLeftDialog = ({ handleClickOpenAddCallDialog, activeTab, tags, handleTabChange }: any) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)

  const handleClick = (event: MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleCloseMoreMenu = () => {
    setAnchorEl(null)
  }

  return (
    <>
      <Grid xs item sx={{ textAlign: 'left', p: '5px 15px', mt: 5 }}>
        <Box sx={{ display: 'flex', alignItems: 'start', justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
            <CustomAvatar skin='light' color='primary' sx={{ mr: 3, width: 55, height: 55, fontSize: '1rem' }}>
              {getInitials('Mahdi Mehrjoo')}
            </CustomAvatar>
            <Box sx={{ display: 'flex', alignItems: 'flex-start', flexDirection: 'column' }}>
              <Typography fontSize={18} fontWeight={500}>
                Mahdi Mehrjoo
              </Typography>
              <Typography variant='body2'>Favin • BPM</Typography>
            </Box>
          </Box>
          <Box>
            <IconButton aria-label='capture screenshot'>
              <Icon icon='material-symbols:arrow-back-ios-new-rounded' />
            </IconButton>
            <Button size='small' variant='contained' color='info'>
              Technical Test
            </Button>
            <IconButton aria-label='capture screenshot'>
              <Icon icon='material-symbols:arrow-forward-ios-rounded' />
            </IconButton>
          </Box>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'end', justifyContent: 'space-between' }}>
          <Stack direction='row' spacing={1} mt={2}>
            {tags?.length > 0 &&
              tags?.map((tag: any, index: any) => (
                <>
                  <BootstrapTooltip placement='top' title={tag.text}>
                    <div>
                      <CustomChip
                        size='small'
                        label={getMaxTextLen(tag.text)}
                        skin='light'
                        color={tag.color as any}
                        sx={{
                          fontSize: 12,
                          height: 22,
                          borderBottomLeftRadius: 0,
                          borderTopLeftRadius: 0
                        }}
                      />
                    </div>
                  </BootstrapTooltip>
                  {tags?.length == index + 1 && (
                    <IconButton
                      aria-label='capture screenshot'
                      sx={{ border: '1px dashed gray', width: '35px', height: '35px' }}
                    >
                      <Icon icon='mdi:tag-plus' />
                    </IconButton>
                  )}
                </>
              ))}
          </Stack>
          <Rating readOnly value={4} sx={{ mr: 5 }} name='read-only' size='small' />
        </Box>
      </Grid>
      <Grid xs item>
        <TabContext value={activeTab}>
          <div style={{ padding: '0' }}>
            <TabList
              variant='scrollable'
              scrollButtons='auto'
              onChange={handleTabChange}
              aria-label='forced scroll tabs example'
              sx={{
                borderBottom: theme => `1px solid ${theme.palette.divider}`
                // , width: '360px'
              }}
            >
              <Tab
                value='details'
                label='Details'
                className={`${activeTab == 'details' ? 'resume-active-tab' : ''} resume-tab`}
              />
              <Tab
                value='file'
                label='Interview'
                className={`${activeTab == 'file' ? 'resume-active-tab' : ''} resume-tab`}
              />
              <Tab
                value='interview'
                label='File'
                className={`${activeTab == 'interview' ? 'resume-active-tab' : ''} resume-tab`}
              />
              <Tab
                value='call'
                label='Call'
                className={`${activeTab == 'call' ? 'resume-active-tab' : ''} resume-tab`}
              />
            </TabList>
            <Box sx={{ height: '710px' }}>
              <>
                <TabPanel sx={{ p: 0, mt: 6 }} value='details'>
                  <ResumeDetailsTab />
                </TabPanel>
                <TabPanel sx={{ p: 0 }} value='file'>
                  <h5>There Is Nothing To Show File ...</h5>
                </TabPanel>
                <TabPanel sx={{ p: 0 }} value='interview'>
                  <h5>There Is Nothing To Show Interview ...</h5>
                </TabPanel>
                <TabPanel sx={{ p: 0 }} value='call'>
                  <ResumeCallsTab />
                </TabPanel>
              </>
            </Box>
          </div>
        </TabContext>
      </Grid>
    </>
  )
}

export default ResumeViewLeftDialog
