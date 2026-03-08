"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { LayoutGrid, PlusCircle, User as UserIcon, LogOut, Menu, X, Shield, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"
import { useUser, useAuth } from "@/firebase"
import { signOut } from "firebase/auth"

export function Navbar() {
  const { user } = useUser()
  const auth = useAuth()
  const [isOpen, setIsOpen] = React.useState(false)
  const pathname = usePathname()
  const router = useRouter()

  const handleLogout = async () => {
    await signOut(auth)
    setIsOpen(false)
    router.push('/')
  }

  const navLinks = [
    { href: '/types', label: 'Website Types', icon: LayoutGrid },
    { href: '/request', label: 'Request Website', icon: PlusCircle },
  ]

  // Close mobile menu when route changes
  React.useEffect(() => {
    setIsOpen(false)
  }, [pathname])

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

        {/* Mobile Toggle */}
        <button 
          className="md:hidden p-2 text-foreground hover:bg-white/10 rounded-lg transition-colors" 
          onClick={() => setIsOpen(true)}
          aria-label="Open Menu"
        >
          <Menu className="w-6 h-6" />
        </button>
      </div>

      {/* Mobile Menu Overlay - Fully Solid Background */}
      <div className={cn(
        "fixed inset-0 z-[200] bg-background md:hidden transition-all duration-300 ease-in-out",
        isOpen ? "translate-x-0" : "translate-x-full"
      )}>
        {/* Header inside mobile menu to allow closing */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-white/10">
          <Link href="/" className="flex items-center gap-2" onClick={() => setIsOpen(false)}>
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-white font-bold">R</div>
            <span className="font-headline font-bold text-xl tracking-tight text-foreground">RIZER WEB <span className="text-primary">APP</span></span>
          </Link>
          <button 
            className="p-2 text-foreground hover:bg-white/10 rounded-lg transition-colors" 
            onClick={() => setIsOpen(false)}
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="container px-4 py-8 flex flex-col gap-8 h-[calc(100vh-4rem)] overflow-y-auto">
          <div className="space-y-4">
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground px-2">Navigation</p>
            {navLinks.map((link) => (
              <Link 
                key={link.href} 
                href={link.href} 
                className={cn(
                  "flex items-center justify-between text-xl font-bold p-5 rounded-2xl transition-all",
                  pathname === link.href ? "bg-primary text-white shadow-xl shadow-primary/30" : "bg-white/5 hover:bg-white/10 text-foreground"
                )}
                onClick={() => setIsOpen(false)}
              >
                <div className="flex items-center gap-4">
                  <link.icon className="w-6 h-6" />
                  {link.label}
                </div>
                <ChevronRight className="w-5 h-5 opacity-50" />
              </Link>
            ))}
          </div>

          <div className="mt-auto space-y-6 pb-12">
            <div className="h-px bg-white/10" />
            {user ? (
              <div className="space-y-4">
                <Link href="/dashboard" className="flex items-center gap-4 p-5 rounded-2xl bg-white/5 border border-white/10" onClick={() => setIsOpen(false)}>
                  <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center text-white font-bold text-lg">
                    {user.displayName?.[0] || user.email?.[0]}
                  </div>
                  <div>
                    <p className="font-bold text-foreground text-lg leading-none mb-1">{user.displayName || "User"}</p>
                    <p className="text-xs text-muted-foreground">Manage your requests</p>
                  </div>
                </Link>
                <Button onClick={handleLogout} className="w-full rounded-2xl h-16 font-bold text-destructive hover:bg-destructive/10" variant="ghost">
                  <LogOut className="w-5 h-5 mr-3" />
                  Logout Account
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4">
                <Link href="/auth/login" className="w-full" onClick={() => setIsOpen(false)}>
                  <Button variant="outline" className="w-full h-16 rounded-2xl font-bold border-white/20 text-lg">Login</Button>
                </Link>
                <Link href="/auth/signup" className="w-full" onClick={() => setIsOpen(false)}>
                  <Button className="w-full h-16 rounded-2xl font-bold shadow-xl shadow-primary/20 text-lg">Sign Up</Button>
                </Link>
              </div>
            )}
            <Link href="/admin" className="block w-full" onClick={() => setIsOpen(false)}>
              <Button variant="ghost" className="w-full h-12 text-muted-foreground font-medium text-xs rounded-xl">
                <Shield className="w-3 h-3 mr-2" />
                Admin Portal
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  )
}