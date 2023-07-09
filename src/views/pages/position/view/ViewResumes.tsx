import { Box, CircularProgress, Stack } from '@mui/material'
import { useScrollContainer } from 'react-indiana-drag-scroll'
import ResumeDialogMain from './ResumeDialogMain'
import { useEffect, useState } from 'react'
import ResumeKanbanColumn from './ResumeKanbanColumn'
import ResumeKanbanCard from './ResumeKanbanCard'
import { DragDropContext } from 'react-beautiful-dnd'
import { isForbiddenState, toastError } from 'src/helpers/functions'
import { getPositionResumes } from 'src/store/position'
import { useDispatch } from 'react-redux'
import { useRouter } from 'next/router'
import { useSelector } from 'react-redux'
import { clearResumeUpdateStatus, getResume, getResumes, updateResumeStatus } from 'src/store/resume'

export const resumesStates: any = {
  draft: { title: 'draft', color: 'secondary' },
  pending: { title: 'pending', color: 'warning' },
  call_review: { title: 'call review', color: 'info' },
  tech_review: { title: 'tech review', color: 'primary' },
  wait_reject: { title: 'wait reject', color: 'error' },
  rejected: { title: 'rejected', color: 'error' },
  hired: { title: 'hired', color: 'success' },
  wait_hire: { title: 'wait hire', color: 'secondary' },
  end_cooperation: { title: 'end cooperation', color: 'secondary' }
}

interface ViewResumesProps {
  allResumes?: boolean
}

const ViewResumes = ({ allResumes = false }: ViewResumesProps) => {
  const [open, setOpen] = useState<boolean>(false)
  const [boardResumes, setBoardResumes] = useState<any>([])
  // const scrollContainer = useScrollContainer()

  const dispatch = useDispatch()

  const { data: positionResumes, loading: positionResumesLoading } = useSelector((state: any) => state.positionResumes)
  const { data: resumes, loading: resumesLoading } = useSelector((state: any) => state.resumesList)
  const { loading: resumeLoading } = useSelector((state: any) => state.resume)
  const { status: resumeStateUpdateStatus, loading: resumeStateUpdateLoading } = useSelector(
    (state: any) => state.resumeUpdateStatus
  )

  useEffect(() => {
    if (allResumes) {
      setBoardResumes(resumes)
    } else {
      setBoardResumes(positionResumes)
    }
  }, [resumes, positionResumes])

  const router = useRouter()
  const { positionId, resumeId } = router?.query as any

  const handleClose = () => {
    setOpen(false)
    const baseResumesUrl = allResumes ? '/resumes/' : `/positions/view/${positionId}/resume/`
    setTimeout(() => {
      delete router?.query?.resumeId
      router.replace(baseResumesUrl, undefined, { shallow: true })
    }, 500)
  }

  useEffect(() => {
    if (resumeId?.length > 0) {
      dispatch(getResume(resumeId[0]))
      setOpen(true)
    }
  }, [router])

  useEffect(() => {
    if (resumeStateUpdateStatus) {
      if (!allResumes) dispatch(getPositionResumes(positionId))
      else dispatch(getResumes())
      dispatch(clearResumeUpdateStatus())
    }
  }, [resumeStateUpdateStatus])

  useEffect(() => {
    if (allResumes) dispatch(getResumes())
    else dispatch(getPositionResumes(positionId))
  }, [])

  const dragEndHandler = (result: any) => {
    const { source, destination, draggableId } = result

    if (!destination) return

    if (source.droppableId == destination.droppableId && source.index == destination.index) return

    const currentStatus = source.droppableId.split('-')[1]
    const [destinationStateIndex, newStatus] = destination.droppableId.split('-')

    if (isForbiddenState(currentStatus)) {
      toastError('You Cannot Move Hired, Rejected And End Cooperation Resumes!')
      return
    }

    if (isForbiddenState(newStatus)) {
      toastError('You Cannot Drop Resume Directly Into Hired, Rejected Or End Cooperation!')
      return
    }

    let newIndex: number = 1

    const sameColumnTowardDown =
      source.droppableId == destination.droppableId && source.index < destination.index ? 1 : 0

    const upResume = boardResumes[destinationStateIndex][newStatus][destination.index - 1 + sameColumnTowardDown]
    const downResume = boardResumes[destinationStateIndex][newStatus][destination.index + sameColumnTowardDown]

    if (upResume && downResume) {
      newIndex = (upResume.index + downResume.index) / 2
    } else if (upResume) {
      newIndex = Math.ceil(upResume.index) + 1
    } else if (downResume) {
      newIndex = downResume.index / 2
    }

    dispatch(updateResumeStatus({ resumeId: draggableId, status: newStatus, index: newIndex }))
  }

  const isLoading = resumeStateUpdateLoading || positionResumesLoading || resumeLoading

  const handleResumeCardClick = (resumeId: string) => {
    router.push({ query: { ...router.query, resumeId } })
    dispatch(getResume(resumeId))
    setOpen(true)
  }

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
          {boardResumes?.length > 0 &&
            boardResumes?.map((column: any, colIndex: number) => {
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
                    <ResumeKanbanCard
                      cardData={resumeData}
                      setOpen={setOpen}
                      index={index}
                      handleClick={handleResumeCardClick}
                    />
                  ))}
                </ResumeKanbanColumn>
              )
            })}
        </DragDropContext>
      </Stack>
      <ResumeDialogMain open={open} toggle={handleClose} resumeData={{}} />
    </>
  )
}

export default ViewResumes
