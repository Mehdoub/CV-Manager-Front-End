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

// import LinearProgress from '@mui/material/LinearProgress'

// ** Third Party Imports
// import axios from 'axios'

// ** Type Imports
import { ProjectListDataType } from 'src/types/apps/userTypes'
import { useDispatch } from 'react-redux'
import { useSelector } from 'react-redux'
import { fetchData } from 'src/store/apps/project'
import { renderClient } from 'src/pages/projects'
import Link from 'next/link'
import { AvatarGroup } from '@mui/material'
import { BootstrapTooltip } from 'src/pages/companies'

interface CellType {
  row: ProjectListDataType
}
const Img = styled('img')(({ theme }) => ({
  width: 32,
  height: 32,
  borderRadius: '50%',
  marginRight: theme.spacing(3)
}))

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
    flex: 0.1,
    field: 'team',
    minWidth: 120,
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
  },
]

const InvoiceListTable = () => {
  // ** State
  const [value, setValue] = useState<string>('')
  const [pageSize, setPageSize] = useState<number>(7)
  const [data, setData] = useState<ProjectListDataType[]>([])

  const dispatch = useDispatch<any>()
  const store = useSelector((state: any) => state.user)

  useEffect(() => {
    dispatch(fetchData())
  }, [dispatch])

  return (
    <Card>
      <CardHeader title="Company's Projects List" />
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
          <Typography variant='body2' sx={{ mr: 2 }}>
            Search:
          </Typography>
          <TextField size='small' placeholder='Search Project' value={value} onChange={e => setValue(e.target.value)} />
        </Box>
      </CardContent>
      <DataGrid
        autoHeight
        rows={store.data}
        columns={columns}
        pageSize={pageSize}
        disableSelectionOnClick
        rowsPerPageOptions={[7, 10, 25, 50]}
        onPageSizeChange={newPageSize => setPageSize(newPageSize)}
      />
    </Card>
  )
}

export default InvoiceListTable
