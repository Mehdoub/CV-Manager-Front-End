// ** Type import
import { VerticalNavItemsType } from 'src/@core/layouts/types'

const navigation = (): VerticalNavItemsType => {
  return [
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
      icon: 'mdi:shield-outline',
      children: [
        {
          title: 'sidebar.roles',
          path: '/roles',
        },
        {
          title: 'sidebar.permissions',
          path: '/permissions',
        },
      ],
    },
  ]
}

export default navigation
