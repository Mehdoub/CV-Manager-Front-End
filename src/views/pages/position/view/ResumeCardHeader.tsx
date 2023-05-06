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
  createFilterOptions,
  styled
} from '@mui/material'
import {
  getColorCodes,
  getFullName,
  getImagePath,
  getMaxTextLen,
  handleCopyClick,
  isForbiddenState,
  ratingTextsObj,
  showDate,
  uppercaseFirstLetters
} from 'src/helpers/functions'
import BootstrapTooltip from 'src/@core/components/bootstrap-tooltip'
import CustomAvatar from 'src/@core/components/mui/avatar'
import CustomChip from 'src/@core/components/mui/chip'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import Icon from 'src/@core/components/icon'
import { getInitials } from 'src/@core/utils/get-initials'
import TabContext from '@mui/lab/TabContext'
import TabList from '@mui/lab/TabList'
import { MouseEvent, useEffect, useState } from 'react'
import ResumeHiringDialog from './ResumeHiringDialog'
import ResumeRejectingDialog from './ResumeRejectingDialog'
import { useSelector } from 'react-redux'
import { resumesStates } from './ViewResumes'
import {
  addContributorToResume,
  addTagToResume,
  clearResumeAddContributor,
  clearResumeAddTag,
  clearResumeRemoveContributor,
  clearResumeRemoveTag,
  getResume,
  removeContributorFromResume,
  removeTagFromResume,
  updateResumeStatus
} from 'src/store/resume'
import { useDispatch } from 'react-redux'
import { clearTagCreate, createTag, getTags } from 'src/store/tag'
import { getPositionResumes } from 'src/store/position'
import { hexToRGBA } from 'src/@core/utils/hex-to-rgba'
import Link from 'next/link'
import { getUsers } from 'src/store/user'
import { useRouter } from 'next/router'

const filter = createFilterOptions<any>()

const StyledLink = styled(Link)(({ theme }) => ({
  fontWeight: 500,
  fontSize: '0.9rem',
  cursor: 'pointer',
  textDecoration: 'none',
  color: theme.palette.text.secondary,
  '&:hover': {
    color: theme.palette.primary.main
  }
}))

const ResumeCardHeader = ({
  handleClickOpenAddCallDialog,
  handleClickOpenAddInterviewDialog,
  closeToggle,
  smActiveTab,
  handleSmTabChange,
  isSmallScreen
}: any) => {
  const [anchorElAddTag, setAnchorElAddTag] = useState<HTMLButtonElement | null>(null)
  const [anchorElAddContributor, setAnchorElAddContributor] = useState<HTMLButtonElement | null>(null)
  const [anchorElViews, setAnchorElViews] = useState<HTMLButtonElement | null>(null)
  const [openResumeHiringDialog, setOpenResumeHiringDialog] = useState<boolean>(false)
  const [openResumeRejectingDialog, setOpenResumeRejectingDialog] = useState<boolean>(false)
  const [anchorElStatesMenu, setAnchorElStatesMenu] = useState<null | HTMLElement>(null)
  const [copyText, setCopyText] = useState<string>('Copy Link')

  const dispatch = useDispatch()
  const router = useRouter()

  const { data: resume } = useSelector((state: any) => state.resume)
  const { data: positionResumes } = useSelector((state: any) => state.positionResumes)
  const { status: resumeStateUpdateStatus, loading: resumeStateUpdateLoading } = useSelector(
    (state: any) => state.resumeUpdateStatus
  )
  const { data: tags } = useSelector((state: any) => state.tags)
  const { data: createdTag } = useSelector((state: any) => state.tagCreate)
  const { status: resumeAddTagStatus } = useSelector((state: any) => state.resumeAddTag)
  const { status: resumeRemoveTagStatus } = useSelector((state: any) => state.resumeRemoveTag)
  const { status: resumeAddContributorStatus } = useSelector((state: any) => state.resumeAddContributor)
  const { status: resumeRemoveContributorStatus } = useSelector((state: any) => state.resumeRemoveContributor)
  const { data: users } = useSelector((state: any) => state.usersList)

  useEffect(() => {
    dispatch(getUsers())
  }, [])

  useEffect(() => {
    if (resumeStateUpdateStatus) {
      dispatch(getResume(resume.id))
    }
  }, [resumeStateUpdateStatus])

  useEffect(() => {
    if (resumeAddTagStatus) {
      dispatch(getResume(resume.id))
      dispatch(getPositionResumes(resume?.position_id?._id))
      dispatch(clearResumeAddTag())
      handleCloseAddTag()
    }
  }, [resumeAddTagStatus])

  useEffect(() => {
    if (resumeRemoveTagStatus) {
      dispatch(getResume(resume.id))
      dispatch(getPositionResumes(resume?.position_id?._id))
      dispatch(clearResumeRemoveTag())
    }
  }, [resumeRemoveTagStatus])

  useEffect(() => {
    if (resumeAddContributorStatus) {
      dispatch(getResume(resume.id))
      dispatch(getPositionResumes(resume?.position_id?._id))
      dispatch(clearResumeAddContributor())
      handleCloseAddContributor()
    }
  }, [resumeAddContributorStatus])

  useEffect(() => {
    if (resumeRemoveContributorStatus) {
      dispatch(getResume(resume.id))
      dispatch(getPositionResumes(resume?.position_id?._id))
      dispatch(clearResumeRemoveContributor())
    }
  }, [resumeRemoveContributorStatus])

  useEffect(() => {
    if (createdTag?.name?.length > 0) {
      addTagToResumeHandler(createdTag?._id)
      dispatch(clearTagCreate())
    }
  }, [createdTag])

  useEffect(() => {
    dispatch(getTags())
  }, [])

  const handleClickStatesMenu = (event: MouseEvent<HTMLElement>) => {
    if (!isForbiddenState(resume?.status)) {
      setAnchorElStatesMenu(event.currentTarget)
    }
  }

  const handleCloseStatesMenu = () => {
    setAnchorElStatesMenu(null)
  }

  const stateKeys = Object.entries(resumesStates).map(([key, value]: any) => key)
  const handleCloseResumeHiringDialog = () => setOpenResumeHiringDialog(false)
  const handleCloseResumeRejectingDialog = () => setOpenResumeRejectingDialog(false)

  const handleClickAddTag = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorElAddTag(event.currentTarget)
  }

  const handleCloseAddTag = () => {
    setAnchorElAddTag(null)
  }

  const handleClickAddContributor = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorElAddContributor(event.currentTarget)
  }

  const handleCloseAddContributor = () => {
    setAnchorElAddContributor(null)
  }

  const handleClickViews = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorElViews(event.currentTarget)
  }

  const handleCloseViews = () => {
    setAnchorElViews(null)
  }

  const openAddTag = Boolean(anchorElAddTag)
  const openAddContributor = Boolean(anchorElAddContributor)
  const openViews = Boolean(anchorElViews)

  const resumeLink = process.env.NEXT_PUBLIC_APP_BASE_URL + router.asPath

  const previousState = stateKeys[stateKeys.indexOf(resume?.status) - 1]
  const nextState = stateKeys[stateKeys.indexOf(resume?.status) + 1]

  const updateStateHandler = (newState: string) => {
    if (resume?.id) {
      const firstResumeOfNewState = positionResumes[stateKeys.indexOf(newState)][newState][0]
      const newIndex = firstResumeOfNewState ? firstResumeOfNewState.index / 2 : 1

      dispatch(updateResumeStatus({ resumeId: resume?.id, status: newState, index: newIndex }))
    }
  }

  const searchTags = (e: any) => {
    dispatch(getTags({ query: e?.target?.value }))
  }

  const addTagToResumeHandler = (tagId: string) => {
    dispatch(addTagToResume({ resumeId: resume?.id, tagId }))
  }

  const removeTagFromResumeHandler = (tagId: string) => {
    dispatch(removeTagFromResume({ resumeId: resume?.id, tagId }))
  }

  const addContributorToResumeHandler = (userId: string) => {
    dispatch(addContributorToResume({ resumeId: resume?.id, userId }))
  }

  const removeContributorFromResumeHandler = (userId: string) => {
    dispatch(removeContributorFromResume({ resumeId: resume?.id, userId }))
  }

  const createTagHandler = (name: string) => {
    dispatch(createTag({ name }))
  }

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
                <BootstrapTooltip title='Company' placement='bottom'>
                  <StyledLink href={`/companies/view/${resume?.company_id?._id}/overview/`}>
                    {resume?.company_id?.name}
                  </StyledLink>
                </BootstrapTooltip>{' '}
                •{' '}
                <BootstrapTooltip title='Project' placement='bottom'>
                  <StyledLink href={`/projects/view/${resume?.project_id?._id}/overview/`}>
                    {resume?.project_id?.name}
                  </StyledLink>
                </BootstrapTooltip>
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
            <BootstrapTooltip placement='top' title={uppercaseFirstLetters(resumesStates[previousState]?.title)}>
              <IconButton
                aria-label='capture screenshot'
                sx={{ pl: 0 }}
                onClick={() => updateStateHandler(previousState)}
                disabled={
                  resumeStateUpdateLoading ||
                  !(
                    stateKeys.indexOf(resume?.status) > 0 &&
                    !isForbiddenState(previousState) &&
                    !isForbiddenState(resume?.status)
                  )
                }
              >
                <Icon icon='material-symbols:arrow-back-ios-new-rounded' />
              </IconButton>
            </BootstrapTooltip>
            <BootstrapTooltip placement='top' title='Change Status'>
              <Button
                size='small'
                variant='contained'
                color={(resume?.status && resumesStates[resume?.status]?.color) ?? 'info'}
                disabled={resumeStateUpdateLoading}
                onClick={handleClickStatesMenu}
              >
                {resume?.status && uppercaseFirstLetters(resumesStates[resume?.status]?.title)}
              </Button>
            </BootstrapTooltip>
            <Menu
              keepMounted
              elevation={0}
              anchorEl={anchorElStatesMenu}
              onClose={handleCloseStatesMenu}
              open={Boolean(anchorElStatesMenu)}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'center'
              }}
              transformOrigin={{
                vertical: 'top',
                horizontal: 'center'
              }}
            >
              {stateKeys.map(
                (item: string, index: number) =>
                  ![resume?.status, 'hired', 'rejected'].includes(item) && (
                    <MenuItem
                      key={`states-menu-${index}`}
                      onClick={() => {
                        handleCloseStatesMenu()
                        updateStateHandler(item)
                      }}
                      sx={{ color: getColorCodes(resumesStates[item].color) }}
                    >
                      {uppercaseFirstLetters(resumesStates[item].title)}
                    </MenuItem>
                  )
              )}
            </Menu>
            <BootstrapTooltip placement='top' title={uppercaseFirstLetters(resumesStates[nextState]?.title)}>
              <IconButton
                aria-label='capture screenshot'
                sx={{ pr: 0 }}
                onClick={() => updateStateHandler(nextState)}
                disabled={
                  resumeStateUpdateLoading ||
                  !(
                    stateKeys.indexOf(resume?.status) < stateKeys.length - 1 &&
                    !isForbiddenState(nextState) &&
                    !isForbiddenState(resume?.status)
                  )
                }
              >
                <Icon icon='material-symbols:arrow-forward-ios-rounded' />
              </IconButton>
            </BootstrapTooltip>
          </Box>
          <ButtonGroup size='small' variant='outlined' sx={{ mt: 3, mr: 1 }}>
            <Button
              startIcon={<Icon icon='mdi:tick-circle-outline' />}
              color='success'
              onClick={() => setOpenResumeHiringDialog(true)}
              disabled={isForbiddenState(resume?.status)}
            >
              Hiring
            </Button>
            <Button
              startIcon={<Icon icon='material-symbols:cancel-outline' />}
              color='error'
              onClick={() => setOpenResumeRejectingDialog(true)}
              disabled={isForbiddenState(resume?.status)}
            >
              Reject
            </Button>
          </ButtonGroup>
        </Grid>
        <Grid item mt={4} lg={6} xs={12}>
          <Stack direction='row' spacing={1} mt={2}>
            {resume?.tags?.length > 0 &&
              resume?.tags?.map((tag: any, index: any) => (
                <>
                  <BootstrapTooltip placement='top' title={tag?.name}>
                    <div>
                      <CustomChip
                        size='small'
                        label={getMaxTextLen(tag?.name)}
                        skin='light'
                        sx={{
                          fontSize: 12,
                          height: 22,
                          backgroundColor: hexToRGBA(tag?.color, 0.12),
                          color: tag?.color,
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
                        onDelete={() => removeTagFromResumeHandler(tag?._id)}
                      />
                    </div>
                  </BootstrapTooltip>
                </>
              ))}
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
                horizontal: 'center'
              }}
              transformOrigin={{
                vertical: 'top',
                horizontal: 'center'
              }}
              PaperProps={{
                style: {
                  width: '10%'
                }
              }}
            >
              <Grid container xs={12} p={3}>
                <Grid item xs={12}>
                  <Autocomplete
                    options={tags?.docs ?? []}
                    size='small'
                    id='autocomplete-size-small-multi'
                    renderInput={params => (
                      <TextField {...params} label='Add Tag' placeholder='Search Tags ...' onChange={searchTags} />
                    )}
                    renderOption={(props, tag: any) =>
                      tag.name.includes('Add "') ? (
                        <ListItem {...props}>{tag?.name}</ListItem>
                      ) : (
                        <ListItem {...props} alignItems='center'>
                          <CustomChip
                            size='small'
                            label={tag?.name}
                            skin='light'
                            sx={{ backgroundColor: hexToRGBA(tag?.color, 0.12), color: tag?.color }}
                          />
                          <ListItemSecondaryAction>
                            <Typography>{tag?.count}</Typography>
                          </ListItemSecondaryAction>
                        </ListItem>
                      )
                    }
                    onChange={(event, newValue) => {
                      if (newValue?._id) {
                        // setNewTag({
                        //   name: newValue?._id
                        // })
                        addTagToResumeHandler(newValue?._id)
                        handleCloseAddTag()
                      } else if (newValue && newValue.inputValue) {
                        createTagHandler(newValue.inputValue)
                      }
                      // else {
                      //   setNewTag(newValue)
                      // }
                    }}
                    filterOptions={(options, params) => {
                      const filtered = filter(options, params)

                      const { inputValue } = params
                      // Suggest the creation of a new value
                      const isExisting = options.some(option => inputValue === option?.name)
                      if (inputValue !== '' && !isExisting) {
                        filtered.push({
                          inputValue,
                          name: `Add "${inputValue}"`
                        })
                      }

                      return filtered
                    }}
                    selectOnFocus
                    clearOnBlur
                    handleHomeEndKeys
                    getOptionLabel={option => {
                      // if (typeof option === 'string') {
                      //   return option
                      // }
                      if (option.inputValue) {
                        return option.inputValue
                      }
                      return option?.name
                    }}
                  />
                </Grid>
              </Grid>
            </Popover>
          </Stack>
        </Grid>
        <Grid item mt={7} lg={6} xs={12} sx={{ textAlign: 'right' }}>
          <BootstrapTooltip placement='top' title={ratingTextsObj[resume?.rating ?? 0]}>
            <div style={{ display: 'inline', cursor: 'pointer' }}>
              <Rating readOnly value={resume?.rating ?? 0} sx={{ mr: 5 }} name='read-only' size='small' />
            </div>
          </BootstrapTooltip>
        </Grid>
      </Grid>
      <Grid lg={6} xs={12} item container sx={{ textAlign: 'left', p: 5 }}>
        <Grid item container lg={7} xl={8} xs={12}>
          <Grid item container xs={12} sx={{ textAlign: 'left', alignItems: 'end' }} spacing={2}>
            <Grid item xs={12} mt={10} ml={1}>
              <Typography variant='body2'>Contributor(s):</Typography>
            </Grid>
            {resume?.contributors?.length > 0 &&
              resume?.contributors?.map((contributorUser: any, index: number) => (
                <Grid item>
                  <BootstrapTooltip placement='top' title={uppercaseFirstLetters(getFullName(contributorUser))}>
                    <Chip
                      sx={{
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
                      onDelete={() => removeContributorFromResumeHandler(contributorUser?._id)}
                      label={uppercaseFirstLetters(getMaxTextLen(getFullName(contributorUser)))}
                      avatar={
                        contributorUser?.avatar ? (
                          <Avatar src={getImagePath(contributorUser?.avatar)} alt={getFullName(contributorUser)} />
                        ) : (
                          <CustomAvatar skin='light' color='primary' alt={getFullName(contributorUser)}>
                            {getInitials(getFullName(contributorUser))}
                          </CustomAvatar>
                        )
                      }
                    />
                  </BootstrapTooltip>
                </Grid>
              ))}
            <Grid item>
              <BootstrapTooltip placement='top' title='Add Contributor'>
                <IconButton
                  aria-label='capture screenshot'
                  sx={{ border: '1px dashed gray', width: '28px', height: '28px', p: 0, mb: 0.5 }}
                  onClick={handleClickAddContributor}
                >
                  <Icon fontSize={16} icon='pajamas:assignee' />
                </IconButton>
              </BootstrapTooltip>
            </Grid>
            <Popover
              id='add-Contributor'
              open={openAddContributor}
              anchorEl={anchorElAddContributor}
              onClose={handleCloseAddContributor}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'center'
              }}
              transformOrigin={{
                vertical: 'top',
                horizontal: 'center'
              }}
              PaperProps={{
                style: {
                  width: '13%'
                }
              }}
            >
              <Grid container xs={12} p={3}>
                <Grid item xs={12}>
                  <Autocomplete
                    size='small'
                    options={users?.docs ?? []}
                    limitTags={2}
                    getOptionLabel={user => getFullName(user)}
                    onChange={(e: any, newValue: any) => addContributorToResumeHandler(newValue?._id)}
                    renderInput={params => <TextField {...params} label='Contributor' placeholder='Search Users ...' />}
                    renderOption={(props, user) => (
                      <ListItem {...props}>
                        <ListItemAvatar>
                          <Avatar
                            src={getImagePath(user?.avatar)}
                            alt={getFullName(user)}
                            sx={{ height: 28, width: 28 }}
                          />
                        </ListItemAvatar>
                        <ListItemText primary={getFullName(user)} />
                      </ListItem>
                    )}
                  />
                </Grid>
              </Grid>
            </Popover>
          </Grid>
        </Grid>
        <Grid
          item
          container
          lg={5}
          xl={4}
          xs={12}
          mt={3}
          sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'inherit', flexDirection: 'column' }}
        >
          <Grid item sx={{ textAlign: 'right' }}>
            <BootstrapTooltip title={copyText} placement='top'>
              <Button
                onClick={() => handleCopyClick(resumeLink, setCopyText)}
                sx={{ p: 0, mt: 2, mr: 2, justifyContent: 'end', minWidth: 0 }}
                color='secondary'
              >
                <Icon icon='mdi:content-copy' fontSize={32} />
              </Button>
            </BootstrapTooltip>
            <BootstrapTooltip title='Views' placement='top'>
              <Button
                onClick={handleClickViews}
                sx={{ p: 0, mt: 3, justifyContent: 'end', minWidth: 0 }}
                color='secondary'
              >
                <Badge
                  badgeContent={resume?.summary_count?.view ?? 0}
                  color='primary'
                  overlap='circular'
                  invisible={!Boolean(resume?.summary_count?.view)}
                >
                  <Icon icon='teenyicons:eye-outline' fontSize={35} />
                </Badge>
              </Button>
            </BootstrapTooltip>
            <Popover
              open={openViews}
              anchorEl={anchorElViews}
              onClose={handleCloseViews}
              anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
              PaperProps={{
                style: {
                  width: '350px',
                  maxHeight: '400px',
                  overflowY: 'scroll'
                }
              }}
            >
              <Grid container xs={12}>
                <Grid item xs={12} p={0.5}>
                  <List dense subheader={<ListSubheader>Views</ListSubheader>}>
                    <Divider />
                    {resume?.summary_count?.view > 0 ? (
                      resume?.views?.map((viewer: any, index: number) => (
                        <ListItemButton key={`viewer-${index}`}>
                          <ListItemAvatar>
                            {viewer.avatar ? (
                              <Avatar src={getImagePath(viewer?.avatar)} alt={getFullName(viewer)}></Avatar>
                            ) : (
                              <Avatar alt={getFullName(viewer)}>{getInitials(getFullName(viewer))}</Avatar>
                            )}
                          </ListItemAvatar>
                          <StyledLink href={`/users/view/${viewer?._id}/overview`}>
                            <ListItemText secondary={`@${viewer?.username}`}>{getFullName(viewer)}</ListItemText>
                          </StyledLink>
                          <ListItemSecondaryAction sx={{ pt: 5 }}>
                            <Typography fontSize={13}>{showDate(viewer?.createdAt)}</Typography>
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
          <ButtonGroup sx={{ justifyContent: 'end' }}>
            <Button
              onClick={handleClickOpenAddCallDialog}
              variant='outlined'
              color='secondary'
              startIcon={<Icon icon='ic:round-call' />}
              sx={{ fontSize: '0.75rem', p: 2 }}
            >
              Call History
            </Button>
            <Button
              onClick={handleClickOpenAddInterviewDialog}
              sx={{ fontSize: '0.75rem', p: 2 }}
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
