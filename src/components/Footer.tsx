
"use client"

import * as React from "react"
import Link from "next/link"
import { Phone, Mail, MapPin, MessageCircle, ShieldCheck } from "lucide-react"
import { Button } from "@/components/ui/button"

export function Footer() {
  const WHATSAPP_NUMBER = "9805602394"
  const WHATSAPP_MESSAGE = encodeURIComponent("Hello, Rizer Support. I Need Help.")
  const [year, setYear] = React.useState<number | null>(null)

  React.useEffect(() => {
    setYear(new Date().getFullYear())
  }, [])

  return (
    <footer className="border-t border-border/40 bg-background/95 backdrop-blur-md py-16">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="space-y-6">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center text-white font-bold text-lg">R</div>
              <span className="font-headline font-bold text-2xl tracking-tight text-foreground">RIZER <span className="text-primary">WEB APP</span></span>
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed font-medium">
              Empowering individuals and businesses in Nepal with world-class websites. Developed by Biplop Devkota.
            </p>
            <Link href="/admin" className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-muted-foreground hover:text-primary">
              <ShieldCheck className="w-3 h-3" />
              Admin Portal
            </Link>
          </div>
          
          <div>
            <h4 className="font-headline font-bold mb-6 text-foreground text-lg">Explore</h4>
            <ul className="space-y-4 text-sm text-muted-foreground font-medium">
              <li><Link href="/types" className="hover:text-primary">Website Types</Link></li>
              <li><Link href="/request" className="hover:text-primary">Request a Site</Link></li>
              <li><Link href="/dashboard" className="hover:text-primary">Client Dashboard</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-headline font-bold mb-6 text-foreground text-lg">Contact</h4>
            <ul className="space-y-4 text-sm text-foreground/90 font-semibold">
              <li className="flex items-center gap-3"><Phone className="w-4 h-4 text-primary" /> +977 {WHATSAPP_NUMBER}</li>
              <li className="flex items-center gap-3"><Mail className="w-4 h-4 text-primary" /> dematweb@gmail.com</li>
              <li className="flex items-center gap-3"><MapPin className="w-4 h-4 text-primary" /> Gaidakot, Nepal 🇳🇵</li>
            </ul>
          </div>

          <div className="space-y-6">
            <h4 className="font-headline font-bold text-foreground text-lg">Support</h4>
            <Link href={`https://wa.me/977${WHATSAPP_NUMBER}?text=${WHATSAPP_MESSAGE}`} target="_blank">
              <Button className="w-full rounded-full font-bold shadow-lg h-12 gap-2 bg-[#25D366] hover:bg-[#128C7E] text-white border-none">
                <MessageCircle className="w-5 h-5" />
                WhatsApp Chat
              </Button>
            </Link>
          </div>
        </div>
        
        <div className="mt-16 pt-8 border-t border-border/40 text-center">
          <p className="text-xs text-muted-foreground font-bold uppercase tracking-widest">
            © {year || "..."} RIZER WEB APP. Developed in Nepal by Biplop Devkota.
          </p>
        </div>
      </div>
    </footer>
  )
}
