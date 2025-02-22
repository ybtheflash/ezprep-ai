'use client'

import React from 'react'
import { DashboardCard } from '../ui/dashboard-card'
import { Calendar } from '@/components/ui/calendar'
import { addDays, format } from 'date-fns'

const mockEvents = [
  { date: new Date(2025, 1, 25), type: 'test', title: 'Math Test' },
  { date: new Date(2025, 1, 28), type: 'practice', title: 'Practice Quiz' },
]

export function DashboardCalendar() {
  const [date, setDate] = React.useState<Date | undefined>(new Date())
  
  return (
    <DashboardCard title="Upcoming Events" className="col-span-4">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        <div className="md:col-span-8">
          <div className="bg-gradient-to-br from-[#DFD2BC]/30 to-[#8b5e34]/20 p-6 rounded-xl border border-[#DFD2BC]/60 shadow-md hover:shadow-lg transition-all duration-300 flex justify-center">
            <Calendar
              mode="single"
              selected={date}
              onSelect={setDate}
              className="w-full max-w-[500px]" // Set reasonable max width
              classNames={{
                day_selected: "bg-[#8b5e34] text-white hover:bg-[#6d4a29] font-medium",
                day_today: "bg-[#DFD2BC]/50 text-[#8b5e34] font-medium",
                cell: "text-center text-sm p-0 first:[&:has([role=gridcell])]:pl-4", // Added padding to first column
                day: "h-9 w-9 p-0 font-normal aria-selected:opacity-100 hover:bg-[#DFD2BC]/40 hover:scale-110 transition-all duration-200 rounded-lg", // Enhanced day cells with hover animation
                head_cell: "text-sm font-semibold text-[#8b5e34] pb-4", // Enhanced header with more spacing
                nav_button: "h-8 w-8 bg-white/60 hover:bg-white hover:scale-105 transition-all duration-200 rounded-full text-[#8b5e34] shadow-sm", // Enhanced nav buttons with hover effect
                nav_button_previous: "ml-1",
                nav_button_next: "mr-1",
                table: "w-full border-collapse",
              }}
            />
          </div>
        </div>
        <div className="md:col-span-4 space-y-6">
          <h3 className="font-semibold text-[#8b5e34] border-b-2 border-[#DFD2BC] pb-3 text-lg">
            Upcoming Events
          </h3>
          <div className="space-y-4">
            {mockEvents
              .filter(event => 
                event.date >= new Date() && 
                event.date <= addDays(new Date(), 7)
              )
              .map((event, index) => (
                <div 
                  key={index}
                  className="p-3 rounded-lg bg-white border border-[#DFD2BC]/50 hover:shadow-lg transition-all duration-300" // Enhanced cards
                >
                  <div className="flex flex-col gap-1.5"> {/* Increased gap */}
                    <span className="font-semibold text-[#8b5e34]">
                      {event.title}
                    </span>
                    <span className="text-sm text-[#6d4a29]/80">
                      {format(event.date, 'MMM dd, yyyy')}
                    </span>
                    <span className={`text-xs px-2.5 py-1 rounded-full w-fit ${
                      event.type === 'test' 
                        ? 'bg-red-100 text-red-800 font-medium' 
                        : 'bg-green-100 text-green-800 font-medium'
                    }`}>
                      {event.type.charAt(0).toUpperCase() + event.type.slice(1)}
                    </span>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>
    </DashboardCard>
  )
}