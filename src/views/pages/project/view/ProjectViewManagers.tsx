import Grid from '@mui/material/Grid'
import ProjectManagerListTable from './ProjectManagerListTable'

const ProjectViewManagers = () => {
  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <ProjectManagerListTable />
      </Grid>
    </Grid>
  )
}

export default ProjectViewManagers
