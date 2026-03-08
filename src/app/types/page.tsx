
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
import { Check, Sparkles, ArrowRight } from "lucide-react"

export default function WebsiteTypesPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 py-20 relative">
        {/* Decorative elements */}
        <div className="absolute top-40 left-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl -z-10" />
        <div className="absolute bottom-40 right-0 w-80 h-80 bg-accent/10 rounded-full blur-3xl -z-10" />

        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center mb-20 space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-semibold mb-2 animate-fade-in">
              <Sparkles className="w-4 h-4" />
              <span>Tailored Digital Experiences</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-headline font-bold tracking-tight">
              Website <span className="text-primary italic">Categories</span>
            </h1>
            <p className="text-muted-foreground text-xl max-w-2xl mx-auto font-body">
              Explore our range of professional web solutions designed to elevate your online presence in Nepal and beyond.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {WEBSITE_TYPES.map((type) => {
              const img = PlaceHolderImages.find(p => p.id === `${type.id}-web`)
              return (
                <Card key={type.id} className="group overflow-hidden glass border-border/50 hover:border-primary/50 transition-all duration-300 flex flex-col h-full hover:shadow-2xl hover:shadow-primary/5">
                  <div className="relative aspect-[16/10] overflow-hidden">
                    <Image 
                      src={img?.imageUrl || "https://picsum.photos/seed/web/600/400"} 
                      alt={type.label}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <div className="absolute top-3 right-3">
                      <Badge className="bg-primary/90 backdrop-blur-md px-3 py-1 text-sm font-bold shadow-lg">
                        {type.price}
                      </Badge>
                    </div>
                  </div>
                  
                  <CardHeader className="pb-4">
                    <CardTitle className="font-headline font-bold text-2xl group-hover:text-primary transition-colors">
                      {type.label}
                    </CardTitle>
                  </CardHeader>

                  <CardContent className="flex-1 space-y-4">
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      High-performance solutions tailored for your {type.label.toLowerCase()} needs. 
                      Modern UI with blazing fast speed.
                    </p>
                    
                    <div className="space-y-2 pt-2 border-t border-border/50">
                      <p className="text-xs font-bold uppercase tracking-wider text-primary/80">Key Features:</p>
                      {(type as any).features?.map((feature: string, i: number) => (
                        <div key={i} className="flex items-center gap-2 text-sm text-foreground/80">
                          <Check className="w-3.5 h-3.5 text-accent" />
                          <span>{feature}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>

                  <CardFooter className="pt-0 pb-6">
                    <Link href={`/request?type=${type.id}`} className="w-full">
                      <Button className="w-full rounded-full h-12 text-md font-bold group-hover:gap-3 transition-all">
                        Request Project
                        <ArrowRight className="w-4 h-4 opacity-0 -ml-4 group-hover:opacity-100 group-hover:ml-0 transition-all" />
                      </Button>
                    </Link>
                  </CardFooter>
                </Card>
              )
            })}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
