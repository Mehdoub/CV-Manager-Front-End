import Grid from '@mui/material/Grid'
import ProjectResumeListTable from './ResumeListTable'
import { DragDropContext, Droppable } from 'react-beautiful-dnd'
import {
  Avatar,
  AvatarGroup,
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  Chip,
  Paper,
  Rating,
  Stack,
  Typography,
  styled
} from '@mui/material'
import Icon from 'src/@core/components/icon'
import CustomChip from 'src/@core/components/mui/chip'
import CustomAvatar from 'src/@core/components/mui/avatar'
import { getInitials } from 'src/@core/utils/get-initials'
import { BootstrapTooltip } from 'src/pages/companies'
import { getColorCodes, getMaxTextLen, uppercaseFirstLetters } from 'src/helpers/functions'

const itemsArr = ['New', 'Reviewd', 'Call Interview', 'Technical Test', 'Hired', 'Rejected']

const cards = [
  {
    id: 1,
    title: 'Mahdi Mehrjoo',
    label: 'Laravel Developer',
    color: 'info',
    interview: 'tomorrow 15:00',
    interviewColor: 'success',
    tags: [
      {
        text: 'test',
        color: 'warning'
      },
      {
        text: 'hot',
        color: 'error'
      }
    ],
    moreTags: 2
  },
  {
    id: 2,
    title: 'Ali Hamzehei Tabrizi',
    label: 'Laravel Developer',
    color: 'info',
    interview: 'right now',
    interviewColor: 'error',
    tags: [],
    moreTags: 0
  },
  {
    id: 3,
    title: 'Amin Paapi',
    label: 'Information',
    color: 'info',
    interview: 'right now',
    interviewColor: 'error',
    tags: [],
    moreTags: 0
  },
  {
    id: 4,
    title: 'Aliakbar Rezaei',
    label: 'Information',
    color: 'info',
    interview: 'yesterday 11:00',
    interviewColor: 'warning',
    tags: [],
    moreTags: 0
  },
  {
    id: 5,
    title: 'Mahdi Amereh',
    label: 'Information',
    color: 'info',
    interview: 'yesterday 11:00',
    interviewColor: 'warning',
    tags: [],
    moreTags: 0
  }
]

const asignees = [
  {
    id: 1,
    title: 'Mahdi Mehrjoo'
  },
  {
    id: 2,
    title: 'Ali Hamzehei'
  },
  {
    id: 3,
    title: 'Amin Paapi'
  },
  {
    id: 4,
    title: 'Aliakbar Rezaei'
  }
]

const ProjectViewResumes = () => {
  return (
    <>
      {/* <Typography variant='h5' sx={{ mb: 1, ml: 6 }}>
        Resumes For This Position
      </Typography> */}
      {/* <Grid container spacing={6} sx={{ overflowX: 'scroll' }}> */}
      <Stack direction='row' spacing={-3} sx={{ overflowX: 'scroll', pr: 3, pb: 20, pt: 0, pl: 0 }}>
        {itemsArr.map(item => (
          <>
            {/* #F7F7F9 rgba(76, 78, 100, 0.05) */}
            <Card
              className='hide-scrollbar'
              sx={{
                minWidth: 300,
                maxHeight: 720,
                backgroundColor: '#F7F7F9',
                overflowY: 'scroll',
                boxShadow: 'none',
                position: 'relative'
                // borderRight: '1px solid rgba(76, 78, 100, 0.12)'
              }}
            >
              <Typography
                sx={{
                  fontSize: 16,
                  fontWeight: 500,
                  textAlign: 'left',
                  p: 5,
                  pb: 0,
                  pt: 0,
                  // color: '#000',
                  top: '0',
                  position: 'sticky',
                  height: '30px',
                  backgroundColor: '#F7F7F9',
                  zIndex: 100
                  // borderBottom: '1px solid rgba(76, 78, 100, 0.12)'
                }}
              >
                {item}
              </Typography>
              {cards.map(card => (
                <Card
                  className='hover-shadow'
                  sx={{
                    m: 4,
                    cursor: 'pointer',
                    boxShadow: 'none',
                    position: 'relative'
                  }}
                >
                  <Typography
                    sx={{
                      fontSize: 14,
                      fontWeight: 500,
                      textAlign: 'left',
                      p: 3
                      // color: '#000',
                    }}
                  >
                    <Box
                      sx={{
                        gap: 2,
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        mb: 3
                      }}
                    >
                      <CustomChip
                        rounded
                        size='small'
                        label={card.label}
                        skin='light'
                        color={card.color as any}
                        sx={{ fontSize: 10, height: 19 }}
                      />
                      <Rating readOnly value={3} name='read-only' size='small' />
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <CustomAvatar
                        skin='light'
                        color='primary'
                        sx={{ mr: 3, width: 35, height: 35, fontSize: '0.85rem' }}
                      >
                        {getInitials(card.title)}
                      </CustomAvatar>
                      <Box sx={{ display: 'flex', alignItems: 'flex-start', flexDirection: 'column' }}>
                        <BootstrapTooltip title={card.title} placement='top'>
                          <Typography fontSize={13} fontWeight={500}>
                            {getMaxTextLen(card.title)}
                          </Typography>
                        </BootstrapTooltip>
                        <Stack direction='row' spacing={1} ml={-2}>
                          {card?.tags?.length > 0 &&
                            card?.tags?.map(
                              (tag, index) =>
                                index < 2 && (
                                  <CustomChip
                                    size='small'
                                    label={tag.text}
                                    skin='light'
                                    color={tag.color as any}
                                    sx={{ fontSize: 10, height: 17, borderBottomLeftRadius: 0, borderTopLeftRadius: 0 }}
                                  />
                                )
                            )}
                          {card.moreTags > 0 && (
                            <CustomChip
                              size='small'
                              label={`+${card.moreTags}`}
                              skin='light'
                              color='info'
                              sx={{ fontSize: 10, height: 17, borderBottomLeftRadius: 0, borderTopLeftRadius: 0 }}
                            />
                          )}
                        </Stack>
                      </Box>
                    </Box>
                    <Chip
                      variant='outlined'
                      size='small'
                      label={`${uppercaseFirstLetters(card.interview)}`}
                      color={card.interviewColor as any}
                      sx={{ backgroundColor: '#fff', position: 'absolute', bottom: 40, fontSize: 10, height: 20 }}
                      avatar={
                        card.interview == 'right now' ? (
                          <svg height='18' width='18' className='blinking'>
                            <circle cx='9' cy='9' r='5' fill={getColorCodes('error')} />
                          </svg>
                        ) : (
                          <Avatar sx={{ backgroundColor: '#fff' }}>
                            <Icon
                              style={{ color: getColorCodes(card.interviewColor), backgroundColor: '#fff' }}
                              icon='fluent:device-meeting-room-remote-16-filled'
                              fontSize={15}
                            />
                          </Avatar>
                        )
                      }
                    />

                    <Box
                      sx={{
                        mt: 5,
                        gap: 2,
                        display: 'flex',
                        // flexWrap: 'wrap',
                        justifyContent: 'space-between',
                        alignItems: 'flex-end',
                        flexDirection: 'row'
                      }}
                    >
                      <Stack direction='row' spacing={1}>
                        <Chip
                          size='small'
                          label='3'
                          sx={{ fontSize: 10, height: 19, width: 41 }}
                          avatar={
                            <Avatar>
                              <Icon icon='ri:attachment-2' fontSize={15} />
                            </Avatar>
                          }
                        />
                        <Chip
                          size='small'
                          label='2'
                          sx={{ fontSize: 10, height: 19, width: 41 }}
                          avatar={
                            <Avatar>
                              <Icon icon='ic:baseline-call' fontSize={15} />
                            </Avatar>
                          }
                        />
                        <Chip
                          size='small'
                          label='4'
                          sx={{ fontSize: 10, height: 19, width: 41 }}
                          avatar={
                            <Avatar>
                              <Icon icon='material-symbols:chat-outline-rounded' fontSize={15} />
                            </Avatar>
                          }
                        />
                      </Stack>
                      <AvatarGroup
                        className='pull-up'
                        max={3}
                        sx={{
                          '& .MuiAvatar-root': { width: 30, height: 30, fontSize: 15 }
                        }}
                      >
                        {asignees.map((asignee: any, index: any) => (
                          <BootstrapTooltip key={index} title={asignee.title} placement='top'>
                            <CustomAvatar src={asignee.id} sx={{ height: 26, width: 26 }} />
                          </BootstrapTooltip>
                        ))}
                      </AvatarGroup>
                    </Box>
                  </Typography>
                </Card>
              ))}
            </Card>
          </>
        ))}
      </Stack>
      {/* </Grid> */}
    </>
  )
}

export default ProjectViewResumes
