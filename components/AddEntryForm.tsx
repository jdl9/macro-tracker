'use client'

import { useState } from 'react'

interface AddEntryFormProps {
  onSuccess: () => void
}

export function AddEntryForm({ onSuccess }: AddEntryFormProps) {
  const [name, setName] = useState('')
  const [protein, setProtein] = useState('')
  const [carbs, setCarbs] = useState('')
  const [fats, setFats] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const calories = Math.round(
    (Number(protein) || 0) * 4 +
    (Number(carbs) || 0) * 4 +
    (Number(fats) || 0) * 9
  )

  async function handleSubmit() {
    if (!name || !protein || !carbs || !fats) {
      setError('All fields are required')
      return
    }
    setError('')
    setLoading(true)

    try {
      const res = await fetch('/api/entries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, protein: Number(protein), carbs: Number(carbs), fats: Number(fats) }),
      })

      if (!res.ok) throw new Error('Failed to save')

      setName('')
      setProtein('')
      setCarbs('')
      setFats('')
      onSuccess()
    } catch {
      setError('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const inputClass =
    'w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/20 text-sm focus:outline-none focus:border-white/30 focus:bg-white/10 transition-all'

  return (
    <div className="space-y-3">
      <input
        type="text"
        placeholder="Food name (e.g. Chicken breast)"
        value={name}
        onChange={e => setName(e.target.value)}
        className={inputClass}
      />

      <div className="grid grid-cols-3 gap-2">
        <div>
          <label className="text-xs text-emerald-400 font-semibold uppercase tracking-widest mb-1 block pl-1">Protein</label>
          <input
            type="number"
            placeholder="0g"
            value={protein}
            onChange={e => setProtein(e.target.value)}
            min="0"
            className={inputClass}
          />
        </div>
        <div>
          <label className="text-xs text-sky-400 font-semibold uppercase tracking-widest mb-1 block pl-1">Carbs</label>
          <input
            type="number"
            placeholder="0g"
            value={carbs}
            onChange={e => setCarbs(e.target.value)}
            min="0"
            className={inputClass}
          />
        </div>
        <div>
          <label className="text-xs text-amber-400 font-semibold uppercase tracking-widest mb-1 block pl-1">Fats</label>
          <input
            type="number"
            placeholder="0g"
            value={fats}
            onChange={e => setFats(e.target.value)}
            min="0"
            className={inputClass}
          />
        </div>
      </div>

      {calories > 0 && (
        <p className="text-xs text-white/40 text-center">{calories} kcal estimated</p>
      )}

      {error && <p className="text-xs text-red-400 text-center">{error}</p>}

      <button
        onClick={handleSubmit}
        disabled={loading}
        className="w-full bg-white text-black font-bold py-3.5 rounded-xl text-sm tracking-wide hover:bg-white/90 active:scale-[0.98] transition-all disabled:opacity-40 disabled:cursor-not-allowed"
      >
        {loading ? 'Saving...' : 'Log Entry'}
      </button>
    </div>
  )
}
