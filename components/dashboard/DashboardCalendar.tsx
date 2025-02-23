'use client'
import React from 'react'
import { DashboardCard } from '../ui/dashboard-card'
import Calendar from '@/components/ui/calendar'
import Gameboy from '@/components/ui/gameboy'
import Image from 'next/image'


const WeatherBox = () => {
  return (
    <div className="h-full bg-gradient-to-br from-[#DFD2BC]/30 to-[#8b5e34]/20 p-6 rounded-xl border border-[#DFD2BC]/60 shadow-md hover:shadow-lg transition-all duration-300 flex flex-col justify-between">
      <h3 className="font-semibold text-[#8b5e34] pb-3 text-lg text-center border-b border-[#DFD2BC]">
        Weather
      </h3>
      <div className="flex flex-col items-center mt-4">
        <span className="text-6xl font-bold text-[#8b5e34]">24°C</span>
        <p className="text-lg text-[#8b5e34]">Partly Cloudy</p>
        <p className="text-xs text-[#8b5e34]/80">Kolkata, India</p>
      </div>
      <div className="grid grid-cols-2 gap-4 pt-4 border-t border-[#DFD2BC] mt-4">
        <div className="flex flex-col items-center">
          <p className="text-sm text-[#8b5e34]/80">Humidity</p>
          <p className="text-sm font-medium text-[#8b5e34]">65%</p>
        </div>
        <div className="flex flex-col items-center">
          <p className="text-sm text-[#8b5e34]/80">Wind Speed</p>
          <p className="text-sm font-medium text-[#8b5e34]">12 km/h</p>
        </div>
      </div>
    </div>
  );
};

export function DashboardCalendar() {
  const [date, setDate] = React.useState<Date | undefined>(new Date())
  const [currentImageIndex, setCurrentImageIndex] = React.useState(0)
  
  const images = [
    "/images/wordle.png",
    "/images/wordle.png",
    "/images/wordle.png",
  ]

  React.useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % images.length)
    }, 3000)

    return () => clearInterval(interval)
  }, [])

  return (
    <DashboardCard title="Calendar & Weather" className="col-span-4">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        <div className="md:col-span-4">
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
        <div className="md:col-span-4">
          <div className="h-full bg-gradient-to-br from-[#DFD2BC]/30 to-[#8b5e34]/20 p-4 rounded-xl border border-[#DFD2BC]/60 shadow-md hover:shadow-lg transition-all duration-300">
            <Gameboy>
              <div className="relative h-full w-full">
                {images.map((src, index) => (
                  <Image
                    key={index}
                    src={src}
                    alt={`Game screen ${index + 1}`}
                    layout="fill"
                    objectFit="contain"
                    className={`absolute inset-0 transition-opacity duration-500 ${
                      index === currentImageIndex ? 'opacity-100' : 'opacity-0'
                    }`}
                  />
                ))}
              </div>
            </Gameboy>
          </div>
        </div>
      </div>
    </DashboardCard>
  )
}