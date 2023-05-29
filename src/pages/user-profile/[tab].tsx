// ** Demo Components Imports
import UserProfile from 'src/views/pages/user-profile/UserProfile'

// ** Types
import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'

const UserProfileTab = () => {
  const [userData, setUserData] = useState<any>()
  const {
    query: { tab }
  } = useRouter()
  useEffect(() => {
    setUserData({
      teamsTech: [
        {
          members: 72,
          ChipColor: 'error',
          chipText: 'Developer',
          title: 'React Developers',
          avatar: '/images/icons/project-icons/react-label.png'
        },
        {
          members: 122,
          chipText: 'Support',
          ChipColor: 'primary',
          title: 'Support Team',
          avatar: '/images/icons/project-icons/support-label.png'
        },
        {
          members: 7,
          ChipColor: 'info',
          chipText: 'Designer',
          title: 'UI Designer',
          avatar: '/images/icons/project-icons/figma-label.png'
        },
        {
          members: 289,
          ChipColor: 'error',
          chipText: 'Developer',
          title: 'Vue.js Developers',
          avatar: '/images/icons/project-icons/vue-label.png'
        },
        {
          members: 24,
          chipText: 'Marketing',
          ChipColor: 'secondary',
          title: 'Digital Marketing',
          avatar: '/images/icons/project-icons/twitter-label.png'
        }
      ],
      overview: [
        { property: 'Registered Resumes', value: '135', icon: 'mdi:check' },
        { property: 'Companies', value: '897', icon: 'mdi:account-outline' },
        { property: 'Projects', value: '146', icon: 'mdi:view-grid-plus-outline' }
      ]
    })
  }, [tab])

  return <UserProfile data={userData} />
}

export default UserProfileTab
