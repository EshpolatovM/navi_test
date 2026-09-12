import {
  ActivitySource,
  Airplane,
  Announcement,
  BachelorCap,
  Balance,
  Brain,
  Calculator,
  ChartHistogram,
  ChartLine,
  ChefHat,
  Code,
  CodeComputer,
  ColorCard,
  CompassOne,
  CooperativeHandshake,
  ElectronicPen,
  Flask,
  Gamepad,
  HammerAndAnvil,
  Iphone,
  Leaf,
  Lightning,
  ListSuccess,
  Monitor,
  Moon,
  Music,
  People,
  Pencil,
  Robot,
  Rocket,
  Seedling,
  Share,
  Shield,
  Sketch,
  Stethoscope,
  Sun,
  Tool,
  Translate,
  TrendingUp,
  TriangleRuler,
  VideoOne,
  Wind,
} from '@icon-park/react'
import type { IconType } from '../lib/icon'

const LUCIDE_ICONS: Record<string, IconType> = {
  ai: Robot,
  it: CodeComputer,
  smm: Share,
  marketing: Announcement,
  uiux: Sketch,
  video: VideoOne,
  mobile: Iphone,
  game: Gamepad,
  doctor: Stethoscope,
  design: ColorCard,
  brain: Brain,
  monitor: Monitor,
  share: Share,
  megaphone: Announcement,
  palette: ColorCard,
  video_icon: VideoOne,
  smartphone: Iphone,
  gamepad: Gamepad,
  stethoscope: Stethoscope,
  pen_tool: ElectronicPen,
  hammer: HammerAndAnvil,
  flask: Flask,
  rocket: Rocket,
  heart: CooperativeHandshake,
  list: ListSuccess,
  sun: Sun,
  moon: Moon,
  wind: Wind,
  compass: CompassOne,
  code: Code,
  chart: ChartHistogram,
  music: Music,
  graduation: BachelorCap,
  wrench: Tool,
  zap: Lightning,
  chef: ChefHat,
  scale: Balance,
  shield: Shield,
  wheat: Seedling,
  plane: Airplane,
  languages: Translate,
  leaf: Leaf,
  users: People,
  activity: ActivitySource,
  trending: TrendingUp,
  calculator: Calculator,
  line_chart: ChartLine,
  pencil_ruler: TriangleRuler,
  pen: Pencil,
}

export type QuizIconName = string

interface QuizIconProps {
  name: QuizIconName
  size?: number
  className?: string
  style?: React.CSSProperties
}

function QuizIcon({ name, size = 21, className, style }: QuizIconProps) {
  const Icon = LUCIDE_ICONS[name]
  if (Icon) {
    return (
      <Icon
        style={{ width: size, height: size, ...style }}
        className={className}
        strokeWidth={4}
      />
    )
  }

  return null
}

export default QuizIcon
export { LUCIDE_ICONS }