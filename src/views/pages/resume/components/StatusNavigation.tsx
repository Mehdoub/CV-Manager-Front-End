import { Box, Button, ButtonGroup, IconButton, Menu, MenuItem } from "@mui/material"
import BootstrapTooltip from "src/@core/components/bootstrap-tooltip"
import { getColorCodes, getObjectKeys, isForbiddenState, uppercaseFirstLetters } from "src/helpers/functions"
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew'
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos'
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline'
import HighlightOffIcon from '@mui/icons-material/HighlightOff'
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline'
import { MouseEvent, useState } from "react"
import { useDispatch } from "react-redux"
import { useSelector } from "react-redux"
import { updateResumeStatus } from "src/store/resume"
import { resumesStates } from "../../position/view/ViewResumes"
import ResumeHiringDialog from "../../position/view/ResumeHiringDialog"
import ResumeRejectingDialog from "../../position/view/ResumeRejectingDialog"
import ResumeEndWorkDialog from "../../position/view/ResumeEndWorkDialog"

interface Props {
  boardResumes: any
}

const StatusNavigation = ({ boardResumes }: Props) => {
  const [anchorElStatesMenu, setAnchorElStatesMenu] = useState<null | HTMLElement>(null)
  const [openResumeHiringDialog, setOpenResumeHiringDialog] = useState<boolean>(false)
  const [openResumeRejectingDialog, setOpenResumeRejectingDialog] = useState<boolean>(false)
  const [openResumeEndWorkDialog, setOpenResumeEndWorkDialog] = useState<boolean>(false)

  const dispatch = useDispatch()

  const { data: resume } = useSelector((state: any) => state.resume)
  const { loading: resumeStateUpdateLoading } = useSelector((state: any) => state.resumeUpdateStatus)
  const { data: constants } = useSelector((state: any) => state.constants)

  const stateKeys = Object.entries(resumesStates).map(([key, value]: any) => key)
  const previousState = stateKeys[stateKeys.indexOf(resume?.status) - 1]
  const nextState = stateKeys[stateKeys.indexOf(resume?.status) + 1]

  const handleCloseResumeHiringDialog = () => setOpenResumeHiringDialog(false)
  const handleCloseResumeRejectingDialog = () => setOpenResumeRejectingDialog(false)
  const handleCloseResumeEndWorkDialog = () => setOpenResumeEndWorkDialog(false)

  const handleClickStatesMenu = (event: MouseEvent<HTMLElement>) => {
    if (!isForbiddenState(resume?.status)) {
      setAnchorElStatesMenu(event.currentTarget)
    }
  }

  const handleCloseStatesMenu = () => {
    setAnchorElStatesMenu(null)
  }

  const updateStateHandler = (newState: string) => {
    if (resume?.id) {
      const firstResumeOfNewState = boardResumes[stateKeys.indexOf(newState)][newState][0]
      const newIndex = firstResumeOfNewState ? firstResumeOfNewState.index / 2 : 1

      dispatch(updateResumeStatus({ resumeId: resume?.id, status: newState, index: newIndex }))
    }
  }

  return (
    <>
      <Box>
        <BootstrapTooltip placement='top' title={uppercaseFirstLetters(resumesStates[previousState]?.title)}>
          <IconButton
            aria-label='capture screenshot'
            sx={{ pl: 0 }}
            onClick={() => updateStateHandler(previousState)}
            disabled={
              resumeStateUpdateLoading ||
              !(
                stateKeys.indexOf(resume?.status) > 0 &&
                !isForbiddenState(previousState) &&
                !isForbiddenState(resume?.status)
              )
            }
          >
            <ArrowBackIosNewIcon />
          </IconButton>
        </BootstrapTooltip>
        <BootstrapTooltip placement='top' title='Change Status'>
          <Button
            size='small'
            variant='contained'
            color={(resume?.status && resumesStates[resume?.status]?.color) ?? 'info'}
            disabled={resumeStateUpdateLoading}
            onClick={handleClickStatesMenu}
            sx={{ minWidth: '100px' }}
          >
            {resume?.status && uppercaseFirstLetters(resumesStates[resume?.status]?.title)}
          </Button>
        </BootstrapTooltip>
        <Menu
          keepMounted
          elevation={0}
          anchorEl={anchorElStatesMenu}
          onClose={handleCloseStatesMenu}
          open={Boolean(anchorElStatesMenu)}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'center'
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'center'
          }}
        >
          {stateKeys.map(
            (item: string, index: number) =>
              ![resume?.status, 'hired', 'rejected'].includes(item) && (
                <MenuItem
                  key={`states-menu-${index}`}
                  onClick={() => {
                    handleCloseStatesMenu()
                    updateStateHandler(item)
                  }}
                  sx={{ color: getColorCodes(resumesStates[item].color) }}
                >
                  {uppercaseFirstLetters(resumesStates[item].title)}
                </MenuItem>
              )
          )}
        </Menu>
        <BootstrapTooltip placement='top' title={uppercaseFirstLetters(resumesStates[nextState]?.title)}>
          <IconButton
            sx={{ pr: 0 }}
            onClick={() => updateStateHandler(nextState)}
            disabled={
              resumeStateUpdateLoading ||
              !(
                stateKeys.indexOf(resume?.status) < stateKeys.length - 1 &&
                !isForbiddenState(nextState) &&
                !isForbiddenState(resume?.status)
              )
            }
          >
            <ArrowForwardIosIcon />
          </IconButton>
        </BootstrapTooltip>
      </Box>
      {resume?.status == 'hired' ? (
        <Button
          startIcon={<ErrorOutlineIcon />}
          color='warning'
          onClick={() => setOpenResumeEndWorkDialog(true)}
          variant='outlined'
          size='small'
          sx={{ mt: 3, mr: 1 }}
        >
          End Work
        </Button>
      ) : (
        <ButtonGroup size='small' variant='outlined' sx={{ mt: 3, mr: 1 }}>
          <Button
            startIcon={<CheckCircleOutlineIcon />}
            color='success'
            onClick={() => setOpenResumeHiringDialog(true)}
            disabled={isForbiddenState(resume?.status)}
          >
            Hiring
          </Button>
          <Button
            startIcon={<HighlightOffIcon />}
            color='error'
            onClick={() => setOpenResumeRejectingDialog(true)}
            disabled={isForbiddenState(resume?.status)}
          >
            Reject
          </Button>
        </ButtonGroup>
      )}

      {getObjectKeys(constants?.resume)?.length > 0 && (
        <>
          <ResumeHiringDialog open={openResumeHiringDialog} handleClose={handleCloseResumeHiringDialog} />
          <ResumeRejectingDialog open={openResumeRejectingDialog} handleClose={handleCloseResumeRejectingDialog} />
          <ResumeEndWorkDialog open={openResumeEndWorkDialog} handleClose={handleCloseResumeEndWorkDialog} />
        </>
      )}
    </>
  )
}

export default StatusNavigation
