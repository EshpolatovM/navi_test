import { Compass, Palette, Heart, Shield, Rocket, Users, TrendingUp } from 'lucide-react'

export const VALUE_ICONS: Record<string, React.ReactNode> = {
  independence: <Compass className="size-4.5" strokeWidth={2.2} />,
  creativity: <Palette className="size-4.5" strokeWidth={2.2} />,
  helping: <Heart className="size-4.5" strokeWidth={2.2} />,
  stability: <Shield className="size-4.5" strokeWidth={2.2} />,
  growth: <Rocket className="size-4.5" strokeWidth={2.2} />,
  teamwork: <Users className="size-4.5" strokeWidth={2.2} />,
  opportunity: <TrendingUp className="size-4.5" strokeWidth={2.2} />,
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