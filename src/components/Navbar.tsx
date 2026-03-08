
"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { LayoutGrid, PlusCircle, User as UserIcon, LogOut, ShieldCheck } from "lucide-react"
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
    <nav className="sticky top-0 z-[100] w-full border-b border-white/10 bg-background shadow-xl">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2 group shrink-0 transition-transform active:scale-95 cursor-pointer">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-white font-bold group-hover:scale-110 transition-transform shadow-lg shadow-primary/20">R</div>
            <span className="font-headline font-bold text-xl tracking-tight text-foreground hidden sm:inline">RIZER WEB <span className="text-primary">APP</span></span>
            <span className="font-headline font-bold text-xl tracking-tight text-foreground sm:hidden">RIZER</span>
          </Link>
        </div>

        {/* Desktop Navigation Links */}
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

        {/* Auth & Admin Actions */}
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
          
          <div className="h-6 w-px bg-white/10 mx-1 hidden xs:block" />

          {/* Admin Portal Button - Accessible to everyone with password but Shield icon for clear indication */}
          <Link href="/admin">
            <Button variant="ghost" size="icon" className="text-accent hover:text-accent/80 hover:bg-accent/10 rounded-full transition-all">
              <ShieldCheck className="w-6 h-6" />
              <span className="sr-only">Admin Portal</span>
            </Button>
          </Link>
        </div>
      </div>
    </nav>
  )
}
