"use client"

import * as React from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Navbar } from "@/components/Navbar"
import { Footer } from "@/components/Footer"
import { FloatingButton } from "@/components/FloatingButton"
import { CheckCircle2, Zap, Shield, Globe, Cpu, Sparkles, Star, ArrowRight, RefreshCw, Megaphone } from "lucide-react"
import { cn } from "@/lib/utils"
import { useFirestore, useCollection, useMemoFirebase } from "@/firebase"
import { collection, query, limit, where, orderBy } from "firebase/firestore"

export default function Home() {
  const [mounted, setMounted] = React.useState(false)
  const db = useFirestore()

  React.useEffect(() => {
    setMounted(true)
  }, [])
  
  const announcementsQuery = useMemoFirebase(() => {
    if (!db || !mounted) return null
    return query(collection(db, "announcements"), orderBy("createdAt", "desc"), limit(5))
  }, [db, mounted])
  const { data: announcementsData } = useCollection(announcementsQuery)
  
  const activeAnnouncement = React.useMemo(() => {
    return announcementsData?.find(a => a.isActive)
  }, [announcementsData])

  const reviewsQuery = useMemoFirebase(() => {
    if (!db || !mounted) return null
    return query(collection(db, "reviews"), where("status", "==", "approved"), limit(6))
  }, [db, mounted])
  const { data: rawReviews } = useCollection(reviewsQuery)

  const displayReviews = React.useMemo(() => {
    if (!mounted) return []
    if (rawReviews && rawReviews.length > 0) return rawReviews
    
    return [
      { id: "1", userName: "Anish Sharma", rating: 5, text: "RIZERWEBNP transformed my local shop into a global brand. The process was so easy and the UI is amazing!" },
      { id: "2", userName: "Sita Gurung", rating: 5, text: "My portfolio looks futuristic and high-end. Biplop is a true professional developer who understands design." },
      { id: "3", userName: "Rahul KC", rating: 5, text: "Unbeatable price for such a premium feel. Highly recommend the custom features and animations!" },
    ]
  }, [rawReviews, mounted])

  if (!mounted) return null;

  return (
    <div className="flex flex-col min-h-screen selection:bg-primary/30 selection:text-primary overflow-x-hidden">
      {activeAnnouncement && (
        <div className="bg-primary text-primary-foreground py-4 px-4 text-center text-xs sm:text-sm font-black animate-fade-in sticky top-0 z-[110] border-b border-white/10 shadow-2xl">
          <div className="container mx-auto flex items-center justify-center gap-3">
            <Megaphone className="w-5 h-5 shrink-0 text-accent animate-bounce" />
            <span className="tracking-tight uppercase">{activeAnnouncement.content}</span>
          </div>
        </div>
      )}

      <Navbar />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative pt-16 pb-20 md:pt-32 md:pb-40 overflow-hidden">
          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-4xl mx-auto text-center space-y-8 animate-fade-in">
              <div className="inline-flex items-center gap-2 px-6 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-[10px] sm:text-xs font-black uppercase tracking-[0.2em] shadow-xl animate-float">
                <Sparkles className="w-4 h-4 text-accent" />
                <span>Modern Web Development for Nepal 🇳🇵</span>
              </div>
              <h1 className="text-5xl sm:text-6xl md:text-8xl font-headline font-bold leading-[1] tracking-tighter text-foreground">
                Create Your <span className="text-primary italic animate-pulse">Dream Web</span> at Cheap Price
              </h1>
              <p className="text-lg sm:text-2xl text-muted-foreground max-w-2xl mx-auto font-body font-medium leading-relaxed opacity-80">
                Premium quality designs, glassmorphism effects, and ultra-smooth animations. Get your professional website today.
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-5 pt-6">
                <Link href="/request" className="w-full sm:w-auto">
                  <Button size="lg" className="w-full h-16 rounded-full font-black text-xl hover:scale-105 transition-all active:scale-95 shadow-2xl shadow-primary/40">
                    Request Website
                  </Button>
                </Link>
                <Link href="/types" className="w-full sm:w-auto">
                  <Button size="lg" variant="outline" className="w-full h-16 rounded-full glass border-white/20 font-black text-xl hover:scale-105 transition-all active:scale-95 backdrop-blur-3xl">
                    View Packages
                  </Button>
                </Link>
              </div>
            </div>
          </div>
          
          {/* Animated Ambient Background */}
          <div className="absolute top-1/4 left-0 w-[500px] h-[500px] bg-primary/20 rounded-full blur-[120px] -translate-x-1/2 opacity-30 animate-pulse" />
          <div className="absolute bottom-1/4 right-0 w-[500px] h-[500px] bg-accent/20 rounded-full blur-[120px] translate-x-1/2 opacity-30 animate-pulse" />
        </section>

        {/* Features Section */}
        <section className="py-24 md:py-32 bg-black/5 relative">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16 md:mb-24 space-y-4">
              <h2 className="text-4xl md:text-6xl font-headline font-bold text-foreground">Why RIZERWEBNP?</h2>
              <p className="text-muted-foreground text-xl max-w-2xl mx-auto font-medium">We merge high-end visual aesthetics with industry-standard performance.</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                { icon: Zap, title: "Ultra Fast", desc: "Built with Next.js 15 for lightning-fast performance and perfect SEO scores." },
                { icon: Globe, title: "Global UX", desc: "Websites that compete with international standards in design and usability." },
                { icon: Shield, title: "Secure Code", desc: "Enterprise-grade security rules and authentication for every single project." },
                { icon: Cpu, title: "AI Enhanced", desc: "Using advanced AI tools to help you visualize and design your project better." },
                { icon: CheckCircle2, title: "Affordable", desc: "Professional web builds starting at prices that fit your budget." },
                { icon: Sparkles, title: "Glass UI", desc: "Modern Glassmorphism and animations tailored to your brand identity." },
              ].map((feature, i) => (
                <div key={i} className="p-10 rounded-[2.5rem] glass glass-shimmer hover-lift border-white/5 group shadow-2xl">
                  <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary mb-8 group-hover:scale-110 group-hover:bg-primary group-hover:text-white transition-all duration-500">
                    <feature.icon className="w-7 h-7" />
                  </div>
                  <h3 className="text-2xl font-headline font-bold mb-4 text-foreground">{feature.title}</h3>
                  <p className="text-muted-foreground leading-relaxed font-medium">{feature.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section id="testimonials-section" className="py-24 md:py-32 relative">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16 md:mb-24 space-y-4">
              <h2 className="text-4xl md:text-6xl font-headline font-bold text-foreground">Trusted by Clients</h2>
              <p className="text-muted-foreground text-xl max-w-2xl mx-auto font-medium italic">Real experiences from those who built with Rizer Studio.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {displayReviews.map((t: any, i) => (
                <div 
                  key={t.id || i} 
                  className="p-10 rounded-[2.5rem] glass hover-lift border-white/5 group relative shadow-2xl"
                >
                  <div className="flex gap-1 mb-8">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star 
                        key={s} 
                        className={cn("w-5 h-5 transition-all", s <= (t.rating || 0) ? "fill-accent text-accent scale-110" : "text-white/10")} 
                      />
                    ))}
                  </div>
                  <p className="text-foreground/90 font-medium italic mb-10 leading-relaxed text-xl">
                    "{t.text}"
                  </p>
                  <div className="flex items-center gap-5 pt-8 border-t border-white/10">
                    <div className="w-12 h-12 rounded-2xl bg-primary/20 flex items-center justify-center font-black text-primary border border-primary/20 text-lg uppercase">
                      {t.userName?.[0] || "?"}
                    </div>
                    <div>
                      <h4 className="font-bold text-foreground text-lg">{t.userName}</h4>
                      <p className="text-xs text-accent font-black uppercase tracking-widest">Verified Client</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="py-24 md:py-40">
          <div className="container mx-auto px-4">
            <div className="rounded-[3rem] bg-primary p-12 md:p-24 text-center text-primary-foreground space-y-10 overflow-hidden relative shadow-[0_48px_96px_-24px_rgba(88,88,179,0.5)] group">
              <div className="relative z-10 max-w-3xl mx-auto space-y-8">
                <h2 className="text-4xl md:text-7xl font-headline font-bold leading-tight tracking-tighter">Ready to Launch Your Digital Home?</h2>
                <p className="text-xl md:text-2xl font-medium opacity-90 max-w-2xl mx-auto leading-relaxed">Join the next generation of businesses in Nepal with a high-performance custom website.</p>
                <div className="pt-8">
                  <Link href="/request">
                    <Button size="lg" variant="secondary" className="h-20 px-14 rounded-full font-black text-2xl hover:scale-110 transition-all active:scale-95 shadow-3xl bg-white text-primary">
                      Build My Website Now
                      <ArrowRight className="ml-3 w-7 h-7" />
                    </Button>
                  </Link>
                </div>
              </div>
              
              {/* Decorative elements */}
              <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-white/10 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2" />
              <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-accent/20 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/2" />
            </div>
          </div>
        </section>
      </main>
      <Footer />
      <FloatingButton />
    </div>
  )
}