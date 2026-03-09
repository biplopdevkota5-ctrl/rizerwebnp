
"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

export function LoadingScreen() {
  const [isVisible, setIsVisible] = React.useState(true)

  React.useEffect(() => {
    // Stage: Fade out after loading
    const timer = setTimeout(() => {
      setIsVisible(false)
    }, 3000)

    return () => clearTimeout(timer)
  }, [])

  if (!isVisible) return null

  return (
    <div 
      className="fixed inset-0 z-[1000] flex items-center justify-center bg-background animate-fade-in"
      style={{ animationDirection: 'reverse', animationDelay: '2.5s' }}
    >
      <div className="text-center space-y-8">
        <div className="relative group">
          <div className="w-24 h-24 md:w-32 md:h-32 bg-primary rounded-[2rem] flex items-center justify-center text-white text-5xl md:text-6xl font-headline font-black shadow-[0_20px_50px_-12px_rgba(88,88,179,0.6)] border border-white/20 animate-logo-pulse">
            R
          </div>
          <div className="absolute inset-0 -m-6 rounded-[2.5rem] border-2 border-primary/20 animate-ping opacity-30" />
        </div>
        
        <div className="space-y-2">
          <h2 className="text-2xl sm:text-3xl font-headline font-bold tracking-tight text-foreground uppercase">
            RIZER <span className="text-primary">WEB APP</span>
          </h2>
          <p className="text-[10px] font-black uppercase tracking-[0.4em] text-muted-foreground opacity-60">
            Digital Solutions for Nepal
          </p>
        </div>
        
        <div className="flex items-center justify-center gap-2">
          {[1, 2, 3].map((i) => (
            <div 
              key={i} 
              className="w-1.5 h-1.5 rounded-full bg-primary animate-bounce" 
              style={{ animationDelay: `${i * 0.15}s` }}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
