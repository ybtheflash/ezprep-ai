'use client'

import React from 'react'
import { DashboardCard } from '../ui/dashboard-card'

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
  // Chart dimensions
  const width = 600
  const height = 300
  const padding = 40
  
  // Calculate max values for scaling
  const maxAura = Math.max(...mockData.map(d => d.aura))
  const maxCoins = Math.max(...mockData.map(d => d.coins))
  
  // Generate points for both lines
  const getPoints = (data: number[]) => {
    return mockData.map((d, i) => {
      const x = padding + (i * ((width - (2 * padding)) / (mockData.length - 1)))
      const y = height - padding - ((data[i] / Math.max(...data)) * (height - (2 * padding)))
      return `${x},${y}`
    }).join(' ')
  }

  const auraPoints = getPoints(mockData.map(d => d.aura))
  const coinPoints = getPoints(mockData.map(d => d.coins))

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
        
        <div className="w-full overflow-x-auto bg-white/50 rounded-lg p-4 border-2 border-[#DFD2BC]">
          <svg width={width} height={height} className="w-full h-auto">
            {/* Grid lines */}
            {[...Array(5)].map((_, i) => (
              <line
                key={`grid-${i}`}
                x1={padding}
                y1={padding + (i * (height - 2 * padding) / 4)}
                x2={width - padding}
                y2={padding + (i * (height - 2 * padding) / 4)}
                stroke="#DFD2BC"
                strokeWidth="1"
                strokeDasharray="4,4"
              />
            ))}
            
            {/* Axes */}
            <line
              x1={padding}
              y1={padding}
              x2={padding}
              y2={height - padding}
              stroke="#8b5e34"
              strokeWidth="2"
            />
            <line
              x1={padding}
              y1={height - padding}
              x2={width - padding}
              y2={height - padding}
              stroke="#8b5e34"
              strokeWidth="2"
            />
            
            {/* Data lines */}
            <polyline
              points={auraPoints}
              fill="none"
              stroke="#8b5e34"
              strokeWidth="3"
              className="drop-shadow-md"
            />
            <polyline
              points={coinPoints}
              fill="none"
              stroke="#DFD2BC"
              strokeWidth="3"
              className="drop-shadow-md"
            />
            
            {/* Data points and labels */}
            {mockData.map((d, i) => {
              const x = padding + (i * ((width - (2 * padding)) / (mockData.length - 1)))
              const yAura = height - padding - ((d.aura / maxAura) * (height - (2 * padding)))
              const yCoins = height - padding - ((d.coins / maxCoins) * (height - (2 * padding)))
              
              return (
                <g key={i}>
                  {/* Aura points */}
                  <circle
                    cx={x}
                    cy={yAura}
                    r="4"
                    fill="#8b5e34"
                    className="drop-shadow"
                  />
                  <text
                    x={x}
                    y={yAura - 10}
                    textAnchor="middle"
                    fill="#8b5e34"
                    className="text-xs font-medium"
                  >
                    {d.aura}
                  </text>
                  
                  {/* Coin points */}
                  <circle
                    cx={x}
                    cy={yCoins}
                    r="4"
                    fill="#DFD2BC"
                    className="drop-shadow"
                  />
                  <text
                    x={x}
                    y={yCoins - 10}
                    textAnchor="middle"
                    fill="#6d4a29"
                    className="text-xs font-medium"
                  >
                    {d.coins}
                  </text>
                  
                  {/* Day labels */}
                  <text
                    x={x}
                    y={height - padding + 20}
                    textAnchor="middle"
                    fill="#8b5e34"
                    className="text-sm font-medium"
                  >
                    {d.day}
                  </text>
                </g>
              )
            })}
          </svg>
        </div>
      </div>
    </DashboardCard>
  )
}