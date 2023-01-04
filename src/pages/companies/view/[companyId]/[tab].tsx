// ** Next Import
import { GetStaticProps, GetStaticPaths, GetStaticPropsContext, InferGetStaticPropsType } from 'next/types'

import CompanyViewPage from 'src/views/pages/company/view/CompanyViewPage'

const UserView = ({ tab, invoiceData }: InferGetStaticPropsType<typeof getStaticProps>) => {
  return <CompanyViewPage tab={tab} invoiceData={invoiceData} />
}

export const getStaticPaths: GetStaticPaths = () => {
  // eslint-disable-next-line prefer-const
  let paths: any = []
  const companyIds = ['1', '2', '3', '4', '5']
  companyIds.map(item => {
    paths.push({ params: { companyId: item, tab: 'overview' } })
    paths.push({ params: { companyId: item, tab: 'project' } })
    paths.push({ params: { companyId: item, tab: 'resume' } })
    paths.push({ params: { companyId: item, tab: 'manager' } })
  })

  return {
    paths: paths,
    fallback: false
  }
}

const data: any = {
  invoices: []
}

export const getStaticProps: GetStaticProps = async ({ params }: GetStaticPropsContext) => {
  // const res = await axios.get('/apps/invoice/invoices')
  const invoiceData: any = {id: params?.companyId, ...data.invoices}

  return {
    props: {
      invoiceData,
      tab: params?.tab
    }
  }
}

export default UserView
