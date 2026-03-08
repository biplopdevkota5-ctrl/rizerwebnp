"use client"

import * as React from "react"
import Link from "next/link"
import { Instagram, Github, Mail, Phone, MapPin, Twitter, MessageCircle } from "lucide-react"
import { Button } from "@/components/ui/button"

export function Footer() {
  const WHATSAPP_NUMBER = "9805602394"
  const WHATSAPP_MESSAGE = encodeURIComponent("Hello, Rizer Web NP. I Need Support.")
  const [year, setYear] = React.useState<number | null>(null)

  React.useEffect(() => {
    setYear(new Date().getFullYear())
  }, [])

  return (
    <footer className="border-t border-border/40 bg-background/95 backdrop-blur-md py-16">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="space-y-6">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center text-white font-bold text-lg shadow-lg group-hover:scale-105 transition-transform">R</div>
              <span className="font-headline font-bold text-2xl tracking-tight text-primary">RIZER WEB APP</span>
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed font-medium">
              Empowering individuals and businesses in Nepal with world-class websites at unbeatable prices. Developed by Biplop Devkota in Gaidakot.
            </p>
          </div>
          
          <div>
            <h4 className="font-headline font-bold mb-6 text-foreground text-lg">Explore</h4>
            <ul className="space-y-4 text-sm text-muted-foreground font-medium">
              <li><Link href="/types" className="hover:text-primary transition-colors">Website Types</Link></li>
              <li><Link href="/request" className="hover:text-primary transition-colors">Request a Site</Link></li>
              <li><Link href="/#testimonials-section" className="hover:text-primary transition-colors">Testimonials</Link></li>
              <li><Link href="/dashboard" className="hover:text-primary transition-colors">Client Dashboard</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-headline font-bold mb-6 text-foreground text-lg">Contact</h4>
            <ul className="space-y-4 text-sm text-foreground/90 font-semibold">
              <li className="flex items-center gap-3">
                <div className="p-2 rounded-full bg-primary/10">
                  <Phone className="w-4 h-4 text-primary" />
                </div>
                +977 {WHATSAPP_NUMBER}
              </li>
              <li className="flex items-center gap-3">
                <div className="p-2 rounded-full bg-primary/10">
                  <Mail className="w-4 h-4 text-primary" />
                </div>
                dematweb@gmail.com
              </li>
              <li className="flex items-center gap-3">
                <div className="p-2 rounded-full bg-primary/10">
                  <MapPin className="w-4 h-4 text-primary" />
                </div>
                Gaidakot, Nepal 🇳🇵
              </li>
            </ul>
          </div>

          <div className="space-y-6">
            <h4 className="font-headline font-bold text-foreground text-lg">Quick Connect</h4>
            <p className="text-sm text-muted-foreground font-medium">
              Have questions? Chat with us directly on WhatsApp for instant support.
            </p>
            <Link href={`https://wa.me/977${WHATSAPP_NUMBER}?text=${WHATSAPP_MESSAGE}`} target="_blank">
              <Button className="w-full rounded-full font-bold shadow-lg h-12 gap-2 bg-[#25D366] hover:bg-[#128C7E] text-white border-none">
                <MessageCircle className="w-5 h-5" />
                Contact on WhatsApp
              </Button>
            </Link>
          </div>
        </div>
        
        <div className="mt-16 pt-8 border-t border-border/40 text-center text-xs text-muted-foreground font-bold uppercase tracking-widest">
          <p>© {year || "..."} RIZER WEB APP. All rights reserved. Developed with ❤️ in Nepal by Biplop Devkota.</p>
        </div>
      </div>
    </footer>
  )
}
