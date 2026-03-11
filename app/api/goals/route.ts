import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET /api/goals — returns the single DailyGoal row, creating defaults if needed
export async function GET() {
  let goal = await prisma.dailyGoal.findFirst()

  if (!goal) {
    goal = await prisma.dailyGoal.create({
      data: { protein: 150, carbs: 200, fats: 65 },
    })
  }

  return NextResponse.json(goal)
}

// PUT /api/goals
// Body: { protein, carbs, fats }
export async function PUT(req: NextRequest) {
  const body = await req.json()
  const { protein, carbs, fats } = body

  if (protein == null || carbs == null || fats == null) {
    return NextResponse.json({ error: 'protein, carbs, and fats are required' }, { status: 400 })
  }

  let goal = await prisma.dailyGoal.findFirst()

  if (!goal) {
    goal = await prisma.dailyGoal.create({
      data: { protein: Number(protein), carbs: Number(carbs), fats: Number(fats) },
    })
  } else {
    goal = await prisma.dailyGoal.update({
      where: { id: goal.id },
      data: { protein: Number(protein), carbs: Number(carbs), fats: Number(fats) },
    })
  }

  return NextResponse.json(goal)
}
