// ** Type import
import { HorizontalNavItemsType } from 'src/@core/layouts/types'

const navigation = (): HorizontalNavItemsType => [
  {
    title: 'Home',
    path: '/home',
    icon: 'mdi:home-outline',
  },
  {
    title: 'Second Page',
    path: '/second-page',
    icon: 'mdi:email-outline',
  },
  {
    path: '/acl',
    action: 'read',
    subject: 'acl-page',
    title: 'Access Control',
    icon: 'mdi:shield-outline',
  },
  {
    title: 'Companies',
    path: '/companies',
    icon: 'carbon:location-company',
  },
  {
    title: 'Projects',
    path: '/projects',
    icon: 'pajamas:project',
  },
]

export default navigation
