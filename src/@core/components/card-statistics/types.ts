// ** React Imports
import { ReactNode } from 'react'

// ** Types
import { ThemeColor } from 'src/@core/layouts/types'
import { OptionsMenuType } from 'src/@core/components/option-menu/types'

export type CardStatsHorizontalProps = {
  title: string
  stats: string
  icon: ReactNode
  color?: ThemeColor
  trendNumber: string
  trend?: 'positive' | 'negative'
}

export type CardStatsVerticalProps = {
  title: string
  stats: string | number
  icon: ReactNode
  chipText: string
  color?: ThemeColor
  trendNumber: string | number
  trend?: 'positive' | 'negative'
  optionsMenuProps?: OptionsMenuType
  statsData?: any
  type?: string
}

export type CardStatsCharacterProps = {
  src: string
  title: string
  stats: string
  chipText: string
  trendNumber: string
  chipColor?: ThemeColor
  trend?: 'positive' | 'negative'
}
