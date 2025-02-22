import { cn } from "@/lib/utils"
import React from "react"

interface DashboardCardProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string
  children: React.ReactNode
}

export function DashboardCard({
  title,
  children,
  className,
  ...props
}: DashboardCardProps) {
  return (
    <div
      className={cn(
        "rounded-xl border border-[#DFD2BC]/60 bg-gradient-to-br from-[#DFD2BC]/30 to-[#8b5e34]/20 p-5 shadow-md hover:shadow-lg transition-all duration-300",
        className
      )}
      {...props}
    >
      <h3 className="text-xl font-semibold text-[#8b5e34] mb-6 pb-2 border-b border-[#DFD2BC]/60">{title}</h3>
      <div className="space-y-1">{children}</div>
    </div>
  )
}