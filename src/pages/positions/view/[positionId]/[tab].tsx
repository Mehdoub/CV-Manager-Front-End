import { useRouter } from 'next/router'
import ViewPage from 'src/views/pages/position/view/ViewPage'

const PositionView = () => {
  const {
    query: { tab, positionId }
  } = useRouter()
  return <ViewPage tab={tab as string} positionId={positionId as string} />
}

export default PositionView
