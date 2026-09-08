import {
  Brain,
  Monitor,
  Share2,
  Megaphone,
  Palette,
  Video,
  Smartphone,
  Gamepad2,
  Stethoscope,
  PenTool,
  Hammer,
  FlaskConical,
  Rocket,
  HeartHandshake,
  ListChecks,
  Sun,
  Moon,
  Wind,
  Compass,
  Code2,
  BarChart3,
  Music,
  GraduationCap,
  Wrench,
  Zap,
  ChefHat,
  Scale,
  Shield,
  Wheat,
  Plane,
  Languages,
  Leaf,
  Users,
  Activity,
  TrendingUp,
  Calculator,
  LineChart,
  PencilRuler,
  PenLine,
  type LucideIcon,
} from 'lucide-react'

import aiSvg from '../assets/images/a-single-rounded-line-ui-icon-representing-artific.svg'
import itSvg from '../assets/images/a-single-icon-representing-it--abstract-computer-a.svg'
import smmSvg from '../assets/images/a-single-icon-representing-smm--social-media-marke.svg'
import marketingSvg from '../assets/images/a-single-icon-representing-marketing--abstract-meg.svg'
import uiuxSvg from '../assets/images/a-single-icon-representing-ui-ux-design--abstract-.svg'
import videoSvg from '../assets/images/a-single-icon-representing-a-video-editor--abstrac.svg'
import mobileSvg from '../assets/images/a-single-icon-representing-a-mobile-developer--abs.svg'
import gameSvg from '../assets/images/a-single-icon-representing-a-game-developer--abstr.svg'
import doctorSvg from '../assets/images/a-single-icon-representing-a-doctor--abstract-simp.svg'
import designSvg from '../assets/images/a-single-icon-representing-graphic-design-and-mobi.svg'

const SVG_ICONS: Record<string, string> = {
  ai: aiSvg,
  it: itSvg,
  smm: smmSvg,
  marketing: marketingSvg,
  uiux: uiuxSvg,
  video: videoSvg,
  mobile: mobileSvg,
  game: gameSvg,
  doctor: doctorSvg,
  design: designSvg,
}

const LUCIDE_ICONS: Record<string, LucideIcon> = {
  brain: Brain,
  monitor: Monitor,
  share: Share2,
  megaphone: Megaphone,
  palette: Palette,
  video_icon: Video,
  smartphone: Smartphone,
  gamepad: Gamepad2,
  stethoscope: Stethoscope,
  pen_tool: PenTool,
  hammer: Hammer,
  flask: FlaskConical,
  rocket: Rocket,
  heart: HeartHandshake,
  list: ListChecks,
  sun: Sun,
  moon: Moon,
  wind: Wind,
  compass: Compass,
  code: Code2,
  chart: BarChart3,
  music: Music,
  graduation: GraduationCap,
  wrench: Wrench,
  zap: Zap,
  chef: ChefHat,
  scale: Scale,
  shield: Shield,
  wheat: Wheat,
  plane: Plane,
  languages: Languages,
  leaf: Leaf,
  users: Users,
  activity: Activity,
  trending: TrendingUp,
  calculator: Calculator,
  line_chart: LineChart,
  pencil_ruler: PencilRuler,
  pen: PenLine,
}

export type QuizIconName = string

interface QuizIconProps {
  name: QuizIconName
  size?: number
  className?: string
  style?: React.CSSProperties
}

function QuizIcon({ name, size = 21, className, style }: QuizIconProps) {
  const svgSrc = SVG_ICONS[name]

  if (svgSrc) {
    return (
      <img
        src={svgSrc}
        alt=""
        width={size}
        height={size}
        className={className}
        style={{ display: 'block', ...style }}
      />
    )
  }

  const LucideComp = LUCIDE_ICONS[name]
  if (LucideComp) {
    return (
      <LucideComp
        style={{ width: size, height: size, ...style }}
        className={className}
        strokeWidth={2.1}
      />
    )
  }

  return null
}

export default QuizIcon
export { SVG_ICONS, LUCIDE_ICONS }
