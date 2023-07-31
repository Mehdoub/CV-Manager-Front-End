import { Breadcrumbs, Typography } from "@mui/material"
import Link from "next/link";
import { useRouter } from "next/router";
import { uppercaseFirstLetters } from "src/helpers/functions";
import NavigateNextIcon from '@mui/icons-material/NavigateNext';


const ViewBreadcrumb = () => {
  const router = useRouter()

  const breadcrumbs = [];

  const pathArr = router.pathname.split('/')
  if (pathArr.length > 0 && pathArr[0] == '') pathArr.shift()

  let middlePage = ''
  if (pathArr.length > 0 && !['', 'home'].includes(pathArr[0])) {
    middlePage = pathArr[0]
    breadcrumbs.push(
      <Link style={{ textDecoration: 'none', color: 'inherit' }} href="/home/">
        Home
      </Link>
    )

    if (pathArr.includes('view')) {
      breadcrumbs.push([
        <Link
          style={{ textDecoration: 'none', color: 'inherit' }}
          href={`/${middlePage}/`}
        >
          {uppercaseFirstLetters(middlePage, false, true)}
        </Link>,
        <Typography color="text.primary">
          View
        </Typography>
      ])
    } else {
      breadcrumbs.push(
        <Typography color="text.primary">
          {uppercaseFirstLetters(middlePage, false, true)}
        </Typography>
      )
    }

  } else {
    breadcrumbs.push([
      <Typography color="text.primary">
        Home
      </Typography>,
      <Typography color="text.primary"></Typography>
    ])
  }


  return (
    <Breadcrumbs
      separator={<NavigateNextIcon fontSize="small" />}
      aria-label="breadcrumb"
    >
      {breadcrumbs}
    </Breadcrumbs>
  )
}

export default ViewBreadcrumb
