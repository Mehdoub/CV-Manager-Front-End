import { Autocomplete, Grid, IconButton, ListItem, ListItemSecondaryAction, Popover, Stack, Typography, createFilterOptions } from "@mui/material"
import { useSelector } from "react-redux"
import BootstrapTooltip from "src/@core/components/bootstrap-tooltip"
import { getMaxTextLen } from "src/helpers/functions"
import CustomChip from 'src/@core/components/mui/chip'
import { hexToRGBA } from "src/@core/utils/hex-to-rgba"
import { useSettings } from "src/@core/hooks/useSettings"
import CustomTextField from "src/@core/components/custom-textfield"
import BookmarkAddIcon from '@mui/icons-material/BookmarkAdd'
import { useEffect, useState } from "react"
import { addTagToResume, clearResumeAddTag, clearResumeRemoveTag, getResume, getResumes, removeTagFromResume } from "src/store/resume"
import { getPositionResumes } from "src/store/position"
import { useDispatch } from "react-redux"
import { clearTagCreate, createTag, getTags } from "src/store/tag"

const filter = createFilterOptions<any>()

interface Props {
  allResumes: boolean
}

const TagsManagement = ({ allResumes }: Props) => {
  const [anchorElAddTag, setAnchorElAddTag] = useState<HTMLButtonElement | null>(null)

  const { data: resume } = useSelector((state: any) => state.resume)
  const { data: createdTag } = useSelector((state: any) => state.tagCreate)
  const { status: resumeAddTagStatus } = useSelector((state: any) => state.resumeAddTag)
  const { status: resumeRemoveTagStatus } = useSelector((state: any) => state.resumeRemoveTag)
  const { data: tags } = useSelector((state: any) => state.tags)

  const { settings } = useSettings()
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(getTags())
  }, [])

  useEffect(() => {
    if (resumeAddTagStatus) {
      dispatch(getResume(resume.id))
      if (!allResumes) dispatch(getPositionResumes(resume?.position_id?._id))
      else dispatch(getResumes())
      dispatch(clearResumeAddTag())
      handleCloseAddTag()
    }
  }, [resumeAddTagStatus])

  useEffect(() => {
    if (resumeRemoveTagStatus) {
      dispatch(getResume(resume.id))
      if (!allResumes) dispatch(getPositionResumes(resume?.position_id?._id))
      else dispatch(getResumes())
      dispatch(clearResumeRemoveTag())
    }
  }, [resumeRemoveTagStatus])

  useEffect(() => {
    if (createdTag?.name?.length > 0) {
      addTagToResumeHandler(createdTag?._id)
      dispatch(clearTagCreate())
    }
  }, [createdTag])

  const handleClickAddTag = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorElAddTag(event.currentTarget)
  }

  const handleCloseAddTag = () => {
    setAnchorElAddTag(null)
  }
  const openAddTag = Boolean(anchorElAddTag)

  const searchTags = (e: any) => {
    dispatch(getTags({ query: e?.target?.value }))
  }

  const addTagToResumeHandler = (tagId: string) => {
    dispatch(addTagToResume({ resumeId: resume?.id, tagId }))
  }

  const removeTagFromResumeHandler = (tagId: string) => {
    dispatch(removeTagFromResume({ resumeId: resume?.id, tagId }))
  }

  const createTagHandler = (name: string) => {
    dispatch(createTag({ name }))
  }

  return (
    <Stack direction='row' spacing={1} mt={2}>
      {resume?.tags?.length > 0 &&
        resume?.tags?.map((tag: any, index: any) => (
          <>
            <BootstrapTooltip placement='top' title={tag?.name}>
              <div>
                <CustomChip
                  size='small'
                  label={getMaxTextLen(tag?.name)}
                  skin='light'
                  sx={{
                    fontSize: 12,
                    height: 22,
                    backgroundColor: hexToRGBA(tag?.color, settings.mode == 'dark' ? 0.4 : 0.12),
                    color: tag?.color,
                    borderBottomLeftRadius: 0,
                    borderTopLeftRadius: 0,
                    cursor: 'pointer',
                    '.MuiSvgIcon-root': {
                      display: 'none'
                    },
                    ':hover': {
                      '.MuiSvgIcon-root': {
                        display: 'inline-block'
                      }
                    }
                  }}
                  onDelete={() => removeTagFromResumeHandler(tag?._id)}
                />
              </div>
            </BootstrapTooltip>
          </>
        ))}
      <BootstrapTooltip placement='top' title='Add Tag'>
        <IconButton
          aria-label='capture screenshot'
          sx={{ border: '1px dashed gray', width: '28px', height: '28px', p: 0 }}
          onClick={handleClickAddTag}
        >
          <BookmarkAddIcon sx={{ fontSize: 20 }} />
        </IconButton>
      </BootstrapTooltip>
      <Popover
        id='add-tag'
        open={openAddTag}
        anchorEl={anchorElAddTag}
        onClose={handleCloseAddTag}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center'
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'center'
        }}
        PaperProps={{
          style: {
            width: '10%'
          }
        }}
      >
        <Grid container p={3}>
          <Grid item xs={12}>
            <Autocomplete
              options={tags?.docs ?? []}
              size='small'
              id='autocomplete-size-small-multi'
              renderInput={params => (
                <CustomTextField
                  {...params}
                  label='Add Tag'
                  placeholder='Search Tags ...'
                  onChange={searchTags}
                />
              )}
              renderOption={(props, tag: any) =>
                tag.name.includes('Add "') ? (
                  <ListItem {...props}>{tag?.name}</ListItem>
                ) : (
                  <ListItem {...props} alignItems='center'>
                    <CustomChip
                      size='small'
                      label={tag?.name}
                      skin='light'
                      sx={{
                        backgroundColor: hexToRGBA(tag?.color, settings.mode == 'dark' ? 0.4 : 0.12),
                        color: tag?.color
                      }}
                    />
                    <ListItemSecondaryAction>
                      <Typography>{tag?.count}</Typography>
                    </ListItemSecondaryAction>
                  </ListItem>
                )
              }
              onChange={(event, newValue) => {
                if (newValue?._id) {
                  addTagToResumeHandler(newValue?._id)
                  handleCloseAddTag()
                } else if (newValue && newValue.inputValue) {
                  createTagHandler(newValue.inputValue)
                }
              }}
              filterOptions={(options, params) => {
                const filtered = filter(options, params)

                const { inputValue } = params
                // Suggest the creation of a new tag
                const isExisting = options.some(option => inputValue === option?.name)
                if (inputValue !== '' && !isExisting) {
                  filtered.push({
                    inputValue,
                    name: `Add "${inputValue}"`
                  })
                }

                return filtered
              }}
              selectOnFocus
              clearOnBlur
              handleHomeEndKeys
              getOptionLabel={option => {
                if (option.inputValue) {
                  return option.inputValue
                }
                return option?.name
              }}
            />
          </Grid>
        </Grid>
      </Popover>
    </Stack>
  )
}

export default TagsManagement
