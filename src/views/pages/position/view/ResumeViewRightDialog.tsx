import CustomAvatar from 'src/@core/components/mui/avatar'
import {
  Avatar,
  Box,
  BoxProps,
  Button,
  Chip,
  Divider,
  Grid,
  IconButton,
  Stack,
  TextField,
  Typography,
  styled
} from '@mui/material'
import { useEffect, useRef, useState, MouseEvent, SyntheticEvent } from 'react'
import Icon from 'src/@core/components/icon'
import { getInitials } from 'src/@core/utils/get-initials'
import { BootstrapTooltip } from 'src/pages/companies'

const useOutsideBox = (ref: any, setState: any, setMsgRow: any) => {
  useEffect(() => {
    const handleClickOutside = (event: any) => {
      if (ref.current && !ref.current.contains(event.target)) {
        setState('')
        setMsgRow(1)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [ref])
}

const ChatFormWrapper = styled(Grid)<BoxProps>(({ theme }) => ({
  display: 'flex',
  position: 'relative',
  alignItems: 'center',
  flexDirection: 'row-reverse',
  height: '65px',
  boxShadow: '10px 0 10px 10px rgb(76 78 100 / 14%)',
  justifyContent: 'space-between',
  backgroundColor: theme.palette.background.paper
}))

const ResumeViewRightDialog = ({ handleClickOpenAddCallDialog, cahtExample }: any) => {
  const isSender = false
  let avatarId = 3

  const [msg, setMsg] = useState<string>('')
  const [msgRow, setMsgRow] = useState<number>(1)
  const [commentClass, setCommentClass] = useState<string>('')

  const wrapperRef = useRef(null)
  useOutsideBox(wrapperRef, setCommentClass, setMsgRow)

  const handleSendMsg = (e: SyntheticEvent) => {
    e.preventDefault()
    setMsg('')
  }

  return (
    <>
      <Grid item>
        <Box
          className='chat-body'
          sx={{
            height: '65vh',
            overflowY: 'scroll',
            p: 4,
            backgroundColor: '#4c4e640d',
            display: 'flex',
            alignItems: 'start',
            flexDirection: 'column'
          }}
        >
          {cahtExample.chat.map((chat: any, index: number, { length }: { length: number }) => {
            avatarId = avatarId == 3 ? 5 : 3
            return (
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: !isSender ? 'row' : 'row-reverse',
                  p: 2,
                  width: '100%'
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
                </Box>
              </Box>
            )
          })}
          <Box sx={{ display: 'flex', p: 6, width: '100%' }}></Box>
        </Box>
        <Box sx={{ width: '100%', position: 'absolute', bottom: 0 }}>
          <form onSubmit={handleSendMsg}>
            <ChatFormWrapper
              ref={wrapperRef}
              onClick={() => {
                setMsgRow(4)
                setCommentClass('comment-box')
              }}
              className={commentClass}
              tabIndex={1}
              container
            >
              <Box sx={{ display: 'flex', alignItems: 'center', mt: 3, mr: 3 }}>
                <IconButton className='chat-icon' size='small' sx={{ mr: 1.5, color: 'rgb(76 78 100 / 14%)' }}>
                  <Icon icon='mdi:comment' fontSize='2.25rem' />
                </IconButton>
              </Box>
              <Box sx={{ flexGrow: 1, display: 'flex', alignItems: 'center', p: 3, maxHeight: '100px' }}>
                <TextField
                  fullWidth
                  value={msg}
                  size='small'
                  placeholder='Type your message here…'
                  onChange={e => setMsg(e.target.value)}
                  multiline
                  rows={msgRow}
                  sx={{ '& .MuiOutlinedInput-input': { pl: 0 }, '& fieldset': { border: '0 !important' } }}
                />
              </Box>
              <Grid item md={12} sx={{ mb: 12 }}>
                <Divider sx={{ width: '100%', m: '0px !important' }} />
              </Grid>
              <Grid
                item
                md={12}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  width: '97%',
                  mr: 4
                }}
                className='comment-btn-send'
              >
                <div>
                  <BootstrapTooltip placement='top' title='Mention Someone'>
                    <IconButton
                      size='small'
                      component='label'
                      htmlFor='upload-img'
                      sx={{ mr: 2.75, color: 'text.secondary' }}
                    >
                      <Icon icon='material-symbols:alternate-email' fontSize='1.375rem' />
                    </IconButton>
                  </BootstrapTooltip>
                  <BootstrapTooltip placement='top' title='Attach File'>
                    <IconButton
                      size='small'
                      component='label'
                      htmlFor='upload-img'
                      sx={{ mr: 2.75, color: 'text.secondary' }}
                    >
                      <Icon icon='majesticons:attachment-line' fontSize='1.375rem' />
                      <input hidden type='file' id='upload-img' />
                    </IconButton>
                  </BootstrapTooltip>
                  <BootstrapTooltip placement='top' title='Add Emoji'>
                    <IconButton
                      size='small'
                      component='label'
                      htmlFor='upload-img'
                      sx={{ mr: 2.75, color: 'text.secondary' }}
                    >
                      <Icon icon='ic:round-emoji-emotions' fontSize='1.375rem' />
                      <input hidden type='file' id='upload-img' />
                    </IconButton>
                  </BootstrapTooltip>
                  <BootstrapTooltip placement='top' title='Record Voice'>
                    <IconButton
                      size='small'
                      component='label'
                      htmlFor='upload-img'
                      sx={{ mr: 2.75, color: 'text.secondary' }}
                    >
                      <Icon icon='material-symbols:auto-detect-voice' fontSize='1.375rem' />
                      <input hidden type='file' id='upload-img' />
                    </IconButton>
                  </BootstrapTooltip>
                  <BootstrapTooltip placement='top' title='Mention A Task'>
                    <IconButton
                      size='small'
                      component='label'
                      htmlFor='upload-img'
                      sx={{ mr: 2.75, color: 'text.secondary' }}
                    >
                      <Icon icon='fluent:document-mention-16-regular' fontSize='1.375rem' />
                      <input hidden type='file' id='upload-img' />
                    </IconButton>
                  </BootstrapTooltip>
                </div>
                <Button type='submit' variant='contained'>
                  Send
                </Button>
              </Grid>
            </ChatFormWrapper>
          </form>
        </Box>
      </Grid>
    </>
  )
}

export default ResumeViewRightDialog
