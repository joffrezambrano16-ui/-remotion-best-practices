// Logotipo original de FruitsIsland: una isla con palmera y un sol-mango.
export function LogoMark({ className = 'h-9 w-9' }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" className={className} aria-hidden>
      <circle cx="24" cy="24" r="24" fill="#FFF3CF" />
      <circle cx="31" cy="15" r="6" fill="#FFC23D" />
      <path d="M6 34c5-4 11-6 18-6s13 2 18 6c-4 5-10.5 8-18 8S10 39 6 34z" fill="#FF7A59" />
      <path d="M8 36c4.5-3 10-4.5 16-4.5S35.5 33 40 36" stroke="#FFF8EC" strokeWidth="2" fill="none" strokeLinecap="round" />
      <path d="M22 30c.5-6 .2-11-1.5-15" stroke="#7C5A2E" strokeWidth="2.4" fill="none" strokeLinecap="round" />
      <path d="M20.5 15c-4-2-8-1-10 2 3.5-.5 6.5 0 10-2zM20.5 15c1-4 4.5-6 8-5.5-2.5 2-4.5 3.5-8 5.5zM20.5 15c-2-3.5-5.5-4.5-8.5-3.5 3 1 5.5 1.8 8.5 3.5zM20.5 15c3.5-1.5 7.5-.5 9.5 2.5-3.5-.8-6.5-1.3-9.5-2.5z" fill="#2F8F4E" />
    </svg>
  )
}

export function Logo() {
  return (
    <span className="flex items-center gap-2">
      <LogoMark />
      <span className="font-display text-xl font-bold tracking-tight text-leaf-700 sm:text-2xl">
        Fruits<span className="text-coral-400">Island</span>
      </span>
    </span>
  )
}
