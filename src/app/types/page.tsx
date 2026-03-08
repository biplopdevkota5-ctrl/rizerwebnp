
"use client"

import * as React from "react"
import Image from "next/image"
import Link from "next/link"
import { Navbar } from "@/components/Navbar"
import { Footer } from "@/components/Footer"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { PlaceHolderImages } from "@/lib/placeholder-images"
import { WEBSITE_TYPES } from "@/lib/types"
import { Check, Sparkles, ArrowRight, ExternalLink } from "lucide-react"

export default function WebsiteTypesPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 py-20 relative">
        {/* Decorative background gradients */}
        <div className="absolute top-0 left-0 w-full h-[500px] bg-gradient-to-b from-primary/10 to-transparent -z-10" />
        <div className="absolute top-40 left-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl -z-10" />
        <div className="absolute bottom-40 right-0 w-80 h-80 bg-accent/10 rounded-full blur-3xl -z-10" />

        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center mb-20 space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-semibold mb-2 animate-fade-in">
              <Sparkles className="w-4 h-4" />
              <span>Tailored Digital Experiences</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-headline font-bold tracking-tight">
              Website <span className="text-primary italic">Solutions</span>
            </h1>
            <p className="text-muted-foreground text-xl max-w-2xl mx-auto font-body">
              Choose the perfect category for your project. Every site is built with premium effects, high performance, and mobile-first design.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {WEBSITE_TYPES.map((type) => {
              const img = PlaceHolderImages.find(p => p.id === `${type.id}-web`)
              return (
                <Card key={type.id} className="group overflow-hidden glass border-border/50 hover:border-primary/50 transition-all duration-500 flex flex-col h-full hover:shadow-2xl hover:shadow-primary/10">
                  <div className="relative aspect-[16/10] overflow-hidden">
                    <Image 
                      src={img?.imageUrl || "https://picsum.photos/seed/web/600/400"} 
                      alt={type.label}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                      data-ai-hint={img?.imageHint || "website layout"}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/20 to-transparent" />
                    <div className="absolute top-3 right-3 flex flex-col gap-2 items-end">
                      <Badge className="bg-primary/90 backdrop-blur-md px-3 py-1 text-sm font-bold shadow-lg border-primary/20">
                        {type.price}
                      </Badge>
                    </div>
                    <div className="absolute bottom-4 left-4">
                       <span className="text-xs font-bold uppercase tracking-widest text-white/70 drop-shadow-md">Professional Category</span>
                    </div>
                  </div>
                  
                  <CardHeader className="pb-4">
                    <CardTitle className="font-headline font-bold text-2xl group-hover:text-primary transition-colors flex items-center justify-between">
                      {type.label}
                    </CardTitle>
                  </CardHeader>

                  <CardContent className="flex-1 space-y-4">
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      Custom-engineered {type.label.toLowerCase()} with high conversion focus and ultra-smooth glassmorphism effects.
                    </p>
                    
                    <div className="space-y-2 pt-4 border-t border-border/30">
                      <p className="text-[10px] font-black uppercase tracking-[0.2em] text-primary">Standard Inclusions</p>
                      <div className="grid grid-cols-1 gap-2">
                        {(type as any).features?.map((feature: string, i: number) => (
                          <div key={i} className="flex items-center gap-2 text-sm text-foreground/70">
                            <div className="w-1.5 h-1.5 rounded-full bg-accent shadow-[0_0_8px_rgba(82,168,237,0.6)]" />
                            <span>{feature}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </CardContent>

                  <CardFooter className="pt-0 pb-6 px-6">
                    <Link href={`/request?type=${type.id}`} className="w-full">
                      <Button className="w-full rounded-full h-12 text-md font-bold group-hover:gap-3 transition-all relative overflow-hidden group/btn">
                        <span className="relative z-10 flex items-center justify-center gap-2">
                          Request Quote
                          <ArrowRight className="w-4 h-4 transition-transform group-hover/btn:translate-x-1" />
                        </span>
                        <div className="absolute inset-0 bg-gradient-to-r from-primary to-accent opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300" />
                      </Button>
                    </Link>
                  </CardFooter>
                </Card>
              )
            })}
          </div>
          
          <div className="mt-24 text-center p-12 rounded-3xl glass border-primary/20 relative overflow-hidden">
            <div className="relative z-10 space-y-4">
              <h2 className="text-3xl font-headline font-bold">Don't see what you need?</h2>
              <p className="text-muted-foreground max-w-lg mx-auto">We specialize in custom logic and unique architectures. Tell us your vision and we'll build it.</p>
              <Link href="/request?type=custom">
                <Button variant="outline" size="lg" className="rounded-full mt-4 glass border-primary/40 hover:bg-primary/10">
                  Discuss Custom Project
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
