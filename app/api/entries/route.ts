import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { todayString, computeCalories } from '@/lib/utils'

// GET /api/entries?date=YYYY-MM-DD  (defaults to today)
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const date = searchParams.get('date') ?? todayString()

  const entries = await prisma.entry.findMany({
    where: { date },
    orderBy: { createdAt: 'asc' },
  })

  return NextResponse.json(entries)
}

// POST /api/entries
// Body: { name, protein, carbs, fats, date? }
export async function POST(req: NextRequest) {
  const body = await req.json()
  const { name, protein, carbs, fats, date } = body

  if (!name || protein == null || carbs == null || fats == null) {
    return NextResponse.json({ error: 'name, protein, carbs, and fats are required' }, { status: 400 })
  }

  const entry = await prisma.entry.create({
    data: {
      name: String(name).trim(),
      protein: Number(protein),
      carbs: Number(carbs),
      fats: Number(fats),
      calories: computeCalories(Number(protein), Number(carbs), Number(fats)),
      date: date ?? todayString(),
    },
  })

  return NextResponse.json(entry, { status: 201 })
}
