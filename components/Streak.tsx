'use client'
import { getUser } from '@/lib/actions/getUser'
import { useEffect, useState } from 'react'

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

const Streak = () => {
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

  if (isLoading) return <div>Loading...</div>
  if (error) return <div className="text-red-500">{error}</div>
  if (!user) return <div>No user data found</div>

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4 mt-6">
      <div className="p-6 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow">
        <h2 className="text-xl font-semibold text-[#8b5e34] mb-2">Current Streak</h2>
        <p className="text-gray-600">{user.currentStreak}</p>
      </div>
      <div className="p-6 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow">
        <h2 className="text-xl font-semibold text-[#8b5e34] mb-2">Longest Streak</h2>
        <p className="text-gray-600">{user.longestStreak}</p>
      </div>
      <div className="p-6 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow">
        <h2 className="text-xl font-semibold text-[#8b5e34] mb-2">Aura Points</h2>
        <p className="text-gray-600">{user.aura}</p>
      </div>
      <div className="p-6 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow">
        <h2 className="text-xl font-semibold text-[#8b5e34] mb-2">EzCoins</h2>
        <p className="text-gray-600">{user.coins}</p>
      </div>
    </div>
  )
}

export default Streak