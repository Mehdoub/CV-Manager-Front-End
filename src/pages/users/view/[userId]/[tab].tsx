// ** Next Import
import { GetStaticProps, GetStaticPaths, GetStaticPropsContext, InferGetStaticPropsType } from 'next/types'

// ** Third Party Imports
import axios from 'axios'

// ** Types
// import { InvoiceType } from 'src/types/apps/invoiceTypes'

// ** Demo Components Imports
import UserViewPage from 'src/views/pages/user/view/UserViewPage'

const UserView = ({ tab, invoiceData }: InferGetStaticPropsType<typeof getStaticProps>) => {
  return <UserViewPage tab={tab} invoiceData={invoiceData} />
}

export const getStaticPaths: GetStaticPaths = () => {
  // eslint-disable-next-line prefer-const
  let paths: any = []
  const userIds = ['1', '2', '3', '4', '5']
  userIds.map(item => {
    paths.push({ params: { userId: item, tab: 'overview' } })
    paths.push({ params: { userId: item, tab: 'security' } })
    paths.push({ params: { userId: item, tab: 'notification' } })
  })
  return {
    paths,
    fallback: false
  }
}
const data: any = {
  invoices: []
}

export const getStaticProps: GetStaticProps = async ({ params }: GetStaticPropsContext) => {
  const invoiceData: any = { id: params?.userId, ...data.invoices }

  return {
    props: {
      invoiceData,
      tab: params?.tab
    }
  }
}

export default UserView
