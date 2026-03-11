/**
 * Returns today's date as YYYY-MM-DD in local time
 */
export function todayString(): string {
  const d = new Date()
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

/**
 * Computes calories from macros: protein*4 + carbs*4 + fats*9
 */
export function computeCalories(protein: number, carbs: number, fats: number): number {
  return Math.round(protein * 4 + carbs * 4 + fats * 9)
}

/**
 * Clamps a value between 0 and 1 for progress bar percentages
 */
export function clampRatio(value: number, goal: number): number {
  if (goal <= 0) return 0
  return Math.min(value / goal, 1)
}
