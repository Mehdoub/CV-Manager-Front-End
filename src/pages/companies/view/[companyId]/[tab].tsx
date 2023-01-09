// ** Next Import
import { useRouter } from 'next/router'

import CompanyViewPage from 'src/views/pages/company/view/CompanyViewPage'

const CompanyView = () => {
  const {
    query: { tab, companyId }
  } = useRouter()
  return <CompanyViewPage tab={tab as string} companyId={companyId as string} />
}

export default CompanyView
