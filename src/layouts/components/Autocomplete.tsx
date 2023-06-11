// ** React Imports
import { useEffect, useCallback, useRef, useState, ChangeEvent } from 'react'

// ** Next Imports
import Link from 'next/link'
import { useRouter } from 'next/router'

// ** MUI Imports
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import List from '@mui/material/List'
import MuiDialog from '@mui/material/Dialog'
import ListItem from '@mui/material/ListItem'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'
import useMediaQuery from '@mui/material/useMediaQuery'
import { styled, useTheme } from '@mui/material/styles'
import ListItemButton from '@mui/material/ListItemButton'
import InputAdornment from '@mui/material/InputAdornment'
import MuiAutocomplete, { AutocompleteRenderInputParams } from '@mui/material/Autocomplete'
import CustomAvatar from 'src/@core/components/mui/avatar'
import ManageSearchIcon from '@mui/icons-material/ManageSearch'
import SearchIcon from '@mui/icons-material/Search'
import CloseIcon from '@mui/icons-material/Close'

// ** Third Party Imports
import axios from 'axios'

// ** Types Imports
import { AppBarSearchType } from 'src/@fake-db/types'
import { Settings } from 'src/@core/context/settingsContext'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Configs Imports
import themeConfig from 'src/configs/themeConfig'
import { getEntityIcon, getImagePath } from 'src/helpers/functions'
import { useDispatch } from 'react-redux'
import { getCompanies } from 'src/store/company'
import { getProjects } from 'src/store/project'
import { getPositions } from 'src/store/position'
import { getResumesIndex } from 'src/store/resume'
import { useSelector } from 'react-redux'

interface Props {
  hidden: boolean
  settings: Settings
}

interface DefaultSuggestionsProps {
  setOpenDialog: (val: boolean) => void
}

interface NoResultProps {
  value: string
  setOpenDialog: (val: boolean) => void
}

const categoryTitle: { [k: string]: string } = {
  companies: 'Companies',
  projects: 'Projects',
  positions: 'Positions',
  resumes: 'Resumes'
}

// ** Styled Autocomplete component
const Autocomplete = styled(MuiAutocomplete)(({ theme }) => ({
  '& fieldset': {
    border: 0
  },
  '& + .MuiAutocomplete-popper': {
    '& .MuiAutocomplete-listbox': {
      paddingTop: 0,
      height: '100%',
      maxHeight: 'inherit',
      '& .MuiListSubheader-root': {
        top: 0,
        fontWeight: 400,
        lineHeight: '15px',
        fontSize: '0.75rem',
        letterSpacing: '1px',
        color: theme.palette.text.disabled
      }
    },
    '& .MuiAutocomplete-paper': {
      border: 0,
      height: '100%',
      borderRadius: 0,
      boxShadow: 'none'
    },
    '& .MuiListItem-root.suggestion': {
      padding: 0,
      '& .MuiListItemSecondaryAction-root': {
        display: 'flex'
      },
      '&.Mui-focused.Mui-focusVisible, &:hover': {
        backgroundColor: theme.palette.action.hover
      },
      '& .MuiListItemButton-root: hover': {
        backgroundColor: 'transparent'
      },
      '&:not(:hover)': {
        '& .MuiListItemSecondaryAction-root': {
          display: 'none'
        },
        '&.Mui-focused, &.Mui-focused.Mui-focusVisible:not(:hover)': {
          '& .MuiListItemSecondaryAction-root': {
            display: 'flex'
          }
        },
        [theme.breakpoints.down('sm')]: {
          '&.Mui-focused:not(.Mui-focusVisible) .MuiListItemSecondaryAction-root': {
            display: 'none'
          }
        }
      }
    },
    '& .MuiAutocomplete-noOptions': {
      display: 'grid',
      minHeight: '100%',
      alignItems: 'center',
      flexDirection: 'column',
      justifyContent: 'center',
      padding: theme.spacing(10)
    }
  }
}))

// ** Styled Dialog component
const Dialog = styled(MuiDialog)({
  '& .MuiBackdrop-root': {
    backdropFilter: 'blur(4px)'
  },
  '& .MuiDialog-paper': {
    overflow: 'hidden',
    '&:not(.MuiDialog-paperFullScreen)': {
      height: '100%',
      maxHeight: 550
    }
  }
})

const CompaniesIcon = getEntityIcon('companies')
const ProjectsIcon = getEntityIcon('projects')
const PositionsIcon = getEntityIcon('positions')
const ResumesIcon = getEntityIcon('resumes')

const NoResult = ({ value, setOpenDialog }: NoResultProps) => {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', flexDirection: 'column', justifyContent: 'center' }}>
      <Box sx={{ mb: 2.5, color: 'text.primary' }}>
        <Icon icon='mdi:file-remove-outline' fontSize='5rem' />
      </Box>
      <Typography variant='h6' sx={{ mb: 11.5, wordWrap: 'break-word' }}>
        No results for{' '}
        <Typography variant='h6' component='span' sx={{ wordWrap: 'break-word' }}>
          {`"${value}"`}
        </Typography>
      </Typography>
    </Box>
  )
}
const DefaultSuggestions = ({ setOpenDialog }: DefaultSuggestionsProps) => {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', flexDirection: 'column', justifyContent: 'center' }}>
      <Box sx={{ mb: 2.5, color: 'text.primary' }}>
        <ManageSearchIcon sx={{ fontSize: '5rem' }} />
      </Box>

      <Typography variant='body2' sx={{ mb: 2.5, color: 'text.disabled' }}>
        Try searching for:
      </Typography>
      <List sx={{ py: 0 }}>
        <ListItem sx={{ py: 2 }} disablePadding onClick={() => setOpenDialog(false)}>
          <Box
            component={Link}
            href='/companies/'
            sx={{
              display: 'flex',
              alignItems: 'center',
              textDecoration: 'none',
              '&:hover > *': { color: 'primary.main' }
            }}
          >
            <Box sx={{ mr: 2.5, display: 'flex', color: 'text.primary' }}>
              <CompaniesIcon />
            </Box>
            <Typography variant='body2' sx={{ color: 'text.primary' }}>
              Companies
            </Typography>
          </Box>
        </ListItem>
        <ListItem sx={{ py: 2 }} disablePadding onClick={() => setOpenDialog(false)}>
          <Box
            component={Link}
            href='/projects/'
            sx={{
              display: 'flex',
              alignItems: 'center',
              textDecoration: 'none',
              '&:hover > *': { color: 'primary.main' }
            }}
          >
            <Box sx={{ mr: 2.5, display: 'flex', color: 'text.primary' }}>
              <ProjectsIcon />
            </Box>
            <Typography variant='body2' sx={{ color: 'text.primary' }}>
              Projects
            </Typography>
          </Box>
        </ListItem>
        <ListItem sx={{ py: 2 }} disablePadding onClick={() => setOpenDialog(false)}>
          <Box
            component={Link}
            href='/positions/'
            sx={{
              display: 'flex',
              alignItems: 'center',
              textDecoration: 'none',
              '&:hover > *': { color: 'primary.main' }
            }}
          >
            <Box sx={{ mr: 2.5, display: 'flex', color: 'text.primary' }}>
              <PositionsIcon />
            </Box>
            <Typography variant='body2' sx={{ color: 'text.primary' }}>
              Positions
            </Typography>
          </Box>
        </ListItem>
        <ListItem sx={{ py: 2 }} disablePadding onClick={() => setOpenDialog(false)}>
          <Box
            component={Link}
            href='/resumes/'
            sx={{
              display: 'flex',
              alignItems: 'center',
              textDecoration: 'none',
              '&:hover > *': { color: 'primary.main' }
            }}
          >
            <Box sx={{ mr: 2.5, display: 'flex', color: 'text.primary' }}>
              <ResumesIcon />
            </Box>
            <Typography variant='body2' sx={{ color: 'text.primary' }}>
              Resumes
            </Typography>
          </Box>
        </ListItem>
      </List>
    </Box>
  )
}

const AutocompleteComponent = ({ hidden, settings }: Props) => {
  // ** States
  const [isMounted, setIsMounted] = useState<boolean>(false)
  const [searchValue, setSearchValue] = useState<string>('')
  const [openDialog, setOpenDialog] = useState<boolean>(false)
  const [options, setOptions] = useState<any>([])

  // ** Hooks & Vars
  const theme = useTheme()
  const router = useRouter()
  const dispatch = useDispatch()
  const { layout } = settings
  const wrapper = useRef<HTMLDivElement>(null)
  const fullScreenDialog = useMediaQuery(theme.breakpoints.down('sm'))

  const { data: companies, loading: loadingCompanies } = useSelector((state: any) => state.companiesList)
  const { data: projects, loading: loadingProjects } = useSelector((state: any) => state.projectsList)
  const { data: positions, loading: loadingPositions } = useSelector((state: any) => state.positionsList)
  const { data: resumes, loading: loadingResumes } = useSelector((state: any) => state.resumesIndex)

  useEffect(() => {
    let companiesDocs: any = []
    let projectsDocs: any = []
    let positionsDocs: any = []
    let resumesDocs: any = []
    if (companies?.docs?.length)
      companiesDocs = [
        ...companies.docs.map((item: any) => {
          return {
            title: item?.name,
            logo: item?.logo,
            url: `/companies/view/${item?._id}/overview`,
            category: 'companies'
          }
        })
      ]
    if (projects?.docs?.length)
      projectsDocs = [
        ...projects.docs.map((item: any) => {
          return {
            title: item?.name,
            logo: item?.logo,
            url: `/projects/view/${item?._id}/overview`,
            category: 'projects'
          }
        })
      ]
    if (positions?.docs?.length)
      positionsDocs = [
        ...positions.docs.map((item: any) => {
          return {
            title: item?.title,
            logo: item?.logo,
            url: `/positions/view/${item?._id}/overview`,
            category: 'positions'
          }
        })
      ]
    if (resumes?.docs?.length)
      resumesDocs = [
        ...resumes.docs.map((item: any) => {
          return { title: item?.fullname, logo: item?.avatar, url: `/resumes/${item?._id}`, category: 'resumes' }
        })
      ]
    setOptions([...companiesDocs, ...projectsDocs, ...positionsDocs, ...resumesDocs])
  }, [companies, projects, positions, resumes])

  console.log('options: ', options)

  // Get all data using API
  // useEffect(() => {
  //   axios
  //     .get('/app-bar/search', {
  //       params: { q: searchValue }
  //     })
  //     .then(response => {
  //       if (response.data && response.data.length) {
  //         setOptions(response.data)
  //       } else {
  //         setOptions([])
  //       }
  //     })
  // }, [searchValue])

  useEffect(() => {
    if (!openDialog) {
      setSearchValue('')
    }
  }, [openDialog])

  useEffect(() => {
    setIsMounted(true)

    return () => setIsMounted(false)
  }, [])

  const handleOptionClick = (obj: AppBarSearchType) => {
    setSearchValue('')
    setOpenDialog(false)
    if (obj.url) {
      router.push(obj.url)
    }
  }

  const handleKeydown = useCallback(
    (event: KeyboardEvent) => {
      if (!openDialog && event.which === 191) {
        setOpenDialog(true)
      }
    },
    [openDialog]
  )

  // Handle shortcut keys keyup events
  const handleKeyUp = useCallback(
    (event: KeyboardEvent) => {
      // ** ESC key to close searchbox
      if (openDialog && event.keyCode === 27) {
        setOpenDialog(false)
      }
    },
    [openDialog]
  )

  useEffect(() => {
    document.addEventListener('keydown', handleKeydown)
    document.addEventListener('keyup', handleKeyUp)

    return () => {
      document.removeEventListener('keydown', handleKeydown)
      document.removeEventListener('keyup', handleKeyUp)
    }
  }, [handleKeyUp, handleKeydown])

  const clearTimerRef: any = useRef()
  const handleSearchValueChange = useCallback((value: string) => {
    setSearchValue(value)
    clearTimeout(clearTimerRef.current)
    const searchObj = { query: value, size: 5, page: 1 }
    const serachTimeout = setTimeout(() => {
      if (value?.length > 0) {
        dispatch(getCompanies({ ...searchObj }))
        dispatch(getProjects({ ...searchObj }))
        dispatch(getPositions({ ...searchObj }))
        dispatch(getResumesIndex({ ...searchObj }))
      }
    }, 1500)
    clearTimerRef.current = serachTimeout
  }, [])

  const searchLoading = loadingCompanies && loadingProjects && loadingPositions && loadingResumes

  if (!isMounted) {
    return null
  } else {
    return (
      <Box
        ref={wrapper}
        onClick={() => !openDialog && setOpenDialog(true)}
        sx={{ display: 'flex', cursor: 'pointer', alignItems: 'center' }}
      >
        <IconButton color='inherit' sx={!hidden && layout === 'vertical' ? { mr: 1, ml: -2.75 } : {}}>
          <SearchIcon />
        </IconButton>
        {!hidden && layout === 'vertical' ? (
          <Typography sx={{ userSelect: 'none', color: 'text.disabled' }}>Search (Ctrl+/)</Typography>
        ) : null}
        {openDialog && (
          <Dialog fullWidth open={openDialog} fullScreen={fullScreenDialog} onClose={() => setOpenDialog(false)}>
            <Box sx={{ top: 0, width: '100%', position: 'sticky' }}>
              <Autocomplete
                autoHighlight
                disablePortal
                options={options}
                id='appBar-search'
                loading={searchLoading}
                isOptionEqualToValue={() => true}
                onInputChange={(event, value: string) => handleSearchValueChange(value)}
                onChange={(event, obj) => handleOptionClick(obj as AppBarSearchType)}
                // noOptionsText={<NoResult value={searchValue} setOpenDialog={setOpenDialog} />}
                getOptionLabel={(option: AppBarSearchType | unknown) => (option as any)?.title}
                groupBy={(option: any) => (searchValue.length ? categoryTitle[option?.category] : '')}
                sx={{
                  '& + .MuiAutocomplete-popper': {
                    ...(searchValue.length
                      ? {
                          overflow: 'auto',
                          maxHeight: 'calc(100vh - 69px)',
                          borderTop: `1px solid ${theme.palette.divider}`,
                          height: fullScreenDialog ? 'calc(100vh - 69px)' : 481,
                          '& .MuiListSubheader-root': { p: theme.spacing(3.75, 6, 0.75) }
                        }
                      : {
                          '& .MuiAutocomplete-listbox': { pb: 0 }
                        })
                  }
                }}
                renderInput={(params: AutocompleteRenderInputParams) => {
                  return (
                    <TextField
                      {...params}
                      value={searchValue}
                      onChange={(event: ChangeEvent<HTMLInputElement>) => handleSearchValueChange(event.target.value)}
                      inputRef={input => {
                        if (input) {
                          if (openDialog) {
                            setTimeout(() => input.focus(), 1)
                          } else {
                            input.blur()
                          }
                        }
                      }}
                      InputProps={{
                        ...params.InputProps,
                        sx: { p: `${theme.spacing(3.75, 6)} !important` },
                        startAdornment: (
                          <InputAdornment position='start' sx={{ color: 'text.primary' }}>
                            <SearchIcon />
                          </InputAdornment>
                        ),
                        endAdornment: (
                          <InputAdornment
                            position='end'
                            onClick={() => setOpenDialog(false)}
                            sx={{ display: 'flex', cursor: 'pointer', alignItems: 'center' }}
                          >
                            {!hidden ? <Typography sx={{ mr: 2.5, color: 'text.disabled' }}>[esc]</Typography> : null}
                            <IconButton size='small' sx={{ p: 1 }}>
                              <CloseIcon />
                            </IconButton>
                          </InputAdornment>
                        )
                      }}
                    />
                  )
                }}
                renderOption={(props, option: any) => {
                  return searchValue.length ? (
                    <ListItem
                      {...props}
                      key={option?.title}
                      className={`suggestion ${props.className}`}
                      onClick={() => handleOptionClick(option as AppBarSearchType)}
                      secondaryAction={<Icon icon='mdi:subdirectory-arrow-left' fontSize={20} />}
                      sx={{
                        '& .MuiListItemSecondaryAction-root': {
                          '& svg': {
                            cursor: 'pointer',
                            color: 'text.disabled'
                          }
                        }
                      }}
                    >
                      <ListItemButton
                        sx={{
                          py: 2.5,
                          px: `${theme.spacing(6)} !important`,
                          '& svg': { mr: 2.5, color: 'text.primary' }
                        }}
                      >
                        {option?.logo ? (
                          <CustomAvatar src={getImagePath(option?.logo)} sx={{ mr: 3, width: 34, height: 34 }} />
                        ) : (
                          <Icon fontSize={20} icon={themeConfig.navSubItemIcon} />
                        )}
                        <Typography variant='body2' sx={{ color: 'text.primary' }}>
                          {option?.title}
                        </Typography>
                      </ListItemButton>
                    </ListItem>
                  ) : null
                }}
              />
            </Box>
            {searchValue.length === 0 ? (
              <Box
                sx={{
                  p: 10,
                  display: 'grid',
                  overflow: 'auto',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderTop: `1px solid ${theme.palette.divider}`,
                  height: fullScreenDialog ? 'calc(100vh - 69px)' : '100%'
                }}
              >
                <DefaultSuggestions setOpenDialog={setOpenDialog} />
              </Box>
            ) : null}
          </Dialog>
        )}
      </Box>
    )
  }
}

export default AutocompleteComponent
