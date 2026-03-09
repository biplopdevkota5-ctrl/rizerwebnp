
"use client"

import * as React from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Navbar } from "@/components/Navbar"
import { Footer } from "@/components/Footer"
import { FloatingButton } from "@/components/FloatingButton"
import { CheckCircle2, Zap, Shield, Globe, Cpu, Sparkles, Star, ArrowRight, Megaphone } from "lucide-react"
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
      { id: "1", userName: "Anish Sharma", rating: 5, text: "RIZER changed my local shop into a global brand. The process was so easy and the UI is amazing!" },
      { id: "2", userName: "Sita Gurung", rating: 5, text: "My portfolio looks futuristic and high-end. Biplop is a true professional developer." },
      { id: "3", userName: "Rahul KC", rating: 5, text: "Unbeatable price for such a premium feel. Highly recommend!" },
    ]
  }, [rawReviews, mounted])

  if (!mounted) return null;

  return (
    <div className="flex flex-col min-h-screen selection:bg-primary/30 selection:text-primary overflow-x-hidden">
      {activeAnnouncement && (
        <div className="bg-primary/95 backdrop-blur-xl text-primary-foreground py-4 px-4 text-center text-xs sm:text-sm font-black sticky top-0 z-[110] border-b border-white/10 shadow-2xl">
          <div className="container mx-auto flex items-center justify-center gap-3">
            <Megaphone className="w-5 h-5 shrink-0 text-accent" />
            <span className="tracking-widest uppercase">{activeAnnouncement.content}</span>
          </div>
        </div>
      )}

      <Navbar />
      
      <main className="flex-1">
        <section className="relative pt-24 pb-20 md:pt-40 md:pb-48 lg:pt-56 lg:pb-64 overflow-hidden">
          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-6xl mx-auto text-center space-y-10 animate-fade-in">
              <div className="inline-flex items-center gap-3 px-8 py-3 rounded-full bg-primary/10 border border-primary/20 text-primary text-[10px] sm:text-xs font-black uppercase tracking-[0.3em] glass">
                <Sparkles className="w-4 h-4 text-accent" />
                <span>Next-Gen Web Solutions Nepal 🇳🇵</span>
              </div>
              <h1 className="text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-headline font-bold leading-[0.9] tracking-tighter text-foreground drop-shadow-2xl uppercase">
                Elevate Your <span className="text-primary italic block md:inline">Identity</span>
              </h1>
              <p className="text-lg sm:text-2xl lg:text-3xl text-muted-foreground max-w-4xl mx-auto font-body font-medium leading-relaxed opacity-80 px-6">
                Premium aesthetics, high-performance architecture, and immersive design. We build websites that inspire.
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-6 pt-8 px-6">
                <Link href="/request" className="w-full sm:w-auto">
                  <Button size="lg" className="w-full sm:min-w-[260px] h-20 md:h-24 rounded-full font-black text-2xl shadow-2xl shadow-primary/30">
                    Start Building
                  </Button>
                </Link>
                <Link href="/types" className="w-full sm:w-auto">
                  <Button size="lg" variant="outline" className="w-full sm:min-w-[260px] h-20 md:h-24 rounded-full glass border-white/20 font-black text-2xl">
                    View Packages
                  </Button>
                </Link>
              </div>
            </div>
          </div>
          <div className="absolute top-1/4 left-0 w-[400px] h-[400px] bg-primary/10 rounded-full blur-[100px] -translate-x-1/2 opacity-20" />
          <div className="absolute bottom-1/4 right-0 w-[400px] h-[400px] bg-accent/10 rounded-full blur-[100px] translate-x-1/2 opacity-20" />
        </section>

        <section className="py-24 md:py-40">
          <div className="container mx-auto px-4">
            <div className="text-center mb-20 space-y-6">
              <h2 className="text-4xl md:text-7xl font-headline font-bold text-foreground uppercase">Why Choose Us?</h2>
              <p className="text-muted-foreground text-xl lg:text-3xl max-w-3xl mx-auto font-medium opacity-70">Merging high-end visual storytelling with performance.</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                { icon: Zap, title: "Ultra Fast", desc: "Engineered for lightning speeds and perfect performance scores." },
                { icon: Globe, title: "Modern UX", desc: "Designs that compete with international standards in Nepal." },
                { icon: Shield, title: "Secure", desc: "Bank-level authentication and security built into every project." },
                { icon: Cpu, title: "AI-Powered", desc: "Leveraging custom GenAI models to help refine your project vision." },
                { icon: CheckCircle2, title: "Affordable", desc: "High-end builds at prices that respect your budget." },
                { icon: Sparkles, title: "Cinematic UI", desc: "Advanced glassmorphism tailored to your brand identity." },
              ].map((feature, i) => (
                <div key={i} className="p-10 rounded-[3rem] glass hover-lift border-white/5 group shadow-2xl">
                  <div className="w-16 h-16 rounded-2xl bg-primary/20 flex items-center justify-center text-primary mb-10 group-hover:scale-110 transition-all shadow-xl">
                    <feature.icon className="w-8 h-8" />
                  </div>
                  <h3 className="text-3xl font-headline font-bold mb-6 text-foreground">{feature.title}</h3>
                  <p className="text-muted-foreground leading-relaxed font-medium md:text-xl opacity-80">{feature.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="testimonials-section" className="py-24 md:py-40 bg-white/[0.02]">
          <div className="container mx-auto px-4">
            <div className="text-center mb-20 space-y-6">
              <h2 className="text-4xl md:text-7xl font-headline font-bold text-foreground uppercase">Client Success</h2>
              <p className="text-muted-foreground text-xl lg:text-3xl max-w-3xl mx-auto font-medium italic opacity-70">Verified experiences from the RIZER community.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {displayReviews.map((t: any, i) => (
                <div key={t.id || i} className="p-10 rounded-[3rem] glass hover-lift border-white/5 shadow-2xl">
                  <div className="flex gap-2 mb-10">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star key={s} className={cn("w-6 h-6", s <= (t.rating || 0) ? "fill-accent text-accent" : "text-white/10")} />
                    ))}
                  </div>
                  <p className="text-foreground/90 font-medium italic mb-12 leading-relaxed text-xl">
                    "{t.text}"
                  </p>
                  <div className="flex items-center gap-6 pt-10 border-t border-white/10">
                    <div className="w-14 h-14 rounded-2xl bg-primary/20 flex items-center justify-center font-black text-primary border border-primary/20 text-xl uppercase shadow-lg">
                      {t.userName?.[0] || "?"}
                    </div>
                    <div>
                      <h4 className="font-bold text-foreground text-xl">{t.userName}</h4>
                      <p className="text-[10px] text-accent font-black uppercase tracking-[0.2em] opacity-80">Verified Client</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-24 md:py-48 px-4">
          <div className="container mx-auto max-w-7xl">
            <div className="rounded-[4rem] bg-primary p-12 md:p-24 text-center text-primary-foreground space-y-12 shadow-2xl group">
              <h2 className="text-5xl md:text-8xl font-headline font-bold uppercase">Ready to Build?</h2>
              <p className="text-xl md:text-3xl font-medium opacity-90 max-w-3xl mx-auto leading-relaxed">Join the next generation of digital-first brands in Nepal.</p>
              <Link href="/request" className="inline-block">
                <Button size="lg" variant="secondary" className="h-24 px-16 rounded-full font-black text-3xl shadow-2xl bg-white text-primary">
                  Let's Create
                  <ArrowRight className="ml-4 w-10 h-10" />
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
      <FloatingButton />
    </div>
  )
}
