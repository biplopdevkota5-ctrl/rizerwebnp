"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { LayoutGrid, PlusCircle, User as UserIcon, LogOut, Shield } from "lucide-react"
import { cn } from "@/lib/utils"
import { useUser, useAuth } from "@/firebase"
import { signOut } from "firebase/auth"

export function Navbar() {
  const { user } = useUser()
  const auth = useAuth()
  const pathname = usePathname()
  const router = useRouter()

  const handleLogout = async () => {
    await signOut(auth)
    router.push('/')
  }

  const navLinks = [
    { href: '/types', label: 'Website Types', icon: LayoutGrid },
    { href: '/request', label: 'Request Website', icon: PlusCircle },
  ]

  return (
    <nav className="sticky top-0 z-[100] w-full border-b border-white/10 bg-background shadow-md">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 group shrink-0">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-white font-bold group-hover:scale-110 transition-transform shadow-lg shadow-primary/20">R</div>
          <span className="font-headline font-bold text-xl tracking-tight text-foreground hidden sm:inline">RIZER WEB <span className="text-primary">APP</span></span>
          <span className="font-headline font-bold text-xl tracking-tight text-foreground sm:hidden">RIZER</span>
        </Link>

        {/* Desktop Navigation Links - Hidden on small screens */}
        <div className="hidden md:flex items-center gap-6">
          {navLinks.map((link) => (
            <Link 
              key={link.href} 
              href={link.href} 
              className={cn(
                "flex items-center gap-2 text-sm font-semibold transition-all hover:text-primary relative py-1",
                pathname === link.href ? "text-primary after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-primary" : "text-muted-foreground"
              )}
            >
              <link.icon className="w-4 h-4" />
              {link.label}
            </Link>
          ))}
          <div className="h-6 w-px bg-white/10 mx-2" />
        </div>

        {/* Auth Actions - Visible on all screens, NO hamburger menu */}
        <div className="flex items-center gap-2">
          {user ? (
            <div className="flex items-center gap-2 sm:gap-4">
              <Link href="/dashboard" className="text-sm font-bold text-foreground hover:text-primary transition-colors flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                  <UserIcon className="w-4 h-4 text-primary" />
                </div>
                <span className="hidden xs:inline">{user.displayName || "Dashboard"}</span>
              </Link>
              <Button variant="ghost" size="sm" onClick={handleLogout} className="text-muted-foreground font-bold hover:text-destructive p-2 h-auto">
                <LogOut className="w-4 h-4" />
              </Button>
            </div>
          ) : (
            <div className="flex items-center gap-1 sm:gap-2">
              <Link href="/auth/login">
                <Button variant="ghost" size="sm" className="font-bold h-9 px-2 sm:px-4 text-xs sm:text-sm">Login</Button>
              </Link>
              <Link href="/auth/signup">
                <Button size="sm" className="font-bold rounded-full h-9 px-3 sm:px-6 text-xs sm:text-sm shadow-lg shadow-primary/20">Sign Up</Button>
              </Link>
            </div>
          )}
          
          <Link href="/admin" className="hidden lg:block ml-2">
            <Button variant="outline" size="icon" className="w-8 h-8 glass rounded-full border-white/10">
              <Shield className="w-4 h-4" />
            </Button>
          </Link>
        </div>
      </div>
    </nav>
  )
}
