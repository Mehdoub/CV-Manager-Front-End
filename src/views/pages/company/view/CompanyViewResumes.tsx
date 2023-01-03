import Grid from '@mui/material/Grid'
import CompanyResumeListTable from './CompanyResumeListTable'

const CompanyViewResumes = () => {
  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <CompanyResumeListTable />
      </Grid>
    </Grid>
  )
}

export default CompanyViewResumes
