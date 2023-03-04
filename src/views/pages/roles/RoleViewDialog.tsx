import TabContext from '@mui/lab/TabContext/TabContext'
import TabList from '@mui/lab/TabList/TabList'
import TabPanel from '@mui/lab/TabPanel/TabPanel'
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
import { useState } from 'react'
import Icon from 'src/@core/components/icon'
import { uppercaseFirstLetters } from 'src/helpers/functions'

interface RoleViewDialogProps {
  open: boolean
  toggle: () => void
  dialogTitle: string
}

const rolesArr: string[] = [
  'Create',
  'Edit',
  'Suspend',
  'Activate',
  'Add Manager',
  'Remove Manager',
  'View List',
  'View Detail'
]

const entities = ['company', 'project', 'position', 'user', 'interview', 'resume', 'other']
const entityIcons = [
  'carbon:location-company',
  'pajamas:project',
  'ic:baseline-work-outline',
  'mdi:users-outline',
  'mdi:virtual-meeting',
  'pepicons-pop:cv',
  'mdi:shield-outline'
]

const renderPermissions = ({ label, permissionId }: { label: string; permissionId: string }) => {
  return (
    <Grid md={4} item>
      <FormControlLabel
        label={label}
        control={
          <Checkbox
            size='small'
            id={permissionId}
            // onChange={() => togglePermission(`${id}-read`)}
            // checked={selectedCheckbox.includes(`${id}-read`)}
          />
        }
      />
    </Grid>
  )
}

function shuffle(array: any): any {
  let currentIndex = array.length,
    randomIndex

  // While there remain elements to shuffle.
  while (currentIndex != 0) {
    // Pick a remaining element.
    randomIndex = Math.floor(Math.random() * currentIndex)
    currentIndex--

    // And swap it with the current element.
    ;[array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]]
  }

  return array
}

const RoleViewDialog = ({ open, toggle, dialogTitle }: RoleViewDialogProps) => {
  const [activeTab, setActiveTab] = useState<string>('company')
  const [selectedCheckbox, setSelectedCheckbox] = useState<string[]>([])
  const [isIndeterminateCheckbox, setIsIndeterminateCheckbox] = useState<boolean>(false)
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

  const handleTabChange = (e: any, value: string) => {
    setActiveTab(value)
  }

  return (
    <Dialog fullWidth maxWidth='md' scroll='body' onClose={toggle} open={open}>
      <DialogTitle sx={{ textAlign: 'center' }}>
        <Typography variant='h5' component='span'>
          {`${dialogTitle} Role`}
        </Typography>
        <Typography variant='body2'>Set Role Permissions</Typography>
      </DialogTitle>
      <DialogContent sx={{ p: { xs: 6, sm: 12 } }}>
        <Box sx={{ my: 4 }}>
          <FormControl fullWidth>
            <TextField label='Role Name' placeholder='Enter Role Name' />
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
            <Tab value='company' label='Company' icon={<Icon icon='carbon:location-company' />} />
            <Tab value='project' label='Project' icon={<Icon icon='pajamas:project' />} />
            <Tab value='position' label='Position' icon={<Icon icon='ic:baseline-work-outline' />} />
            <Tab value='user' label='User' icon={<Icon icon='mdi:users-outline' />} />
            <Tab value='interview' label='Interview' icon={<Icon icon='mdi:virtual-meeting' />} />
            <Tab value='resume' label='Resume' icon={<Icon icon='pepicons-pop:cv' />} />
            <Tab value='other' label='Other' icon={<Icon icon='mdi:shield-outline' />} />
          </TabList>
          <Box sx={{ mt: 6 }}>
            {entities.map((item: string, index: number) => (
              <TabPanel sx={{ p: 0 }} value={item} key={`${item}-${index}`}>
                <Typography sx={{ mb: 6 }} variant='h5'>
                  {uppercaseFirstLetters(`role permissions for ${item} actions`)}
                </Typography>
                <Grid container md={12}>
                  {shuffle(rolesArr).map((permissionName: string, permissionIndex: number) =>
                    renderPermissions({ label: permissionName, permissionId: permissionIndex.toString() })
                  )}
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
                        checked={selectedCheckbox.length === rolesArr.length * 3}
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
                            checked={selectedCheckbox.includes(`${id}-read`)}
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
                            checked={selectedCheckbox.includes(`${id}-write`)}
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
                            checked={selectedCheckbox.includes(`${id}-create`)}
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
          <Button size='large' type='submit' variant='contained' onClick={toggle}>
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
