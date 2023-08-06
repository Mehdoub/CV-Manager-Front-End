import { Autocomplete, Avatar, Chip, Grid, IconButton, ListItem, ListItemAvatar, ListItemText, Popover, Typography } from "@mui/material"
import Link from "next/link"
import BootstrapTooltip from "src/@core/components/bootstrap-tooltip"
import { getInitials } from "src/@core/utils/get-initials"
import { getFullName, getImagePath, getMaxTextLen, uppercaseFirstLetters } from "src/helpers/functions"
import CustomAvatar from 'src/@core/components/mui/avatar'
import CustomTextField from "src/@core/components/custom-textfield"
import { useSettings } from "src/@core/hooks/useSettings"
import { useSelector } from "react-redux"
import { useEffect, useState } from "react"
import { getUsers } from "src/store/user"
import { useDispatch } from "react-redux"
import { addAssigneeToResume, clearResumeAddAssignee, clearResumeRemoveAssignee, getResume, getResumes, removeAssigneeFromResume } from "src/store/resume"
import { getPositionResumes } from "src/store/position"
import PersonAddIcon from '@mui/icons-material/PersonAdd'

interface Props {
  allResumes: boolean
}

const AssigneesManagement = ({ allResumes }: Props) => {
  const [anchorElAddContributor, setAnchorElAddContributor] = useState<HTMLButtonElement | null>(null)

  const { settings } = useSettings()
  const dispatch = useDispatch()

  const { data: resume } = useSelector((state: any) => state.resume)
  const { data: users } = useSelector((state: any) => state.usersList)
  const { status: resumeAddAssigneeStatus } = useSelector((state: any) => state.resumeAddAssignee)
  const { status: resumeRemoveAssigneeStatus } = useSelector((state: any) => state.resumeRemoveAssignee)

  useEffect(() => {
    dispatch(getUsers())
  }, [])

  useEffect(() => {
    if (resumeAddAssigneeStatus) {
      dispatch(getResume(resume.id))
      if (!allResumes) dispatch(getPositionResumes(resume?.position_id?._id))
      else dispatch(getResumes())
      dispatch(clearResumeAddAssignee())
      handleCloseAddContributor()
    }
  }, [resumeAddAssigneeStatus])

  useEffect(() => {
    if (resumeRemoveAssigneeStatus) {
      dispatch(getResume(resume.id))
      if (!allResumes) dispatch(getPositionResumes(resume?.position_id?._id))
      else dispatch(getResumes())
      dispatch(clearResumeRemoveAssignee())
    }
  }, [resumeRemoveAssigneeStatus])

  const openAddContributor = Boolean(anchorElAddContributor)

  const handleClickAddContributor = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorElAddContributor(event.currentTarget)
  }

  const handleCloseAddContributor = () => {
    setAnchorElAddContributor(null)
  }

  const addAssigneeToResumeHandler = (userId: string) => {
    dispatch(addAssigneeToResume({ resumeId: resume?.id, userId }))
  }

  const removeAssigneeFromResumeHandler = (userId: string) => {
    dispatch(removeAssigneeFromResume({ resumeId: resume?.id, userId }))
  }

  const searchUsers = (value: any) => {
    const query = value?.target?.value
    dispatch(getUsers({ query }))
  }

  return (
    <>
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
        <Grid container p={3}>
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
    </>
  )
}

export default AssigneesManagement
