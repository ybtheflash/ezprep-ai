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
        "rounded-lg border bg-[#fcf3e4] p-4 shadow-sm transition-all hover:shadow-md",
        className
      )}
      {...props}
    >
      <h3 className="text-lg font-semibold text-[#8b5e34] mb-4">{title}</h3>
      <div>{children}</div>
    </div>
  )
}