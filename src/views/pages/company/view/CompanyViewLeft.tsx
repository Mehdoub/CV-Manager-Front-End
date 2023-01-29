// ** React Imports
import { Fragment, useEffect, useState } from 'react'

// ** MUI Imports
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import Button from '@mui/material/Button'
import Divider from '@mui/material/Divider'
import Typography from '@mui/material/Typography'
import CardContent from '@mui/material/CardContent'
import CardActions from '@mui/material/CardActions'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Custom Components
import CustomChip from 'src/@core/components/mui/chip'
import CustomAvatar from 'src/@core/components/mui/avatar'
import CompanySuspendDialog from 'src/views/pages/company/view/CompanySuspendDialog'

// ** Types
import { ThemeColor } from 'src/@core/layouts/types'

// ** Utils Import
import { getInitials } from 'src/@core/utils/get-initials'
import { useDispatch } from 'react-redux'
import { getCompany } from 'src/store/company'
import { useSelector } from 'react-redux'
import { Skeleton } from '@mui/material'
import CompanyEditDialog from './CompanyEditDialog'
import Translations from 'src/layouts/components/Translations'

interface ColorsType {
  [key: string]: ThemeColor
}

const statusColors: ColorsType = {
  active: 'success',
  inactive: 'secondary'
}

interface Props {
  companyId: string
}

const CompanyViewLeft = ({ companyId }: Props) => {
  // ** States
  const [openEdit, setOpenEdit] = useState<boolean>(false)
  const [suspendDialogOpen, setSuspendDialogOpen] = useState<boolean>(false)

  const dispatch = useDispatch()
  const store = useSelector((state: any) => state.company)
  const {
    data: company,
    // managers,
    loading
  } = store

  useEffect(() => {
    if (companyId) {
      dispatch(getCompany(companyId))
    }
  }, [companyId])

  // Handle Edit dialog
  const handleEditClickOpen = () => setOpenEdit(true)
  const handleEditClose = () => setOpenEdit(false)

  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <Card>
          <CardContent sx={{ pt: 15, display: 'flex', alignItems: 'center', flexDirection: 'column' }}>
            {loading ? (
              <Skeleton animation='wave' variant='circular' width={150} height={150} />
            ) : company?.logo ? (
              <CustomAvatar
                src={company?.logo}
                variant='rounded'
                alt={company?.name}
                sx={{ width: 150, height: 150, fontWeight: 600, mb: 4, fontSize: '3rem', borderRadius: '50%' }}
              />
            ) : (
              <CustomAvatar
                skin='light'
                variant='rounded'
                color='primary'
                sx={{ width: 150, height: 150, fontWeight: 600, mb: 4, fontSize: '3rem', borderRadius: '50%' }}
              >
                {getInitials(company?.name)}
              </CustomAvatar>
            )}
            <Typography variant='h6' sx={{ mb: 2 }}>
              {company?.name}
            </Typography>
            {loading && <Skeleton animation='wave' width='35%' height={30} style={{ marginBottom: '7px' }} />}
            {loading ? (
              <Skeleton animation='wave' width='15%' height={30} style={{ marginBottom: '7px' }} />
            ) : (
              <CustomChip
                skin='light'
                size='small'
                label={company?.is_active ? 'active' : 'inactive'}
                color={statusColors[company?.is_active ? 'active' : 'inactive']}
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
            <Typography variant='h6'>
              <Translations text='companies.view.details' />
            </Typography>
            <Divider sx={{ mt: theme => `${theme.spacing(4)} !important` }} />
            <Box sx={{ pt: 2, pb: 1 }}>
              <Box sx={{ display: 'flex', mb: 2.7 }}>
                <Typography sx={{ mr: 2, fontWeight: 500, fontSize: '0.875rem' }}>Phone:</Typography>
                {loading ? (
                  <Skeleton animation='wave' width='50%' />
                ) : (
                  <Typography variant='body2'>{company?.phone?.length > 0 ? company?.phone : '---'}</Typography>
                )}
              </Box>
              <Box sx={{ display: 'flex', mb: 2.7 }}>
                <Typography sx={{ mr: 2, fontWeight: 500, fontSize: '0.875rem' }}>Address:</Typography>
                {loading ? (
                  <Skeleton animation='wave' width='50%' />
                ) : (
                  <Typography variant='body2'>{company?.address?.length > 0 ? company?.address : '---'}</Typography>
                )}
              </Box>
              <Box sx={{ display: 'flex' }}>
                <Typography sx={{ mr: 2, fontWeight: 500, fontSize: '0.875rem' }}>Description:</Typography>
                {loading ? (
                  <Skeleton animation='wave' width='50%' />
                ) : (
                  <Typography variant='body2'>
                    {company?.description?.length > 0 ? company?.description : '---'}
                  </Typography>
                )}
              </Box>
            </Box>
          </CardContent>
          {!loading && (
            <CardActions sx={{ display: 'flex', justifyContent: 'center' }}>
              <Button variant='contained' sx={{ mr: 2 }} onClick={handleEditClickOpen}>
                <Translations text='companies.view.edit' />
              </Button>
              <Button color='error' variant='outlined' onClick={() => setSuspendDialogOpen(true)}>
                <Translations text='companies.view.suspend' />
              </Button>
            </CardActions>
          )}
          <CompanyEditDialog open={openEdit} closeHandler={handleEditClose} />
          <CompanySuspendDialog open={suspendDialogOpen} setOpen={setSuspendDialogOpen} />
        </Card>
      </Grid>
    </Grid>
  )
}

export default CompanyViewLeft
