import { Stack } from '@mui/material'
import { useScrollContainer } from 'react-indiana-drag-scroll'
import ResumeCardMainDialog from './ResumeCardMainDialog'
import { useEffect, useState } from 'react'
import ResumeKanbanColumn from './ResumeKanbanColumn'
import ResumeKanbanCard from './ResumeKanbanCard'
import resumes from 'src/data/resumeCards.json'
import { DragDropContext } from 'react-beautiful-dnd'

const ViewResumes = () => {
  const [open, setOpen] = useState<boolean>(false)
  const [allResumes, setAllResumes] = useState<any>([])
  const handleClose = () => setOpen(false)
  const scrollContainer = useScrollContainer()
  const cols = Object.keys(resumes)

  useEffect(() => {
    setAllResumes(resumes)
  }, [])

  const dragEndHandler = (result: any) => {
    const { source, destination, draggableId } = result

    if (!destination) return

    if (source.droppableId == destination.droppableId && source.index == destination.index) return

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
          {allResumes.map((columnData: any) => (
            <ResumeKanbanColumn
              title={columnData.title}
              color={columnData.status_color}
              statusKey={columnData.key}
              key={columnData.key}
            >
              {columnData?.resumes.map((resumeData: any) => (
                <ResumeKanbanCard cardData={resumeData} setOpen={setOpen} />
              ))}
            </ResumeKanbanColumn>
          ))}
        </DragDropContext>
      </Stack>
      <ResumeCardMainDialog open={open} toggle={handleClose} resumeData={{}} />
    </>
  )
}

export default ViewResumes
