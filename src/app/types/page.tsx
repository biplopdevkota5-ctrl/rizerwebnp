
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
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 py-20 relative">
        {/* Decorative background gradients */}
        <div className="absolute top-0 left-0 w-full h-[500px] bg-gradient-to-b from-primary/10 to-transparent -z-10" />
        
        <div className="container mx-auto px-4">
          {/* Header Section */}
          <div className="max-w-4xl mx-auto text-center mb-16 space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-semibold mb-2 animate-fade-in">
              <Sparkles className="w-4 h-4" />
              <span>Tailored Digital Experiences</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-headline font-bold tracking-tight">
              Website <span className="text-primary italic">Solutions</span>
            </h1>
            <p className="text-muted-foreground text-xl max-w-2xl mx-auto font-body">
              Premium website categories for every need. High performance, mobile-first design, and modern aesthetics.
            </p>
          </div>

          {/* About Us Section */}
          <section className="mb-24">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div className="space-y-6">
                <h2 className="text-3xl md:text-4xl font-headline font-bold">About RIZERWEBNP</h2>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  Founded by <span className="text-primary font-bold">Biplop Devkota</span>, RIZERWEBNP is a dedicated web development studio based in <span className="text-foreground font-medium">Gaidakot, Nepal</span>. We believe that professional digital presence shouldn't be a luxury. 
                </p>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  Our mission is to empower local businesses, creators, and entrepreneurs with world-class websites that utilize modern technologies like Glassmorphism, smooth animations, and ultra-fast performance.
                </p>
                <div className="grid grid-cols-2 gap-4 pt-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-primary/10 text-primary">
                      <Shield className="w-5 h-5" />
                    </div>
                    <span className="font-medium text-sm">Secure Builds</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-primary/10 text-primary">
                      <Globe className="w-5 h-5" />
                    </div>
                    <span className="font-medium text-sm">Global Standards</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-primary/10 text-primary">
                      <Award className="w-5 h-5" />
                    </div>
                    <span className="font-medium text-sm">Premium UI/UX</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-primary/10 text-primary">
                      <Users className="w-5 h-5" />
                    </div>
                    <span className="font-medium text-sm">Client Focused</span>
                  </div>
                </div>
              </div>
              <div className="glass p-8 rounded-3xl border-primary/20 space-y-6 relative overflow-hidden">
                <div className="relative z-10">
                  <h3 className="text-2xl font-headline font-bold mb-4">Our Vision</h3>
                  <p className="text-muted-foreground italic">
                    "We don't just build websites; we create digital homes for your ideas. Our goal is to make Nepal a hub for cutting-edge web design by providing accessible yet high-end services."
                  </p>
                  <div className="mt-6 flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center text-white font-bold">BD</div>
                    <div>
                      <p className="font-bold">Biplop Devkota</p>
                      <p className="text-xs text-muted-foreground">Founder & Lead Developer</p>
                    </div>
                  </div>
                </div>
                <div className="absolute -top-10 -right-10 w-40 h-40 bg-primary/10 rounded-full blur-3xl" />
              </div>
            </div>
          </section>

          {/* Website Types List Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {WEBSITE_TYPES.map((type) => (
              <Card key={type.id} className="group glass border-border/50 hover:border-primary/50 transition-all duration-300 flex flex-col h-full hover:shadow-lg">
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start mb-2">
                    <Badge variant="outline" className="text-primary border-primary/30">
                      Category
                    </Badge>
                    <span className="text-sm font-bold text-accent">{type.price}</span>
                  </div>
                  <CardTitle className="font-headline font-bold text-xl group-hover:text-primary transition-colors">
                    {type.label}
                  </CardTitle>
                </CardHeader>

                <CardContent className="flex-1 space-y-4">
                  <div className="space-y-2 pt-2">
                    {type.features?.map((feature: string, i: number) => (
                      <div key={i} className="flex items-center gap-2 text-sm text-foreground/70">
                        <Check className="w-3.5 h-3.5 text-accent" />
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>

                <CardFooter className="pt-4 pb-6 px-6">
                  <Link href={`/request?type=${type.id}`} className="w-full">
                    <Button variant="outline" className="w-full rounded-full h-10 text-sm glass border-primary/20 group-hover:bg-primary group-hover:text-white transition-all">
                      Request Quote
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </Link>
                </CardFooter>
              </Card>
            ))}
          </div>
          
          <div className="mt-24 text-center p-12 rounded-3xl glass border-primary/20 relative overflow-hidden">
            <div className="relative z-10 space-y-4">
              <h2 className="text-3xl font-headline font-bold">Need something completely unique?</h2>
              <p className="text-muted-foreground max-w-lg mx-auto">We specialize in custom logic and bespoke architectures. Let's discuss your custom project.</p>
              <Link href="/request?type=custom">
                <Button size="lg" className="rounded-full mt-4 h-12 px-8">
                  Get a Custom Proposal
                </Button>
              </Link>
            </div>
            <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-primary/10 rounded-full blur-3xl" />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
