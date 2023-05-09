import { TextField, TextFieldProps, styled } from '@mui/material'
import { uppercaseFirstLetters } from 'src/helpers/functions'

const CustomTextField = styled(({ className, ...props }: TextFieldProps) => (
  <TextField {...props} value={uppercaseFirstLetters(props?.value, false, true)} classes={{ root: className }} />
))(({}) => ({}))

export default CustomTextField
