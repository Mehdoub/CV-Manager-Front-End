// ** MUI Components
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import Typography from '@mui/material/Typography'
import CardContent from '@mui/material/CardContent'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Types
import { ProfileTeamsType, ProfileTabCommonType } from 'src/@fake-db/types'
import { Button, CardActions } from '@mui/material'
import UserEditDialog from '../../user/view/UserEditDialog'
import { useState } from 'react'

interface Props {
  about: ProfileTabCommonType[]
  contacts: ProfileTabCommonType[]
  overview: ProfileTabCommonType[]
}

const renderList = (arr: ProfileTabCommonType[]) => {
  if (arr && arr.length) {
    return arr.map((item, index) => {
      const IconComponent = item.icon
      return (
        <Box
          key={index}
          sx={{
            display: 'flex',
            alignItems: 'center',
            '&:not(:last-of-type)': { mb: 4 },
            '& svg': { color: 'text.secondary' }
          }}
        >
          {typeof item.icon == 'string' ? <Icon icon={item.icon} /> : <IconComponent />}

          <Typography sx={{ mx: 2, fontWeight: 600, color: 'text.secondary' }}>
            {`${item?.property?.charAt(0).toUpperCase() + item?.property?.slice(1)}:`}
          </Typography>
          <Typography sx={{ color: 'text.secondary' }}>
            {item?.value?.charAt(0).toUpperCase() + item?.value?.slice(1)}
          </Typography>
        </Box>
      )
    })
  } else {
    return null
  }
}

const AboutOverivew = (props: Props) => {
  const { about, contacts, overview } = props
  const [editUserOpen, setEditUserOpen] = useState<boolean>(false)
  const closeEditUserDialog = () => setEditUserOpen(false)

  return (
    <>
      <Grid container spacing={6}>
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Box sx={{ mb: 7 }}>
                <Typography variant='body2' sx={{ mb: 4, color: 'text.disabled', textTransform: 'uppercase' }}>
                  About
                </Typography>
                {renderList(about)}
              </Box>
              <Box sx={{ mb: 7 }}>
                <Typography variant='body2' sx={{ mb: 4, color: 'text.disabled', textTransform: 'uppercase' }}>
                  Contacts
                </Typography>
                {renderList(contacts)}
              </Box>
            </CardContent>
            <CardActions sx={{ display: 'flex', justifyContent: 'right' }}>
              <Button variant='contained' sx={{ mr: 2 }} onClick={() => setEditUserOpen(true)}>
                Edit
              </Button>
            </CardActions>
          </Card>
        </Grid>
        {/* <Grid item xs={12}>
          <Card>
            <CardContent>
              <div>
                <Typography variant='body2' sx={{ mb: 4, color: 'text.disabled', textTransform: 'uppercase' }}>
                  Overview
                </Typography>
                {renderList(overview)}
              </div>
            </CardContent>
          </Card>
        </Grid> */}
      </Grid>
      <UserEditDialog open={editUserOpen} handleClose={closeEditUserDialog} data={{}} />
    </>
  )
}

export default AboutOverivew
