// ** MUI Imports
import Grid from '@mui/material/Grid'

// ** Types
// import { InvoiceType } from 'src/types/apps/invoiceTypes'

// ** Demo Components Imports
import UserViewLeft from 'src/views/pages/user/view/UserViewLeft'
import UserViewRight from 'src/views/pages/user/view/UserViewRight'

type Props = {
  tab: string
  userId: string
}

const UserView = ({ tab, userId }: Props) => {
  return (
    <Grid container spacing={6}>
      <Grid item xs={12} md={5} lg={4}>
        <UserViewLeft userId={userId} />
      </Grid>
      <Grid item xs={12} md={7} lg={8}>
        <UserViewRight tab={tab} userId={userId} />
      </Grid>
    </Grid>
  )
}

export default UserView
