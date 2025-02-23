// lib/actions/quests.ts
'use server'

import Quest from '@/models/Quest'
import connectDB from '../db'


export const addQuest = async (data: {
  title: string
  description: string
  type: 'daily' | 'weekly'
  reward: number
  completionGoal: number
  resetDays: number
}) => {
  try {
    await connectDB()

    const resetTime = new Date()
    resetTime.setDate(resetTime.getDate() + data.resetDays)

    const quest = new Quest({
      title: data.title,
      description: data.description,
      type: data.type,
      reward: data.reward,
      completionGoal: data.completionGoal,
      resetTime
    })

    await quest.save()
    return { success: true }

  } catch (error) {
    console.error('Error adding quest:', error)
    return { success: false, error: 'Failed to add quest' }
  }
}