import { useEffect, type RefObject } from 'react'

/**
 * Dialog focus management (single reusable solution for every modal):
 *
 *  - on open: moves keyboard focus into the dialog panel;
 *  - while open: traps Tab/Shift+Tab so focus cycles only through the panel's
 *    interactive elements (background content is never reached);
 *  - on close/unmount: restores focus to the element that opened the dialog.
 *
 * Multiple dialogs can be open at once (e.g. SetupModal + its delete
 * confirmation); only the top-most dialog traps Tab via a shared lock stack.
 */
const lockStack: HTMLElement[] = []

const FOCUSABLE_SELECTOR = [
  'a[href]',
  'button:not([disabled])',
  'textarea:not([disabled])',
  'input:not([disabled])',
  'select:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
  'iframe',
].join(',')

function getFocusable(root: HTMLElement): HTMLElement[] {
  return Array.from(root.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR)).filter(
    (el) => el.getClientRects().length > 0 && !el.hasAttribute('disabled'),
  )
}

export function useDialogFocus(open: boolean, ref: RefObject<HTMLElement | null>) {
  useEffect(() => {
    if (!open) return
    const panel = ref.current
    if (!panel) return

    const previous = document.activeElement instanceof HTMLElement ? document.activeElement : null
    lockStack.push(panel)
    panel.focus({ preventScroll: true })

    const onKeyDown = (e: KeyboardEvent) => {
      if (lockStack.length === 0 || lockStack[lockStack.length - 1] !== panel) return
      if (e.key !== 'Tab') return

      const focusables = getFocusable(panel)
      if (focusables.length === 0) {
        e.preventDefault()
        panel.focus({ preventScroll: true })
        return
      }

      const first = focusables[0]
      const last = focusables[focusables.length - 1]
      const active = document.activeElement

      if (e.shiftKey && (active === first || !panel.contains(active))) {
        e.preventDefault()
        last.focus()
      } else if (!e.shiftKey && (active === last || !panel.contains(active))) {
        e.preventDefault()
        first.focus()
      }
    }

    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.removeEventListener('keydown', onKeyDown)
      const idx = lockStack.indexOf(panel)
      if (idx >= 0) lockStack.splice(idx, 1)
      previous?.focus({ preventScroll: true })
    }
  }, [open, ref])
}