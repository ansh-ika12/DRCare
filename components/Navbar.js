'use client'

import { useState } from 'react'

export default function Navbar() {
  const [open, setOpen] = useState(false)

  const links = [
    { label: 'Home', href: '/#home' },
    { label: 'How It Works', href: '/#how-it-works' },
    { label: 'Features', href: '/#features' },
    { label: 'Why DRCare', href: '/#why-us' },
  ]

  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur border-b border-slate-100">
      <nav className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4">
        <a href="/#home" className="flex items-center gap-2">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M1 12C1 12 5 5 12 5C19 5 23 12 23 12C23 12 19 19 12 19C5 19 1 12 1 12Z" stroke="#0F2A52" strokeWidth="1.8"/>
            <circle cx="12" cy="12" r="3.5" fill="#3B9EF0"/>
          </svg>
          <span className="font-heading font-bold text-xl text-navy">DRCare</span>
        </a>

        <div className="hidden md:flex items-center gap-8">
          {links.map((link) => (
            <a key={link.href} href={link.href} className="text-sm font-medium text-slate-600 hover:text-navy transition-colors">
              {link.label}
            </a>
          ))}
        </div>

        <div className="hidden md:block">
          <a href="/screening" className="bg-navy text-white text-sm font-semibold px-5 py-2.5 rounded-full hover:bg-navy-dark transition-colors">
            Start Screening
          </a>
        </div>

        <button className="md:hidden" onClick={() => setOpen(!open)} aria-label="Toggle menu">
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
            <path d="M4 6H20M4 12H20M4 18H20" stroke="#0F2A52" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        </button>
      </nav>

      {open && (
        <div className="md:hidden px-6 pb-4 flex flex-col gap-3 bg-white border-t border-slate-100">
          {links.map((link) => (
            <a key={link.href} href={link.href} onClick={() => setOpen(false)} className="text-sm font-medium text-slate-600 py-1">
              {link.label}
            </a>
          ))}
          <a href="/screening" className="bg-navy text-white text-sm font-semibold px-5 py-2.5 rounded-full text-center mt-2">
            Start Screening
          </a>
        </div>
      )}
    </header>
  )
}