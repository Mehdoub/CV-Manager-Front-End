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
import SuspendDialog from 'src/views/common/SuspendDialog'

// ** Types
import { ThemeColor } from 'src/@core/layouts/types'

// ** Utils Import
import { getInitials } from 'src/@core/utils/get-initials'
import { useDispatch } from 'react-redux'
import { useSelector } from 'react-redux'
import {
  activePosition,
  clearPositionActive,
  clearPositionDeactive,
  deactivePosition,
  getPosition
} from 'src/store/position'
import { getImagePath, getObjectKeys, uppercaseFirstLetters } from 'src/helpers/functions'
import { Skeleton } from '@mui/material'
import Link from 'next/link'
import Translations from 'src/layouts/components/Translations'
import PositionEditDialog from './PositionEditDialog'
import { useRouter } from 'next/router'

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

const PositionViewLeft = () => {
  // ** States
  const [openEdit, setOpenEdit] = useState<boolean>(false)
  const [suspendDialogOpen, setSuspendDialogOpen] = useState<boolean>(false)

  // Handle Edit dialog
  const handleEditClickOpen = () => setOpenEdit(true)
  const handleEditClose = () => setOpenEdit(false)

  const dispatch = useDispatch()

  const { data: position, loading, errors } = useSelector((state: any) => state.position)
  const { data: constants } = useSelector((state: any) => state.constants)

  const {
    query: { positionId }
  } = useRouter()

  useEffect(() => {
    if ([404, 400].includes(errors?.status)) location.href = '/404'
  }, [errors])

  useEffect(() => {
    if (positionId) dispatch(getPosition(positionId))
  }, [positionId])

  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <Card>
          <CardContent sx={{ pt: 15, display: 'flex', alignItems: 'center', flexDirection: 'column' }}>
            {position?.logo?.length ? (
              <CustomAvatar
                src={getImagePath(position?.logo)}
                variant='rounded'
                alt={position?.title}
                sx={{ width: 150, height: 150, fontWeight: 600, mb: 4, fontSize: '3rem', borderRadius: '50%' }}
              />
            ) : (
              <CustomAvatar
                skin='light'
                variant='rounded'
                color='primary'
                sx={{ width: 150, height: 150, fontWeight: 600, mb: 4, fontSize: '3rem', borderRadius: '50%' }}
              >
                {getInitials(position?.title)}
              </CustomAvatar>
            )}
            {loading && <Skeleton animation='wave' width='35%' height={30} style={{ marginBottom: '7px' }} />}
            <Typography variant='h6' sx={{ mb: 2 }}>
              {uppercaseFirstLetters(position?.title)}
            </Typography>
            {loading ? (
              <Skeleton animation='wave' width='15%' height={30} style={{ marginBottom: '7px' }} />
            ) : (
              <CustomChip
                skin='light'
                size='small'
                label={position?.is_active ? 'active' : 'inactive'}
                color={statusColors[position?.is_active ? 'active' : 'inactive']}
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
              <StyledLink href={`/companies/view/${position?.company_id?.id}/overview`}>
                {uppercaseFirstLetters(position?.company_id?.name)}
              </StyledLink>
            </Box>
            <Box sx={{ display: 'flex', mb: 2.7 }}>
              <Typography sx={{ mr: 2, fontWeight: 500, fontSize: '0.875rem' }}>Project:</Typography>
              <StyledLink href={`/projects/view/${position?.project_id?.id}/overview`}>
                {uppercaseFirstLetters(position?.project_id?.name)}
              </StyledLink>
            </Box>
            <Box sx={{ display: 'flex', mb: 2.7 }}>
              <Typography sx={{ mr: 2, fontWeight: 500, fontSize: '0.875rem' }}>Level:</Typography>
              <Typography variant='body2'>{uppercaseFirstLetters(position?.level)}</Typography>
            </Box>
            <Box sx={{ display: 'flex', mb: 2.7 }}>
              <Typography sx={{ mr: 2, fontWeight: 500, fontSize: '0.875rem' }}>Description:</Typography>
              <Typography variant='body2'>{uppercaseFirstLetters(position?.description)}</Typography>
            </Box>
          </CardContent>

          <CardActions sx={{ display: 'flex', justifyContent: 'center' }}>
            <Button variant='contained' sx={{ mr: 2 }} onClick={handleEditClickOpen}>
              Edit
            </Button>
            {position?.is_active ? (
              <Button color='error' variant='outlined' onClick={() => setSuspendDialogOpen(true)}>
                <Translations text='companies.view.suspend' />
              </Button>
            ) : (
              <Button color='success' variant='outlined' onClick={() => setSuspendDialogOpen(true)}>
                <Translations text='companies.view.activate' />
              </Button>
            )}
          </CardActions>
          {getObjectKeys(constants?.position)?.length > 0 && <PositionEditDialog open={openEdit} closeHandler={handleEditClose} />}

          <SuspendDialog
            open={suspendDialogOpen}
            setOpen={setSuspendDialogOpen}
            type='position'
            entity={position}
            activeStore={useSelector((state: any) => state.positionActive)}
            deactiveStore={useSelector((state: any) => state.positionDeactive)}
            getEntityAction={getPosition}
            activeAction={activePosition}
            deactiveAction={deactivePosition}
            clearActiveAction={clearPositionActive}
            clearDeactiveAction={clearPositionDeactive}
          />
        </Card>
      </Grid>
    </Grid>
  )
}

export default PositionViewLeft
