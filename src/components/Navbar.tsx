"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { LayoutGrid, PlusCircle, User as UserIcon, LogOut, Menu, Shield } from "lucide-react"
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
    <nav className="sticky top-0 z-[100] w-full border-b border-white/10 bg-background/80 backdrop-blur-xl">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-white font-bold group-hover:scale-110 transition-transform shadow-lg shadow-primary/20">R</div>
          <span className="font-headline font-bold text-xl tracking-tight text-foreground">RIZER WEB <span className="text-primary">APP</span></span>
        </Link>

        {/* Desktop Links */}
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
          {user ? (
            <div className="flex items-center gap-4">
              <Link href="/dashboard" className="text-sm font-bold text-foreground hover:text-primary transition-colors flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                  <UserIcon className="w-4 h-4 text-primary" />
                </div>
                <span className="hidden lg:inline">{user.displayName || "Dashboard"}</span>
              </Link>
              <Button variant="ghost" size="sm" onClick={handleLogout} className="text-muted-foreground font-bold hover:text-destructive">
                <LogOut className="w-4 h-4" />
              </Button>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Link href="/auth/login">
                <Button variant="ghost" size="sm" className="font-bold">Login</Button>
              </Link>
              <Link href="/auth/signup">
                <Button size="sm" className="font-bold rounded-full px-5 shadow-lg shadow-primary/20">Get Started</Button>
              </Link>
            </div>
          )}
          <Link href="/admin">
            <Button variant="outline" size="icon" className="w-8 h-8 glass rounded-full border-white/10 ml-2">
              <Shield className="w-4 h-4" />
            </Button>
          </Link>
        </div>

        {/* Mobile Toggle - Now links to the Menu Page */}
        <Link href="/menu" className="md:hidden">
          <Button variant="ghost" size="icon" className="p-2 text-foreground hover:bg-white/10 rounded-lg transition-colors">
            <Menu className="w-6 h-6" />
          </Button>
        </Link>
      </div>
    </nav>
  )
}
