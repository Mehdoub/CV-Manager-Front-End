import { Button, ButtonProps, Grid } from '@mui/material'
import { styled } from '@mui/system'
import { useState } from 'react'
import { useDispatch } from 'react-redux'
import { useSelector } from 'react-redux'
import CustomTextField from 'src/@core/components/custom-textfield'
import { getResumes } from 'src/store/resume'
import AddResumeDialog from 'src/views/pages/position/view/AddResumeDialog'
import ViewResumes from 'src/views/pages/position/view/ViewResumes'

const ResponsiveBtn = styled(Button)<ButtonProps>(({ theme }) => ({
  mb: 2,
  [theme.breakpoints.down('md')]: {
    position: 'unset',
    minWidth: 'auto',
    marginLeft: '15px',
    marginBottom: '5px'
  }
}))

const Resumes = () => {
  const [openAddResumeDialog, setOpenAddResumeDialog] = useState<boolean>(false)
  const [searchQuery, setSearchQuery] = useState<string>('')
  const handleCloseAddResumeDialog = () => setOpenAddResumeDialog(false)

  const dispatch = useDispatch()

  const { data: constants } = useSelector((state: any) => state.constants)
  const { data: provinces } = useSelector((state: any) => state.provinces)

  const handleSearchResume = (query: string) => {
    setSearchQuery(query)
    dispatch(getResumes(query))
  }

  return (
    <>
      <Grid container>
        {/* <Grid container item xs={12} ml={4} sx={{ position: 'fixed', top: '80px' }}>
          <Grid item>
            <ResponsiveBtn variant='outlined' onClick={() => setOpenAddResumeDialog(true)}>
              Add Resume
            </ResponsiveBtn>
          </Grid>
          <Grid item ml={4}>
            <CustomTextField
              size='small'
              value={searchQuery}
              sx={{ mr: 6, mb: 2 }}
              placeholder='Search Company'
              onChange={e => handleSearchResume(e.target.value)}
              autoFocus
            />
          </Grid>
        </Grid> */}
        <Grid item xs={12} mt={10}>
          <ViewResumes allResumes={true} />
        </Grid>
      </Grid>
      {constants?.system && provinces?.length ? (
        <AddResumeDialog open={openAddResumeDialog} handleClose={handleCloseAddResumeDialog} />
      ) : null}
    </>
  )
}

export default Resumes
