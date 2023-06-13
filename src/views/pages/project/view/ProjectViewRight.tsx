// ** React Imports
import { SyntheticEvent, useState, useEffect } from 'react'

// ** Next Import
import { useRouter } from 'next/router'

// ** MUI Imports
import Box from '@mui/material/Box'
import TabList from '@mui/lab/TabList'
import TabPanel from '@mui/lab/TabPanel'
import TabContext from '@mui/lab/TabContext'
import { styled } from '@mui/material/styles'
import Typography from '@mui/material/Typography'
import MuiTab, { TabProps } from '@mui/material/Tab'
import CircularProgress from '@mui/material/CircularProgress'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Demo Components Imports
import ProjectViewManagers from 'src/views/pages/project/view/ProjectViewManagers'
import ProjectViewOverview from 'src/views/pages/project/view/ProjectViewOverview'
import ProjectViewPositions from 'src/views/pages/project/view/ProjectViewPositions'
import { Button } from '@mui/material'
import AddPositionDrawer from '../../position/list/AddPositionDrawer'
import ResumesView from 'src/views/common/ResumesView'
import { useSelector } from 'react-redux'
import { getProjectResumes } from 'src/store/project'
import AssignmentIndIcon from '@mui/icons-material/AssignmentInd'
import WorkIcon from '@mui/icons-material/Work'
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts'
import FolderCopyIcon from '@mui/icons-material/FolderCopy'

// ** Types
// import { InvoiceType } from 'src/types/apps/invoiceTypes'

interface Props {
  tab: string
  projectId: any
}

// ** Styled Tab component
const Tab = styled(MuiTab)<TabProps>(({ theme }) => ({
  minHeight: 48,
  flexDirection: 'row',
  '& svg': {
    marginBottom: '0 !important',
    marginRight: theme.spacing(1)
  }
}))

const ProjectViewRight = ({ tab, projectId }: Props) => {
  // ** State
  const [activeTab, setActiveTab] = useState<string>(tab)
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [addPositionOpen, setaddPositionOpen] = useState<boolean>(false)

  const toggleAddPositionDrawer = () => setaddPositionOpen(!addPositionOpen)

  // ** Hooks
  const router = useRouter()

  const projectStore = useSelector((state: any) => state.projectFind)
  const projectResumesStore = useSelector((state: any) => state.projectResumes)
  const { data: constants } = useSelector((state: any) => state.constants)

  const handleChange = (event: SyntheticEvent, value: string) => {
    setIsLoading(true)
    setActiveTab(value)
    router
      .push({
        pathname: `/projects/view/${projectId}/${value.toLowerCase()}`
      })
      .then(() => setIsLoading(false))
  }

  useEffect(() => {
    if (tab && tab !== activeTab) {
      setActiveTab(tab)
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tab])

  useEffect(() => {
    if (projectId) {
      setIsLoading(false)
    }
  }, [projectId])

  return (
    <>
      <TabContext value={activeTab}>
        <TabList
          variant='scrollable'
          scrollButtons='auto'
          onChange={handleChange}
          aria-label='forced scroll tabs example'
          sx={{ borderBottom: theme => `1px solid ${theme.palette.divider}` }}
        >
          <Tab value='overview' label='Overview' icon={<FolderCopyIcon />} />
          <Tab value='position' label='Positions' icon={<WorkIcon />} />
          {/* <Tab value='resume' label='Resumes' icon={<AssignmentIndIcon />} /> */}
          <Tab value='manager' label='Managers' icon={<ManageAccountsIcon />} />
          {activeTab == 'position' ? (
            <Button
              sx={{ mb: 2, position: 'absolute', right: '5px', top: '5px' }}
              onClick={toggleAddPositionDrawer}
              variant='outlined'
            >
              Add Position
            </Button>
          ) : (
            ''
          )}
        </TabList>
        <Box sx={{ mt: 6 }}>
          {isLoading ? (
            <Box sx={{ mt: 6, display: 'flex', alignItems: 'center', flexDirection: 'column' }}>
              <CircularProgress sx={{ mb: 4 }} />
              <Typography>Loading...</Typography>
            </Box>
          ) : (
            <>
              <TabPanel sx={{ p: 0 }} value='overview'>
                <ProjectViewOverview />
              </TabPanel>
              <TabPanel sx={{ p: 0 }} value='position'>
                <ProjectViewPositions />
              </TabPanel>
              {/* <TabPanel sx={{ p: 0 }} value='resume'>
                <ResumesView
                  entityStore={projectStore}
                  entityResumesStore={projectResumesStore}
                  getEntityResumesAction={getProjectResumes}
                />
              </TabPanel> */}
              <TabPanel sx={{ p: 0 }} value='manager'>
                <ProjectViewManagers />
              </TabPanel>
            </>
          )}
        </Box>
      </TabContext>
      {constants?.position ? (
        <AddPositionDrawer
          open={addPositionOpen}
          toggle={toggleAddPositionDrawer}
          dispatchProjectPositionsList={true}
        />
      ) : null}
    </>
  )
}

export default ProjectViewRight
