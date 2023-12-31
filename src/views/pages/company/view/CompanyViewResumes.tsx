// ** React Imports
import { useState, useEffect } from 'react'

// ** MUI Imports
import Card from '@mui/material/Card'
import { DataGrid } from '@mui/x-data-grid'
import { styled } from '@mui/material/styles'
import CardHeader from '@mui/material/CardHeader'
import Typography from '@mui/material/Typography'

// ** Type Imports
import { useDispatch } from 'react-redux'
import { useSelector } from 'react-redux'
import Link from 'next/link'
import { Grid } from '@mui/material'
import { getCompanyResumes } from 'src/store/company'
import { getFullName } from 'src/helpers/functions'

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
    flex: 0.15,
    field: 'fullname',
    headerName: 'Full Name',
    renderCell: ({ row }: any) => {
      return (
        <Typography variant='subtitle1' noWrap sx={{ textTransform: 'capitalize' }}>
          {getFullName(row)}
        </Typography>
      )
    }
  },
  {
    flex: 0.15,
    minWidth: 120,
    headerName: 'Position',
    field: 'position_id',
    renderCell: ({ row }: any) => {
      const { position_id } = row
      return (
        <Typography variant='subtitle1' noWrap sx={{ textTransform: 'capitalize' }}>
          <StyledLink href={`/postions/view/${position_id?.id}/overview`}>{position_id?.title}</StyledLink>
        </Typography>
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
    headerName: 'Time Create',
    field: 'created_at',
    renderCell: ({ row }: any) => {
      return (
        <Typography variant='subtitle1' noWrap sx={{ textTransform: 'capitalize' }}>
          {new Date(row?.createdAt).toDateString()}
        </Typography>
      )
    }
  }
]

interface Props {
  companyId: string
}

const CompanyViewResumes = (props: Props) => {
  const { companyId } = props
  // ** State
  const [pageSize, setPageSize] = useState<number>(7)

  const dispatch = useDispatch<any>()

  const companyResumesStore = useSelector((state: any) => state.companyResumes)
  const { data: latestResumes } = companyResumesStore

  useEffect(() => {
    if (companyId) {
      dispatch(getCompanyResumes(companyId))
    }
  }, [companyId])

  return (
    <Grid container spacing={6}>
      <Grid item md={12}>
        <Card sx={{ marginTop: '20px' }}>
          <CardHeader title='Latest Resumes' />
          <DataGrid
            autoHeight
            rows={latestResumes}
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

export default CompanyViewResumes
