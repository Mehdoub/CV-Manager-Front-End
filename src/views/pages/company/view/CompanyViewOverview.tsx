import Grid from '@mui/material/Grid'
import CompanyProjectListTable from 'src/views/pages/company/view/CompanyProjectListTable'

const CompanyViewOverview = () => {
  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <CompanyProjectListTable />
      </Grid>
    </Grid>
  )
}

export default CompanyViewOverview
