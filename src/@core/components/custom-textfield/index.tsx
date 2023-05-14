import { TextField, TextFieldProps, styled } from '@mui/material'

const CustomTextField = styled(({ className, ...props }: TextFieldProps) => (
  <TextField {...props} value={props.value} classes={{ root: className }} />
))(({}) => ({}))

export default CustomTextField
