
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
          className="flex items-center gap-3 group shrink-0 transition-all active:scale-95"
        >
          <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center text-white font-black text-lg shadow-lg">
            R
          </div>
          <span className="font-headline font-black text-xl tracking-tight text-foreground uppercase">
            RIZER <span className="text-primary italic">STUDIO</span>
          </span>
        </Link>

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
                "text-sm font-bold transition-all hover:text-primary py-1 flex items-center gap-2 relative",
                pathname === link.href ? "text-primary" : "text-muted-foreground"
              )}
            >
              {link.icon && <link.icon className="w-4 h-4" />}
              {link.label}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-3">
          {user ? (
            <div className="flex items-center gap-3">
              <Link href="/dashboard" className="flex items-center gap-3 p-1 pr-4 rounded-full bg-primary/5 border border-primary/10">
                <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
                  <UserIcon className="w-4 h-4 text-white" />
                </div>
                <span className="text-xs font-black uppercase tracking-widest hidden xs:inline">{user.displayName || user.email?.split('@')[0]}</span>
              </Link>
              <Button variant="ghost" size="icon" onClick={handleLogout} className="rounded-full">
                <LogOut className="w-5 h-5" />
              </Button>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Link href="/auth/login" className="hidden xs:inline">
                <Button variant="ghost" size="sm" className="font-bold text-sm">Login</Button>
              </Link>
              <Link href="/auth/signup">
                <Button size="sm" className="font-black rounded-full h-10 px-6 shadow-xl shadow-primary/20">Join Us</Button>
              </Link>
            </div>
          )}
          
          <Link href="/menu" className="md:hidden">
            <Button variant="ghost" size="icon" className="rounded-full h-10 w-10">
              <Menu className="w-6 h-6" />
            </Button>
          </Link>
        </div>
      </div>
    </nav>
  )
}
