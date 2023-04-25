// ** Next Import
import { GetStaticProps, GetStaticPaths, GetStaticPropsContext, InferGetStaticPropsType } from 'next/types'

// ** Third Party Imports
// import axios from 'axios'

// ** Demo Components Imports
import UserProfile from 'src/views/pages/user-profile/UserProfile'

// ** Types
import { UserProfileActiveTab } from 'src/@fake-db/types'
import { useEffect, useState } from 'react'
import Language from 'src/helpers/Language'

const UserProfileTab = ({
  tab
}: //  data
any) => {
  const [userData, setUserData] = useState<any>()
  useEffect(() => {
    const jsonData = JSON.parse(localStorage.getItem('userData') as string)
    const lang = Language.builder().getLanguage() == 'en' ? 'English' : 'Farsi'
    setUserData({
      about: [
        { property: 'Full Name', value: `${jsonData?.firstname} ${jsonData?.lastname}`, icon: 'mdi:account-outline' },
        // { property: 'Status', value: 'active', icon: 'mdi:check' },
        { property: 'Role', value: jsonData?.role, icon: 'mdi:star-outline' },
        { property: 'Country', value: 'Iran', icon: 'mdi:flag-outline' },
        { property: 'Language', value: lang, icon: 'mdi:translate' }
      ],
      contacts: [
        { property: 'Contact', value: `+${jsonData?.mobile}`, icon: 'mdi:phone-outline' },
        { property: 'Email', value: jsonData?.email ?? 'john.doe@example.com', icon: 'mdi:email-outline' }
      ],
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

  return <UserProfile tab={tab} data={userData} />
}

export const getStaticPaths: GetStaticPaths = () => {
  return {
    paths: [
      { params: { tab: 'profile' } },
      { params: { tab: 'teams' } },
      { params: { tab: 'projects' } },
      { params: { tab: 'connections' } }
    ],
    fallback: false
  }
}

export const getStaticProps: GetStaticProps = async ({ params }: GetStaticPropsContext) => {
  // const res = await axios.get('/pages/profile', { params: { tab: params?.tab } })
  const data: UserProfileActiveTab = {
    about: [
      { property: 'Full Name', value: 'John Doe', icon: 'mdi:account-outline' },
      { property: 'Status', value: 'active', icon: 'mdi:check' },
      { property: 'Role', value: 'Developer', icon: 'mdi:star-outline' },
      { property: 'Country', value: 'USA', icon: 'mdi:flag-outline' },
      { property: 'Language', value: 'English', icon: 'mdi:translate' }
    ],
    contacts: [
      { property: 'Contact', value: '(123) 456-7890', icon: 'mdi:phone-outline' },
      { property: 'Skype', value: 'john.doe', icon: 'mdi:message-outline' },
      { property: 'Email', value: 'john.doe@example.com', icon: 'mdi:email-outline' }
    ],
    teams: [
      { property: 'Backend Developer', value: '(126 Members)', icon: 'mdi:github', color: 'primary' },
      { property: 'React Developer', value: '(98 Members)', icon: 'mdi:react', color: 'info' }
    ],
    overview: [
      { property: 'Task Compiled', value: '13.5k', icon: 'mdi:check' },
      { property: 'Connections', value: '897', icon: 'mdi:account-outline' },
      { property: 'Projects Compiled', value: '146', icon: 'mdi:view-grid-plus-outline' }
    ],
    connections: [
      { isFriend: false, connections: '45', name: 'Cecilia Payne', avatar: '/images/avatars/2.png' },
      { isFriend: true, connections: '1.32k', name: 'Curtis Fletcher', avatar: '/images/avatars/3.png' },
      { isFriend: true, connections: '125', name: 'Alice Stone', avatar: '/images/avatars/4.png' },
      { isFriend: false, connections: '456', name: 'Darrell Barnes', avatar: '/images/avatars/5.png' },
      { isFriend: false, connections: '1.2k', name: 'Eugenia Moore', avatar: '/images/avatars/8.png' }
    ],
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
    ]
  }

  return {
    props: {
      data,
      tab: params?.tab
    }
  }
}

export default UserProfileTab
