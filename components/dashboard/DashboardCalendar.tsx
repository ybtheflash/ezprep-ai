'use client'
import React from 'react'
import { DashboardCard } from '../ui/dashboard-card'
import { Calendar } from '@/components/ui/calendar'

const WeatherBox = () => {
  return (
    <div className="h-full bg-gradient-to-br from-[#DFD2BC]/30 to-[#8b5e34]/20 p-6 rounded-xl border border-[#DFD2BC]/60 shadow-md hover:shadow-lg transition-all duration-300">
      <h3 className="font-semibold text-[#8b5e34] pb-3 text-lg border-b border-[#DFD2BC]">
        Weather
      </h3>
      <div className="mt-4 space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-4xl font-bold text-[#8b5e34]">24°C</span>
          <div className="text-right">
            <p className="text-sm text-[#8b5e34]">Partly Cloudy</p>
            <p className="text-xs text-[#8b5e34]/80">Kolkata, India</p>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4 pt-4 border-t border-[#DFD2BC]">
          <div>
            <p className="text-xs text-[#8b5e34]/80">Humidity</p>
            <p className="text-sm font-medium text-[#8b5e34]">65%</p>
          </div>
          <div>
            <p className="text-xs text-[#8b5e34]/80">Wind Speed</p>
            <p className="text-sm font-medium text-[#8b5e34]">12 km/h</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export function DashboardCalendar() {
  const [date, setDate] = React.useState<Date | undefined>(new Date())
  
  return (
    <DashboardCard title="Calendar & Weather" className="col-span-4">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        <div className="md:col-span-8">
          <div className="h-full bg-gradient-to-br from-[#DFD2BC]/30 to-[#8b5e34]/20 p-4 rounded-xl border border-[#DFD2BC]/60 shadow-md hover:shadow-lg transition-all duration-300">
            <div className="flex justify-center h-full items-center">
              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                className="w-full max-w-[300px]" // Added max-width
                classNames={{
                  day_selected: "bg-[#292828] text-white hover:bg-[#292828]/90 font-medium",
                  day_today: "bg-[#DFD2BC]/50 text-[#8b5e34] font-medium",
                  cell: "text-center text-sm p-0 first:[&:has([role=gridcell])]:pl-2",
                  day: "h-9 w-9 p-0 font-normal aria-selected:opacity-100 hover:bg-[#DFD2BC]/40 hover:scale-110 transition-all duration-200 rounded-lg",
                  head_cell: "text-sm font-semibold text-[#8b5e34] pb-4",
                  nav_button: "h-8 w-8 bg-white/60 hover:bg-white hover:scale-105 transition-all duration-200 rounded-full text-[#8b5e34] shadow-sm",
                  nav_button_previous: "ml-1",
                  nav_button_next: "mr-1",
                  table: "w-full border-collapse space-y-1",
                  months: "w-full", // Added to ensure month table fills width
                }}
              />
            </div>
          </div>
        </div>
        <div className="md:col-span-4">
          <WeatherBox />
        </div>
      </div>
    </DashboardCard>
  )
}