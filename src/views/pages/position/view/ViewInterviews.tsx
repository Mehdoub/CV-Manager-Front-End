import Grid from '@mui/material/Grid'
import ProjectPositionListTable from 'src/views/pages/project/view/ProjectPositionListTable'

const ProjectViewPositions = () => {
  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <ProjectPositionListTable />
      </Grid>
    </Grid>
  )
}

export default ProjectViewPositions
