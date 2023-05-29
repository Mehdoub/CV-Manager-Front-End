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
  Typography
} from '@mui/material'
import CustomTextField from 'src/@core/components/custom-textfield'
import { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { useSelector } from 'react-redux'
import Icon from 'src/@core/components/icon'
import { getEntityIcon, getMaxTextLen, uppercaseFirstLetters } from 'src/helpers/functions'
import { clearCreateRole, clearEditRole, createRole, editRole, getRoles } from 'src/store/role'
import BootstrapTooltip from 'src/@core/components/bootstrap-tooltip'

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

  const dispatch = useDispatch()

  const { data: entities } = useSelector((state: any) => state.permissionsGrouped)
  const { status: statusCreate } = useSelector((state: any) => state.roleCreate)
  const { status: statusEdit } = useSelector((state: any) => state.roleEdit)

  useEffect(() => {
    if (statusCreate) {
      dispatch(clearCreateRole())
      dispatch(getRoles())
      toggle()
    }
    if (statusEdit) {
      dispatch(clearEditRole())
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
          label={
            <BootstrapTooltip placement='top' title={permission?.name}>
              <Typography>{getMaxTextLen(permission?.name, 25)}</Typography>
            </BootstrapTooltip>
          }
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
            <CustomTextField
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
              entities?.map((item: any, index: number) => {
                const IconComponent = getEntityIcon(item?.entity)
                return (
                  item?.entity?.length > 0 && (
                    <Tab
                      key={`${item?.entity}-${index}`}
                      value={item?.entity}
                      label={uppercaseFirstLetters(item?.entity)}
                      icon={<IconComponent />}
                    />
                  )
                )
              })}
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
