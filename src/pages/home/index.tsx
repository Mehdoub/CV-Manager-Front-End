// ** MUI Imports
import Card from '@mui/material/Card'
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import Translations from 'src/layouts/components/Translations'

const Home = () => {
  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <Card>
          <Grid container md={12}>
            <Grid sm={12} md={6} item>
              <img src='/images/banners/welcome.webp' width={'100%'} />
            </Grid>
            <Grid sm={12} md={6} item>
              <CardHeader title={<Translations text='home.title' />}></CardHeader>
              <CardContent>
                <Typography>
                  <Translations text='home.description' />
                </Typography>
                <Typography sx={{fontSize: '20px', fontWeight: '600', pt: '15px'}}>Features</Typography>
                <Typography>
                  <Translations text='home.description' />
                </Typography>
                <Typography sx={{fontSize: '20px', fontWeight: '600', pt: '15px'}}>Benefits</Typography>
                <Typography>
                  <Translations text='home.description' />
                </Typography>
              </CardContent>
            </Grid>
          </Grid>
        </Card>
      </Grid>
    </Grid>
  )
}

export default Home
