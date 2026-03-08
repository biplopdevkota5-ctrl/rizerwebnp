
"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { PlusCircle, User as UserIcon, LogOut } from "lucide-react"
import { cn } from "@/lib/utils"
import { useUser, useAuth } from "@/firebase"
import { signOut } from "firebase/auth"

export function Navbar() {
  const { user } = useUser()
  const auth = useAuth()
  const pathname = usePathname()
  const router = useRouter()
  const [logoClicks, setLogoClicks] = React.useState(0)
  
  const handleLogout = async () => {
    await signOut(auth)
    router.push('/')
  }

  const handleLogoClick = () => {
    const nextCount = logoClicks + 1
    if (nextCount >= 10) {
      setLogoClicks(0)
      router.push('/admin')
    } else {
      setLogoClicks(nextCount)
    }
    // Reset clicks after 3 seconds of inactivity
    setTimeout(() => setLogoClicks(0), 3000)
  }

  return (
    <nav className="sticky top-0 z-[100] w-full border-b border-white/10 bg-background shadow-xl">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div 
          onClick={handleLogoClick}
          className="flex items-center gap-2 group shrink-0 transition-transform active:scale-95 cursor-pointer"
        >
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-white font-bold group-hover:scale-110 transition-transform shadow-lg shadow-primary/20">R</div>
          <span className="font-headline font-bold text-xl tracking-tight text-foreground hidden sm:inline">RIZER WEB <span className="text-primary">APP</span></span>
          <span className="font-headline font-bold text-xl tracking-tight text-foreground sm:hidden">RIZER</span>
        </div>

        {/* Desktop Navigation Links */}
        <div className="hidden md:flex items-center gap-6">
          <Link 
            href="/types" 
            className={cn(
              "text-sm font-semibold transition-all hover:text-primary py-1",
              pathname === '/types' ? "text-primary border-b-2 border-primary" : "text-muted-foreground"
            )}
          >
            Website Types
          </Link>
          <Link 
            href="/request" 
            className={cn(
              "flex items-center gap-2 text-sm font-semibold transition-all hover:text-primary py-1",
              pathname === '/request' ? "text-primary border-b-2 border-primary" : "text-muted-foreground"
            )}
          >
            <PlusCircle className="w-4 h-4" />
            Request Website
          </Link>
          <div className="h-6 w-px bg-white/10 mx-2" />
        </div>

        {/* Auth Actions */}
        <div className="flex items-center gap-2">
          {user ? (
            <div className="flex items-center gap-2">
              <Link href="/dashboard" className="text-sm font-bold text-foreground hover:text-primary transition-colors flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                  <UserIcon className="w-4 h-4 text-primary" />
                </div>
                <span className="hidden xs:inline">{user.displayName || user.email?.split('@')[0] || "Dashboard"}</span>
              </Link>
              <Button variant="ghost" size="sm" onClick={handleLogout} className="text-muted-foreground font-bold hover:text-destructive p-2 h-auto">
                <LogOut className="w-4 h-4" />
              </Button>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Link href="/auth/login">
                <Button variant="ghost" size="sm" className="font-bold h-9 px-4">Login</Button>
              </Link>
              <Link href="/auth/signup">
                <Button size="sm" className="font-bold rounded-full h-9 px-6 shadow-lg shadow-primary/20">Sign Up</Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  )
}
