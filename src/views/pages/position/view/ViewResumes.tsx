import { Box, CircularProgress, Stack } from '@mui/material'
import { useScrollContainer } from 'react-indiana-drag-scroll'
import ResumeCardMainDialog from './ResumeCardMainDialog'
import { useEffect, useState } from 'react'
import ResumeKanbanColumn from './ResumeKanbanColumn'
import ResumeKanbanCard from './ResumeKanbanCard'
import { DragDropContext } from 'react-beautiful-dnd'
import { isForbiddenState, toastError } from 'src/helpers/functions'
import { getPositionResumes } from 'src/store/position'
import { useDispatch } from 'react-redux'
import { useRouter } from 'next/router'
import { useSelector } from 'react-redux'
import { clearResumeUpdateStatus, updateResumeStatus } from 'src/store/resume'

export const resumesStates: any = {
  pending: { title: 'pending', color: 'warning' },
  call_review: { title: 'call review', color: 'info' },
  tech_review: { title: 'tech review', color: 'primary' },
  wait_reject: { title: 'wait reject', color: 'error' },
  rejected: { title: 'rejected', color: 'error' },
  hired: { title: 'hired', color: 'success' },
  wait_hire: { title: 'wait hire', color: 'secondary' }
}

const ViewResumes = () => {
  const [open, setOpen] = useState<boolean>(false)
  const handleClose = () => setOpen(false)
  // const scrollContainer = useScrollContainer()

  const dispatch = useDispatch()

  const { data: positionResumes, loading: positionResumesLoading } = useSelector((state: any) => state.positionResumes)
  const { status: resumeStateUpdateStatus, loading: resumeStateUpdateLoading } = useSelector(
    (state: any) => state.resumeUpdateStatus
  )

  const {
    query: { positionId }
  } = useRouter()

  useEffect(() => {
    if (resumeStateUpdateStatus) {
      dispatch(getPositionResumes(positionId))
      dispatch(clearResumeUpdateStatus())
    }
  }, [resumeStateUpdateStatus])

  useEffect(() => {
    dispatch(getPositionResumes(positionId))
  }, [])

  const dragEndHandler = (result: any) => {
    const { source, destination, draggableId } = result

    if (!destination) return

    if (source.droppableId == destination.droppableId && source.index == destination.index) return

    const currentStatus = source.droppableId.split('-')[1]
    const [destinationStateIndex, newStatus] = destination.droppableId.split('-')

    if (isForbiddenState(currentStatus)) {
      toastError('You Cannot Move Hired And Rejected Resumes!')
      return
    }

    if (isForbiddenState(newStatus)) {
      toastError('You Cannot Drop Resume Directly Into Hired Or Rejected!')
      return
    }

    let newIndex: number = 1

    const sameColumnTowardDown =
      source.droppableId == destination.droppableId && source.index < destination.index ? 1 : 0

    const upResume = positionResumes[destinationStateIndex][newStatus][destination.index - 1 + sameColumnTowardDown]
    const downResume = positionResumes[destinationStateIndex][newStatus][destination.index + sameColumnTowardDown]

    if (upResume && downResume) {
      newIndex = (upResume.index + downResume.index) / 2
    } else if (upResume) {
      newIndex = Math.ceil(upResume.index) + 1
    } else if (downResume) {
      newIndex = downResume.index / 2
    }

    dispatch(updateResumeStatus({ resumeId: draggableId, status: newStatus, index: newIndex }))
  }

  const isLoading = resumeStateUpdateLoading || positionResumesLoading

  return (
    <>
      {isLoading && (
        <Box
          sx={{
            mt: 6,
            display: 'flex',
            alignItems: 'center',
            flexDirection: 'column',
            justifyContent: 'center',
            height: '450px',
            position: 'fixed',
            zIndex: 1000,
            top: '45%',
            left: '5%',
            width: '100%'
          }}
        >
          <CircularProgress sx={{ mb: 4 }} />
        </Box>
      )}
      <Stack
        // ref={scrollContainer.ref}
        direction='row'
        spacing={-3}
        sx={{
          // overflowX: 'scroll',
          pr: 3,
          pb: 20,
          pt: 0,
          pl: 0,
          filter: isLoading ? 'blur(3px)' : undefined,
          position: 'relative'
        }}
      >
        <DragDropContext onDragEnd={dragEndHandler}>
          {positionResumes.length > 0 &&
            positionResumes.map((column: any, colIndex: number) => {
              const status = Object.keys(column)[0]
              const colData = resumesStates[status]
              return (
                <ResumeKanbanColumn
                  title={colData.title}
                  color={colData.color}
                  statusKey={`${colIndex}-${status}`}
                  key={status}
                >
                  {column[status].map((resumeData: any, index: number) => (
                    <ResumeKanbanCard cardData={resumeData} setOpen={setOpen} index={index} />
                  ))}
                </ResumeKanbanColumn>
              )
            })}
        </DragDropContext>
      </Stack>
      <ResumeCardMainDialog open={open} toggle={handleClose} resumeData={{}} />
    </>
  )
}

export default ViewResumes
