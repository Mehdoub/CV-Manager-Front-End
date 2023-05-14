import { Tooltip, TooltipProps, styled, tooltipClasses } from '@mui/material'
import { uppercaseFirstLetters } from 'src/helpers/functions'

const BootstrapTooltip = styled(({ className, ...props }: TooltipProps) => (
  <Tooltip {...props} arrow classes={{ popper: className }} title={uppercaseFirstLetters(props.title)} />
))(({ theme }) => ({
  [`& .${tooltipClasses.arrow}`]: {
    color: theme.palette.common.black
  },
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: theme.palette.common.black
  }
}))

export default BootstrapTooltip
