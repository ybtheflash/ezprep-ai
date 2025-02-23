// lib/actions/updateAuraAndDailyProgress.ts
'use server'

import { getServerSession } from 'next-auth'
import connectDB from '../db'
import User from '@/models/user'
import { authOptions } from '../auth'

export const updateAuraAndDailyProgress = async (auraToAdd: number) => {
  try {
    await connectDB()
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return { success: false, error: 'User not authenticated' }
    }

    const user = await User.findOne({ email: session.user.email })

    if (!user) {
      return { success: false, error: 'User not found' }
    }

    const currentDate = new Date()
    // Normalize date to midnight UTC to group by day
    const currentDateNormalized = new Date(Date.UTC(
      currentDate.getUTCFullYear(),
      currentDate.getUTCMonth(),
      currentDate.getUTCDate()
    ))

    // Update total aura
    user.aura += auraToAdd

    // Ensure dailyProgress is defined as an array
    user.dailyProgress = user.dailyProgress || []

    // Update daily progress
    const existingDailyProgress = user.dailyProgress.find(
      (entry: { date: Date }) => 
        entry.date.toISOString().split('T')[0] === 
        currentDateNormalized.toISOString().split('T')[0]
    )

    if (existingDailyProgress) {
      // Add to existing day's aura
      existingDailyProgress.aura += auraToAdd
    } else {
      // Create new daily entry
      user.dailyProgress.push({
        date: currentDateNormalized,
        aura: auraToAdd,
        coins: 0 // Assuming coins aren't updated here
      })
    }

    await user.save()
    console.log('Updated user:', user) // Add logging to verify update
    return { success: true }

  } catch (error) {
    console.error('Error updating aura and daily progress:', error)
    return { success: false, error: 'Failed to update progress' }
  }
}