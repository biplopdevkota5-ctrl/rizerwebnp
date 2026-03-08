
"use client"

import * as React from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { 
  LayoutGrid, 
  PlusCircle, 
  LogOut, 
  MessageCircle, 
  Info, 
  Shield, 
  ChevronRight, 
  X,
  ArrowLeft,
  ShieldCheck
} from "lucide-react"
import { useUser, useAuth } from "@/firebase"
import { signOut } from "firebase/auth"

const ADMIN_EMAILS = [
  "biplopdevkota5@gmail.com",
  "officialhyper993@gmail.com",
  "dematweb@gmail.com",
  "devp62569@gmail.com"
]

export default function MobileMenuPage() {
  const { user } = useUser()
  const auth = useAuth()
  const router = useRouter()
  const WHATSAPP_MESSAGE = encodeURIComponent("Hello, Rizer Web NP. I Need Support.")

  const isAdmin = React.useMemo(() => {
    if (!user?.email) return false;
    return ADMIN_EMAILS.some(email => email.toLowerCase() === user.email?.toLowerCase());
  }, [user])

  const handleLogout = async () => {
    await signOut(auth)
    router.push('/')
  }

  const navLinks = [
    { href: '/types', label: 'Website Types', icon: LayoutGrid, desc: 'Explore our premium packages' },
    { href: '/request', label: 'Request Website', icon: PlusCircle, desc: 'Start your project today' },
  ]

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <nav className="h-16 flex items-center justify-between px-6 border-b border-white/5 bg-background sticky top-0 z-50">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-white font-bold">R</div>
          <span className="font-headline font-bold text-xl tracking-tight text-foreground">RIZER WEB <span className="text-primary">APP</span></span>
        </Link>
        <Link href="/">
          <Button variant="ghost" size="icon" className="rounded-full hover:bg-white/10">
            <X className="w-6 h-6" />
          </Button>
        </Link>
      </nav>

      <main className="flex-1 overflow-y-auto px-6 py-8 space-y-10">
        {/* Navigation Links */}
        <section className="space-y-4">
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground ml-2">Main Menu</p>
          <div className="grid grid-cols-1 gap-3">
            {navLinks.map((link) => (
              <Link 
                key={link.href} 
                href={link.href} 
                className="flex items-center justify-between p-5 rounded-3xl transition-all border border-white/5 bg-white/5 hover:bg-white/10 text-foreground"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl flex items-center justify-center bg-primary/10">
                    <link.icon className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <p className="font-bold text-lg leading-none mb-1">{link.label}</p>
                    <p className="text-xs font-medium text-muted-foreground">{link.desc}</p>
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
              <Link href="/dashboard" className="flex items-center gap-4 p-5 rounded-3xl bg-white/5 border border-white/10 shadow-sm">
                <div className="w-14 h-14 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-xl border border-primary/20">
                  {user.displayName?.[0] || user.email?.[0] || "?"}
                </div>
                <div>
                  <p className="font-bold text-foreground text-lg leading-none mb-1">{user.displayName || "User Profile"}</p>
                  <p className="text-xs text-muted-foreground font-medium">{user.email}</p>
                </div>
              </Link>
              
              {isAdmin && (
                <Link href="/admin">
                  <Button className="w-full rounded-2xl h-14 font-black bg-accent/20 text-accent hover:bg-accent/30 border border-accent/20" variant="ghost">
                    <ShieldCheck className="w-5 h-5 mr-3" />
                    Enter Admin Portal
                  </Button>
                </Link>
              )}

              <Button onClick={handleLogout} className="w-full rounded-2xl h-14 font-bold text-destructive hover:bg-destructive/10" variant="ghost">
                <LogOut className="w-5 h-5 mr-3" />
                Logout from Account
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3">
              <Link href="/auth/login" className="w-full">
                <Button variant="outline" className="w-full h-16 rounded-3xl font-bold border-white/10 bg-white/5 text-lg">Login</Button>
              </Link>
              <Link href="/auth/signup" className="w-full">
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
              onClick={() => window.open(`https://wa.me/9779805602394?text=${WHATSAPP_MESSAGE}`, '_blank')}
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

        <div className="pt-8 pb-12 text-center">
          <p className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-[0.3em] text-muted-foreground">
            <Shield className="w-3 h-3" />
            Secure Platform
          </p>
        </div>
      </main>
      
      <div className="p-6 border-t border-white/5">
        <Button variant="ghost" className="w-full text-muted-foreground" onClick={() => router.back()}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Go Back
        </Button>
      </div>
    </div>
  )
}
