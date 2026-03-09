"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

export function LoadingScreen() {
  const [isVisible, setIsVisible] = React.useState(true)
  const [isSliding, setIsSliding] = React.useState(false)
  const [isRemoving, setIsRemoving] = React.useState(false)

  React.useEffect(() => {
    // Stage 1: Initial Wait (Logo Pulse)
    const slideTimer = setTimeout(() => {
      setIsSliding(true)
    }, 2200)

    // Stage 2: Slide to Top Left and Fade Out Background
    const removeTimer = setTimeout(() => {
      setIsRemoving(true)
      setTimeout(() => setIsVisible(false), 1000)
    }, 3200)

    return () => {
      clearTimeout(slideTimer)
      clearTimeout(removeTimer)
    }
  }, [])

  if (!isVisible) return null

  return (
    <div 
      className={cn(
        "fixed inset-0 z-[1000] flex items-center justify-center transition-all duration-1000 ease-in-out",
        isRemoving ? "bg-transparent pointer-events-none" : "bg-background"
      )}
    >
      {/* Central Animated Logo that will slide to match Navbar position */}
      <div 
        className={cn(
          "fixed transition-all duration-1000 cubic-bezier(0.85, 0, 0.15, 1)",
          !isSliding 
            ? "left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 scale-150" 
            : "left-6 top-4 scale-100 translate-x-0 translate-y-0"
        )}
      >
        <div className="relative group">
          <div className={cn(
            "w-20 h-20 md:w-24 md:h-24 bg-primary flex items-center justify-center text-white text-4xl md:text-5xl font-headline font-black transition-all duration-700 shadow-[0_20px_50px_-12px_rgba(88,88,179,0.6)] border border-white/20 relative z-10",
            isSliding ? "rounded-full w-9 h-9 md:w-9 md:h-9 text-lg" : "rounded-[1.5rem] animate-logo-pulse"
          )}>
            R
          </div>
          
          {/* Animated rings - hidden during slide */}
          {!isSliding && (
            <>
              <div className="absolute inset-0 -m-6 rounded-[2rem] border-2 border-primary/20 animate-ping opacity-30" />
              <div className="absolute inset-0 -m-10 rounded-[2.5rem] border border-primary/10 animate-ping [animation-delay:0.5s] opacity-20" />
            </>
          )}
        </div>
      </div>

      {/* Loading Text Sequence - Fades out earlier */}
      <div className={cn(
        "text-center space-y-4 transition-all duration-500",
        isSliding ? "opacity-0 translate-y-10 scale-90" : "opacity-100"
      )}>
        <div className="flex flex-col gap-1 mt-32">
          <h2 className="text-2xl sm:text-3xl font-headline font-bold tracking-tight text-foreground flex items-center justify-center gap-3 uppercase">
            RIZER <span className="text-primary italic">STUDIO</span>
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
      
      {/* Background Lighting */}
      <div className={cn(
        "absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/5 rounded-full blur-[150px] transition-all duration-1000",
        isRemoving ? "opacity-0 scale-150" : "opacity-100"
      )} />
    </div>
  )
}
