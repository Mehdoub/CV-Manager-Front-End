import { Card, Typography, useTheme } from '@mui/material'
import { getColorCodes } from 'src/helpers/functions'

interface ResumeKanbanColumnProps {
  title: string
  color: string
  children: any
}

const ResumeKanbanColumn = ({ title, color, children }: ResumeKanbanColumnProps) => {
  const theme = useTheme()
  return (
    <Card
      className='hide-scrollbar'
      sx={{
        minWidth: 300,
        maxHeight: 720,
        backgroundColor: theme.palette.mode == 'dark' ? '#282A42' : '#F7F7F9',
        overflowY: 'scroll',
        boxShadow: 'none',
        position: 'relative'
      }}
    >
      <Card
        sx={{
          fontSize: 16,
          fontWeight: 500,
          textAlign: 'left',
          p: 5,
          pb: 0,
          pt: 0,
          top: 0,
          position: 'sticky',
          height: '42px',
          margin: '0 16px',
          borderRadius: '10px 10px 3px 3px',
          // backgroundColor: '#fff',
          display: 'flex',
          alignItems: 'center',
          boxShadow: '0px 2px 10px 0px rgb(76 78 100 / 22%)',
          borderTop: '2px solid ' + getColorCodes(color),
          zIndex: 100
        }}
      >
        {title}
      </Card>
      {children}
    </Card>
  )
}

export default ResumeKanbanColumn
