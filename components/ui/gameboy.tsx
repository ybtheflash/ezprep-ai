"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

interface GameBoyProps {
  children: React.ReactNode
}

export default function GameBoy({ children }: GameBoyProps) {
  return (
    <div className="flex h-full items-center justify-center">
      <div className="relative aspect-[1/1.6] w-full max-w-[300px] rounded-[2rem] bg-[#e0e0e0] p-8 shadow-xl">
        {/* Screen bezel */}
        <div className="relative mb-8 aspect-square w-full rounded-lg bg-[#8b8b8b] p-4 shadow-inner">
          {/* Power LED */}
          <div className="absolute left-4 top-2 h-2 w-2 rounded-full bg-red-600" />

          {/* Screen */}
          <div className="relative h-full w-full overflow-hidden rounded bg-[#9ca283] shadow-inner">
            {children}
          </div>
        </div>

        {/* Controls */}
        <div className="grid grid-cols-3 gap-4">
          {/* D-Pad */}
          <div className="relative h-16 w-16">
            <div className="absolute left-1/2 top-0 h-5 w-5 -translate-x-1/2 rounded bg-[#2f2f2f]" />
            <div className="absolute bottom-0 left-1/2 h-5 w-5 -translate-x-1/2 rounded bg-[#2f2f2f]" />
            <div className="absolute left-0 top-1/2 h-5 w-5 -translate-y-1/2 rounded bg-[#2f2f2f]" />
            <div className="absolute right-0 top-1/2 h-5 w-5 -translate-y-1/2 rounded bg-[#2f2f2f]" />
            <div className="absolute left-1/2 top-1/2 h-7 w-7 -translate-x-1/2 -translate-y-1/2 rounded bg-[#2f2f2f]" />
          </div>

          {/* Center buttons */}
          <div className="flex items-end justify-center gap-4">
            <div className="h-2 w-6 rotate-[-30deg] rounded-full bg-[#8b8b8b]" />
            <div className="h-2 w-6 rotate-[-30deg] rounded-full bg-[#8b8b8b]" />
          </div>

          {/* A/B buttons */}
          <div className="flex items-center justify-end gap-2">
            <button className="h-8 w-8 rounded-full bg-[#ab0000] shadow-md active:shadow-none" />
            <button className="h-8 w-8 rounded-full bg-[#ab0000] shadow-md active:shadow-none" />
          </div>
        </div>

        {/* Speaker lines */}
        <div className="absolute bottom-6 right-8 flex gap-1">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-4 w-1 rotate-[-30deg] rounded-full bg-[#8b8b8b]" />
          ))}
        </div>
      </div>
    </div>
  )
}