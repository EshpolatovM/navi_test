import { Settings } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useSettings } from './SettingsContext'
import NaviLogo from './NaviLogo'
import { InteractiveHoverButton } from './ui/interactive-hover-button'
import BlindPullToggle from './ui/blind-pull-toggle'

function Header({ onOpenSettings, hideBrand }: { onOpenSettings?: () => void; hideBrand?: boolean }) {
  const { t } = useSettings()
  return (
    <header className="relative z-10 flex items-center justify-between px-4 py-2.5 md:px-8 md:py-3.5">
      {!hideBrand && (
        <Link to="/" aria-label={t('settings.title')} className="motion-ui flex items-center">
          <NaviLogo width={116} className="shrink-0" />
        </Link>
      )}

      <div className="motion-ui flex items-center gap-1.5">
        <BlindPullToggle />

        {onOpenSettings && (
          <InteractiveHoverButton
            type="button"
            size="icon"
            variant="ghost"
            arrow={false}
            icon={<Settings className="size-4.5" strokeWidth={2.2} />}
            aria-label={t('settings.title')}
            onClick={onOpenSettings}
          />
        )}
      </div>
    </header>
  )
}

export default Header