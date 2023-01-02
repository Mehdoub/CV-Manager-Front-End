// ** React Imports
import {
  useState,
  useEffect,

  //  MouseEvent,
  useCallback
} from 'react'

// ** Next Imports
import Link from 'next/link'
import { GetStaticProps, InferGetStaticPropsType } from 'next/types'

// ** MUI Imports
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'

// import Menu from '@mui/material/Menu'
import Grid from '@mui/material/Grid'

// import Divider from '@mui/material/Divider'
import { DataGrid } from '@mui/x-data-grid'
import { styled } from '@mui/material/styles'

// import MenuItem from '@mui/material/MenuItem'
// import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'

// import CardHeader from '@mui/material/CardHeader'
// import InputLabel from '@mui/material/InputLabel'
// import FormControl from '@mui/material/FormControl'
// import CardContent from '@mui/material/CardContent'
// import {
//   Select,
//   SelectChangeEvent
// } from '@mui/material/Select'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Store Imports
import { useDispatch, useSelector } from 'react-redux'

// ** Custom Components Imports
// import CustomChip from 'src/@core/components/mui/chip'
import CustomAvatar from 'src/@core/components/mui/avatar'
import CardStatisticsHorizontal from 'src/@core/components/card-statistics/card-stats-horizontal'

// ** Utils Import
import { getInitials } from 'src/@core/utils/get-initials'

// ** Actions Imports
import { fetchData } from 'src/store/apps/project'

// ** Third Party Components
// import axios from 'axios'

// ** Types Imports
// import { RootState, AppDispatch } from 'src/store'
import { CardStatsType } from 'src/@fake-db/types'

// import { ThemeColor } from 'src/@core/layouts/types'
// import { UsersType } from 'src/types/apps/userTypes'
import { CardStatsHorizontalProps } from 'src/@core/components/card-statistics/types'

// ** Custom Table Components Imports
import TableHeader from 'src/views/pages/project/list/TableHeader'
import AddUserDrawer from 'src/views/pages/project/list/AddProjectDrawer'
import { AvatarGroup, Stack } from '@mui/material'
import { BootstrapTooltip } from '../companies'

// interface UserRoleType {
//   [key: string]: { icon: string; color: string }
// }

// interface UserStatusType {
//   [key: string]: ThemeColor
// }

// // ** Vars
// const userRoleObj: UserRoleType = {
//   admin: { icon: 'mdi:laptop', color: 'error.main' },
//   author: { icon: 'mdi:cog-outline', color: 'warning.main' },
//   editor: { icon: 'mdi:pencil-outline', color: 'info.main' },
//   maintainer: { icon: 'mdi:chart-donut', color: 'success.main' },
//   subscriber: { icon: 'mdi:account-outline', color: 'primary.main' }
// }

// interface CellType {
//   row: UsersType
// }

// const userStatusObj: UserStatusType = {
//   active: 'success',
//   pending: 'warning',
//   inactive: 'secondary'
// }

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
  if (row.avatar.length) {
    return <CustomAvatar src={row.avatar} sx={{ mr: 3, width: 34, height: 34 }} />
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

// const RowOptions = ({ id }: { id: number | string }) => {
//   // ** Hooks
//   const dispatch = useDispatch<any>()

//   // ** State
//   const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)

//   const rowOptionsOpen = Boolean(anchorEl)

//   const handleRowOptionsClick = (event: MouseEvent<HTMLElement>) => {
//     setAnchorEl(event.currentTarget)
//   }
//   const handleRowOptionsClose = (e?: any) => {
//     if (e) {
//       e.preventDefault()
//     }
//     setAnchorEl(null)
//   }

//   const handleDelete = () => {
//     handleRowOptionsClose()
//   }

//   return (
//     <>
//       <IconButton size='small' onClick={handleRowOptionsClick}>
//         <Icon icon='mdi:dots-vertical' />
//       </IconButton>
//       <Menu
//         keepMounted
//         anchorEl={anchorEl}
//         open={rowOptionsOpen}
//         onClose={handleRowOptionsClose}
//         anchorOrigin={{
//           vertical: 'bottom',
//           horizontal: 'right'
//         }}
//         transformOrigin={{
//           vertical: 'top',
//           horizontal: 'right'
//         }}
//         PaperProps={{ style: { minWidth: '8rem' } }}
//       >
//         <MenuItem
//           component={Link}
//           sx={{ '& svg': { mr: 2 } }}
//           onClick={handleRowOptionsClose}
//           href='/apps/user/view/overview/'
//         >
//           <Icon icon='mdi:eye-outline' fontSize={20} />
//           View
//         </MenuItem>
//         <MenuItem onClick={handleRowOptionsClose} sx={{ '& svg': { mr: 2 } }}>
//           <Icon icon='mdi:pencil-outline' fontSize={20} />
//           Edit
//         </MenuItem>
//         <MenuItem onClick={handleDelete} sx={{ '& svg': { mr: 2 } }}>
//           <Icon icon='mdi:delete-outline' fontSize={20} />
//           Delete
//         </MenuItem>
//       </Menu>
//     </>
//   )
// }

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
            <StyledLink href='/user/view/overview/' onClick={e => e.preventDefault()}>
              {project_id}
            </StyledLink>
            {/* <Typography noWrap variant='caption'>
              {`@${username}`}
            </Typography> */}
          </Box>
        </Box>
      )
    }
  },
  {
    flex: 0.2,
    minWidth: 250,
    field: 'company',
    headerName: 'Company',
    renderCell: ({ row }: any) => {
      return (
        <Typography noWrap variant='body2'>
          <StyledLink href='/' onClick={e => e.preventDefault()}>
            {row.company}
          </StyledLink>
        </Typography>
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

  // {
  //   flex: 0.15,
  //   field: 'role',
  //   minWidth: 150,
  //   headerName: 'Role',
  //   renderCell: ({ row }: CellType) => {
  //     return (
  //       <Box sx={{ display: 'flex', alignItems: 'center', '& svg': { mr: 3, color: userRoleObj[row.role].color } }}>
  //         <Icon icon={userRoleObj[row.role].icon} fontSize={20} />
  //         <Typography noWrap sx={{ color: 'text.secondary', textTransform: 'capitalize' }}>
  //           {row.role}
  //         </Typography>
  //       </Box>
  //     )
  //   }
  // },
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

  // {
  //   flex: 0.1,
  //   minWidth: 110,
  //   field: 'status',
  //   headerName: 'Status',
  //   renderCell: ({ row }: CellType) => {
  //     return (
  //       <CustomChip
  //         skin='light'
  //         size='small'
  //         label={row.status}
  //         color={userStatusObj[row.status]}
  //         sx={{ textTransform: 'capitalize', '& .MuiChip-label': { lineHeight: '18px' } }}
  //       />
  //     )
  //   }
  // },
  {
    flex: 0.1,
    minWidth: 90,
    sortable: false,
    field: 'actions',
    headerName: 'Actions',
    renderCell: ({ row }: any) => (
      <Stack direction='row' spacing={2}>
        <BootstrapTooltip title='view' placement='top'>
          <StyledLink href={`/projects/${row.project_id}`} onClick={e => e.preventDefault()}>
            <Icon icon='mdi:eye-outline' fontSize={20} />
          </StyledLink>
        </BootstrapTooltip>
        <BootstrapTooltip title='edit' placement='top'>
          <StyledLink href={`/projects/edit`} onClick={e => e.preventDefault()}>
            <Icon icon='mdi:pencil-outline' fontSize={20} />
          </StyledLink>
        </BootstrapTooltip>
        <BootstrapTooltip title='delete' placement='top'>
          <StyledLink href={`/projects/delete`} onClick={e => e.preventDefault()}>
            <Icon icon='mdi:delete-outline' fontSize={20} />
          </StyledLink>
        </BootstrapTooltip>
      </Stack>
    )
  }
]

const UserList = ({ apiData }: InferGetStaticPropsType<typeof getStaticProps>) => {
  // ** State
  // const [role, setRole] = useState<string>('')
  // const [plan, setPlan] = useState<string>('')
  // const [status, setStatus] = useState<string>('')
  const [value, setValue] = useState<string>('')
  const [pageSize, setPageSize] = useState<number>(10)
  const [addUserOpen, setAddUserOpen] = useState<boolean>(false)

  // ** Hooks
  const dispatch = useDispatch<any>()
  const store = useSelector((state: any) => state.user)

  useEffect(() => {
    dispatch(fetchData())
  }, [dispatch, value])

  const handleFilter = useCallback((val: string) => {
    setValue(val)
  }, [])

  // const handleRoleChange = useCallback((e: SelectChangeEvent) => {
  //   setRole(e.target.value)
  // }, [])

  // const handlePlanChange = useCallback((e: SelectChangeEvent) => {
  //   setPlan(e.target.value)
  // }, [])

  // const handleStatusChange = useCallback((e: SelectChangeEvent) => {
  //   setStatus(e.target.value)
  // }, [])

  const toggleAddUserDrawer = () => setAddUserOpen(!addUserOpen)

  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        {apiData && (
          <Grid container spacing={6}>
            {apiData.statsHorizontal.map((item: CardStatsHorizontalProps, index: number) => {
              return (
                <Grid item xs={12} md={3} sm={6} key={index}>
                  <CardStatisticsHorizontal {...item} icon={<Icon icon={item.icon as string} />} />
                </Grid>
              )
            })}
          </Grid>
        )}
      </Grid>
      <Grid item xs={12}>
        <Card>
          {/* <CardHeader title='Search Filters' sx={{ pb: 4, '& .MuiCardHeader-title': { letterSpacing: '.15px' } }} />
          <CardContent>
            <Grid container spacing={6}>
              <Grid item sm={4} xs={12}>
                <FormControl fullWidth>
                  <InputLabel id='role-select'>Select Role</InputLabel>
                  <Select
                    fullWidth
                    value={role}
                    id='select-role'
                    label='Select Role'
                    labelId='role-select'
                    onChange={handleRoleChange}
                    inputProps={{ placeholder: 'Select Role' }}
                  >
                    <MenuItem value=''>Select Role</MenuItem>
                    <MenuItem value='admin'>Admin</MenuItem>
                    <MenuItem value='author'>Author</MenuItem>
                    <MenuItem value='editor'>Editor</MenuItem>
                    <MenuItem value='maintainer'>Maintainer</MenuItem>
                    <MenuItem value='subscriber'>Subscriber</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item sm={4} xs={12}>
                <FormControl fullWidth>
                  <InputLabel id='plan-select'>Select Plan</InputLabel>
                  <Select
                    fullWidth
                    value={plan}
                    id='select-plan'
                    label='Select Plan'
                    labelId='plan-select'
                    onChange={handlePlanChange}
                    inputProps={{ placeholder: 'Select Plan' }}
                  >
                    <MenuItem value=''>Select Plan</MenuItem>
                    <MenuItem value='basic'>Basic</MenuItem>
                    <MenuItem value='company'>Company</MenuItem>
                    <MenuItem value='enterprise'>Enterprise</MenuItem>
                    <MenuItem value='team'>Team</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item sm={4} xs={12}>
                <FormControl fullWidth>
                  <InputLabel id='status-select'>Select Status</InputLabel>
                  <Select
                    fullWidth
                    value={status}
                    id='select-status'
                    label='Select Status'
                    labelId='status-select'
                    onChange={handleStatusChange}
                    inputProps={{ placeholder: 'Select Role' }}
                  >
                    <MenuItem value=''>Select Role</MenuItem>
                    <MenuItem value='pending'>Pending</MenuItem>
                    <MenuItem value='active'>Active</MenuItem>
                    <MenuItem value='inactive'>Inactive</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          </CardContent>
          <Divider /> */}
          <TableHeader value={value} handleFilter={handleFilter} toggle={toggleAddUserDrawer} />
          <DataGrid
            autoHeight
            rows={store.data}
            columns={columns}

            // checkboxSelection
            pageSize={pageSize}
            disableSelectionOnClick
            rowsPerPageOptions={[10, 25, 50]}
            sx={{ '& .MuiDataGrid-columnHeaders': { borderRadius: 0 } }}
            onPageSizeChange={(newPageSize: number) => setPageSize(newPageSize)}
          />
        </Card>
      </Grid>

      <AddUserDrawer open={addUserOpen} toggle={toggleAddUserDrawer} />
    </Grid>
  )
}

export const getStaticProps: GetStaticProps = async () => {
  // const res = await axios.get('/cards/statistics')
  const apiData: CardStatsType = {
    statsHorizontal: [
      {
        stats: '8,458',
        trend: 'negative',
        trendNumber: '8.1%',
        title: 'New Customers',
        icon: 'mdi:account-outline'
      },
      {
        icon: 'mdi:poll',
        stats: '$28.5k',
        color: 'warning',
        trendNumber: '18.2%',
        title: 'Total Profit'
      },
      {
        color: 'info',
        stats: '2,450k',
        trend: 'negative',
        icon: 'mdi:trending-up',
        trendNumber: '24.6%',
        title: 'New Transactions'
      },
      {
        stats: '$48.2K',
        color: 'success',
        icon: 'mdi:currency-usd',
        trendNumber: '22.5%',
        title: 'Total Revenue'
      }
    ],
    statsVertical: [
      {
        stats: '155k',
        color: 'primary',
        icon: 'mdi:cart-plus',
        trendNumber: '+22%',
        title: 'Total Orders',
        chipText: 'Last 4 Month'
      },
      {
        stats: '$89.34k',
        color: 'warning',
        trend: 'negative',
        trendNumber: '-18%',
        title: 'Total Profit',
        icon: 'mdi:wallet-giftcard',
        chipText: 'Last One Year'
      },
      {
        icon: 'mdi:link',
        color: 'info',
        stats: '142.8k',
        trendNumber: '+62%',
        chipText: 'Last One Year',
        title: 'Total Impression'
      },
      {
        stats: '$13.4k',
        color: 'success',
        trendNumber: '+38%',
        icon: 'mdi:currency-usd',
        title: 'Total Sales',
        chipText: 'Last Six Months'
      },
      {
        color: 'error',
        stats: '$8.16k',
        trend: 'negative',
        trendNumber: '-16%',
        title: 'Total Expenses',
        icon: 'mdi:briefcase-outline',
        chipText: 'Last One Month'
      },
      {
        stats: '$2.55k',
        color: 'secondary',
        icon: 'mdi:trending-up',
        trendNumber: '+46%',
        title: 'Transactions',
        chipText: 'Last One Year'
      }
    ],
    statsCharacter: [
      {
        stats: '8.14k',
        title: 'Ratings',
        chipColor: 'primary',
        trendNumber: '+15.6%',
        chipText: 'Year of 2022',
        src: '/images/cards/card-stats-img-1.png'
      },
      {
        stats: '12.2k',
        trend: 'negative',
        title: 'Sessions',
        chipColor: 'success',
        trendNumber: '-25.5%',
        chipText: 'Last Month',
        src: '/images/cards/card-stats-img-2.png'
      },
      {
        stats: '42.4k',
        title: 'Customers',
        chipColor: 'warning',
        trendNumber: '+9.2%',
        chipText: 'Daily Customers',
        src: '/images/cards/card-stats-img-3.png'
      },
      {
        stats: '4.25k',
        trendNumber: '+10.8%',
        chipColor: 'secondary',
        title: 'Total Orders',
        chipText: 'Last Week',
        src: '/images/cards/card-stats-img-4.png'
      }
    ]
  }

  return {
    props: {
      apiData
    }
  }
}

export default UserList
