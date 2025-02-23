'use client'

import React from 'react'
import { DashboardCard } from '../ui/dashboard-card'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

// Mock data - in a real app, this would come from an API/database
const mockData = [
  { day: 'Mon', aura: 85, coins: 20 },
  { day: 'Tue', aura: 120, coins: 35 },
  { day: 'Wed', aura: 95, coins: 25 },
  { day: 'Thu', aura: 150, coins: 45 },
  { day: 'Fri', aura: 130, coins: 40 },
  { day: 'Sat', aura: 110, coins: 30 },
  { day: 'Sun', aura: 140, coins: 42 },
]

export function ProgressChart() {
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
              data={mockData}
              margin={{
                top: 20,
                right: 30,
                left: 20,
                bottom: 10,
              }}
            >
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
                domain={[0, 'auto']}
              />
              <YAxis
                yAxisId="right"
                orientation="right"
                tick={{ fill: '#8b5e34' }}
                stroke="#8b5e34"
                domain={[0, 'auto']}
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