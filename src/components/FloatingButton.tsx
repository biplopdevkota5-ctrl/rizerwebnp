
"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { ArrowUp, LayoutGrid, MessageCircle } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"

export function FloatingButton() {
  const pathname = usePathname()
  const [showScroll, setShowScroll] = React.useState(false)

  const WHATSAPP_NUMBER = "9805602394"
  const WHATSAPP_MESSAGE = encodeURIComponent("Hello, Rizer Web NP. I Need Support.")

  React.useEffect(() => {
    const handleScroll = () => {
      setShowScroll(window.scrollY > 400)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const openWhatsApp = () => {
    window.open(`https://wa.me/977${WHATSAPP_NUMBER}?text=${WHATSAPP_MESSAGE}`, '_blank')
  }

  return (
    <div className="fixed bottom-6 right-6 z-[60] flex flex-col items-end gap-4 pointer-events-none">
      {/* WhatsApp Support Button */}
      <div className="flex items-center gap-3 pointer-events-auto animate-float">
        <div className="bg-white/10 backdrop-blur-xl border border-white/10 px-4 py-2 rounded-2xl shadow-2xl hidden md:block">
          <p className="text-[10px] font-black uppercase tracking-widest text-white/80">Get Faster Support</p>
        </div>
        <Button 
          onClick={openWhatsApp}
          className="group relative h-14 px-6 rounded-2xl bg-[#25D366] hover:bg-[#128C7E] text-white shadow-[0_20px_40px_-10px_rgba(37,211,102,0.4)] border-none hover:scale-105 transition-all duration-300"
        >
          <div className="absolute inset-0 rounded-2xl bg-[#25D366] animate-ping opacity-20 group-hover:hidden" />
          <MessageCircle className="w-6 h-6 mr-2" />
          <span className="font-black text-sm uppercase tracking-tighter">Support</span>
        </Button>
      </div>

      <div className="flex flex-col gap-3 pointer-events-auto">
        {pathname !== '/' && (
          <Link href="/">
            <Button 
              size="icon" 
              className="rounded-xl w-12 h-12 shadow-2xl bg-primary hover:bg-primary/90 hover:scale-110 transition-transform"
              title="Back to Home"
            >
              <LayoutGrid className="w-5 h-5" />
            </Button>
          </Link>
        )}
        
        {showScroll && (
          <Button 
            size="icon" 
            variant="secondary" 
            className="rounded-xl w-12 h-12 shadow-2xl glass hover:scale-110 transition-transform animate-fade-in"
            onClick={scrollToTop}
            title="Scroll to Top"
          >
            <ArrowUp className="w-5 h-5" />
          </Button>
        )}
      </div>
    </div>
  )
}
