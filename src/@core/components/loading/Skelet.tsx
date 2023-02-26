import { Skeleton } from '@mui/material'

interface Props {
  loading: boolean
  width?: any
  height?: any
  variant?: any
  animation?: any
  sx?: any
  component: any
}

const Skelet = (props: Props) => {
  const { loading, width, height, variant = 'rounded', animation = 'wave', component, sx } = props
  let skeletonProps: any = { loading, variant, animation }
  if (height) skeletonProps.height = height
  if (width) skeletonProps.width = width
  if (sx) skeletonProps.sx = sx

  return loading ? <Skeleton {...skeletonProps} /> : component
}

export default Skelet
