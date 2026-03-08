import Link from "next/link"
import { Instagram, Github, Mail, Phone, MapPin, Twitter } from "lucide-react"

export function Footer() {
  return (
    <footer className="border-t border-border/40 bg-background/90 backdrop-blur-md py-16">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="space-y-6">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center text-white font-bold text-lg shadow-lg group-hover:scale-105 transition-transform">R</div>
              <span className="font-headline font-bold text-2xl tracking-tight text-primary">RIZERWEBNP</span>
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
              <li><Link href="/#faq" className="hover:text-primary transition-colors">FAQ</Link></li>
              <li><Link href="/#pricing" className="hover:text-primary transition-colors">Pricing</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-headline font-bold mb-6 text-foreground text-lg">Contact</h4>
            <ul className="space-y-4 text-sm text-foreground/90 font-semibold">
              <li className="flex items-center gap-3">
                <div className="p-2 rounded-full bg-primary/10">
                  <Phone className="w-4 h-4 text-primary" />
                </div>
                9805602394
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

          <div>
            <h4 className="font-headline font-bold mb-6 text-foreground text-lg">Follow Us</h4>
            <div className="flex gap-4">
              <Link href="#" className="p-3 rounded-full bg-secondary hover:bg-primary hover:text-white transition-all shadow-sm">
                <Twitter className="w-5 h-5" />
              </Link>
              <Link href="#" className="p-3 rounded-full bg-secondary hover:bg-primary hover:text-white transition-all shadow-sm">
                <Instagram className="w-5 h-5" />
              </Link>
              <Link href="#" className="p-3 rounded-full bg-secondary hover:bg-primary hover:text-white transition-all shadow-sm">
                <Github className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </div>
        
        <div className="mt-16 pt-8 border-t border-border/40 text-center text-xs text-muted-foreground font-bold uppercase tracking-widest">
          <p>© {new Date().getFullYear()} RIZERWEBNP. All rights reserved. Developed with ❤️ in Nepal by Biplop Devkota.</p>
        </div>
      </div>
    </footer>
  )
}
