'use client'

import React, { useEffect, useState } from 'react'
import { DashboardCard } from '../ui/dashboard-card'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

interface ProgressData {
  day: string
  aura: number
  coins: number
}

export function ProgressChart() {
  const [chartData, setChartData] = useState<ProgressData[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchProgressData = async () => {
      try {
        const response = await fetch('/api/user/progress')
        if (!response.ok) {
          throw new Error('Failed to fetch progress data')
        }
        const data = await response.json()
        setChartData(data)
      } catch (err) {
        console.error('Error fetching progress:', err)
        setError('Failed to load progress data')
      } finally {
        setLoading(false)
      }
    }

    fetchProgressData()
  }, [])

  const maxAura = chartData.length > 0 
    ? Math.ceil(Math.max(...chartData.map(d => d.aura)) * 1.1) // Add 10% padding
    : 10; // Default to 10 if no data

  if (loading) {
    return (
      <DashboardCard title="Weekly Progress" className="col-span-4">
        <div className="h-[280px] flex items-center justify-center">
          <div className="retro-loading"></div>
        </div>
      </DashboardCard>
    )
  }

  if (error) {
    return (
      <DashboardCard title="Weekly Progress" className="col-span-4">
        <div className="h-[280px] flex items-center justify-center text-red-500">
          {error}
        </div>
      </DashboardCard>
    )
  }

  return (
    <DashboardCard title="Weekly Progress" className="col-span-4">
      <div className="space-y-4">
        <div className="flex items-center justify-center gap-6">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-[#8b5e34]" />
            <span className="text-sm text-[#6d4a29]">Aura Points</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-[#DFD2BC]" />
            <span className="text-sm text-[#6d4a29]">EzCoins</span>
          </div>
        </div>
        
        <div className="w-full h-[280px] overflow-x-auto bg-white/50 rounded-lg p-4 border-2 border-[#DFD2BC]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={chartData}
              margin={{
                top: 20,
                right: 30,
                left: 20,
                bottom: 10,
              }}
            >
              {/* Keep existing chart configuration */}
              <CartesianGrid strokeDasharray="3 3" stroke="#DFD2BC" />
              <XAxis
                dataKey="day"
                tick={{ fill: '#8b5e34' }}
                stroke="#8b5e34"
              />
              <YAxis
                yAxisId="left"
                tick={{ fill: '#8b5e34' }}
                stroke="#8b5e34"
                domain={[0, maxAura]}
              />
              <YAxis
                yAxisId="right"
                orientation="right"
                tick={{ fill: '#8b5e34' }}
                stroke="#8b5e34"
                domain={[0, maxAura]}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'rgba(255, 255, 255, 0.9)',
                  border: '1px solid #DFD2BC',
                  borderRadius: '0.5rem',
                }}
                labelStyle={{ color: '#8b5e34' }}
              />
              <Line
                yAxisId="left"
                type="monotone"
                dataKey="aura"
                stroke="#8b5e34"
                strokeWidth={3}
                dot={{
                  fill: '#8b5e34',
                  stroke: '#8b5e34',
                  strokeWidth: 2,
                  r: 4,
                }}
                activeDot={{
                  fill: '#8b5e34',
                  stroke: '#fff',
                  strokeWidth: 2,
                  r: 6,
                }}
              />
              <Line
                yAxisId="right"
                type="monotone"
                dataKey="coins"
                stroke="#DFD2BC"
                strokeWidth={3}
                dot={{
                  fill: '#DFD2BC',
                  stroke: '#DFD2BC',
                  strokeWidth: 2,
                  r: 4,
                }}
                activeDot={{
                  fill: '#DFD2BC',
                  stroke: '#fff',
                  strokeWidth: 2,
                  r: 6,
                }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </DashboardCard>
  )
}