import { useRef, useState, type PointerEvent, type ReactNode } from 'react'

function OptionCarousel({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null)
  const st = useRef({ drag: false, moved: false, startX: 0, startScroll: 0, pointerId: -1 })
  const [grabbing, setGrabbing] = useState(false)

  const onPointerDown = (e: PointerEvent<HTMLDivElement>) => {
    if (e.button !== 0) return
    st.current.drag = true
    st.current.moved = false
    st.current.pointerId = e.pointerId
    st.current.startX = e.clientX
    st.current.startScroll = ref.current?.scrollLeft ?? 0
  }

  const onPointerMove = (e: PointerEvent<HTMLDivElement>) => {
    if (!st.current.drag || e.pointerId !== st.current.pointerId) return
    const d = e.clientX - st.current.startX
    if (Math.abs(d) > 5) st.current.moved = true
    // Mouse: drive the scroll manually (native click-drag doesn't scroll). Touch: native scroll handles it.
    if (e.pointerType === 'mouse') {
      const el = ref.current
      if (el) el.scrollLeft = st.current.startScroll - d
    }
    if (st.current.moved) setGrabbing(true)
  }

  const endDrag = () => {
    if (!st.current.drag) return
    st.current.drag = false
    st.current.pointerId = -1
    setGrabbing(false)
    // Let any queued click decide on "moved" before we reset it.
    window.setTimeout(() => {
      st.current.moved = false
    }, 0)
  }

  const onClickCapture = (e: React.MouseEvent<HTMLDivElement>) => {
    // A drag gesture must never select an option.
    if (st.current.moved) {
      e.preventDefault()
      e.stopPropagation()
    }
  }

  return (
    <div className="relative -mx-4 w-[calc(100%+2rem)] md:hidden">
      <div
        ref={ref}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerLeave={endDrag}
        onPointerCancel={endDrag}
        onClickCapture={onClickCapture}
        className={`no-scrollbar flex snap-x snap-mandatory touch-pan-x gap-3 overflow-x-auto scroll-px-6 px-6 py-1 select-none ${
          grabbing ? 'cursor-grabbing' : 'cursor-grab active:cursor-grabbing'
        }`}
      >
        {children}
      </div>

      {/* Subtle edge fades */}
      <div className="pointer-events-none absolute inset-y-0 left-0 w-7 bg-gradient-to-r from-[#faf8f4] to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-7 bg-gradient-to-l from-[#faf8f4] to-transparent" />
    </div>
  )
}

export default OptionCarousel