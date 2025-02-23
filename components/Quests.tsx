// components/Quests.tsx
'use client'

import { useEffect, useState } from 'react'
import { getAvailableQuests, updateQuestProgress } from '@/lib/actions/quests'

interface Quest {
  _id: string
  title: string
  description: string
  type: 'daily' | 'weekly'
  reward: number
  completionGoal: number
  progress?: number
  completed?: boolean
}

export function WeeklyQuests() {
  const [quests, setQuests] = useState<Quest[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadQuests = async () => {
      try {
        const response = await getAvailableQuests()
        // Convert _id to string explicitly
        setQuests(response.map((q: any) => ({
          _id: q._id.toString(),
          title: q.title,
          description: q.description,
          type: q.type,
          reward: q.reward,
          completionGoal: q.completionGoal,
          progress: q.progress,
          completed: q.completed,
        })))
      } catch (error) {
        console.error('Error loading quests:', error)
      } finally {
        setLoading(false)
      }
    }
    loadQuests()
  }, [])

  const handleCompleteQuest = async (questId: string) => {
    try {
      const result = await updateQuestProgress(questId)
      if (result.success) {
        setQuests(prev => prev.map(quest => 
          quest._id === questId ? {
            ...quest,
            progress: result.quest!.progress,
            completed: result.quest!.completed
          } : quest
        ))
      }
    } catch (error) {
      console.error('Error completing quest:', error)
    }
  }

  if (loading) return <div>Loading quests...</div>

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-[#8b5e34]">Weekly Quests</h2>
      <div className="grid gap-4">
        {quests.filter(q => q.type === 'weekly').map(quest => (
          <div key={quest._id} className="p-4 bg-white/50 rounded-lg border-2 border-[#DFD2BC]">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-lg font-semibold text-[#6d4a29]">{quest.title}</h3>
                <p className="text-sm text-[#8b5e34]">{quest.description}</p>
                <div className="mt-2 text-sm text-[#6d4a29]">
                  Progress: {quest.progress || 0}/{quest.completionGoal}
                </div>
              </div>
              <div className="text-right">
                <div className="text-lg font-bold text-[#6d4a29]">
                  +{quest.reward} Coins
                </div>
                <button
                  onClick={() => handleCompleteQuest(quest._id)}
                  disabled={quest.completed}
                  className={`mt-2 px-4 py-2 rounded-md ${
                    quest.completed 
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      : 'bg-[#8b5e34] text-white hover:bg-[#6d4a29]'
                  }`}
                >
                  {quest.completed ? 'Completed' : 'Complete'}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}