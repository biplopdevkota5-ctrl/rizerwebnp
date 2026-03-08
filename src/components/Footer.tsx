import Link from "next/link"
import { Instagram, Github, Mail, Phone, MapPin, Twitter } from "lucide-react"

export function Footer() {
  return (
    <footer className="border-t border-border/40 bg-background/50 backdrop-blur-sm py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-6 h-6 rounded bg-primary flex items-center justify-center text-white font-bold text-xs">R</div>
              <span className="font-headline font-bold text-xl tracking-tight text-primary">RIZERWEBNP</span>
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Empowering individuals and businesses in Nepal with world-class websites at unbeatable prices. Developed by Biplop Devkota.
            </p>
          </div>
          
          <div>
            <h4 className="font-headline font-semibold mb-4 text-foreground">Explore</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="/types" className="hover:text-primary transition-colors">Website Types</Link></li>
              <li><Link href="/request" className="hover:text-primary transition-colors">Request a Site</Link></li>
              <li><Link href="/#faq" className="hover:text-primary transition-colors">FAQ</Link></li>
              <li><Link href="/#pricing" className="hover:text-primary transition-colors">Pricing</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-headline font-semibold mb-4 text-foreground">Contact</h4>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-primary" />
                9805602394
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-primary" />
                dematweb@gmail.com
              </li>
              <li className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-primary" />
                Gaidakot, Nepal 🇳🇵
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-headline font-semibold mb-4 text-foreground">Follow Us</h4>
            <div className="flex gap-4">
              <Link href="#" className="p-2 rounded-full bg-secondary hover:bg-primary hover:text-white transition-all">
                <Twitter className="w-4 h-4" />
              </Link>
              <Link href="#" className="p-2 rounded-full bg-secondary hover:bg-primary hover:text-white transition-all">
                <Instagram className="w-4 h-4" />
              </Link>
              <Link href="#" className="p-2 rounded-full bg-secondary hover:bg-primary hover:text-white transition-all">
                <Github className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
        
        <div className="mt-12 pt-8 border-t border-border/40 text-center text-xs text-muted-foreground">
          <p>© {new Date().getFullYear()} RIZERWEBNP. All rights reserved. Developed with ❤️ in Nepal by Biplop Devkota.</p>
        </div>
      </div>
    </footer>
  )
}
