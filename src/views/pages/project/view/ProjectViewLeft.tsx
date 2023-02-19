// ** React Imports
import { useEffect, useState } from 'react'

// ** MUI Imports
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import Button from '@mui/material/Button'
import Divider from '@mui/material/Divider'
import { styled } from '@mui/material/styles'
import Typography from '@mui/material/Typography'
import CardContent from '@mui/material/CardContent'
import CardActions from '@mui/material/CardActions'

// ** Custom Components
import CustomChip from 'src/@core/components/mui/chip'
import CustomAvatar from 'src/@core/components/mui/avatar'
import ProjectSuspendDialog from 'src/views/pages/project/view/ProjectSuspendDialog'

// ** Types
import { ThemeColor } from 'src/@core/layouts/types'

// ** Utils Import
import { getInitials } from 'src/@core/utils/get-initials'
import { useDispatch } from 'react-redux'
import { getProject } from 'src/store/project'
import { useSelector } from 'react-redux'
import { Skeleton } from '@mui/material'
import Translations from 'src/layouts/components/Translations'
import Link from 'next/link'
import ProjectEditDialog from './ProjectEditDialog'

interface ColorsType {
  [key: string]: ThemeColor
}

const statusColors: ColorsType = {
  active: 'success',
  inactive: 'error'
}

const StyledLink = styled(Link)(({ theme }) => ({
  fontWeight: 600,
  fontSize: '1rem',
  cursor: 'pointer',
  textDecoration: 'none',
  color: theme.palette.text.secondary,
  '&:hover': {
    color: theme.palette.primary.main
  }
}))

interface Props {
  projectId: string
}

const ProjectViewLeft = ({ projectId }: Props) => {
  // ** States
  const [openEdit, setOpenEdit] = useState<boolean>(false)
  const [suspendDialogOpen, setSuspendDialogOpen] = useState<boolean>(false)

  // Handle Edit dialog
  const handleEditClickOpen = () => setOpenEdit(true)
  const handleEditClose = () => setOpenEdit(false)

  const dispatch = useDispatch()
  const store = useSelector((state: any) => state.projectFind)
  const { data: project, loading } = store

  useEffect(() => {
    if (projectId) dispatch(getProject(projectId))
  }, [projectId])

  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <Card>
          <CardContent sx={{ pt: 15, display: 'flex', alignItems: 'center', flexDirection: 'column' }}>
            {project?.logo?.length ? (
              <CustomAvatar
                src={project?.logo}
                variant='rounded'
                alt={project?.name}
                sx={{ width: 150, height: 150, fontWeight: 600, mb: 4, fontSize: '3rem', borderRadius: '50%' }}
              />
            ) : (
              <CustomAvatar
                skin='light'
                variant='rounded'
                color='primary'
                sx={{ width: 150, height: 150, fontWeight: 600, mb: 4, fontSize: '3rem', borderRadius: '50%' }}
              >
                {getInitials(project?.name)}
              </CustomAvatar>
            )}
            <Typography variant='h6' sx={{ mb: 2 }}>
              {project?.name}
            </Typography>
            {loading && <Skeleton animation='wave' width='35%' height={30} style={{ marginBottom: '7px' }} />}
            {loading ? (
              <Skeleton animation='wave' width='15%' height={30} style={{ marginBottom: '7px' }} />
            ) : (
              <CustomChip
                skin='light'
                size='small'
                label={project?.is_active ? 'active' : 'inactive'}
                color={statusColors[project?.is_active ? 'active' : 'inactive']}
                sx={{
                  height: 20,
                  fontWeight: 500,
                  fontSize: '0.75rem',
                  borderRadius: '5px',
                  textTransform: 'capitalize'
                }}
              />
            )}
          </CardContent>
          <CardContent>
            <Typography variant='h6'>Details</Typography>
            <Divider sx={{ mt: theme => `${theme.spacing(4)} !important` }} />
            <Box sx={{ display: 'flex', mb: 2.7 }}>
              <Typography sx={{ mr: 2, fontWeight: 500, fontSize: '0.875rem' }}>Company:</Typography>
              <StyledLink href={`/companies/view/${project?.company_id?.id}/overview`}>
                {project?.company_id?.name}
              </StyledLink>
            </Box>
            <Box sx={{ pt: 2, pb: 1 }}>
              <Box sx={{ display: 'flex', mb: 2.7 }}>
                <Typography sx={{ mr: 2, fontWeight: 500, fontSize: '0.875rem' }}>Description:</Typography>
                <Typography variant='body2'>{project?.description}</Typography>
              </Box>
            </Box>
          </CardContent>

          {!loading && (
            <CardActions sx={{ display: 'flex', justifyContent: 'center' }}>
              <Button variant='contained' sx={{ mr: 2 }} onClick={handleEditClickOpen}>
                <Translations text='companies.view.edit' />
              </Button>
              {project?.is_active ? (
                <Button color='error' variant='outlined' onClick={() => setSuspendDialogOpen(true)}>
                  <Translations text='companies.view.suspend' />
                </Button>
              ) : (
                <Button color='success' variant='outlined' onClick={() => setSuspendDialogOpen(true)}>
                  <Translations text='companies.view.activate' />
                </Button>
              )}
            </CardActions>
          )}

          <ProjectEditDialog open={openEdit} closeHandler={handleEditClose}  />

          <ProjectSuspendDialog open={suspendDialogOpen} setOpen={setSuspendDialogOpen} />
        </Card>
      </Grid>
    </Grid>
  )
}

export default ProjectViewLeft
