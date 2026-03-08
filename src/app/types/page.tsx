
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

export default function WebsiteTypesPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-16 space-y-4">
            <h1 className="text-4xl md:text-6xl font-headline font-bold">Website Categories</h1>
            <p className="text-muted-foreground text-lg">Choose a style that fits your vision. All plans include mobile responsiveness and basic SEO.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {WEBSITE_TYPES.map((type, idx) => {
              const img = PlaceHolderImages.find(p => p.id === `${type.id}-web`)
              return (
                <Card key={type.id} className="overflow-hidden glass border-border/50 hover:border-primary transition-all group">
                  <div className="relative aspect-video overflow-hidden">
                    <Image 
                      src={img?.imageUrl || "https://picsum.photos/seed/web/600/400"} 
                      alt={type.label}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-2 right-2">
                      <Badge className="bg-primary/90 hover:bg-primary">Starting at {type.price}</Badge>
                    </div>
                  </div>
                  <CardHeader>
                    <CardTitle className="font-headline font-bold text-xl">{type.label}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground line-clamp-3">
                      High-performance {type.label.toLowerCase()} tailored for your specific audience in Nepal. Includes modern features and clean design.
                    </p>
                  </CardContent>
                  <CardFooter>
                    <Link href={`/request?type=${type.id}`} className="w-full">
                      <Button className="w-full rounded-full">Request Now</Button>
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
