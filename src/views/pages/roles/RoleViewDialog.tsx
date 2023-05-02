import TabContext from '@mui/lab/TabContext'
import TabList from '@mui/lab/TabList'
import TabPanel from '@mui/lab/TabPanel'
import {
  Box,
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  FormControlLabel,
  FormHelperText,
  Grid,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Tooltip,
  Typography
} from '@mui/material'
import { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { useSelector } from 'react-redux'
import Icon from 'src/@core/components/icon'
import { getEntityIcon, shuffle, uppercaseFirstLetters } from 'src/helpers/functions'
import { clearCreateRole, clearEditRole, createRole, editRole, getRoles } from 'src/store/role'

interface RoleViewDialogProps {
  open: boolean
  toggle: () => void
  dialogTitle: string
  editRoleData: any
}

const RoleViewDialog = ({ open, toggle, dialogTitle, editRoleData }: RoleViewDialogProps) => {
  const [activeTab, setActiveTab] = useState<string>('roles')
  const [roleName, setRoleName] = useState<string>('')
  const [roleNameErr, setRoleNameErr] = useState<string>('')
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([])
  const [isIndeterminateCheckbox, setIsIndeterminateCheckbox] = useState<boolean>(false)

  const dispatch = useDispatch()

  const { data: entities } = useSelector((state: any) => state.permissionsGrouped)
  const { status: statusCreate } = useSelector((state: any) => state.roleCreate)
  const { status: statusEdit } = useSelector((state: any) => state.roleEdit)

  useEffect(() => {
    if (statusCreate) {
      clearCreateRole()
      dispatch(getRoles())
      toggle()
    }
    if (statusEdit) {
      clearEditRole()
      dispatch(getRoles())
      toggle()
    }
  }, [statusCreate, statusEdit])

  useEffect(() => {
    if (dialogTitle == 'Edit') {
      setRoleName(editRoleData?.name)
      setSelectedPermissions(editRoleData?.permissions)
    } else {
      setRoleName('')
      setSelectedPermissions([])
    }
  }, [editRoleData, dialogTitle])

  const togglePermission = (id: string) => {
    let arr = [...selectedPermissions]
    if (selectedPermissions.includes(id)) {
      arr.splice(arr.indexOf(id), 1)
      setSelectedPermissions([...arr])
    } else {
      arr = [...arr, id]
      setSelectedPermissions([...arr])
    }
  }

  const renderPermissions = (permission: any) => {
    return (
      <Grid md={4} item key={permission?._id}>
        <FormControlLabel
          label={permission?.name}
          control={
            <Checkbox
              size='small'
              id={permission?._id}
              onChange={() => togglePermission(permission?._id)}
              checked={selectedPermissions.includes(permission?._id)}
            />
          }
        />
      </Grid>
    )
  }

  // const handleSelectAllCheckbox = () => {
  //   if (isIndeterminateCheckbox) {
  //     setSelectedPermissions([])
  //   } else {
  //     rolesArr.forEach(row => {
  //       const id = row.toLowerCase().split(' ').join('-')
  //       togglePermission(`${id}-read`)
  //       togglePermission(`${id}-write`)
  //       togglePermission(`${id}-create`)
  //     })
  //   }
  // }

  const handleTabChange = (e: any, value: string) => {
    setActiveTab(value)
  }

  const handleSubmit = () => {
    if (!roleName.trim().length) {
      setRoleNameErr('Role Name Cannot Be Empty')
    } else {
      setRoleNameErr('')
      let sendData = { name: roleName, permissions: selectedPermissions }
      if (dialogTitle == 'Add') dispatch(createRole(sendData))
      else dispatch(editRole({ ...sendData, id: editRoleData?._id }))
    }
  }

  return (
    <Dialog fullWidth maxWidth='md' scroll='body' onClose={toggle} open={open}>
      <DialogTitle sx={{ textAlign: 'center' }}>
        <Typography variant='h5' component='span'>
          {`${dialogTitle} Role`}
        </Typography>
        <Typography variant='body2'>Set Role Permissions</Typography>
      </DialogTitle>
      <DialogContent sx={{ p: { xs: 6, sm: 12 }, minHeight: '450px' }}>
        <Box sx={{ my: 4 }}>
          <FormControl fullWidth>
            <TextField
              value={roleName}
              onChange={e => setRoleName(e.target.value)}
              label='Role Name'
              placeholder='Enter Role Name'
              error={!!roleNameErr}
            />
            {roleNameErr && <FormHelperText sx={{ color: 'error.main' }}>{roleNameErr}</FormHelperText>}
          </FormControl>
        </Box>
        <TabContext value={activeTab}>
          <TabList
            variant='scrollable'
            scrollButtons='auto'
            onChange={handleTabChange}
            aria-label='forced scroll tabs example'
            sx={{ borderBottom: theme => `1px solid ${theme.palette.divider}` }}
          >
            {entities.length > 0 &&
              entities?.map(
                (item: any, index: number) =>
                  item?.entity?.length > 0 && (
                    <Tab
                      key={`${item?.entity}-${index}`}
                      value={item?.entity}
                      label={uppercaseFirstLetters(item?.entity)}
                      icon={<Icon icon={getEntityIcon(item?.entity)} />}
                    />
                  )
              )}
          </TabList>
          <Box sx={{ mt: 6 }}>
            {entities.length > 0 &&
              entities?.map(({ entity, permissions }: any, index: number) => (
                <TabPanel sx={{ p: 0 }} value={entity} key={`${entity}-${index}`}>
                  <Typography sx={{ mb: 6 }} variant='h5'>
                    {uppercaseFirstLetters(`role permissions for ${entity} actions`)}
                  </Typography>
                  <Grid container md={12}>
                    {permissions?.map((permission: any, permissionIndex: number) => renderPermissions(permission))}
                  </Grid>
                </TabPanel>
              ))}
          </Box>
        </TabContext>
        {/* <Typography variant='h6'>Role Permissions</Typography>
        <TableContainer>
          <Table size='small'>
            <TableHead>
              <TableRow>
                <TableCell sx={{ pl: '0 !important' }}>
                  <Box
                    sx={{
                      display: 'flex',
                      fontSize: '0.875rem',
                      whiteSpace: 'nowrap',
                      alignItems: 'center',
                      textTransform: 'capitalize',
                      '& svg': { ml: 1, cursor: 'pointer' }
                    }}
                  >
                    Administrator Access
                    <Tooltip placement='top' title='Allows a full access to the system'>
                      <Box sx={{ display: 'flex' }}>
                        <Icon icon='mdi:information-outline' fontSize='1rem' />
                      </Box>
                    </Tooltip>
                  </Box>
                </TableCell>
                <TableCell colSpan={3}>
                  <FormControlLabel
                    label='Select All'
                    sx={{ '& .MuiTypography-root': { textTransform: 'capitalize' } }}
                    control={
                      <Checkbox
                        size='small'
                        onChange={handleSelectAllCheckbox}
                        indeterminate={isIndeterminateCheckbox}
                        checked={selectedPermissions.length === rolesArr.length * 3}
                      />
                    }
                  />
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {rolesArr.map((i: string, index: number) => {
                const id = i.toLowerCase().split(' ').join('-')

                return (
                  <TableRow key={index} sx={{ '& .MuiTableCell-root:first-of-type': { pl: '0 !important' } }}>
                    <TableCell
                      sx={{
                        fontWeight: 600,
                        whiteSpace: 'nowrap',
                        color: theme => `${theme.palette.text.primary} !important`
                      }}
                    >
                      {i}
                    </TableCell>
                    <TableCell>
                      <FormControlLabel
                        label='Read'
                        control={
                          <Checkbox
                            size='small'
                            id={`${id}-read`}
                            onChange={() => togglePermission(`${id}-read`)}
                            checked={selectedPermissions.includes(`${id}-read`)}
                          />
                        }
                      />
                    </TableCell>
                    <TableCell>
                      <FormControlLabel
                        label='Write'
                        control={
                          <Checkbox
                            size='small'
                            id={`${id}-write`}
                            onChange={() => togglePermission(`${id}-write`)}
                            checked={selectedPermissions.includes(`${id}-write`)}
                          />
                        }
                      />
                    </TableCell>
                    <TableCell>
                      <FormControlLabel
                        label='Create'
                        control={
                          <Checkbox
                            size='small'
                            id={`${id}-create`}
                            onChange={() => togglePermission(`${id}-create`)}
                            checked={selectedPermissions.includes(`${id}-create`)}
                          />
                        }
                      />
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </TableContainer> */}
      </DialogContent>
      <DialogActions sx={{ pt: 0, display: 'flex', justifyContent: 'center' }}>
        <Box className='demo-space-x'>
          <Button size='large' type='submit' variant='contained' onClick={() => handleSubmit()}>
            Submit
          </Button>
          <Button size='large' color='secondary' variant='outlined' onClick={toggle}>
            Cancel
          </Button>
        </Box>
      </DialogActions>
    </Dialog>
  )
}

export default RoleViewDialog
