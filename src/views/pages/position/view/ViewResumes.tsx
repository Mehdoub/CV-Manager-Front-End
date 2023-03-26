import { Stack } from '@mui/material'
import { useScrollContainer } from 'react-indiana-drag-scroll'
import ResumeCardViewDialog from './ResumeCardViewDialog'
import { useState } from 'react'
import ResumeKanbanColumn from './ResumeKanbanColumn'
import ResumeKanbanCard from './ResumeKanbanCard'

const columns = [
  {
    title: 'New',
    color: 'primary'
  },
  {
    title: 'Reviewd',
    color: 'info'
  },
  {
    title: 'Call Interview',
    color: 'warning'
  },
  {
    title: 'Technical Test',
    color: 'secondary'
  },
  {
    title: 'Hired',
    color: 'success'
  },
  {
    title: 'Rejected',
    color: 'error'
  }
]

const cards = [
  {
    id: 1,
    title: 'Mahdi Mehrjoo',
    label: 'Laravel Developer',
    color: 'info',
    interview: 'tomorrow 15:00',
    interviewColor: 'success',
    tags: [
      {
        text: 'test',
        color: 'warning'
      },
      {
        text: 'hot',
        color: 'error'
      }
    ],
    moreTags: 2,
    date: '14 March 03:00 P.M',
    asignees: [
      {
        id: 1,
        title: 'Mahdi Mehrjoo'
      },
      {
        id: 2,
        title: 'Ali Hamzehei'
      },
      {
        id: 3,
        title: 'Amin Paapi'
      },
      {
        id: 4,
        title: 'Aliakbar Rezaei'
      }
    ],
    rate: 5,
    rateText: 'Excellent!'
  },
  {
    id: 2,
    title: 'Ali Hamzehei Tabrizi',
    label: 'Laravel Developer',
    color: 'info',
    interview: 'right now',
    interviewColor: 'error',
    tags: [],
    moreTags: 0,
    date: '14 March 03:00 P.M',
    asignees: [
      {
        id: 1,
        title: 'Mahdi Mehrjoo'
      },
      {
        id: 2,
        title: 'Ali Hamzehei'
      },
      {
        id: 3,
        title: 'Amin Paapi'
      },
      {
        id: 4,
        title: 'Aliakbar Rezaei'
      }
    ],
    rate: 4,
    rateText: 'Awesome'
  },
  {
    id: 3,
    title: 'Amin Paapi',
    label: 'Information',
    color: 'info',
    interview: 'right now',
    interviewColor: 'error',
    tags: [],
    moreTags: 0,
    date: '14 March 03:00 P.M',
    asignees: [
      {
        id: 1,
        title: 'Mahdi Mehrjoo'
      },
      {
        id: 2,
        title: 'Ali Hamzehei'
      },
      {
        id: 3,
        title: 'Amin Paapi'
      },
      {
        id: 4,
        title: 'Aliakbar Rezaei'
      }
    ],
    rate: 3,
    rateText: 'Good'
  },
  {
    id: 4,
    title: 'Aliakbar Rezaei',
    label: 'Information',
    color: 'info',
    interview: 'yesterday 11:00',
    interviewColor: 'warning',
    tags: [],
    moreTags: 0,
    date: '14 March 03:00 P.M',
    asignees: [
      {
        id: 1,
        title: 'Mahdi Mehrjoo'
      },
      {
        id: 2,
        title: 'Ali Hamzehei'
      },
      {
        id: 3,
        title: 'Amin Paapi'
      },
      {
        id: 4,
        title: 'Aliakbar Rezaei'
      }
    ],
    rate: 3,
    rateText: 'Good'
  },
  {
    id: 5,
    title: 'Mahdi Amereh',
    label: 'Information',
    color: 'info',
    interview: 'yesterday 11:00',
    interviewColor: 'warning',
    tags: [],
    moreTags: 0,
    date: '14 March 03:00 P.M',
    asignees: [
      {
        id: 1,
        title: 'Mahdi Mehrjoo'
      },
      {
        id: 2,
        title: 'Ali Hamzehei'
      },
      {
        id: 3,
        title: 'Amin Paapi'
      },
      {
        id: 4,
        title: 'Aliakbar Rezaei'
      }
    ],
    rate: 3,
    rateText: 'Good'
  }
]

const ProjectViewResumes = () => {
  const [open, setOpen] = useState<boolean>(false)
  const handleClose = () => setOpen(false)
  const scrollContainer = useScrollContainer()
  return (
    <>
      <Stack
        ref={scrollContainer.ref}
        direction='row'
        spacing={-3}
        sx={{ overflowX: 'scroll', pr: 3, pb: 20, pt: 0, pl: 0 }}
      >
        {columns.map(column => (
          <ResumeKanbanColumn title={column.title} color={column.color}>
            {cards.map(card => (
              <ResumeKanbanCard cardData={card} setOpen={setOpen} />
            ))}
          </ResumeKanbanColumn>
        ))}
      </Stack>
      <ResumeCardViewDialog open={open} toggle={handleClose} resumeData={{}} />
    </>
  )
}

export default ProjectViewResumes
