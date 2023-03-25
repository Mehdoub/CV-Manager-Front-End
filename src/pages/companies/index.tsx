// ** React Imports
import { useState, useEffect, useCallback, useRef } from 'react'

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
import CustomChip from 'src/@core/components/mui/chip'
import CardStatisticsHorizontal from 'src/@core/components/card-statistics/card-stats-horizontal'

// ** Utils Import
import { getInitials } from 'src/@core/utils/get-initials'

// ** Custom Table Components Imports
import TableHeader from 'src/views/pages/company/list/TableHeader'
import { AvatarGroup, Skeleton, Tooltip, TooltipProps, tooltipClasses } from '@mui/material'
import { Stack } from '@mui/system'
import { getCompanies } from 'src/store/company'
import CompanyEditDialog from 'src/views/pages/company/view/CompanyEditDialog'
import AddCompanyDrawer from 'src/views/pages/company/list/AddCompanyDrawer'
import { getFullName, getImagePath, showDate } from 'src/helpers/functions'
import { useTranslation } from 'react-i18next'

const statusColors: any = {
  active: 'success',
  inactive: 'error'
}

export const BootstrapTooltip = styled(({ className, ...props }: TooltipProps) => (
  <Tooltip {...props} arrow classes={{ popper: className }} />
))(({ theme }) => ({
  [`& .${tooltipClasses.arrow}`]: {
    color: theme.palette.common.black
  },
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: theme.palette.common.black
  }
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

// ** renders client column
const renderClient = (row: any, field = 'logo') => {
  if (row[field]?.length) {
    return <CustomAvatar src={getImagePath(row[field])} sx={{ mr: 3, width: 34, height: 34 }} />
  } else {
    return (
      <CustomAvatar skin='light' color='primary' sx={{ mr: 3, width: 34, height: 34, fontSize: '1rem' }}>
        {getInitials(row.name ? row.name : 'John Doe')}
      </CustomAvatar>
    )
  }
}

const apiData = {
  statsHorizontal: [
    {
      stats: '8,458',
      trendNumber: '8.1%',
      title: 'New Resumes',
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
  ]
}

const CompanyList = () => {
  // ** State
  const [searchQuery, setSearchQuery] = useState<string>('')
  const [company, setCompany] = useState<any>({})
  const [pageSize, setPageSize] = useState<number>(10)
  const [page, setPage] = useState<number>(0)
  const [editCompanyOpen, setEditCompanyOpen] = useState<boolean>(false)
  const [addCompanyOpen, setAddCompanyOpen] = useState<boolean>(false)

  // ** Hooks
  const dispatch = useDispatch<any>()
  const store = useSelector((state: any) => state.companiesList)
  const { data: companies, loading } = store
  const { t } = useTranslation()

  const handlePageChange = (newPage: number) => {
    setPage(newPage++)
    dispatch(getCompanies({ page: newPage, size: pageSize, query: searchQuery }))
  }

  useEffect(() => {
    dispatch(getCompanies({ size: pageSize, page: page, query: searchQuery }))
  }, [])

  const clearTimerRef : any = useRef();
  const handleFilter = useCallback((val: string) => {
    setSearchQuery(val)
    clearTimeout(clearTimerRef.current)
    const serachTimeout = setTimeout(() => {
      dispatch(getCompanies({ query: val, size: pageSize }))
    }, 1500)
    clearTimerRef.current = serachTimeout
  }, [])

  const toggleEditCompanyDialog = () => setEditCompanyOpen(!editCompanyOpen)
  const toggleAddCompanyDrawer = () => setAddCompanyOpen(!addCompanyOpen)

  const columns = [
    {
      flex: 0.2,
      minWidth: 230,
      field: 'company',
      headerName: t('companies.list.company'),
      renderCell: ({ row }: any) => {
        const { name } = row

        return (
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            {renderClient(row)}
            <Box sx={{ display: 'flex', alignItems: 'flex-start', flexDirection: 'column' }}>
              <StyledLink href={`/companies/view/${row.id}/overview`}>{name}</StyledLink>
            </Box>
          </Box>
        )
      }
    },
    {
      flex: 0.1,
      field: 'managers',
      minWidth: 120,
      headerName: t('companies.list.managers'),
      renderCell: ({ row }: any) =>
        row?.managers?.length > 0 ? (
          <AvatarGroup className='pull-up'>
            {row?.managers?.map((item: any, index: any) => (
              <BootstrapTooltip
                key={index}
                title={`${item?.user_id?.firstname} ${item?.user_id?.lastname}`}
                placement='top'
              >
                <CustomAvatar src={item?.user_id?.avatar} sx={{ height: 26, width: 26 }} />
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
      minWidth: 120,
      headerName: 'Projects',
      renderCell: ({ row }: any) =>
        row?.projects?.length > 0 ? (
          <AvatarGroup className='pull-up'>
            {row?.projects?.map((item: any, index: any) => (
              <BootstrapTooltip key={index} title={`${item?.name}`} placement='top'>
                <CustomAvatar src={item?.logo} sx={{ height: 26, width: 26 }} />
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
      headerName: 'Time Create',
      field: 'createdAt',
      renderCell: ({ row }: any) => {
        return (
          <Typography variant='subtitle1' noWrap sx={{ textTransform: 'capitalize' }}>
            {showDate(row?.createdAt)}
          </Typography>
        )
      }
    },
    {
      flex: 0.1,
      minWidth: 90,
      sortable: false,
      field: 'actions',
      headerName: 'Actions',
      renderCell: ({ row }: any) => (
        <Stack direction='row' spacing={2}>
          <BootstrapTooltip title='view' placement='top'>
            <StyledLink href={`/companies/view/${row.id}/overview`}>
              <Icon icon='mdi:eye-outline' fontSize={20} />
            </StyledLink>
          </BootstrapTooltip>
          <BootstrapTooltip title='edit' placement='top'>
            <div
              style={{ cursor: 'pointer' }}
              onClick={() => {
                setCompany(row)
                toggleEditCompanyDialog()
              }}
            >
              <Icon icon='mdi:pencil-outline' fontSize={20} />
            </div>
          </BootstrapTooltip>
        </Stack>
      )
    }
  ]

  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        {apiData && (
          <Grid container spacing={6}>
            {apiData.statsHorizontal.map((item: any, index: number) => {
              return (
                <Grid item xs={12} md={3} sm={6} key={index}>
                  {loading ? (
                    <Skeleton variant='rounded' height={100} />
                  ) : (
                    <CardStatisticsHorizontal {...item} icon={<Icon icon={item.icon as string} />} />
                  )}
                </Grid>
              )
            })}
          </Grid>
        )}
      </Grid>
      <Grid item xs={12}>
        <Card>
          <>
            <TableHeader searchQuery={searchQuery} handleFilter={handleFilter} toggle={toggleAddCompanyDrawer} />
            {companies?.docs && !loading ? (
              <DataGrid
                autoHeight
                rows={companies?.docs ?? []}
                columns={columns}
                pageSize={pageSize}
                disableSelectionOnClick
                rowsPerPageOptions={[10]}
                sx={{ '& .MuiDataGrid-columnHeaders': { borderRadius: 0 } }}
                onPageSizeChange={(newPageSize: number) => setPageSize(newPageSize)}
                pagination
                paginationMode='server'
                rowCount={companies?.totalDocs}
                page={page}
                onPageChange={newPage => handlePageChange(newPage)}
              />
            ) : (
              <Skeleton variant='rounded' height={600} />
            )}
          </>
        </Card>
      </Grid>
      <AddCompanyDrawer open={addCompanyOpen} toggle={toggleAddCompanyDrawer} />
      <CompanyEditDialog open={editCompanyOpen} closeHandler={toggleEditCompanyDialog} company={company} />
    </Grid>
  )
}

export default CompanyList
