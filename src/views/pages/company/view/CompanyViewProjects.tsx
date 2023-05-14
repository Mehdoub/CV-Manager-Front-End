// ** React Imports
import { useState, useEffect } from 'react'

// ** MUI Imports
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import { DataGrid } from '@mui/x-data-grid'
import { styled } from '@mui/material/styles'
import CardHeader from '@mui/material/CardHeader'
import Typography from '@mui/material/Typography'
import CustomChip from 'src/@core/components/mui/chip'

import { useDispatch } from 'react-redux'
import { useSelector } from 'react-redux'
import { renderClient } from 'src/pages/projects'
import Link from 'next/link'
import { Grid, Skeleton } from '@mui/material'
import { getCompanyProjects } from 'src/store/company'
import { getFullName, statusColors, uppercaseFirstLetters } from 'src/helpers/functions'

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
    field: 'name',
    headerName: 'Project',
    renderCell: ({ row }: any) => {
      const { id, name } = row

      return (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          {renderClient(row)}
          <Box sx={{ display: 'flex', alignItems: 'flex-start', flexDirection: 'column' }}>
            <StyledLink href={`/projects/view/${id}/overview/`}>{uppercaseFirstLetters(name)}</StyledLink>
          </Box>
        </Box>
      )
    }
  },
  {
    flex: 0.15,
    minWidth: 120,
    headerName: 'Status',
    field: 'is_active',
    renderCell: ({ row }: any) => {
      return (
        <CustomChip
          skin='light'
          size='small'
          label={row?.is_active ? 'active' : 'inactive'}
          color={statusColors[row?.is_active ? 'active' : 'inactive']}
          sx={{
            height: 20,
            fontWeight: 500,
            fontSize: '0.75rem',
            borderRadius: '5px',
            textTransform: 'capitalize'
          }}
        />
      )
    }
  },
  {
    flex: 0.15,
    minWidth: 120,
    headerName: 'User Create',
    field: 'created_by',
    renderCell: ({ row }: any) => {
      return (
        <Typography variant='subtitle1' noWrap sx={{ textTransform: 'capitalize' }}>
          <StyledLink href={`/users/view/${row?.created_by?.id}/overview`}>{getFullName(row?.created_by)}</StyledLink>
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
          {new Date(row.createdAt).toDateString()}
        </Typography>
      )
    }
  }
]

interface Props {
  companyId: string
}

const CompanyViewProjects = (props: Props) => {
  const { companyId } = props
  // ** State
  const [pageSize, setPageSize] = useState<number>(10)

  const dispatch = useDispatch<any>()

  const companyProjectsStore = useSelector((state: any) => state.companyProjects)
  const { data: projects, loading } = companyProjectsStore

  useEffect(() => {
    dispatch(getCompanyProjects(companyId))
  }, [dispatch])

  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        {loading ? (
          <Skeleton variant='rounded' height={500} />
        ) : (
          <Card>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between' }}>
              <CardHeader title='Latest Projects' />
            </Box>
            <DataGrid
              autoHeight
              rows={projects}
              columns={columns}
              pageSize={pageSize}
              disableSelectionOnClick
              rowsPerPageOptions={[10]}
              onPageSizeChange={newPageSize => setPageSize(newPageSize)}
            />
          </Card>
        )}
      </Grid>
    </Grid>
  )
}

export default CompanyViewProjects
