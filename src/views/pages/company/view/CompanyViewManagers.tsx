import Grid from '@mui/material/Grid'
import CompanyManagerListTable from './CompanyManagerListTable'

const CompanyViewManagers = () => {
  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <CompanyManagerListTable />
      </Grid>
    </Grid>
  )
}

export default CompanyViewManagers
