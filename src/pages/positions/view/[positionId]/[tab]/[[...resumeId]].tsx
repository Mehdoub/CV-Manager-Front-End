import { useRouter } from 'next/router'
import PositionViewPage from 'src/views/pages/position/view/PositionViewPage'

const PositionView = () => {
  const {
    query: { tab, positionId }
  } = useRouter()
  return <PositionViewPage tab={tab as string} positionId={positionId as string} />
}

export default PositionView
