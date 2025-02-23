'use client'

import React, { useEffect, useState } from 'react'
import { DashboardCard } from '../ui/dashboard-card'
import Image from 'next/image'
import { getUser } from '@/lib/actions/getUser'

// Mock data - in a real app, this would come from an API/database
const mockStats = {
  currentStreak: 7,
  longestStreak: 15,
  auraPoints: 2500,
  ezCoins: 150
}

interface User {
  name: string;
  id: number;
  email: string;
  username: string;
  longestStreak: number;
  currentStreak: number;
  aura: number;
  coins: number;
}

export function UserStats() {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  useEffect(() => {
    const fetchUser = async () => {
      try {
        setIsLoading(true)
        const response = await getUser()
        setUser(response)
      } catch (err) {
        setError('Failed to load user data')
        console.error(err)
      } finally {
        setIsLoading(false)
      }
    }
    fetchUser()
  }, [])
  return (
    <DashboardCard title="Your Progress" className="col-span-4">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="flex flex-col items-center p-4 bg-white/50 rounded-lg space-y-2">
          <span className="text-sm text-[#6d4a29]">Current Streak</span>
          <span className="text-3xl font-bold text-[#8b5e34]">{user?.currentStreak}</span>
          <span className="text-xs text-[#6d4a29]">days</span>
        </div>
        <div className="flex flex-col items-center p-4 bg-white/50 rounded-lg space-y-2">
          <span className="text-sm text-[#6d4a29]">Longest Streak</span>
          <span className="text-3xl font-bold text-[#8b5e34]">{user?.longestStreak}</span>
          <span className="text-xs text-[#6d4a29]">days</span>
        </div>
        <div className="flex flex-col items-center p-4 bg-white/50 rounded-lg space-y-2">
          <span className="text-sm text-[#6d4a29]">Aura Points</span>
          <div className="flex items-center gap-2">
            <Image
              src="/images/aura.png"
              alt="Aura Points"
              width={24}
              height={24}
            />
            <span className="text-3xl font-bold text-[#8b5e34]">{user?.aura}</span>
          </div>
        </div>
        <div className="flex flex-col items-center p-4 bg-white/50 rounded-lg space-y-2">
          <span className="text-sm text-[#6d4a29]">EzCoins</span>
          <div className="flex items-center gap-2">
            <span className="text-2xl">🪙</span>
            <span className="text-3xl font-bold text-[#8b5e34]">{user?.coins}</span>
          </div>
        </div>
      </div>
    </DashboardCard>
  )
}