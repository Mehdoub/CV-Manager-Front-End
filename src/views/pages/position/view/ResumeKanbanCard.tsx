import { Avatar, AvatarGroup, Box, Card, Chip, Rating, Stack, Typography } from '@mui/material'
import {
  calcInterviewRemainingTime,
  getColorCodes,
  getFullName,
  getImagePath,
  getMaxTextLen,
  ratingTextsObj,
  uppercaseFirstLetters
} from 'src/helpers/functions'
import BootstrapTooltip from 'src/@core/components/bootstrap-tooltip'
import CustomChip from 'src/@core/components/mui/chip'
import CustomAvatar from 'src/@core/components/mui/avatar'
import Icon from 'src/@core/components/icon'
import { getInitials } from 'src/@core/utils/get-initials'
import { Draggable } from 'react-beautiful-dnd'
import { useDispatch } from 'react-redux'
import { getResume } from 'src/store/resume'

interface ResumeKanbanCardProps {
  cardData: any
  setOpen: any
  index: number
}

const ResumeKanbanCard = ({ cardData: card, setOpen, index }: ResumeKanbanCardProps) => {
  const dispatch = useDispatch()

  const handleResumeCardClick = (resumeId: string) => {
    dispatch(getResume(resumeId))
  }

  const [interviewDateText, interviewColor, interviewDateString] = calcInterviewRemainingTime(
    '2023-09-18T07:09:11.498Z',
    '2023-09-18T11:09:11.498Z'
  )

  return (
    <Draggable draggableId={`${card.id}`} index={index} key={card.id}>
      {provided => (
        <Card
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          ref={provided.innerRef}
          className='hover-shadow'
          sx={{
            m: 4,
            cursor: 'pointer',
            boxShadow: 'none',
            // backgroundColor: theme.palette.mode == 'dark' ? '#30334E' : '#F7F7F9',
            position: 'relative'
          }}
          onClick={() => {
            setOpen(true)
            handleResumeCardClick(card.id)
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
              <BootstrapTooltip placement='top' title={card.position_id.title}>
                <div>
                  <CustomChip
                    rounded
                    size='small'
                    label={getMaxTextLen(card.position_id.title, 20)}
                    skin='light'
                    color={'info'}
                    sx={{ fontSize: 10, height: 19 }}
                  />
                </div>
              </BootstrapTooltip>
              <BootstrapTooltip placement='top' title={ratingTextsObj[(card.rating as any) ?? 0]}>
                <div>
                  <Rating readOnly value={card.rating ?? 0} name='read-only' size='small' />
                </div>
              </BootstrapTooltip>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              {card.avatar ? (
                <Avatar
                  color='primary'
                  src={getImagePath(card.avatar)}
                  sx={{ mr: 3, width: 35, height: 35, fontSize: '0.85rem' }}
                  alt={getFullName(card)}
                />
              ) : (
                <CustomAvatar skin='light' color='primary' sx={{ mr: 3, width: 35, height: 35, fontSize: '0.85rem' }}>
                  {getInitials(getFullName(card))}
                </CustomAvatar>
              )}
              <Box sx={{ display: 'flex', alignItems: 'flex-start', flexDirection: 'column' }}>
                <BootstrapTooltip title={getFullName(card)} placement='top'>
                  <Typography fontSize={13} fontWeight={500}>
                    {getMaxTextLen(getFullName(card))}
                  </Typography>
                </BootstrapTooltip>
                <Stack direction='row' spacing={1} ml={-2}>
                  {card?.tags?.length > 0 &&
                    card?.tags?.map(
                      (tag: any, index: number) =>
                        index < 2 && (
                          <BootstrapTooltip placement='top' title={tag.text}>
                            <div>
                              <CustomChip
                                size='small'
                                label={getMaxTextLen(tag.text)}
                                skin='light'
                                color={tag.tag_color as any}
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
                  {card?.count_tags && card?.count_tags - 2 > 0 && (
                    <BootstrapTooltip placement='top' title={`+${card.count_tags - 2}`}>
                      <div>
                        <CustomChip
                          size='small'
                          label={`+${card.count_tags - 2}`}
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
            <BootstrapTooltip placement='top' title={interviewDateString}>
              <Chip
                variant='outlined'
                size='small'
                label={`${getMaxTextLen(uppercaseFirstLetters(interviewDateText), 20)}`}
                color={interviewColor as any}
                sx={{ backgroundColor: '#fff', position: 'absolute', bottom: 40, fontSize: 10, height: 20 }}
                avatar={
                  interviewDateText == 'right now' ? (
                    <svg height='18' width='18' className='blinking'>
                      <circle cx='9' cy='9' r='5' fill={getColorCodes('error')} />
                    </svg>
                  ) : (
                    <Avatar sx={{ backgroundColor: '#fff !important' }}>
                      <Icon
                        style={{
                          color: getColorCodes(interviewColor),
                          backgroundColor: '#fff'
                        }}
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
                    label={card.summary_count.file}
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
                    label={card.summary_count.call_history}
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
                    label={card.summary_count.comment}
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
                {card?.contributors.length > 0 ? (
                  card?.contributors.map((asignee: any, index: any) => (
                    <BootstrapTooltip key={index} title={asignee.title} placement='top'>
                      {asignee.avatar ? (
                        <CustomAvatar src={asignee.avatar} sx={{ height: 26, width: 26 }} />
                      ) : (
                        <CustomAvatar skin='light' color='primary' sx={{ mr: 3, width: 26, height: 26 }}>
                          {getInitials(asignee.title)}
                        </CustomAvatar>
                      )}
                    </BootstrapTooltip>
                  ))
                ) : (
                  <BootstrapTooltip title='No Contributor' placement='top'>
                    <CustomAvatar skin='light' color='primary' sx={{ width: 26, height: 26 }}></CustomAvatar>
                  </BootstrapTooltip>
                )}
              </AvatarGroup>
            </Box>
          </Typography>
        </Card>
      )}
    </Draggable>
  )
}

export default ResumeKanbanCard
