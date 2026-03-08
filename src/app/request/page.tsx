
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
import { Sparkles, Send, MessageCircle, Star, RefreshCw } from "lucide-react"
import { WEBSITE_TYPES } from "@/lib/types"
import { aiDesignSuggestion } from "@/ai/flows/ai-design-suggestion-flow"
import { useFirestore, useUser } from "@/firebase"
import { collection, addDoc } from "firebase/firestore"
import { cn } from "@/lib/utils"
import { errorEmitter } from "@/firebase/error-emitter"
import { FirestorePermissionError } from "@/firebase/errors"
import { sendDiscordNotification } from "@/app/actions/notifications"

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

    const payload = {
      ...formData,
      userId: user?.uid || 'guest',
      userName: formData.fullName,
      status: 'pending',
      createdAt: new Date().toISOString()
    };

    // 1. Write to Admin Database (Global Requests)
    const adminRequestsCol = collection(db, "requests");
    
    // 2. Write to User Personal Database
    const userRequestsCol = user 
      ? collection(db, "users", user.uid, "website_requests")
      : collection(db, "anonymous_website_requests");

    try {
      // Parallel submission to both databases
      await Promise.all([
        addDoc(adminRequestsCol, payload),
        addDoc(userRequestsCol, payload)
      ]);

      // 3. Send Discord Notification
      await sendDiscordNotification({
        fullName: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        websiteType: formData.websiteType,
        budget: formData.budget,
        pages: formData.pages,
        description: formData.description
      });

      toast({ title: "Success!", description: "Your request has been submitted. Check Discord/WhatsApp for confirmation." })
      
      const waMessage = `Hello, I submitted a website request on RIZERWEBNP.\nName: ${formData.fullName}\nType: ${formData.websiteType}\nBudget: ${formData.budget}`
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
    <div className="container mx-auto px-4 max-w-4xl space-y-10 md:space-y-16">
      <Card className="glass border-white/10 shadow-2xl rounded-[2.5rem] overflow-hidden">
        <CardHeader className="text-center bg-white/5 pt-10 pb-8">
          <CardTitle className="font-headline text-3xl md:text-5xl font-bold mb-2">Request Your Website</CardTitle>
          <CardDescription className="text-muted-foreground font-medium">Your request is sent directly to our admin and Discord channel.</CardDescription>
        </CardHeader>
        <CardContent className="p-6 md:p-12">
          <form onSubmit={handleSubmit} className="space-y-10">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
              <div className="space-y-6">
                <h3 className="font-headline font-bold text-xl flex items-center gap-2">
                  <div className="w-1.5 h-6 bg-primary rounded-full" />
                  Contact Details
                </h3>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="fullName" className="font-bold">Full Name</Label>
                    <Input id="fullName" required value={formData.fullName} onChange={e => setFormData({...formData, fullName: e.target.value})} className="glass h-12 rounded-xl" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email" className="font-bold">Email</Label>
                    <Input id="email" type="email" required value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="glass h-12 rounded-xl" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone" className="font-bold">Phone Number</Label>
                    <Input id="phone" type="tel" required value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} className="glass h-12 rounded-xl" />
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <h3 className="font-headline font-bold text-xl flex items-center gap-2">
                  <div className="w-1.5 h-6 bg-accent rounded-full" />
                  Specification
                </h3>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="websiteType" className="font-bold">Website Type</Label>
                    <Select value={formData.websiteType} onValueChange={val => setFormData({...formData, websiteType: val})}>
                      <SelectTrigger id="websiteType" className="glass h-12 rounded-xl">
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent className="glass">
                        {WEBSITE_TYPES.map(t => (
                          <SelectItem key={t.id} value={t.id}>{t.label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="budget" className="font-bold">Budget (NPR / USD)</Label>
                    <Input id="budget" placeholder="e.g. $100 or 15,000 NPR" required value={formData.budget} onChange={e => setFormData({...formData, budget: e.target.value})} className="glass h-12 rounded-xl" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="pages" className="font-bold">Pages Needed</Label>
                    <Input id="pages" placeholder="Home, About, Services..." required value={formData.pages} onChange={e => setFormData({...formData, pages: e.target.value})} className="glass h-12 rounded-xl" />
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-8">
              <h3 className="font-headline font-bold text-xl flex items-center gap-2">
                <div className="w-1.5 h-6 bg-primary rounded-full" />
                Project Details
              </h3>
              <div className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="description" className="font-bold">Vision Description</Label>
                  <Textarea id="description" className="min-h-[120px] glass rounded-2xl p-4" placeholder="Explain what your website should do and any core business goals..." required value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between mb-2">
                    <Label htmlFor="designStyle" className="font-bold">Design Style & Idea</Label>
                    <Button type="button" variant="ghost" size="sm" onClick={handleAiSuggestion} disabled={aiLoading} className="text-primary hover:bg-primary/10 font-black text-xs uppercase tracking-wider">
                      {aiLoading ? "AI Thinking..." : <><Sparkles className="w-3 h-3 mr-2" /> AI Suggest Design</>}
                    </Button>
                  </div>
                  <Textarea id="designStyle" className="min-h-[150px] glass rounded-2xl p-4" placeholder="Describe the aesthetic (e.g. dark, minimalist, futuristic)..." value={formData.designStyle} onChange={e => setFormData({...formData, designStyle: e.target.value})} />
                </div>
              </div>
            </div>

            <div className="pt-6 flex flex-col sm:flex-row gap-4">
              <Button type="submit" size="lg" className="flex-1 h-14 rounded-2xl text-lg font-black shadow-2xl shadow-primary/20 hover:scale-[1.02] transition-all" disabled={loading}>
                <Send className="w-5 h-5 mr-3" />
                {loading ? "Processing..." : "Submit Project"}
              </Button>
              <Button type="button" variant="outline" size="lg" className="flex-1 h-14 rounded-2xl text-lg glass border-white/10 font-bold shadow-xl hover:scale-[1.02] transition-all" onClick={() => window.open(`https://wa.me/977${WHATSAPP_NUM}?text=${DEFAULT_WHATSAPP_MSG}`, '_blank')}>
                <MessageCircle className="w-5 h-5 mr-3 text-[#25D366]" />
                Direct WhatsApp
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {user && (
        <Card className="glass border-accent/20 shadow-2xl rounded-[2.5rem] overflow-hidden">
          <CardHeader className="bg-white/5 p-8">
            <CardTitle className="flex items-center gap-3 font-headline text-2xl md:text-3xl font-bold">
              <Star className="w-8 h-8 text-accent fill-accent" />
              Leave a Review
            </CardTitle>
            <CardDescription className="font-medium">Share your experience with the RIZERWEBNP community.</CardDescription>
          </CardHeader>
          <CardContent className="p-8 md:p-12">
            <form onSubmit={handleSubmitReview} className="space-y-8">
              <div className="space-y-4">
                <Label className="font-bold">Rating (1-5 Stars)</Label>
                <div className="flex gap-3">
                  {[1, 2, 3, 4, 5].map((num) => (
                    <button
                      key={num}
                      type="button"
                      onClick={() => setReviewData({ ...reviewData, rating: num })}
                      className={cn(
                        "w-12 h-12 sm:w-14 sm:h-14 rounded-2xl border-2 transition-all flex items-center justify-center font-black text-lg",
                        reviewData.rating >= num 
                          ? "bg-accent border-accent text-white shadow-lg shadow-accent/20" 
                          : "glass border-white/10 text-muted-foreground hover:border-accent/50"
                      )}
                    >
                      {num}
                    </button>
                  ))}
                </div>
              </div>
              <div className="space-y-2">
                <Label className="font-bold">Your Feedback</Label>
                <Textarea 
                  placeholder="How was our service? What did you love about your new website?" 
                  value={reviewData.text} 
                  onChange={e => setReviewData({ ...reviewData, text: e.target.value })}
                  className="glass rounded-2xl min-h-[120px] p-4"
                />
              </div>
              <Button type="submit" variant="secondary" className="w-full h-14 font-black rounded-2xl text-lg hover:bg-accent hover:text-white transition-all">Post Review</Button>
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
      <main className="flex-1 py-12">
        <Suspense fallback={
          <div className="flex-1 flex items-center justify-center py-20">
            <RefreshCw className="w-10 h-10 animate-spin text-primary opacity-50" />
          </div>
        }>
          <RequestFormContent />
        </Suspense>
      </main>
      <Footer />
    </div>
  )
}
