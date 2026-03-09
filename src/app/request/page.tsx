
"use client"

import * as React from "react"
import { Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Navbar } from "@/components/Navbar"
import { Footer } from "@/components/Footer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { Sparkles, Send, MessageCircle, Star } from "lucide-react"
import { WEBSITE_TYPES } from "@/lib/types"
import { aiDesignSuggestion } from "@/ai/flows/ai-design-suggestion-flow"
import { useFirestore, useUser } from "@/firebase"
import { collection, addDoc } from "firebase/firestore"
import { cn } from "@/lib/utils"
import { errorEmitter } from "@/firebase/error-emitter"
import { FirestorePermissionError } from "@/firebase/errors"
import { sendDiscordNotification } from "@/app/actions/notifications"
import { IOSSpinner } from "@/components/ui/ios-spinner"

const WHATSAPP_NUM = "9805602394"
const DEFAULT_WHATSAPP_MSG = encodeURIComponent("Hello, Rizer Web NP. I Need Support.")

function RequestFormContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const { toast } = useToast()
  const db = useFirestore()
  const { user } = useUser()
  
  const [loading, setLoading] = React.useState(false)
  const [aiLoading, setAiLoading] = React.useState(false)

  const [formData, setFormData] = React.useState({
    fullName: "",
    email: "",
    phone: "",
    whatsapp: "",
    websiteType: searchParams.get('type') || "business",
    budget: "",
    title: "",
    description: "",
    functions: "",
    pages: "",
    designStyle: "",
    extraFeatures: ""
  })

  const [reviewData, setReviewData] = React.useState({
    text: "",
    rating: 5
  })

  React.useEffect(() => {
    if (user) {
      setFormData(prev => ({ 
        ...prev, 
        fullName: user.displayName || "", 
        email: user.email || "", 
      }))
    }
  }, [user])

  const handleAiSuggestion = async () => {
    if (!formData.description) {
      toast({ title: "Description Required", description: "Please enter a brief description first.", variant: "destructive" })
      return
    }
    setAiLoading(true)
    try {
      const result = await aiDesignSuggestion({ designIdea: formData.description })
      setFormData(prev => ({ ...prev, designStyle: result.suggestion }))
      toast({ title: "AI Suggestion Generated", description: "We've added some creative ideas to your design style!" })
    } catch (error) {
      toast({ title: "AI Error", description: "Failed to get AI suggestions.", variant: "destructive" })
    } finally {
      setAiLoading(false)
    }
  }

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault()
    if (!db || !user) {
      toast({ title: "Login Required", description: "Please login to leave a review.", variant: "destructive" })
      return
    }
    if (!reviewData.text) {
      toast({ title: "Review Empty", description: "Please write something about our service.", variant: "destructive" })
      return
    }

    const reviewsCol = collection(db, "reviews");
    const payload = {
      userId: user.uid,
      userName: user.displayName || "Anonymous",
      text: reviewData.text,
      rating: reviewData.rating,
      status: "pending",
      createdAt: new Date().toISOString()
    };

    addDoc(reviewsCol, payload).catch(async (error) => {
      const permissionError = new FirestorePermissionError({
        path: reviewsCol.path,
        operation: 'create',
        requestResourceData: payload,
      });
      errorEmitter.emit('permission-error', permissionError);
    });
    
    setReviewData({ text: "", rating: 5 });
    toast({ title: "Review Submitted", description: "Thanks! It will be visible after admin approval." });
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!db) return
    setLoading(true)

    let userIp = "Unknown";
    try {
      const ipRes = await fetch('https://api.ipify.org?format=json');
      const ipData = await ipRes.json();
      userIp = ipData.ip;
    } catch (ipError) {
      console.warn("Could not fetch IP address:", ipError);
    }

    const payload = {
      ...formData,
      userId: user?.uid || 'guest',
      userName: formData.fullName,
      status: 'pending',
      createdAt: new Date().toISOString(),
      ipAddress: userIp
    };

    const adminRequestsCol = collection(db, "requests");
    const userRequestsCol = user 
      ? collection(db, "users", user.uid, "website_requests")
      : collection(db, "anonymous_website_requests");

    try {
      await Promise.all([
        addDoc(adminRequestsCol, payload),
        addDoc(userRequestsCol, payload)
      ]);

      await sendDiscordNotification({
        ...formData,
        ipAddress: userIp
      });

      toast({ title: "Success!", description: "Your request has been submitted. Check Discord/WhatsApp for confirmation." })
      
      const waMessage = `Hello, I submitted a website request on RIZERWEBNP.\nName: ${formData.fullName}\nPhone: ${formData.phone}\nType: ${formData.websiteType}\nBudget: ${formData.budget}`
      const encodedMsg = encodeURIComponent(waMessage)
      
      setTimeout(() => {
        window.open(`https://wa.me/977${WHATSAPP_NUM}?text=${encodedMsg}`, '_blank')
        router.push('/dashboard')
      }, 1500)
    } catch (error) {
      console.error("Submission error:", error);
      toast({ 
        title: "Error", 
        description: "Failed to submit request. Please try again or contact support.", 
        variant: "destructive" 
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="container mx-auto px-4 max-w-5xl space-y-12 md:space-y-20 lg:space-y-24">
      <Card className="glass border-white/10 shadow-2xl rounded-[2.5rem] md:rounded-[3.5rem] overflow-hidden">
        <CardHeader className="text-center bg-white/5 pt-12 pb-10 md:pt-16 md:pb-14">
          <CardTitle className="font-headline text-4xl md:text-6xl lg:text-7xl font-bold mb-4">Request Your Website</CardTitle>
          <CardDescription className="text-muted-foreground text-lg md:text-xl font-medium px-4">Your request is sent directly to our admin and Discord channel for rapid processing.</CardDescription>
        </CardHeader>
        <CardContent className="p-6 md:p-16 lg:p-20">
          <form onSubmit={handleSubmit} className="space-y-12 md:space-y-16">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16">
              <div className="space-y-8">
                <h3 className="font-headline font-bold text-2xl flex items-center gap-3">
                  <div className="w-2 h-8 bg-primary rounded-full" />
                  Contact Information
                </h3>
                <div className="space-y-6">
                  <div className="space-y-2.5">
                    <Label htmlFor="fullName" className="font-bold text-base">Full Name</Label>
                    <Input id="fullName" required value={formData.fullName} onChange={e => setFormData({...formData, fullName: e.target.value})} className="glass h-14 rounded-2xl px-6 text-lg" />
                  </div>
                  <div className="space-y-2.5">
                    <Label htmlFor="email" className="font-bold text-base">Email Address</Label>
                    <Input id="email" type="email" required value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="glass h-14 rounded-2xl px-6 text-lg" />
                  </div>
                  <div className="space-y-2.5">
                    <Label htmlFor="phone" className="font-bold text-base">Phone Number</Label>
                    <Input id="phone" type="tel" required value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} className="glass h-14 rounded-2xl px-6 text-lg" />
                  </div>
                </div>
              </div>

              <div className="space-y-8">
                <h3 className="font-headline font-bold text-2xl flex items-center gap-3">
                  <div className="w-2 h-8 bg-accent rounded-full" />
                  Build Specifications
                </h3>
                <div className="space-y-6">
                  <div className="space-y-2.5">
                    <Label htmlFor="websiteType" className="font-bold text-base">Website Type</Label>
                    <Select value={formData.websiteType} onValueChange={val => setFormData({...formData, websiteType: val})}>
                      <SelectTrigger id="websiteType" className="glass h-14 rounded-2xl px-6 text-lg">
                        <SelectValue placeholder="Select a package" />
                      </SelectTrigger>
                      <SelectContent className="glass">
                        {WEBSITE_TYPES.map(t => (
                          <SelectItem key={t.id} value={t.id}>{t.label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2.5">
                    <Label htmlFor="budget" className="font-bold text-base">Estimated Budget (NPR / USD)</Label>
                    <Input id="budget" placeholder="e.g. $100 or 15,000 NPR" required value={formData.budget} onChange={e => setFormData({...formData, budget: e.target.value})} className="glass h-14 rounded-2xl px-6 text-lg" />
                  </div>
                  <div className="space-y-2.5">
                    <Label htmlFor="pages" className="font-bold text-base">Specific Pages Needed</Label>
                    <Input id="pages" placeholder="Home, About, Services, Contact..." required value={formData.pages} onChange={e => setFormData({...formData, pages: e.target.value})} className="glass h-14 rounded-2xl px-6 text-lg" />
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-10">
              <h3 className="font-headline font-bold text-2xl flex items-center gap-3">
                <div className="w-2 h-8 bg-primary rounded-full" />
                Detailed Project Scope
              </h3>
              <div className="space-y-8">
                <div className="space-y-3">
                  <Label htmlFor="description" className="font-bold text-base">Project Vision & Goals</Label>
                  <Textarea id="description" className="min-h-[160px] glass rounded-3xl p-6 text-lg leading-relaxed" placeholder="Explain what your website should do and any specific business goals you want to achieve..." required value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} />
                </div>
                <div className="space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-2">
                    <Label htmlFor="designStyle" className="font-bold text-base">Aesthetic & Design Style</Label>
                    <Button type="button" variant="ghost" size="sm" onClick={handleAiSuggestion} disabled={aiLoading} className="text-primary hover:bg-primary/10 font-black text-xs uppercase tracking-widest bg-primary/5 px-4 py-2 rounded-xl h-auto">
                      {aiLoading ? <IOSSpinner size="sm" /> : <><Sparkles className="w-4 h-4 mr-2" /> AI Design Assistant</>}
                    </Button>
                  </div>
                  <Textarea id="designStyle" className="min-h-[180px] glass rounded-3xl p-6 text-lg leading-relaxed" placeholder="Describe the look and feel (e.g. dark, minimalist, glassmorphism, corporate, futuristic)..." value={formData.designStyle} onChange={e => setFormData({...formData, designStyle: e.target.value})} />
                </div>
              </div>
            </div>

            <div className="pt-10 flex flex-col md:flex-row gap-6">
              <Button type="submit" size="lg" className="flex-1 h-16 md:h-20 rounded-2xl md:rounded-3xl text-xl font-black shadow-[0_20px_40px_-10px_rgba(88,88,179,0.5)] hover:scale-[1.02] transition-all" disabled={loading}>
                {loading ? <IOSSpinner size="sm" /> : <><Send className="w-6 h-6 mr-3" /> Launch Project Request</>}
              </Button>
              <Button type="button" variant="outline" size="lg" className="flex-1 h-16 md:h-20 rounded-2xl md:rounded-3xl text-xl glass border-white/10 font-bold shadow-xl hover:scale-[1.02] transition-all" onClick={() => window.open(`https://wa.me/977${WHATSAPP_NUM}?text=${DEFAULT_WHATSAPP_MSG}`, '_blank')}>
                <MessageCircle className="w-6 h-6 mr-3 text-[#25D366]" />
                Contact on WhatsApp
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {user && (
        <Card className="glass border-accent/20 shadow-2xl rounded-[2.5rem] md:rounded-[3.5rem] overflow-hidden">
          <CardHeader className="bg-white/5 p-8 md:p-12">
            <CardTitle className="flex items-center gap-4 font-headline text-3xl md:text-5xl font-bold">
              <Star className="w-10 h-10 md:w-14 md:h-14 text-accent fill-accent" />
              Service Testimonial
            </CardTitle>
            <CardDescription className="text-lg md:text-xl font-medium mt-2">Your feedback helps the RIZERWEBNP community grow. Share your build experience!</CardDescription>
          </CardHeader>
          <CardContent className="p-8 md:p-16 lg:p-20">
            <form onSubmit={handleSubmitReview} className="space-y-10">
              <div className="space-y-6">
                <Label className="font-bold text-lg">Rating (1-5 Excellence Scale)</Label>
                <div className="flex flex-wrap gap-4 md:gap-6">
                  {[1, 2, 3, 4, 5].map((num) => (
                    <button
                      key={num}
                      type="button"
                      onClick={() => setReviewData({ ...reviewData, rating: num })}
                      className={cn(
                        "w-14 h-14 md:w-20 md:h-20 rounded-2xl md:rounded-3xl border-2 transition-all flex items-center justify-center font-black text-xl md:text-2xl",
                        reviewData.rating >= num 
                          ? "bg-accent border-accent text-white shadow-2xl shadow-accent/40 scale-110" 
                          : "glass border-white/10 text-muted-foreground hover:border-accent/50"
                      )}
                    >
                      {num}
                    </button>
                  ))}
                </div>
              </div>
              <div className="space-y-4">
                <Label className="font-bold text-lg">Detailed Feedback</Label>
                <Textarea 
                  placeholder="How was our service? What did you love about your new website build?" 
                  value={reviewData.text} 
                  onChange={e => setReviewData({ ...reviewData, text: e.target.value })}
                  className="glass rounded-3xl min-h-[160px] p-6 text-lg"
                />
              </div>
              <Button type="submit" variant="secondary" className="w-full h-16 md:h-20 font-black rounded-2xl md:rounded-3xl text-xl hover:bg-accent hover:text-white transition-all shadow-xl">Submit Review to Public Feed</Button>
            </form>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

export default function RequestPage() {
  return (
    <div className="min-h-screen flex flex-col selection:bg-primary/30 selection:text-primary overflow-x-hidden">
      <Navbar />
      <main className="flex-1 py-12 md:py-20 lg:py-24">
        <Suspense fallback={
          <div className="flex-1 flex items-center justify-center py-40">
            <IOSSpinner size="lg" />
          </div>
        }>
          <RequestFormContent />
        </Suspense>
      </main>
      <Footer />
    </div>
  )
}
