
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Navbar } from "@/components/Navbar"
import { Footer } from "@/components/Footer"
import { FloatingButton } from "@/components/FloatingButton"
import { CheckCircle2, Zap, Shield, Globe, Cpu, Sparkles } from "lucide-react"

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative pt-24 pb-20 overflow-hidden">
          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-4xl mx-auto text-center space-y-8 animate-fade-in">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium">
                <Sparkles className="w-4 h-4" />
                <span>Modern Web Development for Nepal 🇳🇵</span>
              </div>
              <h1 className="text-5xl md:text-7xl font-headline font-bold leading-tight tracking-tighter">
                Create Your <span className="text-primary italic">Dream Website</span> at Cheap Price
              </h1>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto font-body">
                Premium quality designs, glassmorphism effects, and ultra-smooth animations. Get your professional website today without breaking the bank.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Link href="/request">
                  <Button size="lg" className="h-14 px-8 text-lg rounded-full">
                    Request Website
                  </Button>
                </Link>
                <Link href="/types">
                  <Button size="lg" variant="outline" className="h-14 px-8 text-lg rounded-full glass">
                    View Website Types
                  </Button>
                </Link>
              </div>
            </div>
          </div>
          
          {/* Abstract Decorations */}
          <div className="absolute top-1/2 left-0 w-96 h-96 bg-primary/20 rounded-full blur-[120px] -translate-y-1/2 -translate-x-1/2" />
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-accent/20 rounded-full blur-[120px] translate-x-1/4" />
        </section>

        {/* Features Section */}
        <section className="py-24 bg-background/50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16 space-y-4">
              <h2 className="text-3xl md:text-5xl font-headline font-bold">Why Choose RIZERWEBNP?</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">We combine cutting-edge technology with affordable pricing to deliver websites that stand out.</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                { icon: Zap, title: "Lightning Fast", desc: "Optimized for speed and SEO to ensure your business loads instantly on any device." },
                { icon: Globe, title: "Global Standard", desc: "Designs that compete on a world-class level with modern UI and smooth UX." },
                { icon: Shield, title: "Secure & Reliable", desc: "Your data is safe with us. We use the latest security practices for every build." },
                { icon: Cpu, title: "AI-Powered", desc: "We use AI design tools to refine your vision into a stunning digital reality." },
                { icon: CheckCircle2, title: "Affordable", desc: "Starting at just $29, we have a plan for every budget and requirement." },
                { icon: Sparkles, title: "Custom Effects", desc: "Glassmorphism, parallax, and custom animations tailored to your brand." },
              ].map((feature, i) => (
                <div key={i} className="p-8 rounded-2xl glass hover:border-primary/50 transition-all group">
                  <feature.icon className="w-12 h-12 text-primary mb-6 group-hover:scale-110 transition-transform" />
                  <h3 className="text-xl font-headline font-bold mb-3">{feature.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">{feature.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section className="py-24">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-5xl font-headline font-bold">What Our Clients Say</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                { name: "Anish Sharma", role: "Business Owner", text: "RIZERWEBNP transformed my local shop into a global brand. The process was so easy!" },
                { name: "Sita Gurung", role: "Photographer", text: "My portfolio looks futuristic and high-end. Biplop is a true professional developer." },
                { name: "Rahul KC", role: "Blogger", text: "Unbeatable price for such a premium feel. Highly recommend the custom features!" },
              ].map((t, i) => (
                <div key={i} className="p-6 rounded-xl border border-border bg-card/50">
                  <p className="italic text-muted-foreground mb-4">"{t.text}"</p>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center font-bold text-primary">
                      {t.name[0]}
                    </div>
                    <div>
                      <h4 className="font-bold text-sm">{t.name}</h4>
                      <p className="text-xs text-muted-foreground">{t.role}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-24">
          <div className="container mx-auto px-4">
            <div className="rounded-3xl bg-primary p-12 text-center text-primary-foreground space-y-6 overflow-hidden relative">
              <div className="relative z-10">
                <h2 className="text-4xl md:text-6xl font-headline font-bold">Ready to Start Your Project?</h2>
                <p className="text-lg opacity-90 max-w-xl mx-auto">Submit your requirements and get a professional response within 24 hours.</p>
                <div className="pt-6">
                  <Link href="/request">
                    <Button size="lg" variant="secondary" className="h-14 px-10 rounded-full font-bold">
                      Launch My Website Now
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
