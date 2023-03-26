import { Avatar, AvatarGroup, Box, Card, Chip, Rating, Stack, Typography } from '@mui/material'
import { getColorCodes, getMaxTextLen, uppercaseFirstLetters } from 'src/helpers/functions'
import { BootstrapTooltip } from 'src/pages/companies'
import CustomChip from 'src/@core/components/mui/chip'
import CustomAvatar from 'src/@core/components/mui/avatar'
import Icon from 'src/@core/components/icon'
import { getInitials } from 'src/@core/utils/get-initials'

interface ResumeKanbanCardProps {
  cardData: any
  setOpen: any
}

const ResumeKanbanCard = ({ cardData: card, setOpen }: ResumeKanbanCardProps) => {
  return (
    <Card
      className='hover-shadow'
      sx={{
        m: 4,
        cursor: 'pointer',
        boxShadow: 'none',
        position: 'relative'
      }}
      onClick={() => setOpen(true)}
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
          <CustomAvatar skin='light' color='primary' sx={{ mr: 3, width: 35, height: 35, fontSize: '0.85rem' }}>
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
                  (tag: any, index: number) =>
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
            {card?.asignees.map((asignee: any, index: any) => (
              <BootstrapTooltip key={index} title={asignee.title} placement='top'>
                <CustomAvatar src={asignee.id} sx={{ height: 26, width: 26 }} />
              </BootstrapTooltip>
            ))}
          </AvatarGroup>
        </Box>
      </Typography>
    </Card>
  )
}

export default ResumeKanbanCard
