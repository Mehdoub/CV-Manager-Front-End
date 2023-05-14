// ** Type import
import { HorizontalNavItemsType } from 'src/@core/layouts/types'

const navigation = (): HorizontalNavItemsType => [
  {
    title: 'sidebar.home',
    path: '/home',
    icon: 'mdi:home-outline',
  },
  {
    title: 'sidebar.users',
    path: '/users',
    icon: 'mdi:users-outline',
  },
  {
    title: 'sidebar.companies',
    path: '/companies',
    icon: 'carbon:location-company',
  },
  {
    title: 'sidebar.projects',
    path: '/projects',
    icon: 'pajamas:project',
  },
  {
    title: 'sidebar.positions',
    path: '/positions',
    icon: 'ic:baseline-work-outline',
  },
  {
    title: 'sidebar.roles_permissions',
    path: '/roles',
    icon: 'mdi:shield-outline',
  },
]

export default navigation
