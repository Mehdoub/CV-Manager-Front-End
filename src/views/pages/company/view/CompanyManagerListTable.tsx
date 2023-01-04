// ** React Imports
import { useState } from 'react'

// ** MUI Imports
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import { DataGrid } from '@mui/x-data-grid'
import { styled } from '@mui/material/styles'
import TextField from '@mui/material/TextField'
import CardHeader from '@mui/material/CardHeader'
import Typography from '@mui/material/Typography'
import Icon from 'src/@core/components/icon'
import CustomChip from 'src/@core/components/mui/chip'
import CardContent from '@mui/material/CardContent'
import CustomAvatar from 'src/@core/components/mui/avatar'

// ** Type Imports
import Link from 'next/link'
import { AvatarGroup, Button, Grid, Stack } from '@mui/material'
import { BootstrapTooltip } from 'src/pages/companies'
import { getInitials } from 'src/@core/utils/get-initials'
import users from 'src/data/users.json'

const statusColors: any = {
  manager: 'success',
  owner: 'error'
}

const renderClient = (row: any) => {
  if (row.userImg.length) {
    return <CustomAvatar src={row.userImg} sx={{ mr: 3, width: 34, height: 34 }} />
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

const columns = [
  {
    flex: 0.2,
    minWidth: 230,
    field: 'project_id',
    headerName: 'Project',
    renderCell: ({ row }: any) => {
      const { project_id } = row

      return (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          {renderClient(row)}
          <Box sx={{ display: 'flex', alignItems: 'flex-start', flexDirection: 'column' }}>
            <StyledLink href={`/users/view/${row.firstname} ${row.lastname}`} onClick={e => e.preventDefault()}>
              {`${row.firstname} ${row.lastname}`}
            </StyledLink>
          </Box>
        </Box>
      )
    }
  },
  {
    flex: 0.15,
    minWidth: 120,
    headerName: 'Type',
    field: 'type',
    renderCell: ({ row }: any) => {
      return (
        <Typography variant='subtitle1' noWrap sx={{ textTransform: 'capitalize' }}>
          <CustomChip
            skin='light'
            size='small'
            label={row.type}
            color={statusColors[row.type]}
            sx={{
              height: 20,
              fontWeight: 500,
              fontSize: '0.75rem',
              borderRadius: '5px',
              textTransform: 'capitalize'
            }}
          />
        </Typography>
      )
    }
  },
  {
    flex: 0.15,
    minWidth: 120,
    headerName: 'Assign Time',
    field: 'created_at',
    renderCell: ({ row }: any) => {
      return (
        <Typography variant='subtitle1' noWrap sx={{ textTransform: 'capitalize' }}>
          {row.created_at}
        </Typography>
      )
    }
  },
  {
    flex: 0.15,
    minWidth: 120,
    headerName: 'Assigned By',
    field: 'created_by',
    renderCell: ({ row }: any) => {
      return (
        <Typography variant='subtitle1' noWrap sx={{ textTransform: 'capitalize' }}>
          <StyledLink href={`/users/${row.created_by}`} onClick={e => e.preventDefault()}>
            {row.created_by}
          </StyledLink>
        </Typography>
      )
    }
  },
  {
    flex: 0.1,
    minWidth: 90,
    sortable: false,
    field: 'actions',
    headerName: ' ',
    renderCell: ({ row }: any) => (
      <Stack direction='row' spacing={2}>
        {/* <BootstrapTooltip title='view' placement='top'>
          <StyledLink href={`/projects/${row.project_id}`} onClick={e => e.preventDefault()}>
            <Icon icon='mdi:eye-outline' fontSize={20} />
          </StyledLink>
        </BootstrapTooltip>
        <BootstrapTooltip title='edit' placement='top'>
          <StyledLink href={`/projects/edit`} onClick={e => e.preventDefault()}>
            <Icon icon='mdi:pencil-outline' fontSize={20} />
          </StyledLink>
        </BootstrapTooltip> */}
        <BootstrapTooltip title='delete' placement='top'>
          <StyledLink href={`/projects/delete`} onClick={e => e.preventDefault()}>
            <Icon icon='mdi:delete-outline' fontSize={20} />
          </StyledLink>
        </BootstrapTooltip>
      </Stack>
    )
  }
]

const CompanyManagerListTable = () => {
  // ** State
  const [value, setValue] = useState<string>('')
  const [pageSize, setPageSize] = useState<number>(7)

  return (
    <Grid>
      <Card>
        <CardContent>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'flex-end' }}>
            <TextField size='small' value={value} sx={{ mr: 6, mb: 2 }} placeholder='Search Manager' />

            <Button sx={{ mb: 2 }} variant='contained'>
              Add Manager
            </Button>
          </Box>
        </CardContent>
        <DataGrid
          autoHeight
          rows={users}
          columns={columns}
          pageSize={pageSize}
          disableSelectionOnClick
          rowsPerPageOptions={[7, 10, 25, 50]}
          onPageSizeChange={newPageSize => setPageSize(newPageSize)}
        />
      </Card>
    </Grid>
  )
}

export default CompanyManagerListTable
