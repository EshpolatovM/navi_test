import { ColorCard, CompassOne, Heart, People, Rocket, Shield, TrendingUp } from '@icon-park/react'

export const VALUE_ICONS: Record<string, React.ReactNode> = {
  independence: <CompassOne className="size-4.5" strokeWidth={4.4} />,
  creativity: <ColorCard className="size-4.5" strokeWidth={4.4} />,
  helping: <Heart className="size-4.5" strokeWidth={4.4} />,
  stability: <Shield className="size-4.5" strokeWidth={4.4} />,
  growth: <Rocket className="size-4.5" strokeWidth={4.4} />,
  teamwork: <People className="size-4.5" strokeWidth={4.4} />,
  opportunity: <TrendingUp className="size-4.5" strokeWidth={4.4} />,
}

export const VALUE_COLORS: Record<string, string> = {
  independence: '#6366F1',
  creativity: '#DB2777',
  helping: '#10B981',
  stability: '#64748B',
  growth: '#F59E0B',
  teamwork: '#2563EB',
  opportunity: '#EA580C',
}

/** RIASEC dimension key → QuizIcon name (friendly, non-clinical) */
export const DIM_ICON_NAMES: Record<string, string> = {
  R: 'hammer',
  I: 'flask',
  A: 'palette',
  S: 'users',
  E: 'rocket',
  C: 'list',
}