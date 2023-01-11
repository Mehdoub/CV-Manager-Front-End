// ** Next Import
import { useRouter } from 'next/router'

import ProjectViewPage from 'src/views/pages/project/view/ProjectViewPage'

const ProjectView = () => {
  const {query: {tab, projectId}} = useRouter()
  return <ProjectViewPage tab={tab as string} projectId={projectId as string} />
}

export default ProjectView
