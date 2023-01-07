// ** Next Import
import { GetStaticProps, GetStaticPaths, GetStaticPropsContext, InferGetStaticPropsType } from 'next/types'

import ProjectViewPage from 'src/views/pages/project/view/ProjectViewPage'

const ProjectView = ({ tab, invoiceData }: InferGetStaticPropsType<typeof getStaticProps>) => {
  return <ProjectViewPage tab={tab} invoiceData={invoiceData} />
}

export const getStaticPaths: GetStaticPaths = () => {
  // eslint-disable-next-line prefer-const
  let paths: any = []
  const companyIds = ['1', '2', '3', '4', '5']
  companyIds.map(item => {
    paths.push({ params: { projectId: item, tab: 'overview' } })
    paths.push({ params: { projectId: item, tab: 'position' } })
    paths.push({ params: { projectId: item, tab: 'resume' } })
    paths.push({ params: { projectId: item, tab: 'manager' } })
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
  const invoiceData: any = { id: params?.projectId, ...data.invoices }

  return {
    props: {
      invoiceData,
      tab: params?.tab
    }
  }
}

export default ProjectView
