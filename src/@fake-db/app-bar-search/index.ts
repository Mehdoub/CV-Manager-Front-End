// ** Mock Adapter
import mock from 'src/@fake-db/mock'

// ** Types
import { AppBarSearchType } from 'src/@fake-db/types'

const searchData: any[] = [
  {
    id: 1,
    url: '/positions/view/6475b841b724e091114823df/overview',
    icon: 'mdi:chart-donut',
    logo: '/uploads/positions/64748b59410c2d0cffc127f0_1685436481796.png',
    title: 'Back-End Developer',
    category: 'positions'
  },
  {
    id: 2,
    url: '/positions/view/64748be7410c2d0cffc1289a/overview',
    icon: 'mdi:chart-timeline-variant',
    logo: '/uploads/positions/64748b59410c2d0cffc127f0.png',
    title: 'Front-End Developer',
    category: 'positions'
  },
  {
    id: 3,
    url: '/companies/view/6475b841b724e091114823df/overview',
    icon: 'mdi:chart-donut',
    logo: '/uploads/companies/64748b59410c2d0cffc127f0.png',
    title: 'Reddit',
    category: 'companies'
  },
  {
    id: 4,
    url: '/projects/view/64748bd1410c2d0cffc12874/overview',
    icon: 'mdi:chart-timeline-variant',
    logo: '/uploads/projects/64748b59410c2d0cffc127f0.png',
    title: 'Dribbble',
    category: 'projects'
  },
  {
    id: 5,
    url: '/resumes/6475b8f2b724e09111482424/',
    icon: 'mdi:chart-donut',
    logo: '/uploads/resumes/64748b59410c2d0cffc127f0.svg',
    title: 'Aliakbar Rezaei',
    category: 'resumes'
  },
  {
    id: 6,
    url: '/resumes/6475d2fdb724e09111482c25/',
    icon: 'mdi:chart-timeline-variant',
    logo: '/uploads/resumes/64748b59410c2d0cffc127f0_1685443325961.png',
    title: 'Mahdi Amereh',
    category: 'resumes'
  },
]

// ** GET Search Data
mock.onGet('/app-bar/search').reply(config => {
  const { q = '' } = config.params
  const queryLowered = q.toLowerCase()

  const exactData: { [k: string]: AppBarSearchType[] } = {
    companies: [],
    projects: [],
    positions: [],
    resumes: [],
  }

  const includeData: { [k: string]: AppBarSearchType[] } = {
    companies: [],
    projects: [],
    positions: [],
    resumes: [],
  }

  searchData.forEach(obj => {
    const isMatched = obj.title.toLowerCase().startsWith(queryLowered)
    if (isMatched && exactData[obj.category].length < 5) {
      exactData[obj.category].push(obj)
    }
  })

  searchData.forEach(obj => {
    const isMatched =
      !obj.title.toLowerCase().startsWith(queryLowered) && obj.title.toLowerCase().includes(queryLowered)
    if (isMatched && includeData[obj.category].length < 5) {
      includeData[obj.category].push(obj)
    }
  })

  const categoriesCheck: string[] = []

  Object.keys(exactData).forEach(category => {
    if (exactData[category].length > 0) {
      categoriesCheck.push(category)
    }
  })
  if (categoriesCheck.length === 0) {
    Object.keys(includeData).forEach(category => {
      if (includeData[category].length > 0) {
        categoriesCheck.push(category)
      }
    })
  }

  const resultsLength = categoriesCheck.length === 1 ? 5 : 3

  return [
    200,
    [
      ...exactData.companies.concat(includeData.companies).slice(0, resultsLength),
      ...exactData.projects.concat(includeData.projects).slice(0, resultsLength),
      ...exactData.positions.concat(includeData.positions).slice(0, resultsLength),
      ...exactData.resumes.concat(includeData.resumes).slice(0, resultsLength),
    ]
  ]
})
