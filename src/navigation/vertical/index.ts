// ** Type import
import { VerticalNavItemsType } from 'src/@core/layouts/types'
import HomeIcon from '@mui/icons-material/Home';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import BusinessIcon from '@mui/icons-material/Business';
import FolderCopyIcon from '@mui/icons-material/FolderCopy';
import WorkIcon from '@mui/icons-material/Work';
import SecurityIcon from '@mui/icons-material/Security';

const navigation = (): any => {
  return [
    {
      title: 'sidebar.home',
      path: '/home',
      icon: HomeIcon,
    },
    {
      title: 'sidebar.users',
      path: '/users',
      icon: PeopleAltIcon,
    },
    {
      title: 'sidebar.companies',
      path: '/companies',
      icon: BusinessIcon,
    },
    {
      title: 'sidebar.projects',
      path: '/projects',
      icon: FolderCopyIcon,
    },
    {
      title: 'sidebar.positions',
      path: '/positions',
      icon: WorkIcon,
    },
    {
      title: 'sidebar.roles_permissions',
      path: '/roles',
      icon: SecurityIcon,
    },
  ]
}

export default navigation
