import {
  Autocomplete,
  Avatar,
  Badge,
  Box,
  Button,
  ButtonGroup,
  Chip,
  Divider,
  Grid,
  IconButton,
  List,
  ListItem,
  ListItemAvatar,
  ListItemButton,
  ListItemSecondaryAction,
  ListItemText,
  ListSubheader,
  Popover,
  Rating,
  Stack,
  Tab,
  TextField,
  Typography,
  createFilterOptions
} from '@mui/material'
import { getFullName, getImagePath, getMaxTextLen, uppercaseFirstLetters } from 'src/helpers/functions'
import BootstrapTooltip from 'src/@core/components/bootstrap-tooltip'
import CustomAvatar from 'src/@core/components/mui/avatar'
import CustomChip from 'src/@core/components/mui/chip'
import Icon from 'src/@core/components/icon'
import { getInitials } from 'src/@core/utils/get-initials'
import TabContext from '@mui/lab/TabContext'
import TabList from '@mui/lab/TabList'
import { useState } from 'react'
import ResumeHiringDialog from './ResumeHiringDialog'
import ResumeRejectingDialog from './ResumeRejectingDialog'
import { useSelector } from 'react-redux'
import { resumesStates } from './ViewResumes'

const filter = createFilterOptions<any>()

const viewes = [
  {
    id: 1,
    name: 'Aliakbar Rezaei',
    username: 'akrez',
    avatar: '/images/avatars/3.png',
    date: 'Yesterday'
  },
  {
    id: 2,
    name: 'Mahdi Amereh',
    username: 'mehdieight',
    avatar: '/images/avatars/5.png',
    date: '2 Days Ago'
  }
]

const fakeTags = [
  {
    id: 1,
    title: 'tag number one',
    color: 'error'
  },
  {
    id: 2,
    title: 'tag two',
    color: 'success'
  },
  {
    id: 3,
    title: 'tag 3',
    color: 'primary'
  }
]

const ResumeCardHeader = ({
  tags,
  handleClickOpenAddCallDialog,
  handleClickOpenAddInterviewDialog,
  closeToggle,
  smActiveTab,
  handleSmTabChange,
  isSmallScreen
}: any) => {
  const [anchorElAddTag, setAnchorElAddTag] = useState<HTMLButtonElement | null>(null)
  const [anchorElViewes, setAnchorElViewes] = useState<HTMLButtonElement | null>(null)
  const [newTag, setNewTag] = useState<any>({})
  const [openResumeHiringDialog, setOpenResumeHiringDialog] = useState<boolean>(false)
  const [openResumeRejectingDialog, setOpenResumeRejectingDialog] = useState<boolean>(false)

  const { data: resume } = useSelector((state: any) => state.resume)

  const stateTitles = Object.entries(resumesStates).map(([key, value]: any) => key)
  const handleCloseResumeHiringDialog = () => setOpenResumeHiringDialog(false)
  const handleCloseResumeRejectingDialog = () => setOpenResumeRejectingDialog(false)

  const handleClickAddTag = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorElAddTag(event.currentTarget)
  }

  const handleCloseAddTag = () => {
    setAnchorElAddTag(null)
  }

  const handleClickViewes = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorElViewes(event.currentTarget)
  }

  const handleCloseViewes = () => {
    setAnchorElViewes(null)
  }

  const openAddTag = Boolean(anchorElAddTag)
  const openViewes = Boolean(anchorElViewes)

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
        <Grid item mt={4} lg={7} xs={12}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
            <CustomAvatar
              src={resume?.avatar ? getImagePath(resume?.avatar) : ''}
              skin='light'
              color='primary'
              sx={{ mr: 3, width: 55, height: 55, fontSize: '1rem' }}
            >
              {!resume?.avatar && getInitials(getFullName(resume))}
            </CustomAvatar>
            <Box sx={{ display: 'flex', alignItems: 'flex-start', flexDirection: 'column' }}>
              <Typography fontSize={18} fontWeight={500}>
                {getFullName(resume)}
              </Typography>
              <Typography variant='body2'>
                {resume.company_id} • {resume.project_id}
              </Typography>
            </Box>
          </Box>
        </Grid>
        <Grid
          item
          mt={4}
          lg={5}
          xs={12}
          sx={{ textAlign: 'right', display: 'flex', flexDirection: 'column', alignItems: 'end' }}
        >
          <Box>
            {stateTitles.indexOf(resume?.status) > 0 && (
              <BootstrapTooltip
                placement='top'
                title={uppercaseFirstLetters(resumesStates[stateTitles[stateTitles.indexOf(resume?.status) - 1]].title)}
              >
                <IconButton aria-label='capture screenshot' sx={{ pl: 0 }}>
                  <Icon icon='material-symbols:arrow-back-ios-new-rounded' />
                </IconButton>
              </BootstrapTooltip>
            )}
            <Button
              size='small'
              variant='contained'
              color={(resume?.status && resumesStates[resume?.status]?.color) ?? 'info'}
            >
              {resume?.status && uppercaseFirstLetters(resumesStates[resume?.status]?.title)}
            </Button>

            {stateTitles.indexOf(resume?.status) < stateTitles.length - 1 && (
              <BootstrapTooltip
                placement='top'
                title={uppercaseFirstLetters(resumesStates[stateTitles[stateTitles.indexOf(resume?.status) + 1]].title)}
              >
                <IconButton aria-label='capture screenshot' sx={{ pr: 0 }}>
                  <Icon icon='material-symbols:arrow-forward-ios-rounded' />
                </IconButton>
              </BootstrapTooltip>
            )}
          </Box>
          <ButtonGroup size='small' variant='outlined' sx={{ mt: 3, mr: 1 }}>
            <Button
              startIcon={<Icon icon='mdi:tick-circle-outline' />}
              color='success'
              onClick={() => setOpenResumeHiringDialog(true)}
            >
              Hiring
            </Button>
            <Button
              startIcon={<Icon icon='material-symbols:cancel-outline' />}
              color='error'
              onClick={() => setOpenResumeRejectingDialog(true)}
            >
              Reject
            </Button>
          </ButtonGroup>
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
                          borderTopLeftRadius: 0,
                          cursor: 'pointer',
                          '.MuiSvgIcon-root': {
                            display: 'none'
                          },
                          ':hover': {
                            '.MuiSvgIcon-root': {
                              display: 'inline-block'
                            }
                          }
                        }}
                        onDelete={() => console.log('deleted')}
                      />
                    </div>
                  </BootstrapTooltip>
                  {tags?.length == index + 1 && (
                    <>
                      <BootstrapTooltip placement='top' title='Add Tag'>
                        <IconButton
                          aria-label='capture screenshot'
                          sx={{ border: '1px dashed gray', width: '28px', height: '28px', p: 0 }}
                          onClick={handleClickAddTag}
                        >
                          <Icon fontSize={16} icon='mdi:tag-plus' />
                        </IconButton>
                      </BootstrapTooltip>
                      <Popover
                        id='add-tag'
                        open={openAddTag}
                        anchorEl={anchorElAddTag}
                        onClose={handleCloseAddTag}
                        anchorOrigin={{
                          vertical: 'bottom',
                          horizontal: 'left'
                        }}
                        PaperProps={{
                          style: {
                            width: '15%'
                          }
                        }}
                      >
                        <Grid container xs={12} p={5}>
                          <Grid item xs={12}>
                            <Autocomplete
                              options={fakeTags}
                              id='autocomplete-size-small-multi'
                              renderInput={params => (
                                <TextField {...params} label='Add Tag' placeholder='Search Tags ...' />
                              )}
                              renderOption={(props, tag: any) =>
                                tag.title.includes('Add "') ? (
                                  <ListItem {...props}>{tag.title}</ListItem>
                                ) : (
                                  <ListItem {...props}>
                                    <CustomChip size='small' label={tag.title} skin='light' color={tag.color as any} />
                                  </ListItem>
                                )
                              }
                              onChange={(event, newValue) => {
                                if (typeof newValue === 'string') {
                                  setNewTag({
                                    title: newValue
                                  })
                                } else if (newValue && newValue.inputValue) {
                                  setNewTag({
                                    title: newValue.inputValue
                                  })
                                } else {
                                  setNewTag(newValue)
                                }
                              }}
                              filterOptions={(options, params) => {
                                const filtered = filter(options, params)

                                const { inputValue } = params
                                // Suggest the creation of a new value
                                const isExisting = options.some(option => inputValue === option.title)
                                if (inputValue !== '' && !isExisting) {
                                  filtered.push({
                                    inputValue,
                                    title: `Add "${inputValue}"`
                                  })
                                }

                                return filtered
                              }}
                              selectOnFocus
                              clearOnBlur
                              handleHomeEndKeys
                              getOptionLabel={option => {
                                if (typeof option === 'string') {
                                  return option
                                }
                                if (option.inputValue) {
                                  return option.inputValue
                                }
                                return option.title
                              }}
                            />
                          </Grid>
                        </Grid>
                      </Popover>
                    </>
                  )}
                </>
              ))}
          </Stack>
        </Grid>
        <Grid item mt={7} lg={6} xs={12} sx={{ textAlign: 'right' }}>
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
          sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'inherit', flexDirection: 'column' }}
        >
          <Grid item sx={{ textAlign: 'right' }}>
            <BootstrapTooltip title='Viewes' placement='top'>
              <Button onClick={handleClickViewes} sx={{ mr: 5 }} color='secondary'>
                <Badge
                  badgeContent={viewes.length ?? 0}
                  color='primary'
                  overlap='circular'
                  invisible={!Boolean(viewes.length)}
                >
                  <Icon icon='teenyicons:eye-outline' fontSize={35} />
                </Badge>
              </Button>
            </BootstrapTooltip>
            <Popover
              open={openViewes}
              anchorEl={anchorElViewes}
              onClose={handleCloseViewes}
              anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
              PaperProps={{
                style: {
                  width: '450px'
                }
              }}
            >
              <Grid container xs={12}>
                <Grid item xs={12} p={3}>
                  <List dense subheader={<ListSubheader>Viewes</ListSubheader>}>
                    <Divider />
                    {viewes.length > 0 ? (
                      viewes.map((viewer: any, index: number) => (
                        <ListItemButton key={`viewer-${index}`} sx={{ mt: 3 }}>
                          <ListItemAvatar>
                            {viewer.avatar ? (
                              <Avatar src={viewer.avatar} alt={viewer.name}></Avatar>
                            ) : (
                              <Avatar alt={viewer.name}>{getInitials(viewer.name)}</Avatar>
                            )}
                          </ListItemAvatar>
                          <ListItemText secondary={`@${viewer.username}`}>{viewer.name}</ListItemText>
                          <ListItemSecondaryAction>
                            <Typography fontSize={13}>{viewer.date}</Typography>
                          </ListItemSecondaryAction>
                        </ListItemButton>
                      ))
                    ) : (
                      <Typography textAlign='center' p={3}>
                        There Is Nothing To Show Here!
                      </Typography>
                    )}
                  </List>
                </Grid>
              </Grid>
            </Popover>
          </Grid>
          <ButtonGroup orientation='vertical'>
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
          </ButtonGroup>
        </Grid>
      </Grid>
      <ResumeHiringDialog open={openResumeHiringDialog} handleClose={handleCloseResumeHiringDialog} />
      <ResumeRejectingDialog open={openResumeRejectingDialog} handleClose={handleCloseResumeRejectingDialog} />
    </>
  )
}

export default ResumeCardHeader
