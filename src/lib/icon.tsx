import type { ComponentType } from 'react'

export interface IconProps {
  size?: number | string
  strokeWidth?: number
  className?: string
  style?: React.CSSProperties
  spin?: boolean
}

export type IconType = ComponentType<IconProps>