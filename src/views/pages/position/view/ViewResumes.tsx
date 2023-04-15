import { Stack } from '@mui/material'
import { useScrollContainer } from 'react-indiana-drag-scroll'
import ResumeCardMainDialog from './ResumeCardMainDialog'
import { useState } from 'react'
import ResumeKanbanColumn from './ResumeKanbanColumn'
import ResumeKanbanCard from './ResumeKanbanCard'
import resumes from 'src/data/resumeCards.json'

const ViewResumes = () => {
  const [open, setOpen] = useState<boolean>(false)
  const handleClose = () => setOpen(false)
  const scrollContainer = useScrollContainer()
  const cols = Object.keys(resumes)
  const allResumes: any = resumes
  return (
    <>
      <Stack
        ref={scrollContainer.ref}
        direction='row'
        spacing={-3}
        sx={{ overflowX: 'scroll', pr: 3, pb: 20, pt: 0, pl: 0 }}
      >
        {cols.map((column: any) => (
          <ResumeKanbanColumn title={allResumes[column].title} color={allResumes[column].status_color}>
            {allResumes[column]?.resumes.map((resumeData: any) => (
              <ResumeKanbanCard cardData={resumeData} setOpen={setOpen} />
            ))}
          </ResumeKanbanColumn>
        ))}
      </Stack>
      <ResumeCardMainDialog open={open} toggle={handleClose} resumeData={{}} />
    </>
  )
}

export default ViewResumes
