// ** MUI Imports
import Grid from '@mui/material/Grid'

// ** Types
// import { InvoiceType } from 'src/types/apps/invoiceTypes'

// ** Demo Components Imports
import CompanyViewLeft from 'src/views/pages/company/view/CompanyViewLeft'
import CompanyViewRight from 'src/views/pages/company/view/CompanyViewRight'

type Props = {
  tab: string
  invoiceData: any
}

const CompanyView = ({ tab, invoiceData }: Props) => {
  return (
    <Grid container spacing={6}>
      <Grid item xs={12} md={5} lg={4}>
        <CompanyViewLeft />
      </Grid>
      <Grid item xs={12} md={7} lg={8}>
        <CompanyViewRight tab={tab} invoiceData={invoiceData} />
      </Grid>
    </Grid>
  )
}

export default CompanyView
