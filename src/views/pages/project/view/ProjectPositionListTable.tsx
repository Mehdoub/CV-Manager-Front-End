// ** React Imports
import { useState, useEffect } from 'react'

// ** MUI Imports
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import { DataGrid } from '@mui/x-data-grid'
import { styled } from '@mui/material/styles'
import CardHeader from '@mui/material/CardHeader'
import Typography from '@mui/material/Typography'
import CustomAvatar from 'src/@core/components/mui/avatar'
import AddProjectDrawer from 'src/views/pages/project/list/AddProjectDrawer'

// ** Type Imports
import { useDispatch } from 'react-redux'
import { useSelector } from 'react-redux'
import Link from 'next/link'
import { AvatarGroup, Button, Grid } from '@mui/material'
import { BootstrapTooltip } from 'src/pages/companies'
import { getProjectPositions } from 'src/store/project'
import { getFullName } from 'src/helpers/functions'
import { getInitials } from 'src/@core/utils/get-initials'

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

const renderClient = (row: any, field = 'logo') => {
  if (row[field]?.length) {
    return <CustomAvatar src={row[field]} sx={{ mr: 3, width: 34, height: 34 }} />
  } else {
    return (
      <CustomAvatar skin='light' color='primary' sx={{ mr: 3, width: 34, height: 34, fontSize: '1rem' }}>
        {getInitials(row?.title ?? 'John Doe')}
      </CustomAvatar>
    )
  }
}

const ProjectPositionListTable = () => {
  // ** State
  const [pageSize, setPageSize] = useState<number>(7)

  const dispatch = useDispatch<any>()
  const { data: project } = useSelector((state: any) => state.projectFind)

  const { data: positions, loading: loadingPositions } = useSelector((state: any) => state.projectPositions)

  useEffect(() => {
    if (project?.id) dispatch(getProjectPositions())
  }, [project?.id])

  const [addProjectOpen, setAddProjectOpen] = useState<boolean>(false)
  const toggleAddProjectDrawer = () => setAddProjectOpen(!addProjectOpen)

  const latestPositionColumns = [
    {
      flex: 0.2,
      minWidth: 230,
      field: 'position',
      headerName: 'Position',
      renderCell: ({ row }: any) => {
        const { id, title } = row

        return (
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            {renderClient(row)}
            <Box sx={{ display: 'flex', alignItems: 'flex-start', flexDirection: 'column' }}>
              <StyledLink href={`/positions/view/${id}/overview/`}>{title}</StyledLink>
            </Box>
          </Box>
        )
      }
    },
    {
      flex: 0.1,
      field: 'managers',
      minWidth: 120,
      headerName: 'Managers',
      renderCell: ({ row }: any) =>
        row?.managers?.length > 0 ? (
          <AvatarGroup className='pull-up'>
            {row?.managers?.map((manager: any, index: any) => (
              <BootstrapTooltip
                key={index}
                title={`${manager?.user_id?.firstname} ${manager?.user_id?.lastname}`}
                placement='top'
              >
                <CustomAvatar src={manager?.user_id?.avatar} sx={{ height: 26, width: 26 }} />
              </BootstrapTooltip>
            ))}
          </AvatarGroup>
        ) : (
          '---'
        )
    },
    {
      flex: 0.2,
      minWidth: 230,
      field: 'created_by',
      headerName: 'User Create',
      renderCell: ({ row }: any) => {
        const { created_by } = row

        return (
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Box sx={{ display: 'flex', alignItems: 'flex-start', flexDirection: 'column' }}>
              <StyledLink href={`/users/view/${created_by?.id}/overview/`}>{getFullName(created_by)}</StyledLink>
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
            {new Date(row?.createdAt).toDateString()}
          </Typography>
        )
      }
    }
  ]

  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <Card>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between' }}>
            <CardHeader title='Latest Positions' />
            <Button sx={{ mt: 2, mr: 5 }} variant='contained' onClick={toggleAddProjectDrawer}>
              Add Position
            </Button>
          </Box>
          <DataGrid
            autoHeight
            rows={positions ?? []}
            columns={latestPositionColumns}
            pageSize={pageSize}
            disableSelectionOnClick
            rowsPerPageOptions={[10]}
            onPageSizeChange={newPageSize => setPageSize(newPageSize)}
          />
        </Card>
      </Grid>
      <AddProjectDrawer open={addProjectOpen} toggle={toggleAddProjectDrawer} />
    </Grid>
  )
}

export default ProjectPositionListTable
