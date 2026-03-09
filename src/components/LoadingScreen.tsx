"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

export function LoadingScreen() {
  const [isVisible, setIsVisible] = React.useState(true)
  const [isRemoving, setIsRemoving] = React.useState(false)

  React.useEffect(() => {
    // Initial wait for a more premium entrance
    const timer = setTimeout(() => {
      setIsRemoving(true)
      setTimeout(() => setIsVisible(false), 800)
    }, 2800)

    return () => clearTimeout(timer)
  }, [])

  if (!isVisible) return null

  return (
    <div 
      className={cn(
        "fixed inset-0 z-[1000] flex items-center justify-center bg-background transition-all duration-1000 ease-in-out",
        isRemoving ? "opacity-0 blur-xl pointer-events-none" : "opacity-100"
      )}
    >
      <div className="relative flex flex-col items-center gap-10">
        {/* Animated Logo Container */}
        <div className="relative group">
          <div className="w-28 h-28 sm:w-36 sm:h-36 rounded-[2.5rem] bg-primary flex items-center justify-center text-white text-6xl sm:text-8xl font-headline font-black animate-logo-pulse shadow-[0_30px_60px_-12px_rgba(88,88,179,0.5)] border border-white/20 relative z-10 transition-transform duration-500">
            R
          </div>
          
          {/* Layered animated rings */}
          <div className="absolute inset-0 -m-6 rounded-[3rem] border-2 border-primary/20 animate-ping opacity-30" />
          <div className="absolute inset-0 -m-10 rounded-[3.5rem] border border-primary/10 animate-ping [animation-delay:0.5s] opacity-20" />
          
          {/* Inner glow */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-primary blur-3xl opacity-20 group-hover:opacity-40 transition-opacity" />
        </div>

        {/* Text Sequence Animation */}
        <div className="text-center space-y-4 animate-fade-in [animation-delay:0.3s]">
          <div className="flex flex-col gap-1">
            <h2 className="text-2xl sm:text-3xl font-headline font-bold tracking-tight text-foreground flex items-center justify-center gap-3">
              RIZER WEB <span className="text-primary italic">STUDIO</span>
            </h2>
            <p className="text-[10px] font-black uppercase tracking-[0.4em] text-muted-foreground opacity-60">
              Future of Nepal's Digital Space
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
      
      {/* Dynamic background lighting */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[120px] animate-pulse" />
      <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
    </div>
  )
}