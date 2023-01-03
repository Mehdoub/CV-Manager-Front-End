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
import CardContent from '@mui/material/CardContent'
import CustomAvatar from 'src/@core/components/mui/avatar'

// ** Type Imports
import { renderClient } from 'src/pages/projects'
import Link from 'next/link'
import { AvatarGroup, Grid } from '@mui/material'
import { BootstrapTooltip } from 'src/pages/companies'
import users from 'src/data/users.json'

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
  // {
  //   flex: 0.2,
  //   minWidth: 230,
  //   field: 'project_id',
  //   headerName: 'Project',
  //   renderCell: ({ row }: any) => {
  //     const { project_id } = row

  //     return (
  //       <Box sx={{ display: 'flex', alignItems: 'center' }}>
  //         {renderClient(row)}
  //         <Box sx={{ display: 'flex', alignItems: 'flex-start', flexDirection: 'column' }}>
  //           <StyledLink href='/projects/view/' onClick={e => e.preventDefault()}>
  //             {project_id}
  //           </StyledLink>
  //         </Box>
  //       </Box>
  //     )
  //   }
  // },
  {
    flex: 0.15,
    minWidth: 120,
    headerName: 'Full Name',
    field: 'fullName',
    renderCell: ({ row }: any) => {
      return (
        <Typography variant='subtitle1' noWrap sx={{ textTransform: 'capitalize' }}>
          <StyledLink href={`/users/view/${row.firstname} ${row.lastname}`} onClick={e => e.preventDefault()}>
            {`${row.firstname} ${row.lastname}`}
          </StyledLink>
        </Typography>
      )
    }
  },
  {
    flex: 0.15,
    minWidth: 120,
    headerName: 'Mobile',
    field: 'mobile',
    renderCell: ({ row }: any) => {
      return (
        <Typography variant='subtitle1' noWrap sx={{ textTransform: 'capitalize' }}>
            {row.mobile}
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
]

const CompanyManagerListTable = () => {
  // ** State
  const [value, setValue] = useState<string>('')
  const [pageSize, setPageSize] = useState<number>(7)

  return (
    <Grid>
      <Card>
        <CardHeader title="Company's Managers List" />
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
            <Typography variant='body2' sx={{ mr: 2 }}>
              Search:
            </Typography>
            <TextField
              size='small'
              placeholder='Search Resume'
              value={value}
              onChange={e => setValue(e.target.value)}
            />
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
