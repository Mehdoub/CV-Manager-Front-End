// ** React Imports
import { useState, useEffect } from 'react'

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
import { useDispatch } from 'react-redux'
import { useSelector } from 'react-redux'
import { fetchData } from 'src/store/apps/project'
import { renderClient } from 'src/pages/projects'
import Link from 'next/link'
import { AvatarGroup, Button, Grid } from '@mui/material'
import { BootstrapTooltip } from 'src/pages/companies'
import { getCompanyProjects } from 'src/store/company'

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
            <StyledLink href={`/projects/view/${id}/overview/`}>{name}</StyledLink>
          </Box>
        </Box>
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

const resumeColumns = [
  {
    flex: 0.2,
    minWidth: 230,
    field: 'project_id',
    headerName: 'Project',
    renderCell: ({ row }: any) => {
      const { project_id, username } = row

      return (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          {renderClient(row)}
          <Box sx={{ display: 'flex', alignItems: 'flex-start', flexDirection: 'column' }}>
            <StyledLink href='/user/view/overview/' onClick={e => e.preventDefault()}>
              {project_id}
            </StyledLink>
            <Typography noWrap variant='caption'>
              {`${username}`}
            </Typography>
          </Box>
        </Box>
      )
    }
  },
  {
    flex: 0.15,
    minWidth: 120,
    headerName: 'Resumes Number',
    field: 'resumesNumber',
    renderCell: ({ row }: any) => {
      return (
        <Typography variant='subtitle1' noWrap sx={{ textTransform: 'capitalize' }}>
          {row.resumesNumber}
        </Typography>
      )
    }
  }
]

const positionColumns = [
  {
    flex: 0.2,
    minWidth: 230,
    field: 'project_id',
    headerName: 'Project',
    renderCell: ({ row }: any) => {
      const { project_id, username } = row

      return (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          {renderClient(row)}
          <Box sx={{ display: 'flex', alignItems: 'flex-start', flexDirection: 'column' }}>
            <StyledLink href='/user/view/overview/' onClick={e => e.preventDefault()}>
              {project_id}
            </StyledLink>
            <Typography noWrap variant='caption'>
              {`${username}`}
            </Typography>
          </Box>
        </Box>
      )
    }
  },
  {
    flex: 0.15,
    minWidth: 120,
    headerName: 'Positions Number',
    field: 'resumesNumber',
    renderCell: ({ row }: any) => {
      return (
        <Typography variant='subtitle1' noWrap sx={{ textTransform: 'capitalize' }}>
          {row.resumesNumber}
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
  const [pageSize, setPageSize] = useState<number>(7)

  const dispatch = useDispatch<any>()
  const store = useSelector((state: any) => state.user)

  const companyProjectsStore = useSelector((state: any) => state.companyProjects)
  const { data: projects } = companyProjectsStore

  useEffect(() => {
    dispatch(fetchData())
    dispatch(getCompanyProjects(companyId))
  }, [dispatch])

  return (
    <Grid container spacing={6}>
      <Grid item xs={6}>
        <Card>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between' }}>
            <CardHeader title='Most Resumes' />
          </Box>
          <DataGrid
            autoHeight
            rows={store.data}
            columns={resumeColumns}
            pageSize={pageSize}
            disableSelectionOnClick
            rowsPerPageOptions={[7, 10, 25, 50]}
            onPageSizeChange={newPageSize => setPageSize(newPageSize)}
          />
        </Card>
      </Grid>
      <Grid item xs={6}>
        <Card>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between' }}>
            <CardHeader title='Most Positions' />
          </Box>
          <DataGrid
            autoHeight
            rows={store.data}
            columns={positionColumns}
            pageSize={pageSize}
            disableSelectionOnClick
            rowsPerPageOptions={[7, 10, 25, 50]}
            onPageSizeChange={newPageSize => setPageSize(newPageSize)}
          />
        </Card>
      </Grid>
      <Grid item xs={12}>
        <Card>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between' }}>
            <CardHeader title='Latest Projects' />
            {/* <TextField size='small' value={value} sx={{ mr: 6, mb: 2 }} placeholder='Search Project' /> */}
          </Box>
          <DataGrid
            autoHeight
            rows={projects}
            columns={columns}
            pageSize={pageSize}
            disableSelectionOnClick
            rowsPerPageOptions={[7, 10, 25, 50]}
            onPageSizeChange={newPageSize => setPageSize(newPageSize)}
          />
        </Card>
      </Grid>
    </Grid>
  )
}

export default CompanyViewProjects
