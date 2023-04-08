import { Avatar, Box, Button, Chip, Grid, IconButton, Rating, Stack, Tab, Typography } from '@mui/material'
import { getMaxTextLen } from 'src/helpers/functions'
import { BootstrapTooltip } from 'src/pages/companies'
import CustomAvatar from 'src/@core/components/mui/avatar'
import CustomChip from 'src/@core/components/mui/chip'
import Icon from 'src/@core/components/icon'
import { getInitials } from 'src/@core/utils/get-initials'
import TabContext from '@mui/lab/TabContext'
import TabList from '@mui/lab/TabList'

const ResumeCardHeader = ({
  tags,
  handleClickOpenAddCallDialog,
  handleClickOpenAddInterviewDialog,
  closeToggle,
  smActiveTab,
  handleSmTabChange,
  isSmallScreen
}: any) => {
  return (
    <>
      <IconButton size='small' onClick={closeToggle} sx={{ position: 'absolute', right: '0.05rem', top: '0.05rem' }}>
        <Icon icon='mdi:close' />
      </IconButton>
      {isSmallScreen && (
        <Grid
          xs={12}
          item
          sx={{
            p: '5px 15px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            borderRight: '1px solid rgba(76, 78, 100, 0.12)'
          }}
        >
          <TabContext value={smActiveTab}>
            <div style={{ padding: '0' }}>
              <TabList
                scrollButtons='auto'
                onChange={handleSmTabChange}
                aria-label='forced scroll tabs example'
                sx={{
                  borderBottom: theme => `1px solid ${theme.palette.divider}`
                }}
                centered
              >
                <Tab
                  value='resumedata'
                  label='Resume Data'
                  className={`${smActiveTab == 'resumedata' ? 'resume-active-tab' : ''} resume-tab`}
                />
                <Tab
                  value='comment'
                  label='Comment'
                  className={`${smActiveTab == 'comment' ? 'resume-active-tab' : ''} resume-tab`}
                />
              </TabList>
            </div>
          </TabContext>
        </Grid>
      )}
      <Grid
        lg={6}
        xs={12}
        item
        container
        sx={{
          textAlign: 'left',
          p: '5px 15px',
          alignItems: 'flex-start',
          borderRight: '1px solid rgba(76, 78, 100, 0.12)'
        }}
      >
        <Grid item mt={4} lg={6} xs={12}>
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
        </Grid>
        <Grid item mt={4} lg={6} xs={12} sx={{ textAlign: 'right' }}>
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
        </Grid>
        <Grid item mt={4} lg={6} xs={12}>
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
        </Grid>
        <Grid item mt={4} lg={6} xs={12} sx={{ textAlign: 'right' }}>
          <Rating readOnly value={4} sx={{ mr: 5 }} name='read-only' size='small' />
        </Grid>
      </Grid>
      <Grid lg={6} xs={12} item container sx={{ textAlign: 'left', p: 5 }}>
        <Grid item container lg={8} xs={12}>
          <Grid item xs={12}>
            <Typography variant='body2'>Asignee(s):</Typography>
            <Stack direction='row' spacing={1} mt={2} sx={{ display: 'flex', justifyContent: 'left' }}>
              <Chip label='Mani Mohammadi' avatar={<Avatar src='/images/avatars/7.png' alt='User Avatar' />} />
            </Stack>
          </Grid>
          <Grid item container xs={12} sx={{ textAlign: 'left' }} spacing={2}>
            <Grid item xs={12}>
              <Typography sx={{ mt: 7 }} variant='body2'>
                Interviewer(s):
              </Typography>
            </Grid>
            <Grid item>
              <Chip label='Mahdi Amereh' avatar={<Avatar src='/images/avatars/5.png' alt='User Avatar' />} />
            </Grid>
            <Grid item>
              <Chip label='Ali Akbar Rezaei' avatar={<Avatar src='/images/avatars/3.png' alt='User Avatar' />} />
            </Grid>
          </Grid>
        </Grid>
        <Grid
          item
          container
          lg={4}
          xs={12}
          mt={3}
          sx={{ display: 'flex', justifyContent: 'end', alignItems: 'inherit', flexDirection: 'column' }}
        >
          <Button
            onClick={handleClickOpenAddCallDialog}
            variant='outlined'
            color='secondary'
            startIcon={<Icon icon='ic:round-call' />}
            sx={{ fontSize: '0.75rem', p: 2 }}
          >
            Add Call History
          </Button>
          <Button
            onClick={handleClickOpenAddInterviewDialog}
            sx={{ mt: 3, fontSize: '0.75rem', p: 2 }}
            variant='outlined'
            color='secondary'
            startIcon={<Icon icon='mdi:virtual-meeting' />}
          >
            Add Interview
          </Button>
        </Grid>
      </Grid>
    </>
  )
}

export default ResumeCardHeader
