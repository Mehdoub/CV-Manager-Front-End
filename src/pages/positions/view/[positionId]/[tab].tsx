// ** Next Import
import { GetStaticProps, GetStaticPaths, GetStaticPropsContext, InferGetStaticPropsType } from 'next/types'

import ViewPage from 'src/views/pages/position/view/ViewPage'

const PositionView = ({ tab, invoiceData }: InferGetStaticPropsType<typeof getStaticProps>) => {
  return <ViewPage tab={tab} invoiceData={invoiceData} />
}

export const getStaticPaths: GetStaticPaths = () => {
  // eslint-disable-next-line prefer-const
  let paths: any = []
  const companyIds = ['1', '2', '3', '4', '5']
  companyIds.map(item => {
    paths.push({ params: { positionId: item, tab: 'overview' } })
    paths.push({ params: { positionId: item, tab: 'interview' } })
    paths.push({ params: { positionId: item, tab: 'resume' } })
    paths.push({ params: { positionId: item, tab: 'manager' } })
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
  const invoiceData: any = { id: params?.positionId, ...data.invoices }

  return {
    props: {
      invoiceData,
      tab: params?.tab
    }
  }
}

export default PositionView
