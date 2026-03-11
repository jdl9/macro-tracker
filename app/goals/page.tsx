'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { DailyGoal } from '@/lib/types'

export default function GoalsPage() {
  const router = useRouter()
  const [protein, setProtein] = useState('')
  const [carbs, setCarbs] = useState('')
  const [fats, setFats] = useState('')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    fetch('/api/goals')
      .then(r => r.json())
      .then((goal: DailyGoal) => {
        setProtein(String(goal.protein))
        setCarbs(String(goal.carbs))
        setFats(String(goal.fats))
        setLoading(false)
      })
  }, [])

  const calories = Math.round(
    (Number(protein) || 0) * 4 +
    (Number(carbs) || 0) * 4 +
    (Number(fats) || 0) * 9
  )

  async function handleSave() {
    setSaving(true)
    await fetch('/api/goals', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ protein: Number(protein), carbs: Number(carbs), fats: Number(fats) }),
    })
    setSaving(false)
    setSaved(true)
    setTimeout(() => { setSaved(false); router.push('/dashboard') }, 1200)
  }

  const inputClass =
    'w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-white/30 focus:bg-white/10 transition-all'

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-white/20 border-t-white rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white px-5">
      <div className="pt-12 pb-8">
        <button
          onClick={() => router.push('/dashboard')}
          className="text-white/30 hover:text-white transition-colors text-sm mb-6 flex items-center gap-2"
        >
          ← Back
        </button>
        <h1 className="text-2xl font-bold">Daily Goals</h1>
        <p className="text-sm text-white/30 mt-1">Set your target macros for the day</p>
      </div>

      <div className="space-y-4">
        <div>
          <label className="text-xs text-emerald-400 font-semibold uppercase tracking-widest mb-2 block">
            Protein (g)
          </label>
          <input type="number" value={protein} onChange={e => setProtein(e.target.value)} min="0" className={inputClass} />
        </div>
        <div>
          <label className="text-xs text-sky-400 font-semibold uppercase tracking-widest mb-2 block">
            Carbohydrates (g)
          </label>
          <input type="number" value={carbs} onChange={e => setCarbs(e.target.value)} min="0" className={inputClass} />
        </div>
        <div>
          <label className="text-xs text-amber-400 font-semibold uppercase tracking-widest mb-2 block">
            Fats (g)
          </label>
          <input type="number" value={fats} onChange={e => setFats(e.target.value)} min="0" className={inputClass} />
        </div>

        {calories > 0 && (
          <div className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-center">
            <p className="text-2xl font-bold">{calories}</p>
            <p className="text-xs text-white/30 mt-0.5">total calories / day</p>
          </div>
        )}

        <button
          onClick={handleSave}
          disabled={saving || saved}
          className="w-full bg-white text-black font-bold py-3.5 rounded-xl text-sm tracking-wide hover:bg-white/90 active:scale-[0.98] transition-all disabled:opacity-40"
        >
          {saved ? '✓ Saved!' : saving ? 'Saving...' : 'Save Goals'}
        </button>
      </div>
    </div>
  )
}
