import { Box, Card, CircularProgress, Grid, Tab, Theme, Typography, useMediaQuery } from '@mui/material'
// import { notifications } from 'src/layouts/components/vertical/AppBarContent'
import Icon from 'src/@core/components/icon'
import CustomAvatar from 'src/@core/components/mui/avatar'
import TabContext from '@mui/lab/TabContext'
import TabList from '@mui/lab/TabList'
import { useEffect, useState } from 'react'
import BootstrapTooltip from 'src/@core/components/bootstrap-tooltip'
import MarkChatReadIcon from '@mui/icons-material/MarkChatRead'
import MarkChatUnreadIcon from '@mui/icons-material/MarkChatUnread'
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive'
import { useSelector } from 'react-redux'
import { useDispatch } from 'react-redux'
import { getNotifications, seenNotifications } from 'src/store/profile'

const NotificationsTab = () => {
  const dispatch = useDispatch()

  const { data: latestNotifications, loading: loadingLatestNotifications } = useSelector(
    (state: any) => state.profileNotifications
  )

  useEffect(() => {
    if (!loadingLatestNotifications) dispatch(getNotifications({ page: 1, size: 100, state: 'unread' }))
    dispatch(seenNotifications())
  }, [])

  return (
    <Grid
      container
      sx={{
        p: '5px 15px',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
      }}
      spacing={2}
    >
      {/* <TabContext value={activeTab}>
        <div style={{ padding: '0', marginBottom: '20px', width: '100%' }}>
          <TabList
            variant='scrollable'
            scrollButtons='auto'
            onChange={handleChange}
            aria-label='customized tabs example'
            centered
            sx={{
              width: '100%',
              '& .MuiTabs-flexContainer': {
                display: 'flex',
                justifyContent: 'center'
              }
            }}
          >
            <Tab
              value='new'
              label={
                <Box sx={{ display: 'flex', alignItems: 'center', ...(!hideText && { '& svg': { mr: 2 } }) }}>
                  <MarkChatUnreadIcon />
                  {!hideText && 'new'}
                </Box>
              }
            />
            <Tab
              value='read'
              label={
                <Box sx={{ display: 'flex', alignItems: 'center', ...(!hideText && { '& svg': { mr: 2 } }) }}>
                  <MarkChatReadIcon />
                  {!hideText && 'read'}
                </Box>
              }
            />
          </TabList>
        </div>
      </TabContext> */}
      {loadingLatestNotifications ? (
        <CircularProgress />
      ) : latestNotifications?.docs?.length > 0 ? (
        latestNotifications?.docs?.map((notification: any, index: number) => (
          <Grid key={`notification-${index}`} item sx={{ width: '100%' }}>
            <Card
              sx={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                p: 5,
                cursor: 'pointer',
                '&:hover': {
                  boxShadow: '0px 2px 10px 5px rgb(76 78 100 / 22%)'
                }
              }}
            >
              {/* <RenderAvatar notification={notification} /> */}
              <CustomAvatar color='primary' skin='light' alt='Notification Icon' sx={{ mr: 3, width: 40, height: 40 }}>
                <NotificationsActiveIcon fontSize='large' />
              </CustomAvatar>
              <Box sx={{ mx: 4, flex: '1 1', display: 'flex', overflow: 'hidden', flexDirection: 'column' }}>
                <Typography fontWeight={600}>{notification?.title}</Typography>
                <Typography variant='body2'>{notification?.body}</Typography>
              </Box>
            </Card>
          </Grid>
        ))
      ) : (
        <Typography variant='body2' mt={5}>
          There Is No Any Notification To Show Here :)
        </Typography>
      )}
    </Grid>
  )
}

export default NotificationsTab
