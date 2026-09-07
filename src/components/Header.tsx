function Header() {
  return (
    <header className="relative z-10 flex items-center justify-between px-4 py-3.5 md:px-8">
      <a href="/" className="flex items-center gap-2.5">
        <span className="grid size-9 place-items-center rounded-lg bg-gradient-to-br from-blue-500 to-blue-700 text-white shadow-[0_6px_16px_rgba(37,99,235,0.4)]">
          <svg
            viewBox="0 0 24 24"
            width="18"
            height="18"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M4 9h16M4 15h16M10 3 8 21M16 3l-2 18" />
          </svg>
        </span>
        <span className="text-lg font-extrabold tracking-tight text-blue-900">
          Quiz<span className="text-blue-600">Lab</span>
        </span>
      </a>
    </header>
  )
}

export default Header