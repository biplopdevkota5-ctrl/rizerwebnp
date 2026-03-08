"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { LayoutGrid, PlusCircle, User as UserIcon, LogOut, Menu, X, Shield, ChevronRight, MessageCircle, Info, Star } from "lucide-react"
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
    { href: '/types', label: 'Website Types', icon: LayoutGrid, desc: 'Explore our premium packages' },
    { href: '/request', label: 'Request Website', icon: PlusCircle, desc: 'Start your project today' },
  ]

  // Close mobile menu when route changes
  React.useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

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

      {/* Full Screen Mobile Navigation Portal */}
      <div className={cn(
        "fixed inset-0 z-[200] bg-background md:hidden transition-all duration-500 ease-in-out flex flex-col",
        isOpen ? "translate-x-0 opacity-100" : "translate-x-full opacity-0"
      )}>
        {/* Portal Header */}
        <div className="h-16 flex items-center justify-between px-6 border-b border-white/5 bg-background">
          <Link href="/" className="flex items-center gap-2" onClick={() => setIsOpen(false)}>
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-white font-bold">R</div>
            <span className="font-headline font-bold text-xl tracking-tight text-foreground">RIZER WEB <span className="text-primary">APP</span></span>
          </Link>
          <button 
            className="p-3 bg-white/5 text-foreground hover:bg-white/10 rounded-full transition-all" 
            onClick={() => setIsOpen(false)}
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Portal Content */}
        <div className="flex-1 overflow-y-auto px-6 py-8 space-y-10">
          {/* Navigation Links */}
          <section className="space-y-4">
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground ml-2">Main Menu</p>
            <div className="grid grid-cols-1 gap-3">
              {navLinks.map((link) => (
                <Link 
                  key={link.href} 
                  href={link.href} 
                  className={cn(
                    "flex items-center justify-between p-5 rounded-3xl transition-all border border-white/5",
                    pathname === link.href ? "bg-primary text-white shadow-xl shadow-primary/30" : "bg-white/5 hover:bg-white/10 text-foreground"
                  )}
                  onClick={() => setIsOpen(false)}
                >
                  <div className="flex items-center gap-4">
                    <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center", pathname === link.href ? "bg-white/20" : "bg-primary/10")}>
                      <link.icon className={cn("w-6 h-6", pathname === link.href ? "text-white" : "text-primary")} />
                    </div>
                    <div>
                      <p className="font-bold text-lg leading-none mb-1">{link.label}</p>
                      <p className={cn("text-xs font-medium", pathname === link.href ? "text-white/70" : "text-muted-foreground")}>{link.desc}</p>
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 opacity-50" />
                </Link>
              ))}
            </div>
          </section>

          {/* Account Section */}
          <section className="space-y-4">
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground ml-2">Account Workspace</p>
            {user ? (
              <div className="space-y-3">
                <Link href="/dashboard" className="flex items-center gap-4 p-5 rounded-3xl bg-white/5 border border-white/10 shadow-sm" onClick={() => setIsOpen(false)}>
                  <div className="w-14 h-14 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-xl border border-primary/20">
                    {user.displayName?.[0] || user.email?.[0] || "?"}
                  </div>
                  <div>
                    <p className="font-bold text-foreground text-lg leading-none mb-1">{user.displayName || "User Profile"}</p>
                    <p className="text-xs text-muted-foreground font-medium">{user.email}</p>
                  </div>
                </Link>
                <Button onClick={handleLogout} className="w-full rounded-2xl h-14 font-bold text-destructive hover:bg-destructive/10" variant="ghost">
                  <LogOut className="w-5 h-5 mr-3" />
                  Logout from Account
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-3">
                <Link href="/auth/login" className="w-full" onClick={() => setIsOpen(false)}>
                  <Button variant="outline" className="w-full h-16 rounded-3xl font-bold border-white/10 bg-white/5 text-lg">Login</Button>
                </Link>
                <Link href="/auth/signup" className="w-full" onClick={() => setIsOpen(false)}>
                  <Button className="w-full h-16 rounded-3xl font-bold shadow-xl shadow-primary/20 text-lg">Join Us</Button>
                </Link>
              </div>
            )}
          </section>

          {/* Contact & Support */}
          <section className="space-y-4">
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground ml-2">Support & Contact</p>
            <div className="grid grid-cols-1 gap-3">
              <Button 
                onClick={() => window.open('https://wa.me/9779805602394', '_blank')}
                className="w-full h-16 rounded-3xl font-black text-lg bg-[#25D366] hover:bg-[#128C7E] text-white shadow-xl shadow-green-500/20"
              >
                <MessageCircle className="w-6 h-6 mr-3" />
                WhatsApp Live Support
              </Button>
              <div className="p-5 rounded-3xl bg-white/5 border border-white/5 flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center text-accent shrink-0">
                  <Info className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-sm mb-1 uppercase tracking-wider text-foreground">Gaidakot Studio</h4>
                  <p className="text-xs text-muted-foreground leading-relaxed font-medium">
                    Professional web services by Biplop Devkota. Dedicated to delivering premium digital experiences in Nepal.
                  </p>
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* Portal Footer */}
        <div className="p-8 border-t border-white/5 bg-white/5 text-center">
          <Link href="/admin" onClick={() => setIsOpen(false)} className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-[0.3em] text-muted-foreground hover:text-primary transition-colors">
            <Shield className="w-3 h-3" />
            Admin Secure Portal
          </Link>
        </div>
      </div>
    </nav>
  )
}
