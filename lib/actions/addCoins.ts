// lib/actions/addCoins.ts
'use server'

import { getServerSession } from 'next-auth'
import connectDB from '../db'
import User from '@/models/user'

export const addCoins = async (coinsToAdd: number) => {
  try {
    await connectDB()
    const session = await getServerSession()
    
    if (!session?.user?.email) {
      return { success: false, error: 'User not authenticated' }
    }

    const user = await User.findOne({ email: session.user.email })

    if (!user) {
      return { success: false, error: 'User not found' }
    }

    // Update total coins
    user.coins += coinsToAdd
    await user.save()

    return { success: true, newBalance: user.coins }

  } catch (error) {
    console.error('Error adding coins:', error)
    return { success: false, error: 'Failed to add coins' }
  }
}