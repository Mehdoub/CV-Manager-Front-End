import { Avatar, AvatarGroup, Box, Card, Chip, Rating, Stack, Typography } from '@mui/material'
import {
  getColorCodes,
  getFullName,
  getImagePath,
  getMaxTextLen,
  getTimeText,
  ratingTextsObj,
  roundNumber,
  uppercaseFirstLetters
} from 'src/helpers/functions'
import BootstrapTooltip from 'src/@core/components/bootstrap-tooltip'
import CustomChip from 'src/@core/components/mui/chip'
import CustomAvatar from 'src/@core/components/mui/avatar'
import Icon from 'src/@core/components/icon'
import { getInitials } from 'src/@core/utils/get-initials'
import { Draggable } from 'react-beautiful-dnd'
import { hexToRGBA } from 'src/@core/utils/hex-to-rgba'
import AttachmentIcon from '@mui/icons-material/Attachment'
import CallIcon from '@mui/icons-material/Call'
import MessageIcon from '@mui/icons-material/Message'

interface ResumeKanbanCardProps {
  cardData: any
  setOpen: any
  index: number
  handleClick: any
}

const ResumeKanbanCard = ({ cardData: card, setOpen, index, handleClick }: ResumeKanbanCardProps) => {
  const [interviewDateText, interviewColor, interviewDateString] =
    card?.interviews?.length > 0
      ? getTimeText(card?.interviews[card?.interviews?.length - 1]?.event_time, true)
      : ['', '', '']

  const selectedTags = card?.tags?.length <= 2 ? card?.tags : card?.tags?.slice(Math.max(card?.tags?.length - 2, 0))

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
            handleClick(card._id)
          }}
        >
          <Typography
            sx={{
              fontSize: 14,
              fontWeight: 500,
              textAlign: 'left',
              p: 3
            }}
            variant='body2'
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
              <BootstrapTooltip placement='top' title={ratingTextsObj[roundNumber(card?.rating) ?? 0]}>
                <div>
                  <Rating readOnly value={roundNumber(card.rating) ?? 0} name='read-only' size='small' />
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
                  {selectedTags?.length > 0 &&
                    selectedTags?.map(
                      (tag: any, index: number) =>
                        index < 2 && (
                          <BootstrapTooltip key={index} placement='top' title={tag?.name}>
                            <div>
                              <CustomChip
                                size='small'
                                label={getMaxTextLen(tag?.name)}
                                skin='light'
                                sx={{
                                  fontSize: 10,
                                  height: 17,
                                  borderBottomLeftRadius: 0,
                                  borderTopLeftRadius: 0,
                                  backgroundColor: hexToRGBA(tag?.color, 0.12),
                                  color: tag?.color
                                }}
                              />
                            </div>
                          </BootstrapTooltip>
                        )
                    )}
                  {card?.summary_count?.tag > 2 && (
                    <BootstrapTooltip placement='top' title={`${card?.summary_count?.tag - 2} More Tags`}>
                      <div>
                        <CustomChip
                          size='small'
                          label={`+${card?.summary_count?.tag - 2}`}
                          skin='light'
                          color='secondary'
                          sx={{ fontSize: 10, height: 17, borderBottomLeftRadius: 0, borderTopLeftRadius: 0 }}
                        />
                      </div>
                    </BootstrapTooltip>
                  )}
                </Stack>
              </Box>
            </Box>
            {interviewDateText && (
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
            )}

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
                    sx={{ fontSize: 10, height: 19, minWidth: 41 }}
                    avatar={
                      <Avatar>
                        <AttachmentIcon sx={{ fontSize: 17 }} />
                      </Avatar>
                    }
                  />
                </BootstrapTooltip>
                <BootstrapTooltip placement='top' title='Call History'>
                  <Chip
                    size='small'
                    label={card.summary_count.call_history}
                    sx={{ fontSize: 10, height: 19, minWidth: 41 }}
                    avatar={
                      <Avatar>
                        <CallIcon sx={{ fontSize: 17 }} />
                      </Avatar>
                    }
                  />
                </BootstrapTooltip>
                <BootstrapTooltip placement='top' title='Comments'>
                  <Chip
                    size='small'
                    label={card.summary_count.comment}
                    sx={{ fontSize: 10, height: 19, minWidth: 41 }}
                    avatar={
                      <Avatar>
                        <MessageIcon sx={{ fontSize: 17 }} />
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
                {card?.assigners?.length > 0 ? (
                  card?.assigners?.map((contributor: any, index: number) => (
                    <BootstrapTooltip key={index} title={getFullName(contributor)} placement='top'>
                      <CustomAvatar src={getImagePath(contributor?.avatar)} sx={{ height: 26, width: 26 }} />
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
