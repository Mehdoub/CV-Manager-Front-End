import CustomAvatar from 'src/@core/components/mui/avatar'
import { Box, BoxProps, Button, Divider, Grid, IconButton, Typography, styled } from '@mui/material'
import CustomTextField from 'src/@core/components/custom-textfield'
import { useEffect, useRef, useState, SyntheticEvent } from 'react'
import Icon from 'src/@core/components/icon'
import { getInitials } from 'src/@core/utils/get-initials'
import BootstrapTooltip from 'src/@core/components/bootstrap-tooltip'
import { useSelector } from 'react-redux'
import {
  addCommentToResume,
  clearResumeAddComment,
  getResume,
  selectResume,
  selectResumeAddComment
} from 'src/store/resume'
import { useDispatch } from 'react-redux'
import { getFullName, getImagePath, getTimeText, toastError } from 'src/helpers/functions'
import ChatBubbleIcon from '@mui/icons-material/ChatBubble'
import Link from 'next/link'

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

const ResumeViewRightDialog = ({ cahtExample }: any) => {
  const isSender = false
  let avatarId = 3

  const [msg, setMsg] = useState<string>('')
  const [msgRow, setMsgRow] = useState<number>(1)
  const [commentClass, setCommentClass] = useState<string>('')

  const { data: resume } = useSelector(selectResume)
  const { status: resumeAddCommentStatus, loading: resumeAddCommentLoading } = useSelector(selectResumeAddComment)

  const dispatch = useDispatch()

  const resumeId = resume?._id

  const wrapperRef = useRef(null)
  useOutsideBox(wrapperRef, setCommentClass, setMsgRow)

  useEffect(() => {
    if (resumeAddCommentStatus) {
      setMsg('')
      setCommentClass('')
      setMsgRow(1)
      dispatch(clearResumeAddComment())
      dispatch(getResume(resumeId))
    }
  }, [resumeAddCommentStatus])

  const handleSendMsg = (e: SyntheticEvent) => {
    e.preventDefault()
    if (msg?.length >= 5) {
      if (resumeId) {
        dispatch(addCommentToResume({ resumeId, body: msg }))
      }
    } else toastError('Comment Message Should Be Atleast 5 Characters')
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
            flexDirection: 'column',
            userSelect: 'text'
          }}
        >
          {resume?.comments?.length > 0 &&
            [...resume?.comments].reverse().map((comment: any, index: number) => {
              const [dateText, dateColor, dateString] = getTimeText(comment?.createdAt)
              return (
                <Box
                  key={comment?._id}
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
                        src: comment?.created_by?.avatar ? getImagePath(comment?.created_by?.avatar) : undefined,
                        alt: getFullName(comment?.created_by)
                      }}
                    >
                      {getInitials(getFullName(comment?.created_by))}
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
                        <Link
                          style={{ textDecoration: 'none' }}
                          href={`/users/view/${comment?.created_by?._id}/overview`}
                        >
                          <Typography
                            sx={{
                              fontSize: '0.875rem',
                              p: theme => theme.spacing(3, 4),
                              color: 'primary.main'
                            }}
                          >
                            {getFullName(comment?.created_by)}
                          </Typography>
                        </Link>
                        <BootstrapTooltip placement='top' title={dateString}>
                          <Typography variant='caption' sx={{ color: 'text.disabled', mr: 2 }}>
                            {dateText}
                          </Typography>
                        </BootstrapTooltip>
                      </div>
                      <Typography
                        sx={{
                          fontSize: '0.875rem',
                          fontWeight: 500,
                          p: theme => theme.spacing(3, 4)
                        }}
                      >
                        {comment?.body}
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
                  <ChatBubbleIcon fontSize='large' />
                </IconButton>
              </Box>
              <Box sx={{ flexGrow: 1, display: 'flex', alignItems: 'center', p: 3, maxHeight: '100px' }}>
                <CustomTextField
                  fullWidth
                  value={msg}
                  size='small'
                  placeholder='Type your message here…'
                  onChange={e => setMsg(e.target.value)}
                  multiline
                  rows={msgRow}
                  sx={{ '& .MuiOutlinedInput-input': { pl: 0 }, '& fieldset': { border: '0 !important' } }}
                  disabled={resumeAddCommentLoading}
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
                      disabled
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
                      disabled
                    >
                      <Icon icon='majesticons:attachment-line' fontSize='1.375rem' />
                      {/* <input hidden type='file' id='upload-img' /> */}
                    </IconButton>
                  </BootstrapTooltip>
                  <BootstrapTooltip placement='top' title='Add Emoji'>
                    <IconButton
                      size='small'
                      component='label'
                      htmlFor='upload-img'
                      sx={{ mr: 2.75, color: 'text.secondary' }}
                      disabled
                    >
                      <Icon icon='ic:round-emoji-emotions' fontSize='1.375rem' />
                      {/* <input hidden type='file' id='upload-img' /> */}
                    </IconButton>
                  </BootstrapTooltip>
                  <BootstrapTooltip placement='top' title='Record Voice'>
                    <IconButton
                      size='small'
                      component='label'
                      htmlFor='upload-img'
                      sx={{ mr: 2.75, color: 'text.secondary' }}
                      disabled
                    >
                      <Icon icon='material-symbols:auto-detect-voice' fontSize='1.375rem' />
                      {/* <input hidden type='file' id='upload-img' /> */}
                    </IconButton>
                  </BootstrapTooltip>
                  <BootstrapTooltip placement='top' title='Mention A Task'>
                    <IconButton
                      size='small'
                      component='label'
                      htmlFor='upload-img'
                      sx={{ mr: 2.75, color: 'text.secondary' }}
                      disabled
                    >
                      <Icon icon='fluent:document-mention-16-regular' fontSize='1.375rem' />
                      {/* <input hidden type='file' id='upload-img' /> */}
                    </IconButton>
                  </BootstrapTooltip>
                </div>
                <Button type='submit' variant='contained' disabled={resumeAddCommentLoading}>
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
