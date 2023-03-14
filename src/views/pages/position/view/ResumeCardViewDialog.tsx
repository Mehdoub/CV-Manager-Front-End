import TabContext from '@mui/lab/TabContext'
import TabList from '@mui/lab/TabList'
import TabPanel from '@mui/lab/TabPanel'
import CustomAvatar from 'src/@core/components/mui/avatar'
import CustomChip from 'src/@core/components/mui/chip'
import {
  Avatar,
  Box,
  Button,
  Checkbox,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  FormControl,
  FormControlLabel,
  FormHelperText,
  Grid,
  IconButton,
  Rating,
  Stack,
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
import { getInitials } from 'src/@core/utils/get-initials'
import { getEntityIcon, getMaxTextLen, shuffle, uppercaseFirstLetters } from 'src/helpers/functions'
import { BootstrapTooltip } from 'src/pages/companies'
import { clearCreateRole, clearEditRole, createRole, editRole, getRoles } from 'src/store/role'

interface ResumeCardViewDialogProps {
  open: boolean
  toggle: () => void
  resumeData: any
}

const tags = [
  {
    text: 'test',
    color: 'warning'
  },
  {
    text: 'hot',
    color: 'error'
  },
  {
    text: 'new',
    color: 'info'
  }
]

const ResumeCardViewDialog = ({ open, toggle, resumeData }: ResumeCardViewDialogProps) => {
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

  const togglePermission = (id: string) => {
    let arr = selectedPermissions
    console.log(arr)
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
      // if (dialogTitle == 'Add') dispatch(createRole(sendData))
      // else dispatch(editRole({ ...sendData, id: editRoleData?.id }))
    }
  }

  return (
    <Dialog fullWidth maxWidth='90%' scroll='body' onClose={toggle} open={open}>
      <Grid container>
        <Grid xs item>
          <DialogTitle sx={{ textAlign: 'left' }}>
            <Stack direction={'row'} sx={{ justifyContent: 'space-between' }}>
              <span>
                <IconButton aria-label='capture screenshot'>
                  <Icon icon='material-symbols:arrow-back-ios-new-rounded' />
                </IconButton>
                <Button size='small' variant='contained' color='info'>
                  Technical Test
                </Button>
                <IconButton aria-label='capture screenshot'>
                  <Icon icon='material-symbols:arrow-forward-ios-rounded' />
                </IconButton>
              </span>
              <IconButton aria-label='capture screenshot'>
                <Icon style={{ fontSize: 30 }} icon='ic:round-more-horiz' />
              </IconButton>
            </Stack>
            <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
              <CustomAvatar skin='light' color='primary' sx={{ mr: 3, width: 55, height: 55, fontSize: '1rem' }}>
                {getInitials('Mahdi Mehrjoo')}
              </CustomAvatar>
              <Box sx={{ display: 'flex', alignItems: 'flex-start', flexDirection: 'column' }}>
                <Typography fontSize={18} fontWeight={500}>
                  Mahdi Mehrjoo
                </Typography>
                <Typography variant='body2'>Favin • BPM</Typography>
              </Box>
            </Box>
            <Stack direction='row' sx={{ justifyContent: 'space-between' }}>
              <Stack direction='row' spacing={1} mt={2}>
                {tags?.length > 0 &&
                  tags?.map((tag, index) => (
                    <>
                      <BootstrapTooltip placement='top' title={tag.text}>
                        <div>
                          <CustomChip
                            size='small'
                            label={getMaxTextLen(tag.text)}
                            skin='light'
                            color={tag.color as any}
                            sx={{
                              fontSize: 12,
                              height: 22,
                              borderBottomLeftRadius: 0,
                              borderTopLeftRadius: 0
                            }}
                          />
                        </div>
                      </BootstrapTooltip>
                      {tags?.length == index + 1 && (
                        <IconButton
                          aria-label='capture screenshot'
                          sx={{ border: '1px dashed gray', width: '35px', height: '35px' }}
                        >
                          <Icon icon='mdi:tag-plus' />
                        </IconButton>
                      )}
                    </>
                  ))}
              </Stack>
              <Rating readOnly value={4} sx={{ marginTop: 5 }} name='read-only' size='small' />
            </Stack>
          </DialogTitle>
        </Grid>
        <Divider sx={{ m: '0px 15px' }} orientation='vertical' flexItem />
        <Grid xs item>
          <DialogTitle sx={{ textAlign: 'left' }}>
            <Typography variant='body2'>Asignee(s):</Typography>
            <Stack direction='row' spacing={1} mt={2}>
              <Chip
                sx={{ ml: -1 }}
                label='Howard Paul'
                avatar={<Avatar src='/images/avatars/7.png' alt='User Avatar' />}
              />
              <Chip
                sx={{ ml: -1 }}
                label='Howard Paul'
                avatar={<Avatar src='/images/avatars/8.png' alt='User Avatar' />}
              />
            </Stack>
            <Typography sx={{mt: 7}} variant='body2'>Interviewer(s):</Typography>
            <Stack direction='row' spacing={1} mt={2}>
              <Chip
                sx={{ ml: -1 }}
                label='Howard Paul'
                avatar={<Avatar src='/images/avatars/7.png' alt='User Avatar' />}
              />
              <Chip
                sx={{ ml: -1 }}
                label='Howard Paul'
                avatar={<Avatar src='/images/avatars/8.png' alt='User Avatar' />}
              />
            </Stack>

          </DialogTitle>
        </Grid>
      </Grid>
      <Divider sx={{ m: '0px !important' }} />
      <DialogContent
        sx={{
          // p: { xs: 6, sm: 12 },
          minHeight: '650px',
          pt: 0
        }}
      >
        <Grid container>
          <Grid xs item>
            <h1>Hi Left</h1>
          </Grid>
          <Divider sx={{ minHeight: '600px', m: '0px 15px' }} orientation='vertical' flexItem />
          <Grid xs item>
            <h1>Hi Right</h1>
          </Grid>
        </Grid>
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

export default ResumeCardViewDialog
