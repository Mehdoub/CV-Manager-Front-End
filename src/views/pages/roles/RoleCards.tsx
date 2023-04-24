// ** React Imports
import { SyntheticEvent, useEffect, useState } from 'react'

// ** MUI Imports
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import Link from '@mui/material/Link'
import Table from '@mui/material/Table'
import Button from '@mui/material/Button'
import Avatar from '@mui/material/Avatar'
import Dialog from '@mui/material/Dialog'
import Tooltip from '@mui/material/Tooltip'
import Checkbox from '@mui/material/Checkbox'
import TableRow from '@mui/material/TableRow'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableHead from '@mui/material/TableHead'
import TextField from '@mui/material/TextField'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import FormControl from '@mui/material/FormControl'
import DialogTitle from '@mui/material/DialogTitle'
import AvatarGroup from '@mui/material/AvatarGroup'
import CardContent from '@mui/material/CardContent'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import TableContainer from '@mui/material/TableContainer'
import FormControlLabel from '@mui/material/FormControlLabel'

// ** Icon Imports
import Icon from 'src/@core/components/icon'
import RoleViewDialog from './RoleViewDialog'
import { useDispatch } from 'react-redux'
import { getRoles } from 'src/store/role'
import { useSelector } from 'react-redux'
import { getPermissionsGrouped } from 'src/store/permission'
import { Skeleton } from '@mui/material'
import { getFullName, getImagePath } from 'src/helpers/functions'
import BootstrapTooltip from 'src/@core/components/bootstrap-tooltip'

interface CardDataType {
  title: string
  avatars: string[]
  totalUsers: number
}

const cardData: CardDataType[] = [
  { totalUsers: 4, title: 'Administrator', avatars: ['1.png', '2.png', '3.png', '4.png'] },
  { totalUsers: 7, title: 'Manager', avatars: ['5.png', '6.png', '7.png', '8.png', '1.png', '2.png', '3.png'] },
  { totalUsers: 5, title: 'Users', avatars: ['4.png', '5.png', '6.png', '7.png', '8.png'] },
  { totalUsers: 3, title: 'Support', avatars: ['1.png', '2.png', '3.png'] },
  { totalUsers: 2, title: 'Restricted User', avatars: ['4.png', '5.png'] }
]

const rolesArr: string[] = [
  'User Management',
  'Content Management',
  'Disputes Management',
  'Database Management',
  'Financial Management',
  'Reporting',
  'API Control',
  'Repository Management',
  'Payroll'
]

const RolesCards = () => {
  // ** States
  const [open, setOpen] = useState<boolean>(false)
  const [dialogTitle, setDialogTitle] = useState<'Add' | 'Edit'>('Add')
  const [editRoleData, setEditRoleData] = useState<any>({})
  const [selectedCheckbox, setSelectedCheckbox] = useState<string[]>([])
  const [isIndeterminateCheckbox, setIsIndeterminateCheckbox] = useState<boolean>(false)

  const dispatch = useDispatch()

  const { data: roles, loading: loadingRoles } = useSelector((state: any) => state.roles)

  useEffect(() => {
    dispatch(getRoles())
    dispatch(getPermissionsGrouped())
  }, [])

  const handleClickOpen = () => setOpen(true)

  const handleClose = () => {
    setOpen(false)
    setSelectedCheckbox([])
    setIsIndeterminateCheckbox(false)
  }

  const togglePermission = (id: string) => {
    const arr = selectedCheckbox
    if (selectedCheckbox.includes(id)) {
      arr.splice(arr.indexOf(id), 1)
      setSelectedCheckbox([...arr])
    } else {
      arr.push(id)
      setSelectedCheckbox([...arr])
    }
  }

  const handleSelectAllCheckbox = () => {
    if (isIndeterminateCheckbox) {
      setSelectedCheckbox([])
    } else {
      rolesArr.forEach(row => {
        const id = row.toLowerCase().split(' ').join('-')
        togglePermission(`${id}-read`)
        togglePermission(`${id}-write`)
        togglePermission(`${id}-create`)
      })
    }
  }

  useEffect(() => {
    if (selectedCheckbox.length > 0 && selectedCheckbox.length < rolesArr.length * 3) {
      setIsIndeterminateCheckbox(true)
    } else {
      setIsIndeterminateCheckbox(false)
    }
  }, [selectedCheckbox])

  const renderCards = () =>
    roles?.length > 0 &&
    roles?.map((role: any, index: number) => (
      <Grid item xs={12} sm={6} lg={4} key={index} sx={{ minHeight: '170px' }}>
        <Card>
          <CardContent>
            <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant='body2'>{`Total ${role?.usersCount} user(s)`}</Typography>
              <AvatarGroup
                className='pull-up'
                max={4}
                sx={{ '& .MuiAvatar-root': { width: 40, height: 40, fontSize: '0.875rem' } }}
              >
                {role?.users?.length > 0 ? (
                  role?.users?.map((user: any, index: number) => (
                    <BootstrapTooltip key={index} title={getFullName(user)} placement='top'>
                      <Avatar key={index} alt={getFullName(user)} src={getImagePath(user?.avatar)} />
                    </BootstrapTooltip>
                  ))
                ) : (
                  <Skeleton variant='circular' animation={false} width={40} height={40} />
                )}
              </AvatarGroup>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
              <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                <Typography variant='h6'>{role?.name}</Typography>
                <Typography
                  href='/'
                  variant='body2'
                  component={Link}
                  sx={{ color: 'primary.main' }}
                  onClick={(e: SyntheticEvent) => {
                    e.preventDefault()
                    setDialogTitle('Edit')
                    setEditRoleData(role)
                    handleClickOpen()
                  }}
                >
                  Edit Role
                </Typography>
              </Box>
              <IconButton sx={{ color: 'text.secondary' }}>
                <Icon icon='mdi:content-copy' fontSize={20} />
              </IconButton>
            </Box>
          </CardContent>
        </Card>
      </Grid>
    ))

  return (
    <Grid container spacing={6} className='match-height'>
      {loadingRoles ? (
        <>
          <Grid style={{ paddingTop: 0 }} item xs={12} sm={6} lg={4}>
            <Skeleton height={200} />
          </Grid>
          <Grid style={{ paddingTop: 0 }} item xs={12} sm={6} lg={4}>
            <Skeleton height={200} />
          </Grid>
          <Grid style={{ paddingTop: 0 }} item xs={12} sm={6} lg={4}>
            <Skeleton height={200} />
          </Grid>
        </>
      ) : (
        renderCards()
      )}
      <Grid item xs={12} sm={6} lg={4}>
        <Card
          sx={{ cursor: 'pointer' }}
          onClick={() => {
            handleClickOpen()
            setDialogTitle('Add')
          }}
        >
          <Grid container sx={{ height: '100%' }}>
            <Grid item xs={5}>
              <Box sx={{ height: '100%', display: 'flex', alignItems: 'flex-end', justifyContent: 'center' }}>
                <img width={65} height={130} alt='add-role' src='/images/pages/add-new-role-illustration.png' />
              </Box>
            </Grid>
            <Grid item xs={7}>
              <CardContent>
                <Box sx={{ textAlign: 'right' }}>
                  <Button
                    variant='contained'
                    sx={{ mb: 2.5, whiteSpace: 'nowrap' }}
                    onClick={() => {
                      setDialogTitle('Add')
                      setEditRoleData({})
                      handleClickOpen()
                    }}
                  >
                    Add Role
                  </Button>
                  <Typography variant='body2'>Add role, if it doesn't exist.</Typography>
                </Box>
              </CardContent>
            </Grid>
          </Grid>
        </Card>
      </Grid>
      <RoleViewDialog open={open} toggle={handleClose} dialogTitle={dialogTitle} editRoleData={editRoleData} />
    </Grid>
  )
}

export default RolesCards
