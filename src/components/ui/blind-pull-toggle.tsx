import { AnimatePresence, motion } from 'framer-motion'
import { Moon, Sun } from '@phosphor-icons/react'
import { cn } from '../../lib/utils'
import { useSettings } from '../SettingsContext'

interface BlindPullToggleProps {
  className?: string
  ariaLabel?: string
}

function palette(dark: boolean) {
  return dark
    ? {
        body: '#25211D',
        border: 'rgba(255,255,255,0.10)',
        icon: '#F0ECE6',
        shadow: '0 2px 8px rgba(0,0,0,0.35)',
      }
    : {
        body: '#E8E4DC',
        border: 'rgba(30,34,43,0.14)',
        icon: '#3D3830',
        shadow: '0 2px 8px rgba(30,34,43,0.25)',
      }
}

export default function BlindPullToggle({ className, ariaLabel }: BlindPullToggleProps) {
  const { theme, setTheme, t } = useSettings()
  const dark = theme === 'dark'
  const nextDark = !dark
  const p = palette(dark)
  const label = ariaLabel ?? t(nextDark ? 'theme.toDark' : 'theme.toLight')

  return (
    <motion.button
      type="button"
      onClick={() => setTheme(nextDark ? 'dark' : 'light')}
      aria-label={label}
      title={label}
      className={cn(
        'grid size-9 place-items-center rounded-full outline-none select-none',
        'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--text-secondary)]',
        className,
      )}
      style={{
        background: p.body,
        border: `1px solid ${p.border}`,
        boxShadow: p.shadow,
      }}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.97 }}
      transition={{ type: 'spring', stiffness: 480, damping: 22 }}
    >
      <AnimatePresence initial={false} mode="wait">
        <motion.div
          key={dark ? 'moon' : 'sun'}
          initial={{ opacity: 0, scale: 0.5, rotate: -90 }}
          animate={{ opacity: 1, scale: 1, rotate: 0 }}
          exit={{ opacity: 0, scale: 0.5, rotate: 90 }}
          transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
          style={{ color: p.icon, display: 'grid', placeItems: 'center' }}
        >
          {dark ? <Moon weight="regular" size={20} /> : <Sun weight="regular" size={20} />}
        </motion.div>
      </AnimatePresence>
    </motion.button>
  )
}