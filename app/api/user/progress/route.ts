import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import connectDB from '@/lib/db'
import User from '@/models/user'
import { authOptions } from '@/lib/auth'


export async function GET() {
  try {
    await connectDB()
    const session = await getServerSession(authOptions);
    
    console.log('Session:', session) // Add logging
    
    if (!session?.user?.email) {
      console.log('Unauthorized access attempt')
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const user = (await User.findOne({ email: session.user.email })
      .select('dailyProgress')
      .lean()) as unknown as { dailyProgress?: { date: string; aura: number; coins: number }[] }

    console.log('User found:', !!user) // Add logging
    
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Ensure dailyProgress is defined as an array
    const dailyProgress = user.dailyProgress || []

    // Process data for the last 7 days
    const today = new Date()
    const oneWeekAgo = new Date(today)
    oneWeekAgo.setDate(today.getDate() - 6)

    const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
    const filledData = Array.from({ length: 7 }).map((_, i) => {
      const date = new Date(oneWeekAgo)
      date.setDate(oneWeekAgo.getDate() + i)
      const dayKey = date.toISOString().split('T')[0]
      
      const existingEntry = dailyProgress.find(entry => 
        new Date(entry.date).toISOString().split('T')[0] === dayKey
      )

      return {
        day: daysOfWeek[date.getDay()],
        aura: existingEntry?.aura || 0,
        coins: existingEntry?.coins || 0,
        date: dayKey
      }
    })

    console.log('Filled data:', filledData) // Add logging to verify data
    return NextResponse.json(filledData)
  } catch (error) {
    console.error('Error in API route:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}