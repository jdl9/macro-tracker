export interface Entry {
  id: string
  name: string
  protein: number
  carbs: number
  fats: number
  calories: number
  date: string
  createdAt: string
  updatedAt: string
}

export interface DailyGoal {
  id: string
  protein: number
  carbs: number
  fats: number
}

export interface DailyTotals {
  protein: number
  carbs: number
  fats: number
  calories: number
}
