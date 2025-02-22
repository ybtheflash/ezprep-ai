'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { DashboardCard } from '../ui/dashboard-card'

interface AnimatedCardProps {
  children: React.ReactNode
  title: string
  className?: string
  delay?: number
}

export function AnimatedCard({ children, title, className, delay = 0 }: AnimatedCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{
        duration: 0.6,
        delay,
        ease: [0.25, 0.1, 0.25, 1], // Improved easing
        opacity: { duration: 0.4 }  // Faster opacity transition
      }}
      whileHover={{
        scale: 1.01,
        transition: { duration: 0.2 }
      }}
    >
      <DashboardCard title={title} className={className}>
        {children}
      </DashboardCard>
    </motion.div>
  )
}

// Animated number component for stats
interface AnimatedNumberProps {
  value: number
  duration?: number
  delay?: number
}

export function AnimatedNumber({ value, duration = 1.5, delay = 0 }: AnimatedNumberProps) {
  const [displayValue, setDisplayValue] = React.useState(0)

  React.useEffect(() => {
    let startTimestamp: number
    const step = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp
      const progress = Math.min((timestamp - startTimestamp) / (duration * 1000), 1)
      setDisplayValue(Math.floor(progress * value))
      if (progress < 1) {
        requestAnimationFrame(step)
      }
    }
    setTimeout(() => requestAnimationFrame(step), delay * 1000)
  }, [value, duration, delay])

  return <span>{displayValue}</span>
}