// ** React Imports
import { useState } from 'react'

// ** MUI Imports
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import { DataGrid } from '@mui/x-data-grid'
import { styled } from '@mui/material/styles'
import Typography from '@mui/material/Typography'
import CustomChip from 'src/@core/components/mui/chip'
import CustomAvatar from 'src/@core/components/mui/avatar'

// ** Type Imports
import Link from 'next/link'
import { Grid } from '@mui/material'
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
    headerName: 'User',
    renderCell: ({ row }: any) => {
      return (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          {renderClient(row)}
          <Box sx={{ display: 'flex', alignItems: 'flex-start', flexDirection: 'column' }}>
            <StyledLink href={`/users/view/${row.id}/overview`}>
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
          <StyledLink href={`/users/view/${row.id}/overview`}>
            {row.created_by}
          </StyledLink>
        </Typography>
      )
    }
  },
]

const ProjectManagerListTable = () => {
  // ** State
  // const [value, setValue] = useState<string>('')
  const [pageSize, setPageSize] = useState<number>(7)

  return (
    <Grid>
      <Card>
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

export default ProjectManagerListTable
