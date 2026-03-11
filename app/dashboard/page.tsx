'use client'

import { useState, useEffect, useCallback } from 'react'
import { MacroRing } from '@/components/MacroRing'
import { EntryCard } from '@/components/EntryCard'
import { AddEntryForm } from '@/components/AddEntryForm'
import { Entry, DailyGoal, DailyTotals } from '@/lib/types'
import { todayString } from '@/lib/utils'

export default function DashboardPage() {
  const [entries, setEntries] = useState<Entry[]>([])
  const [goal, setGoal] = useState<DailyGoal | null>(null)
  const [showAddForm, setShowAddForm] = useState(false)
  const [loading, setLoading] = useState(true)

  const today = todayString()

  const totals: DailyTotals = entries.reduce(
    (acc, e) => ({
      protein: acc.protein + e.protein,
      carbs: acc.carbs + e.carbs,
      fats: acc.fats + e.fats,
      calories: acc.calories + e.calories,
    }),
    { protein: 0, carbs: 0, fats: 0, calories: 0 }
  )

  const fetchData = useCallback(async () => {
    const [entriesRes, goalRes] = await Promise.all([
      fetch(`/api/entries?date=${today}`),
      fetch('/api/goals'),
    ])
    const [entriesData, goalData] = await Promise.all([entriesRes.json(), goalRes.json()])
    setEntries(entriesData)
    setGoal(goalData)
    setLoading(false)
  }, [today])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  async function handleDelete(id: string) {
    await fetch(`/api/entries/${id}`, { method: 'DELETE' })
    setEntries(prev => prev.filter(e => e.id !== id))
  }

  const formattedDate = new Date().toLocaleDateString('en-US', {
    weekday: 'long', month: 'long', day: 'numeric',
  })

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-white/20 border-t-white rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      {/* Header */}
      <div className="px-5 pt-12 pb-6">
        <p className="text-xs text-white/30 uppercase tracking-widest font-medium">{formattedDate}</p>
        <h1 className="text-2xl font-bold mt-1">Today's Macros</h1>
      </div>

      {/* Calorie summary bar */}
      <div className="mx-5 mb-6 bg-white/5 border border-white/10 rounded-2xl px-5 py-4 flex justify-between items-center">
        <div>
          <p className="text-3xl font-bold">{Math.round(totals.calories)}</p>
          <p className="text-xs text-white/30 mt-0.5">kcal consumed</p>
        </div>
        {goal && (
          <div className="text-right">
            <p className="text-sm font-semibold text-white/50">
              {Math.round((goal.protein * 4 + goal.carbs * 4 + goal.fats * 9))}
            </p>
            <p className="text-xs text-white/30 mt-0.5">kcal goal</p>
          </div>
        )}
      </div>

      {/* Macro rings */}
      {goal && (
        <div className="mx-5 mb-6 bg-white/5 border border-white/10 rounded-2xl px-4 py-6">
          <div className="grid grid-cols-3 gap-4">
            <MacroRing
              label="Protein"
              current={totals.protein}
              goal={goal.protein}
              color="bg-emerald-400"
              ringColor="#34d399"
            />
            <MacroRing
              label="Carbs"
              current={totals.carbs}
              goal={goal.carbs}
              color="bg-sky-400"
              ringColor="#38bdf8"
            />
            <MacroRing
              label="Fats"
              current={totals.fats}
              goal={goal.fats}
              color="bg-amber-400"
              ringColor="#fbbf24"
            />
          </div>
        </div>
      )}

      {/* Add Entry toggle */}
      <div className="mx-5 mb-4">
        <button
          onClick={() => setShowAddForm(prev => !prev)}
          className="w-full border border-dashed border-white/20 rounded-2xl py-3.5 text-sm text-white/40 hover:text-white/70 hover:border-white/40 transition-all"
        >
          {showAddForm ? '— Close' : '+ Log a meal or snack'}
        </button>
      </div>

      {/* Add Entry Form */}
      {showAddForm && (
        <div className="mx-5 mb-6 bg-white/5 border border-white/10 rounded-2xl p-5">
          <h2 className="text-sm font-semibold text-white/60 mb-4 uppercase tracking-widest">New Entry</h2>
          <AddEntryForm onSuccess={() => { fetchData(); setShowAddForm(false) }} />
        </div>
      )}

      {/* Entry list */}
      <div className="mx-5 mb-8">
        <h2 className="text-xs font-semibold text-white/30 uppercase tracking-widest mb-3">
          {entries.length === 0 ? 'No entries yet' : `${entries.length} entr${entries.length === 1 ? 'y' : 'ies'}`}
        </h2>
        <div className="space-y-2">
          {entries.map(entry => (
            <EntryCard key={entry.id} entry={entry} onDelete={handleDelete} />
          ))}
        </div>
      </div>

      {/* Nav bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-[#0a0a0a]/90 backdrop-blur border-t border-white/10 px-5 py-4 flex justify-around">
        <button className="flex flex-col items-center gap-1 text-white">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/>
          </svg>
          <span className="text-[10px] tracking-widest">TODAY</span>
        </button>
        <a href="/goals" className="flex flex-col items-center gap-1 text-white/30 hover:text-white transition-colors">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="3"/>
            <path d="M19.07 4.93a10 10 0 0 1 0 14.14M4.93 4.93a10 10 0 0 0 0 14.14"/>
          </svg>
          <span className="text-[10px] tracking-widest">GOALS</span>
        </a>
      </div>
    </div>
  )
}
