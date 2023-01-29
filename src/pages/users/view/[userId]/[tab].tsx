// ** Next Import
import { useRouter } from 'next/router'

// ** Demo Components Imports
import UserViewPage from 'src/views/pages/user/view/UserViewPage'

const UserView = () => {
  const {
    query: { tab, userId }
  } = useRouter()
  return <UserViewPage tab={tab as string} userId={userId as string} />
}

export default UserView
