
"use client"

import * as React from "react"
import Link from "next/link"
import { Navbar } from "@/components/Navbar"
import { Footer } from "@/components/Footer"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { WEBSITE_TYPES } from "@/lib/types"
import { Check, Sparkles, ArrowRight, Shield, Globe, Award, Users, Percent } from "lucide-react"
import { useFirestore, useCollection, useMemoFirebase } from "@/firebase"
import { collection } from "firebase/firestore"

export default function WebsiteTypesPage() {
  const db = useFirestore()
  
  const adjQuery = useMemoFirebase(() => 
    db ? collection(db, "website_adjustments") : null, 
    [db]
  )
  const { data: adjustments } = useCollection(adjQuery)

  const getPriceDisplay = (type: typeof WEBSITE_TYPES[0]) => {
    const adj = adjustments?.find(a => a.id === type.id)
    
    if (!adj || !adj.isActive || !adj.discountPercentage) {
      return (
        <span className="text-foreground font-black text-xl md:text-2xl">{type.price}</span>
      )
    }

    if (type.id === 'custom' || !type.price.includes('$')) {
      return <span className="text-foreground font-black text-xl md:text-2xl">{type.price}</span>
    }
    
    const parts = type.price.match(/\$(\d+)/)
    if (!parts) return <span className="text-foreground font-black text-xl md:text-2xl">{type.price}</span>

    const originalVal = parseInt(parts[1])
    const discountedVal = Math.floor(originalVal * (1 - adj.discountPercentage / 100))
    
    return (
      <div className="flex flex-col items-end">
        <span className="text-[10px] md:text-xs text-muted-foreground line-through font-bold opacity-60">{type.price}</span>
        <span className="text-accent font-black text-xl md:text-3xl">${discountedVal}+</span>
      </div>
    )
  }

  const getTag = (typeId: string) => {
    const adj = adjustments?.find(a => a.id === typeId)
    if (!adj || !adj.isActive) return null
    return adj.customTag || `${adj.discountPercentage}% OFF`
  }

  return (
    <div className="min-h-screen flex flex-col selection:bg-primary/30 selection:text-primary overflow-x-hidden">
      <Navbar />
      <main className="flex-1 py-12 md:py-24 lg:py-32 relative">
        <div className="absolute top-0 left-0 w-full h-[600px] bg-gradient-to-b from-primary/10 to-transparent -z-10" />
        
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="max-w-5xl mx-auto text-center mb-16 md:mb-28 space-y-8 md:space-y-10">
            <div className="inline-flex items-center gap-2 px-6 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-[10px] sm:text-xs font-black uppercase tracking-[0.2em] animate-fade-in shadow-xl">
              <Sparkles className="w-4 h-4" />
              <span>Tailored Digital Solutions</span>
            </div>
            <h1 className="text-5xl sm:text-6xl md:text-8xl lg:text-9xl font-headline font-bold tracking-tighter text-foreground leading-[1] md:leading-[1.1]">
              Website <span className="text-primary italic">Solutions</span>
            </h1>
            <p className="text-muted-foreground text-lg sm:text-xl md:text-2xl max-w-3xl mx-auto font-medium leading-relaxed px-4">
              Explore our premium website categories tailored for every vision. High performance, mobile-first design, and cutting-edge aesthetics as standard.
            </p>
          </div>

          <section className="mb-24 md:mb-40 lg:mb-52">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 md:gap-20 lg:gap-32 items-center">
              <div className="space-y-8 order-2 lg:order-1">
                <h2 className="text-4xl md:text-6xl font-headline font-bold text-foreground tracking-tight">About RIZER STUDIO</h2>
                <div className="space-y-6">
                  <p className="text-lg md:text-2xl text-foreground/90 leading-relaxed font-semibold">
                    Founded by <span className="text-primary font-black uppercase tracking-tight">Biplop Devkota</span>, RIZERWEBNP is a dedicated high-end web development studio based in <span className="text-foreground font-black">Gaidakot, Nepal</span>.
                  </p>
                  <p className="text-base sm:text-lg md:text-xl text-muted-foreground leading-relaxed font-medium">
                    We believe that professional digital presence shouldn't be a luxury. Our mission is to empower local businesses, creators, and entrepreneurs with world-class websites that utilize modern technologies like Glassmorphism, smooth animations, and ultra-fast performance.
                  </p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6 pt-6">
                  {[
                    { icon: Shield, label: "Secure Architecture" },
                    { icon: Globe, label: "Global UX Standards" },
                    { icon: Award, label: "Premium UI/UX Design" },
                    { icon: Users, label: "Client-First Support" }
                  ].map((item, idx) => (
                    <div key={idx} className="flex items-center gap-4 p-4 md:p-6 rounded-2xl md:rounded-3xl glass border-white/5 shadow-xl hover-lift">
                      <div className="p-3 rounded-xl bg-primary/20 text-primary shrink-0 shadow-inner">
                        <item.icon className="w-5 h-5 md:w-6 md:h-6" />
                      </div>
                      <span className="font-black text-[12px] md:text-[14px] text-foreground uppercase tracking-widest">{item.label}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="glass p-10 md:p-16 lg:p-20 rounded-[3rem] md:rounded-[4rem] border-white/10 space-y-8 relative overflow-hidden order-1 lg:order-2 shadow-2xl">
                <div className="relative z-10">
                  <h3 className="text-3xl md:text-4xl font-headline font-bold mb-6 text-foreground">Our Vision</h3>
                  <p className="text-foreground/90 italic text-xl md:text-3xl lg:text-4xl leading-relaxed font-medium tracking-tight">
                    "We don't just build websites; we create digital homes for your ideas. Our goal is to make Nepal a hub for cutting-edge web design by providing accessible yet high-end services."
                  </p>
                  <div className="mt-12 flex items-center gap-6 border-t border-white/10 pt-10">
                    <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-primary flex items-center justify-center text-white font-black shadow-[0_10px_30px_rgba(88,88,179,0.5)] text-xl md:text-2xl">BD</div>
                    <div>
                      <p className="font-bold text-foreground text-xl md:text-2xl leading-none mb-1">Biplop Devkota</p>
                      <p className="text-[11px] md:text-[13px] text-muted-foreground font-black uppercase tracking-[0.3em] opacity-70">Founder & Lead Developer</p>
                    </div>
                  </div>
                </div>
                <div className="absolute -top-20 -right-20 w-80 h-80 bg-primary/20 rounded-full blur-[100px] opacity-50" />
              </div>
            </div>
          </section>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8 lg:gap-10">
            {WEBSITE_TYPES.map((type) => {
              const tag = getTag(type.id)
              return (
                <Card key={type.id} className="group glass border-white/10 hover:border-primary/50 transition-all duration-500 flex flex-col h-full rounded-[2rem] overflow-hidden shadow-xl hover:shadow-2xl">
                  <CardHeader className="pb-6 p-8">
                    <div className="flex justify-between items-start mb-6">
                      <Badge variant="outline" className="text-primary border-primary/40 font-black text-[10px] uppercase tracking-widest bg-primary/5 px-4 h-7">
                        Package
                      </Badge>
                      <div className="text-right">
                        {getPriceDisplay(type)}
                      </div>
                    </div>
                    <CardTitle className="font-headline font-bold text-2xl md:text-3xl group-hover:text-primary transition-colors text-foreground flex items-center flex-wrap gap-2">
                      {type.label}
                      {tag && (
                        <Badge className="bg-accent text-white animate-pulse text-[10px] font-black h-6 rounded-lg px-3 border-none shadow-lg shadow-accent/20">
                          {tag}
                        </Badge>
                      )}
                    </CardTitle>
                  </CardHeader>

                  <CardContent className="flex-1 space-y-6 px-8">
                    <div className="space-y-4 pt-4">
                      {type.features?.map((feature: string, i: number) => (
                        <div key={i} className="flex items-center gap-4 text-sm md:text-base text-foreground/80 font-semibold">
                          <Check className="w-5 h-5 text-accent shrink-0" />
                          <span>{feature}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>

                  <CardFooter className="pt-10 pb-10 px-8">
                    <Link href={`/request?type=${type.id}`} className="w-full">
                      <Button variant="outline" className="w-full rounded-2xl h-14 text-base font-bold glass border-white/10 group-hover:bg-primary group-hover:text-white group-hover:border-primary transition-all shadow-lg active:scale-95">
                        Request Quote
                        <ArrowRight className="w-5 h-5 ml-2" />
                      </Button>
                    </Link>
                  </CardFooter>
                </Card>
              )
            })}
          </div>
          
          <div className="mt-24 md:mt-40 lg:mt-52 text-center p-12 md:p-24 lg:p-32 rounded-[3rem] md:rounded-[4rem] glass border-white/10 relative overflow-hidden shadow-2xl">
            <div className="relative z-10 space-y-10 md:space-y-12">
              <h2 className="text-4xl md:text-6xl lg:text-7xl font-headline font-bold text-foreground tracking-tight leading-tight">Need something <span className="text-primary italic">bespoke?</span></h2>
              <p className="text-muted-foreground text-lg md:text-2xl max-w-2xl mx-auto font-medium leading-relaxed px-4">We specialize in custom logic, complex data architectures, and unique user experiences. Let's discuss your next big idea.</p>
              <Link href="/request?type=custom" className="inline-block pt-6">
                <Button size="lg" className="rounded-full h-16 md:h-20 px-12 md:px-20 text-xl font-black shadow-2xl shadow-primary/40 hover:scale-110 transition-all active:scale-95">
                  Get a Custom Proposal
                </Button>
              </Link>
            </div>
            <div className="absolute -bottom-20 -right-20 w-[400px] h-[400px] bg-primary/20 rounded-full blur-[120px]" />
            <div className="absolute -top-20 -left-20 w-[400px] h-[400px] bg-accent/10 rounded-full blur-[120px]" />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
