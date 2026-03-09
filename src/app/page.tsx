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
      { id: "1", userName: "Anish Sharma", rating: 5, text: "RIZER STUDIO transformed my local shop into a global brand. The process was so easy and the UI is amazing!" },
      { id: "2", userName: "Sita Gurung", rating: 5, text: "My portfolio looks futuristic and high-end. Biplop is a true professional developer who understands design." },
      { id: "3", userName: "Rahul KC", rating: 5, text: "Unbeatable price for such a premium feel. Highly recommend the custom features and animations!" },
    ]
  }, [rawReviews, mounted])

  if (!mounted) return null;

  return (
    <div className="flex flex-col min-h-screen selection:bg-primary/30 selection:text-primary overflow-x-hidden">
      {activeAnnouncement && (
        <div className="bg-primary/95 backdrop-blur-xl text-primary-foreground py-4 px-4 text-center text-xs sm:text-sm font-black animate-fade-in sticky top-0 z-[110] border-b border-white/10 shadow-2xl">
          <div className="container mx-auto flex items-center justify-center gap-3">
            <Megaphone className="w-5 h-5 shrink-0 text-accent animate-bounce" />
            <span className="tracking-widest uppercase">{activeAnnouncement.content}</span>
          </div>
        </div>
      )}

      <Navbar />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative pt-24 pb-20 md:pt-40 md:pb-48 lg:pt-56 lg:pb-64 overflow-hidden">
          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-6xl mx-auto text-center space-y-10 md:space-y-16 animate-fade-in">
              <div className="inline-flex items-center gap-3 px-8 py-3 rounded-full bg-primary/10 border border-primary/20 text-primary text-[10px] sm:text-xs font-black uppercase tracking-[0.3em] shadow-[0_0_40px_-10px_rgba(88,88,179,0.3)] animate-float glass">
                <Sparkles className="w-4 h-4 text-accent" />
                <span>Next-Gen Web Studio Nepal 🇳🇵</span>
              </div>
              <h1 className="text-5xl sm:text-7xl md:text-9xl lg:text-[10rem] font-headline font-bold leading-[0.9] tracking-tighter text-foreground drop-shadow-2xl uppercase">
                Elevate Your <span className="text-primary italic block md:inline">Identity</span>
              </h1>
              <p className="text-lg sm:text-2xl lg:text-3xl text-muted-foreground max-w-4xl mx-auto font-body font-medium leading-relaxed opacity-80 px-6">
                Premium aesthetics, high-performance architecture, and immersive animations. We build websites that don't just exist—they inspire.
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-6 pt-8 px-6">
                <Link href="/request" className="w-full sm:w-auto">
                  <Button size="lg" className="w-full sm:min-w-[260px] h-20 md:h-24 rounded-full font-black text-2xl hover:scale-105 transition-all active:scale-95 shadow-[0_30px_60px_-15px_rgba(88,88,179,0.5)]">
                    Start Building
                  </Button>
                </Link>
                <Link href="/types" className="w-full sm:w-auto">
                  <Button size="lg" variant="outline" className="w-full sm:min-w-[260px] h-20 md:h-24 rounded-full glass border-white/20 font-black text-2xl hover:scale-105 transition-all active:scale-95 backdrop-blur-3xl">
                    View Packages
                  </Button>
                </Link>
              </div>
            </div>
          </div>
          
          {/* Animated Ambient Elements */}
          <div className="absolute top-1/4 left-0 w-[400px] md:w-[800px] h-[400px] md:h-[800px] bg-primary/10 rounded-full blur-[100px] md:blur-[180px] -translate-x-1/2 opacity-20 animate-pulse" />
          <div className="absolute bottom-1/4 right-0 w-[400px] md:w-[800px] h-[400px] md:h-[800px] bg-accent/10 rounded-full blur-[100px] md:blur-[180px] translate-x-1/2 opacity-20 animate-pulse" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.4)_100%)] pointer-events-none" />
        </section>

        {/* Features Section */}
        <section className="py-24 md:py-40 relative">
          <div className="container mx-auto px-4">
            <div className="text-center mb-20 md:mb-32 space-y-6">
              <h2 className="text-4xl md:text-7xl lg:text-8xl font-headline font-bold text-foreground uppercase">Why RIZER STUDIO?</h2>
              <p className="text-muted-foreground text-xl lg:text-3xl max-w-3xl mx-auto font-medium opacity-70">Merging high-end visual storytelling with enterprise performance.</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12">
              {[
                { icon: Zap, title: "Next.js 15 Fast", desc: "Engineered for lightning speeds and perfect 100/100 Lighthouse performance scores." },
                { icon: Globe, title: "Global UX", desc: "Our designs compete with international standards, bringing elite quality to Nepal." },
                { icon: Shield, title: "Fortified Security", desc: "Bank-level authentication and Firestore security rules built into every project." },
                { icon: Cpu, title: "AI-Powered", desc: "Leveraging custom GenAI models to help you refine your project vision and style." },
                { icon: CheckCircle2, title: "Competitive", desc: "High-end builds at prices that respect your budget without compromising quality." },
                { icon: Sparkles, title: "Cinematic UI", desc: "Advanced glassmorphism and motion graphics tailored to your brand identity." },
              ].map((feature, i) => (
                <div key={i} className="p-10 md:p-14 rounded-[3rem] glass glass-shimmer hover-lift border-white/5 group shadow-2xl transition-all">
                  <div className="w-16 h-16 rounded-2xl bg-primary/20 flex items-center justify-center text-primary mb-10 group-hover:scale-110 group-hover:bg-primary group-hover:text-white transition-all duration-700 shadow-xl">
                    <feature.icon className="w-8 h-8" />
                  </div>
                  <h3 className="text-3xl md:text-4xl font-headline font-bold mb-6 text-foreground">{feature.title}</h3>
                  <p className="text-muted-foreground leading-relaxed font-medium md:text-xl opacity-80">{feature.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section id="testimonials-section" className="py-24 md:py-40 bg-white/[0.02] relative">
          <div className="container mx-auto px-4">
            <div className="text-center mb-20 md:mb-32 space-y-6">
              <h2 className="text-4xl md:text-7xl lg:text-8xl font-headline font-bold text-foreground">Client Success</h2>
              <p className="text-muted-foreground text-xl lg:text-3xl max-w-3xl mx-auto font-medium italic opacity-70">Verified experiences from the RIZER community.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12">
              {displayReviews.map((t: any, i) => (
                <div 
                  key={t.id || i} 
                  className="p-10 md:p-14 rounded-[3rem] glass hover-lift border-white/5 group relative shadow-2xl transition-all"
                >
                  <div className="flex gap-2 mb-10">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star 
                        key={s} 
                        className={cn("w-6 h-6 transition-all", s <= (t.rating || 0) ? "fill-accent text-accent scale-110" : "text-white/10")} 
                      />
                    ))}
                  </div>
                  <p className="text-foreground/90 font-medium italic mb-12 leading-relaxed text-xl md:text-2xl">
                    "{t.text}"
                  </p>
                  <div className="flex items-center gap-6 pt-10 border-t border-white/10">
                    <div className="w-14 h-14 rounded-2xl bg-primary/20 flex items-center justify-center font-black text-primary border border-primary/20 text-xl uppercase shadow-lg">
                      {t.userName?.[0] || "?"}
                    </div>
                    <div>
                      <h4 className="font-bold text-foreground text-xl md:text-2xl">{t.userName}</h4>
                      <p className="text-[10px] text-accent font-black uppercase tracking-[0.2em] opacity-80">Verified Client</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="py-24 md:py-48 lg:py-64 px-4">
          <div className="container mx-auto max-w-7xl">
            <div className="rounded-[4rem] md:rounded-[6rem] bg-primary p-12 md:p-24 lg:p-36 text-center text-primary-foreground space-y-12 md:space-y-16 overflow-hidden relative shadow-[0_60px_120px_-30px_rgba(88,88,179,0.5)] group">
              <div className="relative z-10 max-w-5xl mx-auto space-y-10 md:space-y-14">
                <h2 className="text-5xl md:text-8xl lg:text-[10rem] font-headline font-bold leading-[0.85] tracking-tighter uppercase">Ready to Build the Future?</h2>
                <p className="text-xl md:text-3xl lg:text-4xl font-medium opacity-90 max-w-3xl mx-auto leading-relaxed px-6">Join the next generation of digital-first brands in Nepal.</p>
                <div className="pt-10">
                  <Link href="/request">
                    <Button size="lg" variant="secondary" className="w-full sm:w-auto h-24 px-16 rounded-full font-black text-3xl hover:scale-110 transition-all active:scale-95 shadow-2xl bg-white text-primary">
                      Let's Create
                      <ArrowRight className="ml-4 w-10 h-10" />
                    </Button>
                  </Link>
                </div>
              </div>
              
              {/* Decorative elements */}
              <div className="absolute top-0 right-0 w-[400px] md:w-[800px] h-[400px] md:h-[800px] bg-white/10 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2 animate-pulse" />
              <div className="absolute bottom-0 left-0 w-[400px] md:w-[800px] h-[400px] md:h-[800px] bg-accent/20 rounded-full blur-[120px] translate-y-1/2 -translate-x-1/2 animate-pulse" />
            </div>
          </div>
        </section>
      </main>
      <Footer />
      <FloatingButton />
    </div>
  )
}
