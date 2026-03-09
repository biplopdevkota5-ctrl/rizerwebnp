"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

export function LoadingScreen() {
  const [isVisible, setIsVisible] = React.useState(true)
  const [isRemoving, setIsRemoving] = React.useState(false)

  React.useEffect(() => {
    // Initial wait to show the cool animation
    const timer = setTimeout(() => {
      setIsRemoving(true)
      // Wait for exit animation to complete
      setTimeout(() => setIsVisible(false), 800)
    }, 2500)

    return () => clearTimeout(timer)
  }, [])

  if (!isVisible) return null

  return (
    <div 
      className={cn(
        "fixed inset-0 z-[1000] flex items-center justify-center bg-background transition-opacity duration-700 ease-in-out",
        isRemoving ? "opacity-0 pointer-events-none" : "opacity-100"
      )}
    >
      <div className="relative flex flex-col items-center gap-8 animate-fade-in">
        {/* Animated Logo */}
        <div className="relative">
          <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-[2rem] bg-primary flex items-center justify-center text-white text-5xl sm:text-7xl font-headline font-black animate-logo-pulse shadow-[0_20px_50px_rgba(88,88,179,0.3)] border border-white/20">
            R
          </div>
          {/* Subtle Outer Ring */}
          <div className="absolute inset-0 -m-4 rounded-[2.5rem] border border-primary/20 animate-ping opacity-20" />
        </div>

        {/* Text Animation */}
        <div className="text-center space-y-2">
          <h2 className="text-xl sm:text-2xl font-headline font-bold tracking-tight text-foreground">
            RIZER WEB <span className="text-primary italic">STUDIO</span>
          </h2>
          <div className="flex items-center justify-center gap-1.5">
            <div className="w-1.5 h-1.5 rounded-full bg-primary animate-bounce [animation-delay:-0.3s]" />
            <div className="w-1.5 h-1.5 rounded-full bg-primary animate-bounce [animation-delay:-0.15s]" />
            <div className="w-1.5 h-1.5 rounded-full bg-primary animate-bounce" />
          </div>
        </div>
      </div>
      
      {/* Decorative background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px]" />
    </div>
  )
}
