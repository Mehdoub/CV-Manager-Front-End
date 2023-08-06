import {
  Avatar,
  Badge,
  Button,
  Divider,
  Grid,
  List,
  ListItemAvatar,
  ListItemButton,
  ListItemSecondaryAction,
  ListItemText,
  ListSubheader,
  Popover,
  Typography
} from "@mui/material"
import { useState } from "react"
import { useSelector } from "react-redux"
import BootstrapTooltip from "src/@core/components/bootstrap-tooltip"
import { getInitials } from "src/@core/utils/get-initials"
import { getFullName, getImagePath, showDate } from "src/helpers/functions"
import VisibilityIcon from '@mui/icons-material/Visibility'
import StyledLink from "src/@core/components/styled-link"
import Skelet from "src/@core/components/loading/Skelet"

const ViewsHistory = () => {
  const [anchorElViews, setAnchorElViews] = useState<HTMLButtonElement | null>(null)

  const { data: resume, loading: resumeLoading } = useSelector((state: any) => state.resume)

  const handleClickViews = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorElViews(event.currentTarget)
  }

  const handleCloseViews = () => {
    setAnchorElViews(null)
  }

  const openViews = Boolean(anchorElViews)

  return (
    <>
      <BootstrapTooltip title='Views' placement='top'>
        <Button
          onClick={handleClickViews}
          sx={{ p: 0, mt: 3, justifyContent: 'end', minWidth: 0 }}
          color='secondary'
          disabled={resumeLoading}
        >
          <Skelet
            loading={resumeLoading}
            variant='circular'
            width={35}
            height={35}
            component={<Badge
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
            </Badge>}
          />

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
        <Grid container>
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
    </>
  )
}

export default ViewsHistory
