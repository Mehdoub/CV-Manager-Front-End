import Grid from '@mui/material/Grid'
import ProjectResumeListTable from './ProjectResumeListTable'

const ProjectViewResumes = () => {
  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <ProjectResumeListTable />
      </Grid>
    </Grid>
  )
}

export default ProjectViewResumes
