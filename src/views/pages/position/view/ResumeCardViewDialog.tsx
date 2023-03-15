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

const data: { chats: ChatsObj[]; contacts: ContactType[]; profileUser: ProfileUserType } = {
  profileUser: {
    id: 11,
    avatar: '/images/avatars/1.png',
    fullName: 'John Doe',
    role: 'admin',
    about:
      'Dessert chocolate cake lemon drops jujubes. Biscuit cupcake ice cream bear claw brownie brownie marshmallow.',
    status: 'online',
    settings: {
      isTwoStepAuthVerificationEnabled: true,
      isNotificationsOn: false
    }
  },
  contacts: [
    {
      id: 1,
      fullName: 'Felecia Rower',
      role: 'Frontend Developer',
      about: 'Cake pie jelly jelly beans. Marzipan lemon drops halvah cake. Pudding cookie lemon drops icing',
      avatar: '/images/avatars/2.png',
      status: 'offline'
    },
    {
      id: 2,
      fullName: 'Adalberto Granzin',
      role: 'UI/UX Designer',
      avatarColor: 'primary',
      about:
        'Toffee caramels jelly-o tart gummi bears cake I love ice cream lollipop. Sweet liquorice croissant candy danish dessert icing. Cake macaroon gingerbread toffee sweet.',
      status: 'busy'
    },
    {
      id: 3,
      fullName: 'Joaquina Weisenborn',
      role: 'Town planner',
      about:
        'Soufflé soufflé caramels sweet roll. Jelly lollipop sesame snaps bear claw jelly beans sugar plum sugar plum.',
      avatar: '/images/avatars/8.png',
      status: 'busy'
    },
    {
      id: 4,
      fullName: 'Verla Morgano',
      role: 'Data scientist',
      about:
        'Chupa chups candy canes chocolate bar marshmallow liquorice muffin. Lemon drops oat cake tart liquorice tart cookie. Jelly-o cookie tootsie roll halvah.',
      avatar: '/images/avatars/3.png',
      status: 'online'
    },
    {
      id: 5,
      fullName: 'Margot Henschke',
      role: 'Dietitian',
      avatarColor: 'success',
      about: 'Cake pie jelly jelly beans. Marzipan lemon drops halvah cake. Pudding cookie lemon drops icing',
      status: 'busy'
    },
    {
      id: 6,
      fullName: 'Sal Piggee',
      role: 'Marketing executive',
      about:
        'Toffee caramels jelly-o tart gummi bears cake I love ice cream lollipop. Sweet liquorice croissant candy danish dessert icing. Cake macaroon gingerbread toffee sweet.',
      avatar: '/images/avatars/5.png',
      status: 'online'
    },
    {
      id: 7,
      fullName: 'Miguel Guelff',
      role: 'Special educational needs teacher',
      about:
        'Biscuit powder oat cake donut brownie ice cream I love soufflé. I love tootsie roll I love powder tootsie roll.',
      avatar: '/images/avatars/7.png',
      status: 'online'
    },
    {
      id: 8,
      fullName: 'Mauro Elenbaas',
      role: 'Advertising copywriter',
      about:
        'Bear claw ice cream lollipop gingerbread carrot cake. Brownie gummi bears chocolate muffin croissant jelly I love marzipan wafer.',
      avatar: '/images/avatars/6.png',
      status: 'away'
    },
    {
      id: 9,
      avatarColor: 'warning',
      fullName: 'Bridgett Omohundro',
      role: 'Designer, television/film set',
      about:
        'Gummies gummi bears I love candy icing apple pie I love marzipan bear claw. I love tart biscuit I love candy canes pudding chupa chups liquorice croissant.',
      status: 'offline'
    },
    {
      id: 10,
      avatarColor: 'error',
      fullName: 'Zenia Jacobs',
      role: 'Building surveyor',
      about: 'Cake pie jelly jelly beans. Marzipan lemon drops halvah cake. Pudding cookie lemon drops icing',
      status: 'away'
    }
  ],
  chats: [
    {
      id: 1,
      userId: 1,
      unseenMsgs: 1,
      chat: [
        {
          message: "How can we help? We're here for you!",
          time: 'Mon Dec 10 2018 07:45:00 GMT+0000 (GMT)',
          senderId: 11,
          feedback: {
            isSent: true,
            isDelivered: true,
            isSeen: true
          }
        },
        {
          message: 'Hey John, I am looking for the best admin template. Could you please help me to find it out?',
          time: 'Mon Dec 10 2018 07:45:23 GMT+0000 (GMT)',
          senderId: 1,
          feedback: {
            isSent: true,
            isDelivered: true,
            isSeen: true
          }
        },
        {
          message: 'It should be MUI v5 compatible.',
          time: 'Mon Dec 10 2018 07:45:55 GMT+0000 (GMT)',
          senderId: 1,
          feedback: {
            isSent: true,
            isDelivered: true,
            isSeen: true
          }
        },
        {
          message: 'Absolutely!',
          time: 'Mon Dec 10 2018 07:46:00 GMT+0000 (GMT)',
          senderId: 11,
          feedback: {
            isSent: true,
            isDelivered: true,
            isSeen: true
          }
        },
        {
          message: 'This admin template is built with MUI!',
          time: 'Mon Dec 10 2018 07:46:05 GMT+0000 (GMT)',
          senderId: 11,
          feedback: {
            isSent: true,
            isDelivered: true,
            isSeen: true
          }
        },
        {
          message: 'Looks clean and fresh UI. 😍',
          time: 'Mon Dec 10 2018 07:46:23 GMT+0000 (GMT)',
          senderId: 1,
          feedback: {
            isSent: true,
            isDelivered: true,
            isSeen: true
          }
        },
        {
          message: "It's perfect for my next project.",
          time: 'Mon Dec 10 2018 07:46:33 GMT+0000 (GMT)',
          senderId: 1,
          feedback: {
            isSent: true,
            isDelivered: true,
            isSeen: true
          }
        },
        {
          message: 'How can I purchase it?',
          time: 'Mon Dec 10 2018 07:46:43 GMT+0000 (GMT)',
          senderId: 1,
          feedback: {
            isSent: true,
            isDelivered: true,
            isSeen: true
          }
        },
        {
          message: 'Thanks, From our official site  😇',
          time: 'Mon Dec 10 2018 07:46:53 GMT+0000 (GMT)',
          senderId: 11,
          feedback: {
            isSent: true,
            isDelivered: true,
            isSeen: true
          }
        },
        {
          message: 'I will purchase it for sure. 👍',
          time: previousDay,
          senderId: 1,
          feedback: {
            isSent: true,
            isDelivered: true,
            isSeen: true
          }
        }
      ]
    },
    {
      id: 2,
      userId: 2,
      unseenMsgs: 0,
      chat: [
        {
          message: 'Hi',
          time: 'Mon Dec 10 2018 07:45:00 GMT+0000 (GMT)',
          senderId: 11,
          feedback: {
            isSent: true,
            isDelivered: true,
            isSeen: true
          }
        },
        {
          message: 'Hello. How can I help You?',
          time: 'Mon Dec 11 2018 07:45:15 GMT+0000 (GMT)',
          senderId: 2,
          feedback: {
            isSent: true,
            isDelivered: true,
            isSeen: true
          }
        },
        {
          message: 'Can I get details of my last transaction I made last month? 🤔',
          time: 'Mon Dec 11 2018 07:46:10 GMT+0000 (GMT)',
          senderId: 11,
          feedback: {
            isSent: true,
            isDelivered: true,
            isSeen: true
          }
        },
        {
          message: 'We need to check if we can provide you such information.',
          time: 'Mon Dec 11 2018 07:45:15 GMT+0000 (GMT)',
          senderId: 2,
          feedback: {
            isSent: true,
            isDelivered: true,
            isSeen: true
          }
        },
        {
          message: 'I will inform you as I get update on this.',
          time: 'Mon Dec 11 2018 07:46:15 GMT+0000 (GMT)',
          senderId: 2,
          feedback: {
            isSent: true,
            isDelivered: true,
            isSeen: true
          }
        },
        {
          message: 'If it takes long you can mail me at my mail address.',
          time: dayBeforePreviousDay,
          senderId: 11,
          feedback: {
            isSent: true,
            isDelivered: false,
            isSeen: false
          }
        }
      ]
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
          <Grid xs item sx={{ backgroundColor: '#4c4e640d', display: 'flex', alignItems: 'end' }}>
            <ChatLog hidden={false} data={data} />
            <Grid md={12}>
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
