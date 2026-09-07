import { useEffect, useState } from 'react'
import { Zap } from 'lucide-react'

function Header() {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header
      className={`sticky top-0 z-20 flex items-center justify-between px-5 py-4 md:px-8 ${
        scrolled ? 'backdrop-blur-md bg-[var(--bg)]/50' : ''
      }`}
    >
      <a href="/" className="flex items-center gap-2.5">
        <span className="grid size-9 place-items-center rounded-xl bg-gradient-to-b from-[#ffd970] to-[var(--accent)] text-[#141005] shadow-[0_6px_20px_-6px_rgba(245,197,66,0.8)]">
          <Zap className="size-5" strokeWidth={2.5} fill="currentColor" />
        </span>
        <span className="text-lg font-extrabold tracking-tight text-[var(--text-primary)]">
          Quiz<span className="text-[var(--accent)]">Lab</span>
        </span>
      </a>
    </header>
  )
}

export default Header