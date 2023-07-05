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
  Typography,
  createFilterOptions,
  styled
} from '@mui/material'
import CustomTextField from 'src/@core/components/custom-textfield'
import {
  getColorCodes,
  getFullName,
  getImagePath,
  getMaxTextLen,
  getObjectKeys,
  handleCopyClick,
  isForbiddenState,
  ratingTextsObj,
  roundNumber,
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
  addAssigneeToResume,
  addTagToResume,
  clearResumeAddAssignee,
  clearResumeAddTag,
  clearResumeRemoveAssignee,
  clearResumeRemoveTag,
  getResume,
  removeAssigneeFromResume,
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
import ResumeEndWorkDialog from './ResumeEndWorkDialog'
import InsertLinkIcon from '@mui/icons-material/InsertLink'
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline'
import HighlightOffIcon from '@mui/icons-material/HighlightOff'
import BookmarkAddIcon from '@mui/icons-material/BookmarkAdd'
import PersonAddIcon from '@mui/icons-material/PersonAdd'
import InterpreterModeIcon from '@mui/icons-material/InterpreterMode'
import CallIcon from '@mui/icons-material/Call'
import VisibilityIcon from '@mui/icons-material/Visibility'
import CloseIcon from '@mui/icons-material/Close'
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew'
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos'
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline'
import { useSettings } from 'src/@core/hooks/useSettings'

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

const ResumeDialogHeader = ({
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
  const [openResumeEndWorkDialog, setOpenResumeEndWorkDialog] = useState<boolean>(false)
  const [anchorElStatesMenu, setAnchorElStatesMenu] = useState<null | HTMLElement>(null)
  const [copyText, setCopyText] = useState<string>('Copy Link')

  const dispatch = useDispatch()
  const router = useRouter()
  const { settings } = useSettings()

  const { data: resume } = useSelector((state: any) => state.resume)
  const { data: positionResumes } = useSelector((state: any) => state.positionResumes)
  const { status: resumeStateUpdateStatus, loading: resumeStateUpdateLoading } = useSelector(
    (state: any) => state.resumeUpdateStatus
  )
  const { data: tags } = useSelector((state: any) => state.tags)
  const { data: createdTag } = useSelector((state: any) => state.tagCreate)
  const { status: resumeAddTagStatus } = useSelector((state: any) => state.resumeAddTag)
  const { status: resumeRemoveTagStatus } = useSelector((state: any) => state.resumeRemoveTag)
  const { status: resumeAddAssigneeStatus } = useSelector((state: any) => state.resumeAddAssignee)
  const { status: resumeRemoveAssigneeStatus } = useSelector((state: any) => state.resumeRemoveAssignee)
  const { data: users } = useSelector((state: any) => state.usersList)
  const { data: constants } = useSelector((state: any) => state.constants)

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
    if (resumeAddAssigneeStatus) {
      dispatch(getResume(resume.id))
      dispatch(getPositionResumes(resume?.position_id?._id))
      dispatch(clearResumeAddAssignee())
      handleCloseAddContributor()
    }
  }, [resumeAddAssigneeStatus])

  useEffect(() => {
    if (resumeRemoveAssigneeStatus) {
      dispatch(getResume(resume.id))
      dispatch(getPositionResumes(resume?.position_id?._id))
      dispatch(clearResumeRemoveAssignee())
    }
  }, [resumeRemoveAssigneeStatus])

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
  const handleCloseResumeEndWorkDialog = () => setOpenResumeEndWorkDialog(false)

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

  const resumeLink = location.origin + router.asPath

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

  const addAssigneeToResumeHandler = (userId: string) => {
    dispatch(addAssigneeToResume({ resumeId: resume?.id, userId }))
  }

  const removeAssigneeFromResumeHandler = (userId: string) => {
    dispatch(removeAssigneeFromResume({ resumeId: resume?.id, userId }))
  }

  const createTagHandler = (name: string) => {
    dispatch(createTag({ name }))
  }

  const searchUsers = (value: any) => {
    const query = value?.target?.value
    if (query?.length > 0) dispatch(getUsers({ query }))
  }

  return (
    <>
      <IconButton size='small' onClick={closeToggle} sx={{ position: 'absolute', right: '0.05rem', top: '0.05rem' }}>
        <CloseIcon />
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
          justifyContent: 'space-between',
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
                <BootstrapTooltip title={copyText} placement='top'>
                  <Button
                    onClick={() => handleCopyClick(resumeLink, setCopyText)}
                    sx={{ p: 0, mb: 1, ml: 1, justifyContent: 'end', minWidth: 0 }}
                    color='secondary'
                  >
                    <InsertLinkIcon />
                  </Button>
                </BootstrapTooltip>
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
          lg={3}
          xs={12}
          sx={{ textAlign: 'right', display: 'flex', flexDirection: 'column', alignItems: 'center', minWidth: '225px' }}
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
                <ArrowBackIosNewIcon />
              </IconButton>
            </BootstrapTooltip>
            <BootstrapTooltip placement='top' title='Change Status'>
              <Button
                size='small'
                variant='contained'
                color={(resume?.status && resumesStates[resume?.status]?.color) ?? 'info'}
                disabled={resumeStateUpdateLoading}
                onClick={handleClickStatesMenu}
                sx={{ minWidth: '100px' }}
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
                <ArrowForwardIosIcon />
              </IconButton>
            </BootstrapTooltip>
          </Box>
          {resume?.status == 'hired' ? (
            <Button
              startIcon={<ErrorOutlineIcon />}
              color='warning'
              onClick={() => setOpenResumeEndWorkDialog(true)}
              variant='outlined'
              size='small'
              sx={{ mt: 3, mr: 1 }}
            >
              End Work
            </Button>
          ) : (
            <ButtonGroup size='small' variant='outlined' sx={{ mt: 3, mr: 1 }}>
              <Button
                startIcon={<CheckCircleOutlineIcon />}
                color='success'
                onClick={() => setOpenResumeHiringDialog(true)}
                disabled={isForbiddenState(resume?.status)}
              >
                Hiring
              </Button>
              <Button
                startIcon={<HighlightOffIcon />}
                color='error'
                onClick={() => setOpenResumeRejectingDialog(true)}
                disabled={isForbiddenState(resume?.status)}
              >
                Reject
              </Button>
            </ButtonGroup>
          )}
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
                          backgroundColor: hexToRGBA(tag?.color, settings.mode == 'dark' ? 0.4 : 0.12),
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
                <BookmarkAddIcon sx={{ fontSize: 20 }} />
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
                      <CustomTextField
                        {...params}
                        label='Add Tag'
                        placeholder='Search Tags ...'
                        onChange={searchTags}
                      />
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
                            sx={{
                              backgroundColor: hexToRGBA(tag?.color, settings.mode == 'dark' ? 0.4 : 0.12),
                              color: tag?.color
                            }}
                          />
                          <ListItemSecondaryAction>
                            <Typography>{tag?.count}</Typography>
                          </ListItemSecondaryAction>
                        </ListItem>
                      )
                    }
                    onChange={(event, newValue) => {
                      if (newValue?._id) {
                        addTagToResumeHandler(newValue?._id)
                        handleCloseAddTag()
                      } else if (newValue && newValue.inputValue) {
                        createTagHandler(newValue.inputValue)
                      }
                    }}
                    filterOptions={(options, params) => {
                      const filtered = filter(options, params)

                      const { inputValue } = params
                      // Suggest the creation of a new tag
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
          <BootstrapTooltip placement='top' title={ratingTextsObj[roundNumber(resume?.rating) ?? 0]}>
            <div style={{ display: 'inline', cursor: 'pointer' }}>
              <Rating readOnly value={roundNumber(resume?.rating) ?? 0} sx={{ mr: 5 }} name='read-only' size='small' />
            </div>
          </BootstrapTooltip>
        </Grid>
      </Grid>
      <Grid lg={6} xs={12} item container sx={{ textAlign: 'left', p: 5 }}>
        <Grid item container lg={7} xs={12}>
          <Grid item container xs={12} sx={{ textAlign: 'left', alignItems: 'end' }} spacing={2}>
            <Grid item xs={12} mt={10} ml={1}>
              <Typography variant='body2'>Assignee(s):</Typography>
            </Grid>
            {resume?.assigners?.length > 0 &&
              resume?.assigners?.map((contributorUser: any, index: number) => (
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
                      onDelete={() => removeAssigneeFromResumeHandler(contributorUser?._id)}
                      label={
                        <Link
                          style={{ textDecoration: 'none', color: settings.mode == 'dark' ? 'white' : '#4c4e64de' }}
                          href={`/users/view/${contributorUser?._id}/overview`}
                        >
                          {uppercaseFirstLetters(getMaxTextLen(getFullName(contributorUser)))}
                        </Link>
                      }
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
                  <PersonAddIcon sx={{ fontSize: 19 }} />
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
                    onChange={(e: any, newValue: any) => addAssigneeToResumeHandler(newValue?._id)}
                    renderInput={params => (
                      <CustomTextField
                        {...params}
                        label='Contributor'
                        placeholder='Search Users ...'
                        onChange={searchUsers}
                      />
                    )}
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
          xs={12}
          mt={3}
          sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'inherit', flexDirection: 'column' }}
        >
          <Grid item sx={{ textAlign: 'right' }}>
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
                  sx={{
                    '& .MuiBadge-badge': {
                      width: 16,
                      height: 16,
                      fontSize: 10
                    }
                  }}
                >
                  <VisibilityIcon sx={{ fontSize: 36 }} />
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
                  width: '450px',
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
                            {viewer?.created_by.avatar ? (
                              <Avatar
                                src={getImagePath(viewer?.created_by?.avatar)}
                                alt={getFullName(viewer?.created_by)}
                              ></Avatar>
                            ) : (
                              <Avatar alt={getFullName(viewer?.created_by)}>
                                {getInitials(getFullName(viewer?.created_by))}
                              </Avatar>
                            )}
                          </ListItemAvatar>
                          <StyledLink href={`/users/view/${viewer?.created_by?._id}/overview`}>
                            <ListItemText secondary={`@${viewer?.created_by?.username}`}>
                              {getFullName(viewer?.created_by)}
                            </ListItemText>
                          </StyledLink>
                          <ListItemSecondaryAction sx={{ pt: 5 }}>
                            <Typography fontSize={13}>{showDate(viewer?.createdAt, true)}</Typography>
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
              startIcon={<CallIcon />}
              sx={{ fontSize: '0.75rem', p: 2 }}
            >
              Call History
            </Button>
            <Button
              onClick={handleClickOpenAddInterviewDialog}
              sx={{ fontSize: '0.75rem', p: 2 }}
              variant='outlined'
              color='secondary'
              startIcon={<InterpreterModeIcon />}
            >
              Add Interview
            </Button>
          </ButtonGroup>
        </Grid>
      </Grid>
      {getObjectKeys(constants?.resume)?.length > 0 && (
        <>
          <ResumeHiringDialog open={openResumeHiringDialog} handleClose={handleCloseResumeHiringDialog} />
          <ResumeRejectingDialog open={openResumeRejectingDialog} handleClose={handleCloseResumeRejectingDialog} />
          <ResumeEndWorkDialog open={openResumeEndWorkDialog} handleClose={handleCloseResumeEndWorkDialog} />
        </>
      )}
    </>
  )
}

export default ResumeDialogHeader
