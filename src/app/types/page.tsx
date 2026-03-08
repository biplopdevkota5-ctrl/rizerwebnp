
"use client"

import * as React from "react"
import Link from "next/link"
import { Navbar } from "@/components/Navbar"
import { Footer } from "@/components/Footer"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { WEBSITE_TYPES } from "@/lib/types"
import { Check, Sparkles, ArrowRight, Shield, Globe, Award, Users } from "lucide-react"

export default function WebsiteTypesPage() {
  return (
    <div className="min-h-screen flex flex-col selection:bg-primary/30 selection:text-primary overflow-x-hidden">
      <Navbar />
      <main className="flex-1 py-12 md:py-20 relative">
        {/* Decorative background gradients */}
        <div className="absolute top-0 left-0 w-full h-[500px] bg-gradient-to-b from-primary/10 to-transparent -z-10" />
        
        <div className="container mx-auto px-4">
          {/* Header Section */}
          <div className="max-w-4xl mx-auto text-center mb-12 md:mb-20 space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-[10px] sm:text-xs font-black uppercase tracking-widest animate-fade-in">
              <Sparkles className="w-3 h-3 sm:w-4 h-4" />
              <span>Tailored Digital Experiences</span>
            </div>
            <h1 className="text-4xl sm:text-5xl md:text-7xl font-headline font-bold tracking-tight text-foreground leading-[1.1]">
              Website <span className="text-primary italic">Solutions</span>
            </h1>
            <p className="text-muted-foreground text-lg sm:text-xl max-w-2xl mx-auto font-medium">
              Premium website categories for every need. High performance, mobile-first design, and modern aesthetics.
            </p>
          </div>

          {/* About Us Section */}
          <section className="mb-20 md:mb-32">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 md:gap-16 items-center">
              <div className="space-y-6 order-2 lg:order-1">
                <h2 className="text-3xl md:text-4xl font-headline font-bold text-foreground">About RIZERWEBNP</h2>
                <div className="space-y-4">
                  <p className="text-lg text-foreground/90 leading-relaxed font-semibold">
                    Founded by <span className="text-primary font-black uppercase tracking-tight">Biplop Devkota</span>, RIZERWEBNP is a dedicated web development studio based in <span className="text-foreground font-black">Gaidakot, Nepal</span>.
                  </p>
                  <p className="text-base sm:text-lg text-muted-foreground leading-relaxed font-medium">
                    We believe that professional digital presence shouldn't be a luxury. Our mission is to empower local businesses, creators, and entrepreneurs with world-class websites that utilize modern technologies like Glassmorphism, smooth animations, and ultra-fast performance.
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-4 pt-6">
                  {[
                    { icon: Shield, label: "Secure Builds" },
                    { icon: Globe, label: "Global Standards" },
                    { icon: Award, label: "Premium UI/UX" },
                    { icon: Users, label: "Client Focused" }
                  ].map((item, idx) => (
                    <div key={idx} className="flex items-center gap-3 p-3 rounded-2xl bg-white/5 border border-white/5">
                      <div className="p-2 rounded-lg bg-primary/20 text-primary shrink-0">
                        <item.icon className="w-4 h-4" />
                      </div>
                      <span className="font-bold text-[11px] sm:text-xs text-foreground uppercase tracking-wider">{item.label}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="glass p-8 md:p-12 rounded-[2rem] border-white/10 space-y-6 relative overflow-hidden order-1 lg:order-2">
                <div className="relative z-10">
                  <h3 className="text-2xl font-headline font-bold mb-4 text-foreground">Our Vision</h3>
                  <p className="text-foreground/90 italic text-lg sm:text-xl leading-relaxed font-medium">
                    "We don't just build websites; we create digital homes for your ideas. Our goal is to make Nepal a hub for cutting-edge web design by providing accessible yet high-end services."
                  </p>
                  <div className="mt-8 flex items-center gap-4 border-t border-white/10 pt-6">
                    <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center text-white font-black shadow-lg">BD</div>
                    <div>
                      <p className="font-bold text-foreground">Biplop Devkota</p>
                      <p className="text-[10px] text-muted-foreground font-black uppercase tracking-[0.2em]">Founder & Lead Developer</p>
                    </div>
                  </div>
                </div>
                <div className="absolute -top-10 -right-10 w-40 h-40 bg-primary/20 rounded-full blur-3xl" />
              </div>
            </div>
          </section>

          {/* Website Types List Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {WEBSITE_TYPES.map((type) => (
              <Card key={type.id} className="group glass border-white/10 hover:border-primary/50 transition-all duration-500 flex flex-col h-full rounded-3xl overflow-hidden shadow-xl">
                <CardHeader className="pb-4">
                  <div className="flex justify-between items-start mb-4">
                    <Badge variant="outline" className="text-primary border-primary/40 font-black text-[10px] uppercase tracking-widest bg-primary/5 px-3">
                      Package
                    </Badge>
                    <span className="text-sm font-black text-accent">{type.price}</span>
                  </div>
                  <CardTitle className="font-headline font-bold text-2xl group-hover:text-primary transition-colors text-foreground">
                    {type.label}
                  </CardTitle>
                </CardHeader>

                <CardContent className="flex-1 space-y-4">
                  <div className="space-y-3 pt-2">
                    {type.features?.map((feature: string, i: number) => (
                      <div key={i} className="flex items-center gap-3 text-sm text-foreground/80 font-semibold">
                        <Check className="w-4 h-4 text-accent shrink-0" />
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>

                <CardFooter className="pt-6 pb-6 px-6">
                  <Link href={`/request?type=${type.id}`} className="w-full">
                    <Button variant="outline" className="w-full rounded-2xl h-12 text-sm font-bold glass border-white/10 group-hover:bg-primary group-hover:text-white group-hover:border-primary transition-all shadow-sm">
                      Request Quote
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </Link>
                </CardFooter>
              </Card>
            ))}
          </div>
          
          <div className="mt-20 md:mt-32 text-center p-10 md:p-20 rounded-[3rem] glass border-white/10 relative overflow-hidden shadow-2xl">
            <div className="relative z-10 space-y-8">
              <h2 className="text-3xl md:text-5xl font-headline font-bold text-foreground">Need something completely unique?</h2>
              <p className="text-muted-foreground text-lg max-w-lg mx-auto font-medium leading-relaxed">We specialize in custom logic and bespoke architectures. Let's discuss your custom project.</p>
              <Link href="/request?type=custom" className="inline-block pt-4">
                <Button size="lg" className="rounded-full h-14 px-12 text-lg font-black shadow-2xl shadow-primary/40 hover:scale-105 transition-all">
                  Get a Custom Proposal
                </Button>
              </Link>
            </div>
            <div className="absolute -bottom-10 -right-10 w-64 h-64 bg-primary/20 rounded-full blur-[100px]" />
            <div className="absolute -top-10 -left-10 w-64 h-64 bg-accent/10 rounded-full blur-[100px]" />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
