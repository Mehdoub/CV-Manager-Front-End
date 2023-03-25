// ** React Imports
// import { useState, useEffect } from 'react'

// ** MUI Components
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'

// import Button from '@mui/material/Button'
import { styled } from '@mui/material/styles'
import CardMedia from '@mui/material/CardMedia'
import Typography from '@mui/material/Typography'
import CardContent from '@mui/material/CardContent'
import CustomChip from 'src/@core/components/mui/chip'

// ** Third Party Imports
// import axios from 'axios'

// ** Icon Imports
import Icon from 'src/@core/components/icon'
import { useEffect, useState } from 'react'
import { UserDataType } from 'src/context/types'

// ** Types
// import { ProfileHeaderType } from 'src/@fake-db/types'

const statusColors: any = {
  active: 'success',
  inactive: 'error'
}

const ProfilePicture = styled('img')(({ theme }) => ({
  width: 120,
  height: 120,
  borderRadius: theme.shape.borderRadius,
  border: `5px solid ${theme.palette.common.white}`,
  [theme.breakpoints.down('md')]: {
    marginBottom: theme.spacing(4)
  }
}))

const UserProfileHeader = () => {
  // ** State
  const [data, setData] = useState<UserDataType | null>(null)

  useEffect(() => {
    setData(JSON.parse(localStorage.getItem('userData') as string))
  }, [])

  const designationIcon = 'mdi:briefcase-outline'

  return (
    <Card>
      <CardMedia
        component='img'
        alt='profile-header'
        image='/images/pages/profile-banner.png'
        sx={{
          height: { xs: 150, md: 250 }
        }}
      />
      <CardContent
        sx={{
          pt: 0,
          mt: -8,
          display: 'flex',
          alignItems: 'flex-end',
          flexWrap: { xs: 'wrap', md: 'nowrap' },
          justifyContent: { xs: 'center', md: 'flex-start' }
        }}
      >
        <ProfilePicture src='/images/avatars/1.png' alt='profile-picture' />
        <Box
          sx={{
            width: '100%',
            display: 'flex',
            ml: { xs: 0, md: 6 },
            alignItems: 'flex-end',
            flexWrap: ['wrap', 'nowrap'],
            justifyContent: ['center', 'space-between']
          }}
        >
          <Box sx={{ mb: [6, 0], display: 'flex', flexDirection: 'column', alignItems: ['center', 'flex-start'] }}>
            <Typography variant='h5' sx={{ mb: 4, fontSize: '1.375rem' }}>
              {`${data?.firstname} ${data?.lastname}`}
              <CustomChip
                skin='light'
                size='small'
                label={data?.is_banned ? 'inactive' : 'active'}
                color={statusColors[data?.is_banned ? 'inactive' : 'active']}
                sx={{
                  height: 20,
                  fontWeight: 500,
                  fontSize: '0.75rem',
                  borderRadius: '5px',
                  textTransform: 'capitalize'
                }}
              />
            </Typography>
            <Box
              sx={{
                display: 'flex',
                flexWrap: 'wrap',
                justifyContent: ['center', 'flex-start']
              }}
            >
              <Box sx={{ mr: 4, display: 'flex', alignItems: 'center', '& svg': { mr: 1, color: 'text.secondary' } }}>
                <Icon icon={designationIcon} />
                <Typography sx={{ color: 'text.secondary', fontWeight: 600 }}>Web Developer</Typography>
              </Box>
              <Box sx={{ mr: 4, display: 'flex', alignItems: 'center', '& svg': { mr: 1, color: 'text.secondary' } }}>
                <Icon icon='mdi:map-marker-outline' />
                <Typography sx={{ color: 'text.secondary', fontWeight: 600 }}>Tehran</Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', '& svg': { mr: 1, color: 'text.secondary' } }}>
                <Icon icon='mdi:calendar-blank-outline' />
                <Typography sx={{ color: 'text.secondary', fontWeight: 600 }}>
                  Joined At {new Date(data?.createdAt as string).toDateString()}
                </Typography>
              </Box>
            </Box>
          </Box>
          {/* <Button variant='contained' startIcon={<Icon icon='mdi:account-check-outline' fontSize={20} />}>
            Connected
          </Button> */}
        </Box>
      </CardContent>
    </Card>
  )
}

export default UserProfileHeader
