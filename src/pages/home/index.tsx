// ** MUI Imports
import Card from '@mui/material/Card'
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import Translations from 'src/layouts/components/Translations'
// import BootstrapTooltip from 'src/@core/components/bootstrap-tooltip'
// import AddPositionDrawer from 'src/views/pages/position/list/AddPositionDrawer'
// import { useEffect, useState } from 'react'
// import AddCompanyDrawer from 'src/views/pages/company/list/AddCompanyDrawer'
// import SidebarAddProject from 'src/views/pages/project/list/AddProjectDrawer'
// import AddResumeDialog from 'src/views/pages/position/view/AddResumeDialog'
// import { useSelector } from 'react-redux'
// import { getEntityIcon, getObjectKeys } from 'src/helpers/functions'

const Home = () => {
  // const [isSpeedDialChecked, setIsSpeedDialChecked] = useState<boolean | undefined>(undefined)
  // const [addCompanyOpen, setAddCompanyOpen] = useState<boolean>(false)
  // const [addProjectOpen, setAddProjectOpen] = useState<boolean>(false)
  // const [addPositionOpen, setAddPositionOpen] = useState<boolean>(false)
  // const [addResumeOpen, setAddResumeOpen] = useState<boolean>(false)
  // const toggleAddCompanyDrawer = () => setAddCompanyOpen(!addCompanyOpen)
  // const toggleAddProjectDrawer = () => setAddProjectOpen(!addProjectOpen)
  // const toggleAddPositionDrawer = () => setAddPositionOpen(!addPositionOpen)
  // const toggleAddResumeDialog = () => setAddResumeOpen(!addResumeOpen)

  // const { data: constants } = useSelector((state: any) => state.constants)
  // const { data: provinces } = useSelector((state: any) => state.provinces)

  // useEffect(() => {
  //   if (isSpeedDialChecked === false) {
  //     setIsSpeedDialChecked(undefined)
  //   }
  // }, [isSpeedDialChecked])

  // const actions = [
  //   { icon: getEntityIcon('companies'), name: 'Create New Company', onclick: toggleAddCompanyDrawer },
  //   { icon: getEntityIcon('projects'), name: 'Create New Project', onclick: toggleAddProjectDrawer },
  //   { icon: getEntityIcon('positions'), name: 'Create New Position', onclick: toggleAddPositionDrawer },
  //   { icon: getEntityIcon('resumes'), name: 'Create New Resume', onclick: toggleAddResumeDialog }
  // ]

  return (
    <>
      {/* <nav className='sd-menu'>
        <input
          type='checkbox'
          className='sd-menu-open'
          name='sd-menu-open'
          id='sd-menu-open'
          checked={isSpeedDialChecked}
        />
        <BootstrapTooltip title='Fast Access' placement='top'>
          <label className='sd-menu-open-button' htmlFor='sd-menu-open'>
            <span className='sd-hamburger sd-hamburger-1'></span>
            <span className='sd-hamburger sd-hamburger-2'></span>
            <span className='sd-hamburger sd-hamburger-3'></span>
          </label>
        </BootstrapTooltip>
        {actions.map((action: any, index: number) => {
          const IconComponent = action.icon
          return (
            <BootstrapTooltip key={`${action.name}-${index}`} title={action.name} placement='top'>
              <a
                href='#'
                className='sd-menu-item'
                onClick={() => {
                  action.onclick()
                  setIsSpeedDialChecked(false)
                }}
              >
                <IconComponent sx={{ marginBottom: '7px' }} />
              </a>
            </BootstrapTooltip>
          )
        })}
      </nav> */}
      <Grid container spacing={6}>
        <Grid item xs={12}>
          <Card>
            <Grid container>
              <Grid xs={12} container sx={{ justifyContent: 'center' }}>
                <Grid item md={6} xs={12}>
                  <CardHeader sx={{ textAlign: 'center', pb: 0 }} title={<Translations text='home.head_title' />}></CardHeader>
                </Grid>
              </Grid>

              <Grid xs={12} container sx={{ justifyContent: 'center' }}>
                <Grid item md={7} xs={12}>
                  <img src='/images/banners/welcome-banner.jpg' width={'100%'} />
                </Grid>
              </Grid>
              <Grid xs={12} item>
                <CardContent sx={{ pt: 0 }}>
                  <Typography>
                    <Translations text='home.head_description' />
                  </Typography>
                  <Typography sx={{ fontSize: '20px', fontWeight: '600', pt: '15px' }}><Translations text='home.title_1' /></Typography>
                  <Typography>
                    <Translations text='home.description_1' />
                  </Typography>
                  <Typography sx={{ fontSize: '20px', fontWeight: '600', pt: '15px' }}><Translations text='home.title_2' /></Typography>
                  <Typography>
                    <Translations text='home.description_2' />
                  </Typography>
                  <Typography sx={{ fontSize: '20px', fontWeight: '600', pt: '15px' }}><Translations text='home.title_3' /></Typography>
                  <Typography>
                    <Translations text='home.description_3' />
                  </Typography>
                  <Typography sx={{ fontSize: '20px', fontWeight: '600', pt: '15px' }}><Translations text='home.title_4' /></Typography>
                  <Typography>
                    <Translations text='home.description_4' />
                  </Typography>
                  <Typography sx={{ fontSize: '20px', fontWeight: '600', pt: '15px' }}><Translations text='home.title_5' /></Typography>
                  <Typography>
                    <Translations text='home.description_5' />
                  </Typography>
                  <Typography sx={{ fontSize: '20px', fontWeight: '600', pt: '15px' }}><Translations text='home.title_6' /></Typography>
                  <Typography>
                    <Translations text='home.description_6' />
                  </Typography>
                </CardContent>
              </Grid>
            </Grid>
          </Card>
        </Grid>
      </Grid>
      {/* {getObjectKeys(constants?.system)?.length > 0 && (
        <>
          <AddCompanyDrawer open={addCompanyOpen} toggle={toggleAddCompanyDrawer} />
          <SidebarAddProject open={addProjectOpen} toggle={toggleAddProjectDrawer} />
          <AddPositionDrawer open={addPositionOpen} toggle={toggleAddPositionDrawer} />
          {provinces?.length && <AddResumeDialog open={addResumeOpen} handleClose={toggleAddResumeDialog} />}
        </>
      )} */}
    </>
  )
}

export default Home
