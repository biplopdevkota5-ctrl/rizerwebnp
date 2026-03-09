"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

interface IOSSpinnerProps {
  className?: string
  size?: "sm" | "md" | "lg"
}

export function IOSSpinner({ className, size = "md" }: IOSSpinnerProps) {
  const bars = Array.from({ length: 12 })
  
  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-6 h-6",
    lg: "w-10 h-10"
  }

  const barWidth = {
    sm: "w-[1px] h-[3px]",
    md: "w-[1.5px] h-[4px]",
    lg: "w-[2.5px] h-[8px]"
  }

  return (
    <div className={cn("relative flex items-center justify-center", sizeClasses[size], className)}>
      {bars.map((_, i) => (
        <div
          key={i}
          className={cn("absolute ios-spinner-bar", barWidth[size])}
          style={{
            transform: `rotate(${i * 30}deg) translate(0, -120%)`,
            animationDelay: `${-1 + (i * 0.083)}s`
          }}
        />
      ))}
    </div>
  )
}
