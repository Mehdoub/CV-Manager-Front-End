import { Stack } from '@mui/material'
import { useScrollContainer } from 'react-indiana-drag-scroll'
import ResumeCardMainDialog from './ResumeCardMainDialog'
import { useEffect, useState } from 'react'
import ResumeKanbanColumn from './ResumeKanbanColumn'
import ResumeKanbanCard from './ResumeKanbanCard'
import resumes from 'src/data/resumeCards.json'
import { DragDropContext } from 'react-beautiful-dnd'
import { toastError } from 'src/helpers/functions'
import { getPositionResumes } from 'src/store/position'
import { useDispatch } from 'react-redux'
import { useRouter } from 'next/router'
import { useSelector } from 'react-redux'

const resumesStates: any = {
  pending: { title: 'pending', color: 'warning' },
  call_review: { title: 'call review', color: 'info' },
  tech_review: { title: 'tech review', color: 'primary' },
  wait_reject: { title: 'wait reject', color: 'secondary' },
  rejected: { title: 'rejected', color: 'error' },
  hired: { title: 'hired', color: 'success' },
  wait_hire: { title: 'wait hire', color: 'info' }
}

const ViewResumes = () => {
  const [open, setOpen] = useState<boolean>(false)
  const [allResumes, setAllResumes] = useState<any>([])
  const handleClose = () => setOpen(false)
  const scrollContainer = useScrollContainer()
  const cols = Object.keys(resumes)

  const dispatch = useDispatch()

  const { data: positionResumes, loading: positionResumesLoading } = useSelector((state: any) => state.positionResumes)

  const {
    query: { positionId }
  } = useRouter()

  useEffect(() => {
    setAllResumes(resumes)
    dispatch(getPositionResumes(positionId))
  }, [])

  const dragEndHandler = (result: any) => {
    const { source, destination, draggableId } = result

    if (!destination) return

    if (source.droppableId == destination.droppableId && source.index == destination.index) return

    if (['4-hired', '5-rejected'].includes(destination.droppableId)) {
      toastError('You Cannot Drop Resume Directly Into Hired Or Rejected!')
      return
    }

    const tempAllResumes = allResumes

    const sourceIndex = Number(source.droppableId.substring(0, 1))
    const destinationIndex = Number(destination.droppableId.substring(0, 1))

    const subjectResume = allResumes[sourceIndex].resumes.filter((item: any) => item.index == source.index)
    let sourceState = allResumes[sourceIndex].resumes.filter((item: any) => item.index !== source.index)
    sourceState = sourceState.map((item: any) =>
      item.index >= source.index ? { ...item, index: item.index - 1 } : item
    )
    tempAllResumes[sourceIndex].resumes = sourceState

    subjectResume[0].index = destination.index

    const destinationState = allResumes[destinationIndex].resumes.map((item: any) =>
      item.index >= destination.index ? { ...item, index: item.index + 1 } : item
    )
    destinationState.splice(destination.index - 1, 0, subjectResume[0])
    tempAllResumes[destinationIndex].resumes = destinationState

    setAllResumes([...tempAllResumes])
  }

  return (
    <>
      <Stack
        // ref={scrollContainer.ref}
        direction='row'
        spacing={-3}
        sx={{
          // overflowX: 'scroll',
          pr: 3,
          pb: 20,
          pt: 0,
          pl: 0
        }}
      >
        <DragDropContext onDragEnd={dragEndHandler}>
          {positionResumes.length > 0 &&
            positionResumes.map((column: any) => {
              const status = Object.keys(column)[0]
              const colData = resumesStates[status]
              return (
                <ResumeKanbanColumn
                  title={colData.title}
                  color={colData.color}
                  statusKey={colData.key}
                  key={colData.key}
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
