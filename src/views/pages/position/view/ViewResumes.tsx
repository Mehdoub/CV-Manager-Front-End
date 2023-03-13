import { Avatar, AvatarGroup, Box, Card, Chip, Rating, Stack, Typography } from '@mui/material'
import Icon from 'src/@core/components/icon'
import CustomChip from 'src/@core/components/mui/chip'
import CustomAvatar from 'src/@core/components/mui/avatar'
import { getInitials } from 'src/@core/utils/get-initials'
import { BootstrapTooltip } from 'src/pages/companies'
import { getColorCodes, getMaxTextLen, uppercaseFirstLetters } from 'src/helpers/functions'

const itemsObj = [
  {
    title: 'New',
    color: 'primary'
  },
  {
    title: 'Reviewd',
    color: 'info'
  },
  {
    title: 'Call Interview',
    color: 'warning'
  },
  {
    title: 'Technical Test',
    color: 'secondary'
  },
  {
    title: 'Hired',
    color: 'success'
  },
  {
    title: 'Rejected',
    color: 'error'
  }
]

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
    moreTags: 2,
    date: '14 March 03:00 P.M',
    rate: 5,
    rateText: 'Excellent!'
  },
  {
    id: 2,
    title: 'Ali Hamzehei Tabrizi',
    label: 'Laravel Developer',
    color: 'info',
    interview: 'right now',
    interviewColor: 'error',
    tags: [],
    moreTags: 0,
    date: '14 March 03:00 P.M',
    rate: 4,
    rateText: 'Awesome'
  },
  {
    id: 3,
    title: 'Amin Paapi',
    label: 'Information',
    color: 'info',
    interview: 'right now',
    interviewColor: 'error',
    tags: [],
    moreTags: 0,
    date: '14 March 03:00 P.M',
    rate: 3,
    rateText: 'Good'
  },
  {
    id: 4,
    title: 'Aliakbar Rezaei',
    label: 'Information',
    color: 'info',
    interview: 'yesterday 11:00',
    interviewColor: 'warning',
    tags: [],
    moreTags: 0,
    date: '14 March 03:00 P.M',
    rate: 3,
    rateText: 'Good'
  },
  {
    id: 5,
    title: 'Mahdi Amereh',
    label: 'Information',
    color: 'info',
    interview: 'yesterday 11:00',
    interviewColor: 'warning',
    tags: [],
    moreTags: 0,
    date: '14 March 03:00 P.M',
    rate: 3,
    rateText: 'Good'
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
      <Stack direction='row' spacing={-3} sx={{ overflowX: 'scroll', pr: 3, pb: 20, pt: 0, pl: 0 }}>
        {itemsObj.map(item => (
          <>
            <Card
              className='hide-scrollbar'
              sx={{
                minWidth: 300,
                maxHeight: 720,
                backgroundColor: '#F7F7F9',
                overflowY: 'scroll',
                boxShadow: 'none',
                position: 'relative'
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
                  top: 0,
                  position: 'sticky',
                  height: '42px',
                  margin: '0 16px',
                  borderRadius: '10px 10px 3px 3px',
                  backgroundColor: '#fff',
                  display: 'flex',
                  alignItems: 'center',
                  boxShadow: '0px 2px 10px 0px rgb(76 78 100 / 22%)',
                  borderTop: '2px solid ' + getColorCodes(item.color),
                  zIndex: 100
                }}
              >
                {item.title}
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
                      <BootstrapTooltip placement='top' title={card.label}>
                        <div>
                          <CustomChip
                            rounded
                            size='small'
                            label={getMaxTextLen(card.label)}
                            skin='light'
                            color={card.color as any}
                            sx={{ fontSize: 10, height: 19 }}
                          />
                        </div>
                      </BootstrapTooltip>
                      <BootstrapTooltip placement='top' title={card.rateText}>
                        <div>
                          <Rating readOnly value={card.rate} name='read-only' size='small' />
                        </div>
                      </BootstrapTooltip>
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
                                  <BootstrapTooltip placement='top' title={tag.text}>
                                    <div>
                                      <CustomChip
                                        size='small'
                                        label={getMaxTextLen(tag.text)}
                                        skin='light'
                                        color={tag.color as any}
                                        sx={{
                                          fontSize: 10,
                                          height: 17,
                                          borderBottomLeftRadius: 0,
                                          borderTopLeftRadius: 0
                                        }}
                                      />
                                    </div>
                                  </BootstrapTooltip>
                                )
                            )}
                          {card.moreTags > 0 && (
                            <BootstrapTooltip placement='top' title={`+${card.moreTags}`}>
                              <div>
                                <CustomChip
                                  size='small'
                                  label={`+${card.moreTags}`}
                                  skin='light'
                                  color='info'
                                  sx={{ fontSize: 10, height: 17, borderBottomLeftRadius: 0, borderTopLeftRadius: 0 }}
                                />
                              </div>
                            </BootstrapTooltip>
                          )}
                        </Stack>
                      </Box>
                    </Box>
                    <BootstrapTooltip placement='top' title={card.date}>
                      <Chip
                        variant='outlined'
                        size='small'
                        label={`${getMaxTextLen(uppercaseFirstLetters(card.interview))}`}
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
                    </BootstrapTooltip>

                    <Box
                      sx={{
                        mt: 5,
                        gap: 2,
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'flex-end',
                        flexDirection: 'row'
                      }}
                    >
                      <Stack direction='row' spacing={1}>
                        <BootstrapTooltip placement='top' title='File Attachments'>
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
                        </BootstrapTooltip>
                        <BootstrapTooltip placement='top' title='Call History'>
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
                        </BootstrapTooltip>
                        <BootstrapTooltip placement='top' title='Comments'>
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
                        </BootstrapTooltip>
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
    </>
  )
}

export default ProjectViewResumes
