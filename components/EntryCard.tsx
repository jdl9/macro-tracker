'use client'

import { Entry } from '@/lib/types'

interface EntryCardProps {
  entry: Entry
  onDelete: (id: string) => void
}

export function EntryCard({ entry, onDelete }: EntryCardProps) {
  return (
    <div className="flex items-center justify-between bg-white/5 border border-white/10 rounded-2xl px-4 py-3">
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-white truncate">{entry.name}</p>
        <p className="text-xs text-white/40 mt-0.5">{entry.calories} kcal</p>
      </div>

      <div className="flex gap-3 text-xs text-white/60 mx-4 shrink-0">
        <span className="flex flex-col items-center">
          <span className="text-emerald-400 font-semibold">{Math.round(entry.protein)}g</span>
          <span className="text-white/30">P</span>
        </span>
        <span className="flex flex-col items-center">
          <span className="text-sky-400 font-semibold">{Math.round(entry.carbs)}g</span>
          <span className="text-white/30">C</span>
        </span>
        <span className="flex flex-col items-center">
          <span className="text-amber-400 font-semibold">{Math.round(entry.fats)}g</span>
          <span className="text-white/30">F</span>
        </span>
      </div>

      <button
        onClick={() => onDelete(entry.id)}
        className="text-white/20 hover:text-red-400 transition-colors p-1 shrink-0"
        aria-label="Delete entry"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" />
        </svg>
      </button>
    </div>
  )
}
