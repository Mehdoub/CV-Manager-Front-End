import TabContext from '@mui/lab/TabContext'
import TabList from '@mui/lab/TabList'
import TabPanel from '@mui/lab/TabPanel'
import CustomAvatar from 'src/@core/components/mui/avatar'
import CustomChip from 'src/@core/components/mui/chip'
import {
  Avatar,
  Box,
  BoxProps,
  Button,
  Chip,
  CircularProgress,
  Dialog,
  DialogContent,
  DialogTitle,
  Divider,
  Grid,
  IconButton,
  Rating,
  Stack,
  Tab,
  TextField,
  Typography,
  styled
} from '@mui/material'
import { SyntheticEvent, useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { useSelector } from 'react-redux'
import Icon from 'src/@core/components/icon'
import { getInitials } from 'src/@core/utils/get-initials'
import { getEntityIcon, getMaxTextLen, shuffle, uppercaseFirstLetters } from 'src/helpers/functions'
import { BootstrapTooltip } from 'src/pages/companies'
import { ChatsObj, ContactType, ProfileUserType } from 'src/types/apps/chatTypes'
import ChatLog from './ChatLog'

const previousDay = new Date(new Date().getTime() - 24 * 60 * 60 * 1000)
const dayBeforePreviousDay = new Date(new Date().getTime() - 24 * 60 * 60 * 1000 * 2)

const renderMsgFeedback = (isSender: boolean, feedback: any) => {
  if (isSender) {
    if (feedback.isSent && !feedback.isDelivered) {
      return (
        <Box component='span' sx={{ display: 'inline-flex', '& svg': { mr: 2, color: 'text.secondary' } }}>
          <Icon icon='mdi:check' fontSize='1rem' />
        </Box>
      )
    } else if (feedback.isSent && feedback.isDelivered) {
      return (
        <Box
          component='span'
          sx={{
            display: 'inline-flex',
            '& svg': { mr: 2, color: feedback.isSeen ? 'success.main' : 'text.secondary' }
          }}
        >
          <Icon icon='mdi:check-all' fontSize='1rem' />
        </Box>
      )
    } else {
      return null
    }
  }
}

const cahtExample = {
  id: 1,
  userId: 1,
  unseenMsgs: 1,
  chat: [
    {
      message: "How can we help? We're here for you!",
      time: '14 mins',
      senderId: 11,
      feedback: {
        isSent: true,
        isDelivered: true,
        isSeen: true
      }
    },
    {
      message:
        'Hey John, I am looking for the best admin template. Could you please help me to find it out? Hey John, I am looking for the best admin template. Could you please help me to find it out?',
      time: '1 hour',
      senderId: 1,
      feedback: {
        isSent: true,
        isDelivered: true,
        isSeen: true
      }
    },
    {
      message: 'It should be MUI v5 compatible.',
      time: '3 hours',
      senderId: 1,
      feedback: {
        isSent: true,
        isDelivered: true,
        isSeen: true
      }
    },
    {
      message: 'Absolutely!',
      time: '7 hours',
      senderId: 11,
      feedback: {
        isSent: true,
        isDelivered: true,
        isSeen: true
      }
    },
    {
      message: 'This admin template is built with MUI!',
      time: 'yesterday',
      senderId: 11,
      feedback: {
        isSent: true,
        isDelivered: true,
        isSeen: true
      }
    },
    {
      message: 'Looks clean and fresh UI. 😍',
      time: 'yesterday',
      senderId: 1,
      feedback: {
        isSent: true,
        isDelivered: true,
        isSeen: true
      }
    },
    {
      message: "It's perfect for my next project.",
      time: 'yesterday',
      senderId: 1,
      feedback: {
        isSent: true,
        isDelivered: true,
        isSeen: true
      }
    },
    {
      message: 'How can I purchase it?',
      time: 'yesterday',
      senderId: 1,
      feedback: {
        isSent: true,
        isDelivered: true,
        isSeen: true
      }
    },
    {
      message: 'Thanks, From our official site  😇',
      time: '2 days',
      senderId: 11,
      feedback: {
        isSent: true,
        isDelivered: true,
        isSeen: true
      }
    },
    {
      message: 'I will purchase it for sure. 👍',
      time: '3 days',
      senderId: 1,
      feedback: {
        isSent: true,
        isDelivered: true,
        isSeen: true
      }
    }
  ]
}

const ChatFormWrapper = styled(Box)<BoxProps>(({ theme }) => ({
  display: 'flex',
  borderRadius: 8,
  alignItems: 'center',
  boxShadow: theme.shadows[1],
  padding: theme.spacing(1.25, 4),
  justifyContent: 'space-between',
  backgroundColor: theme.palette.background.paper
}))

const Form = styled('form')(({ theme }) => ({
  padding: theme.spacing(0, 5, 5)
}))

interface ResumeCardViewDialogProps {
  open: boolean
  toggle: () => void
  resumeData: any
}

const tags = [
  {
    text: 'test',
    color: 'warning'
  },
  {
    text: 'hot',
    color: 'error'
  },
  {
    text: 'new',
    color: 'info'
  }
]

const ResumeCardViewDialog = ({ open, toggle, resumeData }: ResumeCardViewDialogProps) => {
  const isSender = false
  const [activeTab, setActiveTab] = useState<string>('details')
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [msg, setMsg] = useState<string>('')

  const dispatch = useDispatch()

  const handleSendMsg = (e: SyntheticEvent) => {
    e.preventDefault()
    setMsg('')
  }

  const handleChange = (e: any, value: string) => {
    setActiveTab(value)
  }

  let avatarId = 3

  return (
    <Dialog fullWidth maxWidth='90%' scroll='body' onClose={toggle} open={open}>
      <Grid container>
        <Grid xs item>
          <DialogTitle sx={{ textAlign: 'left' }}>
            <Stack direction={'row'} sx={{ justifyContent: 'space-between' }}>
              <span>
                <IconButton aria-label='capture screenshot'>
                  <Icon icon='material-symbols:arrow-back-ios-new-rounded' />
                </IconButton>
                <Button size='small' variant='contained' color='info'>
                  Technical Test
                </Button>
                <IconButton aria-label='capture screenshot'>
                  <Icon icon='material-symbols:arrow-forward-ios-rounded' />
                </IconButton>
              </span>
              <IconButton aria-label='capture screenshot'>
                <Icon style={{ fontSize: 30 }} icon='ic:round-more-horiz' />
              </IconButton>
            </Stack>
            <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
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
            <Stack direction='row' sx={{ justifyContent: 'space-between' }}>
              <Stack direction='row' spacing={1} mt={2}>
                {tags?.length > 0 &&
                  tags?.map((tag, index) => (
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
              <Rating readOnly value={4} sx={{ marginTop: 5 }} name='read-only' size='small' />
            </Stack>
          </DialogTitle>
        </Grid>
        <Divider sx={{ m: '0px 15px' }} orientation='vertical' flexItem />
        <Grid xs item>
          <DialogTitle sx={{ textAlign: 'left' }}>
            <Typography variant='body2'>Asignee(s):</Typography>
            <Stack direction='row' spacing={1} mt={2}>
              <Chip
                sx={{ ml: -1 }}
                label='Mani Mohammadi'
                avatar={<Avatar src='/images/avatars/7.png' alt='User Avatar' />}
              />
            </Stack>
            <Typography sx={{ mt: 7 }} variant='body2'>
              Interviewer(s):
            </Typography>
            <Stack direction='row' spacing={1} mt={2}>
              <Chip
                sx={{ ml: -1 }}
                label='Mahdi Amereh'
                avatar={<Avatar src='/images/avatars/5.png' alt='User Avatar' />}
              />
              <Chip
                sx={{ ml: -1 }}
                label='Ali Akbar Rezaei'
                avatar={<Avatar src='/images/avatars/3.png' alt='User Avatar' />}
              />
            </Stack>
          </DialogTitle>
        </Grid>
      </Grid>
      <Divider sx={{ m: '0px !important' }} />
      <DialogContent
        sx={{
          p: 0,
          // minHeight: '650px',
          pt: 0
        }}
      >
        <Grid container>
          <Grid xs item>
            <TabContext value={activeTab}>
              <div style={{ padding: '15px' }}>
                <TabList
                  variant='scrollable'
                  scrollButtons='auto'
                  onChange={handleChange}
                  aria-label='forced scroll tabs example'
                  sx={{ borderBottom: theme => `1px solid ${theme.palette.divider}` }}
                >
                  <Tab value='details' label='Details' icon={<Icon icon='mdi:account-outline' />} />
                  <Tab value='file' label='File' icon={<Icon icon='pepicons-pop:cv' />} />
                  <Tab value='interview' label='Interviews' icon={<Icon icon='mdi:virtual-meeting' />} />
                  <Tab value='call' label='Calls' icon={<Icon icon='material-symbols:call' />} />
                </TabList>
                <Box sx={{ mt: 6 }}>
                  {isLoading ? (
                    <Box sx={{ mt: 6, display: 'flex', alignItems: 'center', flexDirection: 'column' }}>
                      <CircularProgress sx={{ mb: 4 }} />
                      <Typography>Loading...</Typography>
                    </Box>
                  ) : (
                    <>
                      <TabPanel sx={{ p: 0 }} value='details'>
                        <h5>There Is Nothing To Show Details ...</h5>
                      </TabPanel>
                      <TabPanel sx={{ p: 0 }} value='file'>
                        <h5>There Is Nothing To Show File ...</h5>
                      </TabPanel>
                      <TabPanel sx={{ p: 0 }} value='interview'>
                        <h5>There Is Nothing To Show Interview ...</h5>
                      </TabPanel>
                      <TabPanel sx={{ p: 0 }} value='call'>
                        <h5>There Is Nothing To Show Calls ...</h5>
                      </TabPanel>
                    </>
                  )}
                </Box>
              </div>
            </TabContext>
          </Grid>
          <Divider sx={{ minHeight: '600px', m: '0px' }} orientation='vertical' flexItem />
          <Grid xs item container sx={{ backgroundColor: '#4c4e640d', display: 'flex', alignItems: 'end' }}>
            <Grid md={12} item className='chat-body' sx={{ maxHeight: '500px', overflowY: 'scroll', p: 4 }}>
              {cahtExample.chat.map((chat: any, index: number, { length }: { length: number }) => {
                avatarId = avatarId == 3 ? 5 : 3
                return (
                  <Box
                    sx={{
                      display: 'flex',
                      flexDirection: !isSender ? 'row' : 'row-reverse',
                      p: 2
                    }}
                  >
                    <div>
                      <CustomAvatar
                        skin='light'
                        color={'error'}
                        sx={{
                          width: '2.45rem',
                          height: '2.45rem',
                          fontSize: '0.875rem',
                          ml: isSender ? 4 : undefined,
                          mr: !isSender ? 4 : undefined
                        }}
                        {...{
                          src: `/images/avatars/${avatarId}.png`,
                          alt: 'John Doe'
                        }}
                      >
                        {getInitials('John Doe')}
                      </CustomAvatar>
                    </div>
                    <Box
                      key={index}
                      sx={{
                        '&:not(:last-of-type)': { mb: 3.5 },
                        width: '100%',
                        border: 'solid rgba(76, 78, 100, 0.12) 1px',
                        borderRadius: 1,
                        backgroundColor: 'background.paper',
                        color: 'text.primary'
                      }}
                    >
                      <div>
                        <div
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between'
                          }}
                        >
                          <Typography
                            sx={{
                              fontSize: '0.875rem',
                              p: theme => theme.spacing(3, 4),
                              color: 'primary.main'
                              // backgroundColor: 'primary.main',
                            }}
                          >
                            Mahdi Amereh
                          </Typography>
                          <Typography variant='caption' sx={{ color: 'text.disabled', mr: 2 }}>
                            {chat.time}
                          </Typography>
                        </div>
                        <Typography
                          sx={{
                            fontSize: '0.875rem',
                            fontWeight: 500,
                            p: theme => theme.spacing(3, 4)
                            // color: 'common.white',
                            // backgroundColor: 'primary.main',
                          }}
                        >
                          {chat.message}
                        </Typography>
                      </div>
                      <Box
                        sx={{
                          mt: 1,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: isSender ? 'flex-end' : 'flex-start'
                        }}
                      >
                        {renderMsgFeedback(isSender, chat.feedback)}
                      </Box>
                    </Box>
                  </Box>
                )
              })}
            </Grid>

            <Grid md={12} item>
              <Form onSubmit={handleSendMsg}>
                <ChatFormWrapper>
                  <Box sx={{ flexGrow: 1, display: 'flex', alignItems: 'center' }}>
                    <TextField
                      fullWidth
                      value={msg}
                      size='small'
                      placeholder='Type your message here…'
                      onChange={e => setMsg(e.target.value)}
                      sx={{ '& .MuiOutlinedInput-input': { pl: 0 }, '& fieldset': { border: '0 !important' } }}
                    />
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <IconButton size='small' sx={{ mr: 1.5, color: 'text.primary' }}>
                      <Icon icon='mdi:microphone' fontSize='1.375rem' />
                    </IconButton>
                    <IconButton
                      size='small'
                      component='label'
                      htmlFor='upload-img'
                      sx={{ mr: 2.75, color: 'text.primary' }}
                    >
                      <Icon icon='mdi:attachment' fontSize='1.375rem' />
                      <input hidden type='file' id='upload-img' />
                    </IconButton>
                    <Button type='submit' variant='contained'>
                      Send
                    </Button>
                  </Box>
                </ChatFormWrapper>
              </Form>
            </Grid>
          </Grid>
        </Grid>
      </DialogContent>
    </Dialog>
  )
}

export default ResumeCardViewDialog
