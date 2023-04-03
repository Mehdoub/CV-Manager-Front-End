import TabContext from '@mui/lab/TabContext'
import TabList from '@mui/lab/TabList'
import TabPanel from '@mui/lab/TabPanel'
import { Box, Grid, Tab, styled } from '@mui/material'
import { useState, MouseEvent } from 'react'
import ResumeDetailsTab from './ResumeDetailsTab'
import ResumeCallsTab from './ResumeCallsTab'

import MuiMenu, { MenuProps } from '@mui/material/Menu'

// Styled Menu component
const Menu = styled(MuiMenu)<MenuProps>(({ theme }) => ({
  '& .MuiMenu-paper': {
    border: `1px solid ${theme.palette.divider}`
  }
}))

const ResumeViewLeftDialog = ({ handleClickOpenAddCallDialog, activeTab, tags, handleTabChange }: any) => {
  return (
    <>
      <Grid xs={12} item>
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
            <Box sx={{ height: '65vh', overflowY: 'scroll' }}>
              <>
                <TabPanel sx={{ p: 0, mt: 6 }} value='details'>
                  <ResumeDetailsTab />
                </TabPanel>
                <TabPanel sx={{ p: 0 }} value='file'>
                  <Grid xs={12} container>
                    <h5>There Is Nothing To Show File ...</h5>
                  </Grid>
                </TabPanel>
                <TabPanel sx={{ p: 0 }} value='interview'>
                  <Grid xs={12} container>
                    <h5>There Is Nothing To Show Interview ...</h5>
                  </Grid>
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
