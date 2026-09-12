import {
  Announcement,
  BookOpen,
  Calculator,
  Checklist,
  Chip,
  ColorCard,
  CompassOne,
  CooperativeHandshake,
  Crown,
  CubeFour,
  ElectronicPen,
  Flag,
  Flask,
  HammerAndAnvil,
  HashtagKey,
  Lamp,
  ListSuccess,
  Magic,
  Message,
  MessageEmoji,
  Messages,
  Minus,
  Paint,
  Pencil,
  People,
  Puzzle,
  RefreshOne,
  Rocket,
  Schedule,
  Search,
  Shop,
  Star,
  Stopwatch,
  Tool,
  Trophy,
  User,
  VideoOne,
} from '@icon-park/react'
import type { IconType } from '../lib/icon'
import QuizIcon from './QuizIcon'

/**
 * Answer-option icon system for the QIZIQISH (interest) assessment.
 *
 * Every interest answer carries a semantic icon name in its data. That name is
 * resolved here into a single, consistent IconPark set — same stroke weight,
 * same optical size, same container — so all answer icons share one visual
 * language. Names not present in this map (e.g. the career test) fall back to
 * the existing QuizIcon resolution, leaving those tests untouched.
 */
export const ANIMATED_ANSWER_ICONS: Record<string, IconType> = {
  hammer: HammerAndAnvil,
  repeat: RefreshOne,
  flask: Flask,
  lightbulb: Lamp,
  circle_minus: Minus,
  wrench: Tool,
  blocks: CubeFour,
  users: People,
  pen_tool: ElectronicPen,
  cpu: Chip,
  search: Search,
  sparkles: Magic,
  puzzle: Puzzle,
  star: Star,
  book_open: BookOpen,
  video: VideoOne,
  palette: ColorCard,
  pen_line: Pencil,
  paint_roller: Paint,
  messages_square: Messages,
  message_circle: Message,
  heart_handshake: CooperativeHandshake,
  message_circle_heart: MessageEmoji,
  user_round: User,
  crown: Crown,
  megaphone: Announcement,
  store: Shop,
  rocket: Rocket,
  trophy: Trophy,
  flag: Flag,
  list_checks: ListSuccess,
  clipboard_list: Checklist,
  calendar_check: Schedule,
  timer: Stopwatch,
  calculator: Calculator,
  hash: HashtagKey,
  compass: CompassOne,
}

interface AnimatedAnswerIconProps {
  name: string
  size?: number
  className?: string
}

function AnimatedAnswerIcon({ name, size = 20, className }: AnimatedAnswerIconProps) {
  const Icon = ANIMATED_ANSWER_ICONS[name]
  if (Icon) {
    return (
      <Icon
        aria-hidden
        style={{ width: size, height: size }}
        strokeWidth={4}
        className={className}
      />
    )
  }
  return <QuizIcon name={name} size={size} className={className} />
}

export default AnimatedAnswerIcon
