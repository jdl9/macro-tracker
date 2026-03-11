'use client'

interface MacroRingProps {
  label: string
  current: number
  goal: number
  color: string        // tailwind color class e.g. "bg-emerald-400"
  ringColor: string    // CSS color for SVG stroke
  unit?: string
}

export function MacroRing({ label, current, goal, color, ringColor, unit = 'g' }: MacroRingProps) {
  const ratio = Math.min(current / Math.max(goal, 1), 1)
  const radius = 36
  const circumference = 2 * Math.PI * radius
  const strokeDashoffset = circumference * (1 - ratio)
  const isOver = current > goal

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative w-24 h-24">
        <svg className="w-full h-full -rotate-90" viewBox="0 0 88 88">
          {/* Track */}
          <circle
            cx="44" cy="44" r={radius}
            fill="none"
            stroke="currentColor"
            strokeWidth="8"
            className="text-white/10"
          />
          {/* Progress */}
          <circle
            cx="44" cy="44" r={radius}
            fill="none"
            stroke={isOver ? '#f87171' : ringColor}
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            style={{ transition: 'stroke-dashoffset 0.6s ease' }}
          />
        </svg>
        {/* Center text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-lg font-bold leading-none text-white">
            {Math.round(current)}
          </span>
          <span className="text-xs text-white/50">{unit}</span>
        </div>
      </div>

      <div className="text-center">
        <p className="text-xs font-semibold uppercase tracking-widest text-white/60">{label}</p>
        <p className="text-xs text-white/40">{Math.round(current)} / {goal}{unit}</p>
      </div>
    </div>
  )
}
