import {
  Hammer,
  Repeat,
  FlaskConical,
  Lightbulb,
  CircleMinus,
  Wrench,
  Blocks,
  Users,
  PenTool,
  Cpu,
  Search,
  Sparkles,
  Puzzle,
  Star,
  BookOpen,
  Video,
  Palette,
  PenLine,
  PaintRoller,
  MessagesSquare,
  MessageCircle,
  HeartHandshake,
  MessageCircleHeart,
  UserRound,
  Crown,
  Megaphone,
  Store,
  Rocket,
  Trophy,
  Flag,
  ListChecks,
  ClipboardList,
  CalendarCheck,
  Timer,
  Calculator,
  Hash,
  Compass,
  type LucideIcon,
} from 'lucide-react'
import QuizIcon from './QuizIcon'

/**
 * Answer-option icon system for the QIZIQISH (interest) assessment.
 *
 * Every interest answer carries a semantic icon name in its data. That name is
 * resolved here into a single, consistent Lucide set — same stroke weight,
 * same optical size, same container — so all answer icons share one visual
 * language. Names not present in this map (e.g. the career test) fall back to
 * the existing QuizIcon resolution, leaving those tests untouched.
 */
export const ANIMATED_ANSWER_ICONS: Record<string, LucideIcon> = {
  hammer: Hammer,
  repeat: Repeat,
  flask: FlaskConical,
  lightbulb: Lightbulb,
  circle_minus: CircleMinus,
  wrench: Wrench,
  blocks: Blocks,
  users: Users,
  pen_tool: PenTool,
  cpu: Cpu,
  search: Search,
  sparkles: Sparkles,
  puzzle: Puzzle,
  star: Star,
  book_open: BookOpen,
  video: Video,
  palette: Palette,
  pen_line: PenLine,
  paint_roller: PaintRoller,
  messages_square: MessagesSquare,
  message_circle: MessageCircle,
  heart_handshake: HeartHandshake,
  message_circle_heart: MessageCircleHeart,
  user_round: UserRound,
  crown: Crown,
  megaphone: Megaphone,
  store: Store,
  rocket: Rocket,
  trophy: Trophy,
  flag: Flag,
  list_checks: ListChecks,
  clipboard_list: ClipboardList,
  calendar_check: CalendarCheck,
  timer: Timer,
  calculator: Calculator,
  hash: Hash,
  compass: Compass,
}

interface AnimatedAnswerIconProps {
  name: string
  size?: number
  className?: string
}

function AnimatedAnswerIcon({ name, size = 20, className }: AnimatedAnswerIconProps) {
  const Lucide = ANIMATED_ANSWER_ICONS[name]
  if (Lucide) {
    return (
      <Lucide
        aria-hidden
        style={{ width: size, height: size }}
        strokeWidth={2}
        className={className}
      />
    )
  }
  return <QuizIcon name={name} size={size} className={className} />
}

export default AnimatedAnswerIcon
