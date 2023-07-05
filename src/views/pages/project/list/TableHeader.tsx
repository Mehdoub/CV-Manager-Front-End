// ** MUI Imports
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import CustomTextField from 'src/@core/components/custom-textfield'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

interface TableHeaderProps {
  searchQuery: string
  toggle: () => void
  handleFilter: (val: string) => void
}

const TableHeader = (props: TableHeaderProps) => {
  // ** Props
  const { handleFilter, toggle, searchQuery } = props

  return (
    <Box sx={{ p: 5, pb: 3, display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'start' }}>
      {/* <Button
        sx={{ mr: 4, mb: 2 }}
        color='secondary'
        variant='outlined'
        startIcon={<Icon icon='mdi:export-variant' fontSize={20} />}
      >
        Export
      </Button> */}
      <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center' }}>
        <Button sx={{ mb: 2, mr: 6 }} onClick={toggle} variant='contained'>
          Add Project
        </Button>
        <CustomTextField
          size='small'
          value={searchQuery}
          sx={{ mb: 2 }}
          placeholder='Search Project'
          onChange={e => handleFilter(e.target.value)}
        />

      </Box>
    </Box>
  )
}

export default TableHeader
