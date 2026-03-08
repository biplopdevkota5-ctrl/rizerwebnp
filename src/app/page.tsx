"use client"

import * as React from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Navbar } from "@/components/Navbar"
import { Footer } from "@/components/Footer"
import { FloatingButton } from "@/components/FloatingButton"
import { CheckCircle2, Zap, Shield, Globe, Cpu, Sparkles, Star, Megaphone, ArrowRight, RefreshCw } from "lucide-react"
import { cn } from "@/lib/utils"
import { useFirestore, useCollection, useMemoFirebase } from "@/firebase"
import { collection, query, where, orderBy, limit } from "firebase/firestore"

export default function Home() {
  const [mounted, setMounted] = React.useState(false)
  const db = useFirestore()

  React.useEffect(() => {
    setMounted(true)
  }, [])
  
  // Fetch Announcements - Public Read
  const announcementsQuery = useMemoFirebase(() => {
    if (!db) return null
    return query(
      collection(db, "announcements"), 
      where("isActive", "==", true), 
      orderBy("createdAt", "desc"), 
      limit(1)
    )
  }, [db])
  const { data: announcements } = useCollection(announcementsQuery)

  // Fetch Approved Reviews - Public Read
  const reviewsQuery = useMemoFirebase(() => {
    if (!db) return null
    return query(
      collection(db, "reviews"), 
      where("status", "==", "approved"), 
      orderBy("createdAt", "desc"), 
      limit(6)
    )
  }, [db])
  const { data: reviews } = useCollection(reviewsQuery)

  const defaultTestimonials = [
    { userName: "Anish Sharma", rating: 5, text: "RIZERWEBNP transformed my local shop into a global brand. The process was so easy and the UI is amazing!" },
    { userName: "Sita Gurung", rating: 5, text: "My portfolio looks futuristic and high-end. Biplop is a true professional developer who understands design." },
    { userName: "Rahul KC", rating: 5, text: "Unbeatable price for such a premium feel. Highly recommend the custom features and animations!" },
  ]

  const displayReviews = reviews?.length ? reviews : defaultTestimonials

  // Prevent hydration mismatch and premature execution
  if (!mounted) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background">
        <RefreshCw className="w-10 h-10 animate-spin text-primary opacity-20" />
      </div>
    )
  }

  return (
    <div className="flex flex-col min-h-screen selection:bg-primary/30 selection:text-primary overflow-x-hidden">
      <Navbar />
      
      {/* Announcement Banner */}
      {announcements?.[0] && (
        <div className="bg-primary/20 backdrop-blur-md border-b border-primary/30 py-3 text-center animate-fade-in relative z-50">
          <div className="container mx-auto px-4 flex items-center justify-center gap-2">
            <Megaphone className="w-4 h-4 text-primary animate-bounce shrink-0" />
            <span className="text-xs sm:text-sm font-bold text-foreground">
              {announcements[0].content}
            </span>
          </div>
        </div>
      )}

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative pt-16 pb-20 md:pt-24 md:pb-32 overflow-hidden">
          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-4xl mx-auto text-center space-y-6 md:space-y-8 animate-fade-in">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-[10px] sm:text-xs font-black uppercase tracking-widest">
                <Sparkles className="w-3 h-3 sm:w-4 h-4" />
                <span>Modern Web Development for Nepal 🇳🇵</span>
              </div>
              <h1 className="text-4xl sm:text-5xl md:text-7xl font-headline font-bold leading-[1.1] tracking-tighter text-foreground">
                Create Your <span className="text-primary italic">Dream Website</span> at Cheap Price
              </h1>
              <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto font-body font-medium leading-relaxed">
                Premium quality designs, glassmorphism effects, and ultra-smooth animations. Get your professional website today without breaking the bank.
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-4 pt-4">
                <Link href="/request" className="w-full sm:w-auto">
                  <Button size="lg" className="w-full sm:h-14 sm:px-8 text-lg rounded-full font-bold shadow-2xl shadow-primary/30 hover:scale-105 transition-all">
                    Request Website
                  </Button>
                </Link>
                <Link href="/types" className="w-full sm:w-auto">
                  <Button size="lg" variant="outline" className="w-full sm:h-14 sm:px-8 text-lg rounded-full glass border-white/10 font-bold hover:scale-105 transition-all">
                    View Website Types
                  </Button>
                </Link>
              </div>
            </div>
          </div>
          
          <div className="absolute top-1/2 left-0 w-64 h-64 md:w-96 md:h-96 bg-primary/20 rounded-full blur-[80px] md:blur-[120px] -translate-y-1/2 -translate-x-1/2 opacity-50" />
          <div className="absolute bottom-0 right-0 w-64 h-64 md:w-96 md:h-96 bg-accent/20 rounded-full blur-[80px] md:blur-[120px] translate-x-1/4 opacity-50" />
        </section>

        {/* Features Section */}
        <section className="py-20 md:py-24 bg-black/20">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12 md:mb-16 space-y-4">
              <h2 className="text-3xl md:text-5xl font-headline font-bold text-foreground">Why Choose RIZERWEBNP?</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto font-medium">We combine cutting-edge technology with affordable pricing to deliver websites that stand out.</p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {[
                { icon: Zap, title: "Lightning Fast", desc: "Optimized for speed and SEO to ensure your business loads instantly on any device." },
                { icon: Globe, title: "Global Standard", desc: "Designs that compete on a world-class level with modern UI and smooth UX." },
                { icon: Shield, title: "Secure & Reliable", desc: "Your data is safe with us. We use the latest security practices for every build." },
                { icon: Cpu, title: "AI-Powered", desc: "We use AI design tools to refine your vision into a stunning digital reality." },
                { icon: CheckCircle2, title: "Affordable", desc: "Starting at just $29, we have a plan for every budget and requirement." },
                { icon: Sparkles, title: "Custom Effects", desc: "Glassmorphism, parallax, and custom animations tailored to your brand." },
              ].map((feature, i) => (
                <div key={i} className="p-8 rounded-3xl glass border-white/5 hover:border-primary/50 transition-all group shadow-xl">
                  <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary mb-6 group-hover:scale-110 transition-transform">
                    <feature.icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-headline font-bold mb-3 text-foreground">{feature.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed font-medium">{feature.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section id="testimonials-section" className="py-20 md:py-24 relative overflow-hidden">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12 md:mb-16 space-y-4">
              <h2 className="text-3xl md:text-5xl font-headline font-bold text-foreground">What Our Clients Say</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto font-medium italic">Verified reviews from satisfied clients.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {displayReviews.map((t, i) => (
                <div 
                  key={i} 
                  className={cn(
                    "p-8 rounded-3xl glass border border-white/5 hover:border-primary/50 transition-all duration-500 group relative",
                    i % 2 === 0 ? "md:animate-float" : "md:animate-float-slow"
                  )}
                >
                  <div className="flex gap-1 mb-6">
                    {[1, 2, 3, 4, 5].map((starVal) => {
                      const isFull = starVal <= (t.rating || 0);
                      return (
                        <Star 
                          key={starVal} 
                          className={cn(
                            "w-4 h-4",
                            isFull ? "fill-accent text-accent" : "text-white/20"
                          )} 
                        />
                      )
                    })}
                    <span className="ml-2 text-xs font-black text-accent tracking-tighter">{t.rating} / 5</span>
                  </div>
                  
                  <p className="text-foreground/90 font-medium italic mb-8 leading-relaxed text-lg">
                    "{t.text}"
                  </p>
                  
                  <div className="flex items-center gap-4 pt-6 border-t border-white/10">
                    <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center font-bold text-primary text-sm border border-primary/30 uppercase">
                      {t.userName?.[0] || "?"}
                    </div>
                    <div>
                      <h4 className="font-bold text-foreground text-sm">{t.userName}</h4>
                      <p className="text-[10px] text-muted-foreground font-black uppercase tracking-[0.1em]">Verified Client</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 md:py-24">
          <div className="container mx-auto px-4">
            <div className="rounded-[2.5rem] bg-primary p-10 md:p-16 text-center text-primary-foreground space-y-8 overflow-hidden relative shadow-[0_32px_64px_-16px_rgba(88,88,179,0.5)]">
              <div className="relative z-10 max-w-2xl mx-auto">
                <h2 className="text-3xl md:text-5xl lg:text-6xl font-headline font-bold leading-tight">Ready to Start Your Project?</h2>
                <p className="text-base md:text-lg font-medium opacity-90">Submit your requirements and get a professional response within 24 hours.</p>
                <div className="pt-6">
                  <Link href="/request">
                    <Button size="lg" variant="secondary" className="h-14 px-10 rounded-full font-black text-lg hover:scale-105 transition-all shadow-2xl">
                      Launch My Website Now
                      <ArrowRight className="ml-2 w-5 h-5" />
                    </Button>
                  </Link>
                </div>
              </div>
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-accent/20 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
            </div>
          </div>
        </section>
      </main>

      <Footer />
      <FloatingButton />
    </div>
  )
}
