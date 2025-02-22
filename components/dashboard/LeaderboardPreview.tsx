'use client'

import React, { useEffect, useState } from 'react'
import { DashboardCard } from '../ui/dashboard-card'
import { useRouter } from 'next/navigation'
import { getLeaderboard } from '@/lib/actions/getLeaderboard'

interface User {
  id: number;
  name: string;
  username: string;
  aura: number;
  currentStreak: number;
  longestStreak: number;
  coins: number;
}

export function LeaderboardPreview() {
  const router = useRouter()
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchLeaders = async () => {
      try {
        const leaderboardData = await getLeaderboard()
        setUsers(leaderboardData.slice(0, 3))
      } catch (error) {
        console.error('Error fetching leaderboard:', error)
      } finally {
        setLoading(false)
      }
    }

    // Initial fetch
    fetchLeaders()

    // Set up polling every 30 seconds
    const intervalId = setInterval(fetchLeaders, 30000)

    // Cleanup interval on component unmount
    return () => clearInterval(intervalId)
  }, [])

  return (
    <DashboardCard
      title="Top Performers"
      className="col-span-2 hover:scale-[1.01] transition-transform duration-200"
    >
      <div className="space-y-3">
        {loading ? (
          <div className="flex justify-center items-center h-32">
            <div className="animate-spin rounded-full h-8 w-8 border-2 border-[#8b5e34] border-t-transparent"></div>
          </div>
        ) : (
          users.map((user, index) => {
            const rank = index + 1;
            const rankColor = rank === 1 ? 'gold' : rank === 2 ? 'silver' : rank === 3 ? '#cd7f32' : '#8b5e34';
            
            return (
              <div
                key={user.id}
                className="retro-card p-3 cursor-pointer"
                onClick={() => router.push('/leaderboard')}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="pixel-number" style={{ backgroundColor: rankColor }}>
                      #{rank}
                    </div>
                    <div>
                      <h3 className="font-bold text-[#8b5e34]">{user.name}</h3>
                      <p className="text-sm text-[#8b5e34] opacity-75">@{user.username}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <img
                      src="/images/stars.png"
                      alt="aura"
                      className="w-6 h-6"
                    />
                    <span className="font-bold text-[#8b5e34]">
                      {user.aura}
                    </span>
                  </div>
                </div>
              </div>
            );
          })
        )}
        <button
          onClick={() => router.push('/leaderboard')}
          className="w-full py-2 text-center text-[#8b5e34] bg-[#fcf3e4] rounded-lg border-2 border-[#DFD2BC] hover:bg-[#DFD2BC] transition-colors text-sm font-medium"
        >
          View Full Leaderboard →
        </button>
      </div>
    </DashboardCard>
  )
}