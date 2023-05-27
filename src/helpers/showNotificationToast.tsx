import { Box, Typography, IconButton } from '@mui/material'
import CustomAvatar from 'src/@core/components/mui/avatar'
import CloseIcon from '@mui/icons-material/Close'
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive'
import { toast } from 'react-hot-toast'

const showNotificationToast = (title: string, body: string) => {
  toast(
    t => (
      <Box sx={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <CustomAvatar color='primary' skin='light' alt='Notification Icon' sx={{ mr: 3, width: 40, height: 40 }}>
            <NotificationsActiveIcon fontSize='medium' />
          </CustomAvatar>
          <div>
            <Typography sx={{ fontWeight: 500 }}>{title}</Typography>
            <Typography variant='caption'>{body}</Typography>
          </div>
        </Box>
        <IconButton onClick={() => toast.dismiss(t.id)}>
          <CloseIcon />
        </IconButton>
      </Box>
    ),
    {
      duration: 6000,
      style: {
        minWidth: '300px'
      }
    }
  )
}

export default showNotificationToast
