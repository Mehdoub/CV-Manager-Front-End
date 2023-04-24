// ** React Imports
import { useState, useEffect } from 'react'

// ** Next Imports
import Link from 'next/link'

// ** MUI Imports
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'

import Grid from '@mui/material/Grid'

import { DataGrid } from '@mui/x-data-grid'
import { styled } from '@mui/material/styles'

import Typography from '@mui/material/Typography'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Store Imports
import { useDispatch, useSelector } from 'react-redux'

// ** Custom Components Imports
import CustomAvatar from 'src/@core/components/mui/avatar'
import BootstrapTooltip from 'src/@core/components/bootstrap-tooltip'

// ** Utils Import
import { getInitials } from 'src/@core/utils/get-initials'

// ** Actions Imports
import { fetchData } from 'src/store/apps/project'

// ** Custom Table Components Imports
import { AvatarGroup, Button } from '@mui/material'

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

// ** renders client column
const renderClient = (row: any) => {
  if (row.logo.length) {
    return <CustomAvatar src={row.logo} sx={{ mr: 3, width: 34, height: 34 }} />
  } else {
    return (
      <CustomAvatar
        skin='light'
        color={row.avatarColor || 'primary'}
        sx={{ mr: 3, width: 34, height: 34, fontSize: '1rem' }}
      >
        {getInitials(row.fullName ? row.fullName : 'John Doe')}
      </CustomAvatar>
    )
  }
}

const columns = [
  {
    flex: 0.2,
    minWidth: 230,
    field: 'company',
    headerName: 'Company',
    renderCell: ({ row }: any) => {
      const { company } = row

      return (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          {renderClient(row)}
          <Box sx={{ display: 'flex', alignItems: 'flex-start', flexDirection: 'column' }}>
            <StyledLink href={`/companies/view/${row.id}/overview`}>{company}</StyledLink>
          </Box>
        </Box>
      )
    }
  },
  {
    flex: 0.1,
    field: 'team',
    minWidth: 150,
    headerName: 'Managers',
    renderCell: ({ row }: any) =>
      row?.avatarGroup.length > 0 ? (
        <AvatarGroup className='pull-up'>
          {row?.avatarGroup?.map((src: any, index: any) => (
            <BootstrapTooltip key={index} title='Manager Name' placement='top'>
              <CustomAvatar src={src} sx={{ height: 26, width: 26 }} />
            </BootstrapTooltip>
          ))}
        </AvatarGroup>
      ) : (
        '---'
      )
  },
  {
    flex: 0.1,
    field: 'projects',
    minWidth: 150,
    headerName: 'Projects',
    renderCell: ({ row }: any) =>
      row?.logoGroup.length > 0 ? (
        <AvatarGroup className='pull-up'>
          {row?.logoGroup?.map((src: any, index: any) => (
            <BootstrapTooltip key={index} title='Project Name' placement='top'>
              <CustomAvatar src={src} sx={{ height: 26, width: 26 }} />
            </BootstrapTooltip>
          ))}
        </AvatarGroup>
      ) : (
        '---'
      )
  },
  {
    flex: 0.15,
    minWidth: 120,
    headerName: 'User Create',
    field: 'username',
    renderCell: ({ row }: any) => {
      return (
        <Typography variant='subtitle1' noWrap sx={{ textTransform: 'capitalize' }}>
          <StyledLink href={`/users/${row.username}`} onClick={e => e.preventDefault()}>
            {row.username}
          </StyledLink>
        </Typography>
      )
    }
  },
  {
    flex: 0.15,
    minWidth: 120,
    headerName: 'Time Create',
    field: 'time_created',
    renderCell: ({ row }: any) => {
      return (
        <Typography variant='subtitle1' noWrap sx={{ textTransform: 'capitalize' }}>
          {row.time_created}
        </Typography>
      )
    }
  }
]

const UserViewCompany = () => {
  // ** State
  const [pageSize, setPageSize] = useState<number>(10)

  // ** Hooks
  const dispatch = useDispatch<any>()
  const store = useSelector((state: any) => state.user)

  useEffect(() => {
    dispatch(fetchData())
  }, [dispatch])

  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <Card>
          <Box
            sx={{
              p: 5,
              pb: 3,
              display: 'flex',
              flexWrap: 'wrap',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}
          >
            <Button
              sx={{ mr: 4, mb: 2 }}
              color='secondary'
              variant='outlined'
              startIcon={<Icon icon='mdi:export-variant' fontSize={20} />}
            >
              Export
            </Button>
          </Box>
          <DataGrid
            autoHeight
            rows={store.data}
            columns={columns}
            pageSize={pageSize}
            disableSelectionOnClick
            rowsPerPageOptions={[10, 25, 50]}
            sx={{ '& .MuiDataGrid-columnHeaders': { borderRadius: 0 } }}
            onPageSizeChange={(newPageSize: number) => setPageSize(newPageSize)}
          />
        </Card>
      </Grid>
    </Grid>
  )
}

export default UserViewCompany
