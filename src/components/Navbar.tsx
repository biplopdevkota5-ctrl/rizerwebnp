"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { PlusCircle, User as UserIcon, LogOut, ShieldCheck, Menu } from "lucide-react"
import { cn } from "@/lib/utils"
import { useUser, useAuth } from "@/firebase"
import { signOut } from "firebase/auth"

export function Navbar() {
  const { user } = useUser()
  const auth = useAuth()
  const pathname = usePathname()
  const router = useRouter()
  const [logoClicks, setLogoClicks] = React.useState(0)
  const timerRef = React.useRef<NodeJS.Timeout | null>(null)
  const [isMounted, setIsMounted] = React.useState(false)

  React.useEffect(() => {
    // Small delay to ensure continuity with LoadingScreen logo transition
    const timer = setTimeout(() => setIsMounted(true), 3200)
    return () => clearTimeout(timer)
  }, [])
  
  const handleLogout = async () => {
    await signOut(auth)
    router.push('/')
  }

  const handleLogoAction = (e: React.MouseEvent) => {
    const nextCount = logoClicks + 1
    if (timerRef.current) clearTimeout(timerRef.current)
    
    if (nextCount >= 10) {
      e.preventDefault() 
      setLogoClicks(0)
      router.push('/admin')
    } else {
      setLogoClicks(nextCount)
      timerRef.current = setTimeout(() => setLogoClicks(0), 3000)
    }
  }

  return (
    <nav className="sticky top-0 z-[100] w-full border-b border-white/10 bg-background/80 backdrop-blur-xl shadow-2xl">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link 
          href="/" 
          onClick={handleLogoAction}
          className="flex items-center gap-3 group shrink-0 transition-all active:scale-95 cursor-pointer outline-none"
        >
          {/* Logo - Matches LoadingScreen final state */}
          <div className={cn(
            "w-9 h-9 rounded-full bg-primary flex items-center justify-center text-white font-black text-lg transition-all duration-1000 shadow-[0_10px_30px_rgba(88,88,179,0.4)]",
            isMounted ? "opacity-100 scale-100" : "opacity-0 scale-50"
          )}>
            R
          </div>
          <span className={cn(
            "font-headline font-black text-xl tracking-tight text-foreground transition-all duration-1000 delay-300",
            isMounted ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-4"
          )}>
            RIZER <span className="text-primary italic">STUDIO</span>
          </span>
        </Link>

        {/* Desktop Navigation Links */}
        <div className="hidden md:flex items-center gap-8">
          {[
            { href: '/types', label: 'Website Types' },
            { href: '/request', label: 'Request Quote', icon: PlusCircle },
            { href: '/admin', label: 'Admin', icon: ShieldCheck }
          ].map((link) => (
            <Link 
              key={link.href}
              href={link.href} 
              className={cn(
                "text-sm font-bold transition-all hover:text-primary py-1 flex items-center gap-2 relative group",
                pathname === link.href ? "text-primary" : "text-muted-foreground"
              )}
            >
              {link.icon && <link.icon className="w-4 h-4" />}
              {link.label}
              <span className={cn(
                "absolute bottom-0 left-0 w-full h-0.5 bg-primary transition-all duration-300",
                pathname === link.href ? "opacity-100" : "opacity-0 group-hover:opacity-40"
              )} />
            </Link>
          ))}
          <div className="h-6 w-px bg-white/10 mx-2" />
        </div>

        {/* Auth Actions */}
        <div className="flex items-center gap-3">
          {user ? (
            <div className="flex items-center gap-3">
              <Link href="/dashboard" className="flex items-center gap-3 p-1 pr-4 rounded-full bg-primary/5 border border-primary/10 hover:bg-primary/10 transition-all">
                <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center shadow-lg">
                  <UserIcon className="w-4 h-4 text-white" />
                </div>
                <span className="text-xs font-black uppercase tracking-widest hidden xs:inline">{user.displayName || user.email?.split('@')[0]}</span>
              </Link>
              <Button variant="ghost" size="icon" onClick={handleLogout} className="rounded-full hover:bg-destructive/10 hover:text-destructive">
                <LogOut className="w-5 h-5" />
              </Button>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Link href="/auth/login" className="hidden xs:inline">
                <Button variant="ghost" size="sm" className="font-bold text-sm">Login</Button>
              </Link>
              <Link href="/auth/signup">
                <Button size="sm" className="font-black rounded-full h-10 px-6 shadow-xl shadow-primary/20 hover:scale-105">Join Us</Button>
              </Link>
            </div>
          )}
          
          <Link href="/menu" className="md:hidden">
            <Button variant="ghost" size="icon" className="rounded-full h-10 w-10 glass">
              <Menu className="w-6 h-6" />
            </Button>
          </Link>
        </div>
      </div>
    </nav>
  )
}
