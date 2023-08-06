import { Box, Button, Typography } from "@mui/material"
import BootstrapTooltip from "src/@core/components/bootstrap-tooltip"
import Skelet from "src/@core/components/loading/Skelet"
import StyledLink from "src/@core/components/styled-link"
import CustomAvatar from 'src/@core/components/mui/avatar'
import { getInitials } from "src/@core/utils/get-initials"
import { getFullName, getImagePath, handleCopyClick } from "src/helpers/functions"
import InsertLinkIcon from '@mui/icons-material/InsertLink'
import { useState } from "react"
import { useRouter } from "next/router"
import { useSelector } from "react-redux"

const HeadInfo = () => {
  const [copyText, setCopyText] = useState<string>('Copy Link')

  const router = useRouter()

  const { data: resume, loading: resumeLoading } = useSelector((state: any) => state.resume)

  const resumeLink = location.origin + router.asPath
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
      <Skelet
        loading={resumeLoading}
        variant='circular'
        width={55}
        height={55}
        sx={{ mr: 3 }}
        component={
          <CustomAvatar
            src={resume?.avatar ? getImagePath(resume?.avatar) : ''}
            skin='light'
            color='primary'
            sx={{ mr: 3, width: 55, height: 55, fontSize: '1rem' }}
          >
            {!resume?.avatar && getInitials(getFullName(resume))}
          </CustomAvatar>
        }
      />
      <Box sx={{ display: 'flex', alignItems: 'flex-start', flexDirection: 'column' }}>
        <Skelet
          loading={resumeLoading}
          width={100}
          component={
            <Typography variant='body2' fontSize={18} fontWeight={500}>
              {getFullName(resume)}
              <BootstrapTooltip title={copyText} placement='top'>
                <Button
                  onClick={() => handleCopyClick(resumeLink, setCopyText)}
                  sx={{ p: 0, mb: 1, ml: 1, justifyContent: 'end', minWidth: 0 }}
                  color='secondary'
                >
                  <InsertLinkIcon />
                </Button>
              </BootstrapTooltip>
            </Typography>
          }
        />
        <Skelet
          loading={resumeLoading}
          width={65}
          height={12}
          sx={{ mt: 2, ml: 1 }}
          component={
            <Typography variant='body2'>
              <BootstrapTooltip title='Company' placement='bottom'>
                <StyledLink href={`/companies/view/${resume?.company_id?._id}/overview/`}>
                  {resume?.company_id?.name}
                </StyledLink>
              </BootstrapTooltip>{' '}
              •{' '}
              <BootstrapTooltip title='Project' placement='bottom'>
                <StyledLink href={`/projects/view/${resume?.project_id?._id}/overview/`}>
                  {resume?.project_id?.name}
                </StyledLink>
              </BootstrapTooltip>
            </Typography>
          }
        />
      </Box>
    </Box>
  )
}

export default HeadInfo
