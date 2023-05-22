// ** Type Import
import { IconProps } from '@iconify/react'

// ** Custom Icon Import
import Icon from 'src/@core/components/icon'

const UserIcon = ({ icon, ...rest }: any) => {
  if (typeof icon !== 'string') {
    const IconComponent: any = icon
    return <IconComponent {...rest} />
  }
  return <Icon icon={icon} {...rest} />
}

export default UserIcon
