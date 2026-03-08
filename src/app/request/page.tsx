
"use client"

import * as React from "react"
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
import { useFirestore } from "@/firebase"
import { collection, addDoc } from "firebase/firestore"

const WHATSAPP_NUM = "9805602394"

export default function RequestPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const { toast } = useToast()
  const db = useFirestore()
  
  const [user, setUser] = React.useState<any>(null)
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

  // Review Form State
  const [reviewData, setReviewData] = React.useState({
    text: "",
    rating: 5
  })

  React.useEffect(() => {
    const savedUser = localStorage.getItem('rizerweb_user')
    if (savedUser) {
      const u = JSON.parse(savedUser)
      setUser(u)
      setFormData(prev => ({ ...prev, fullName: u.name, email: u.email, phone: u.phone, whatsapp: u.phone }))
    }
  }, [])

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

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!db || !user) {
      toast({ title: "Login Required", description: "Please login to leave a review.", variant: "destructive" })
      return
    }

    try {
      await addDoc(collection(db, "reviews"), {
        userId: user.id,
        userName: user.name,
        text: reviewData.text,
        rating: reviewData.rating,
        status: "pending",
        createdAt: new Date().toISOString()
      })
      setReviewData({ text: "", rating: 5 })
      toast({ title: "Review Submitted", description: "Thanks! It will be visible after admin approval." })
    } catch (e) {
      toast({ title: "Error", description: "Could not submit review.", variant: "destructive" })
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!db) return
    setLoading(true)

    try {
      // 1. Save to Firestore
      await addDoc(collection(db, "requests"), {
        ...formData,
        userId: user?.id || 'guest',
        userName: formData.fullName,
        status: 'pending',
        createdAt: new Date().toISOString()
      })

      toast({ title: "Success!", description: "Your request has been submitted to Firestore." })

      // 2. Redirect to WhatsApp
      const waMessage = `Hello, I submitted a website request on RIZERWEBNP.\nName: ${formData.fullName}\nType: ${formData.websiteType}`
      const encodedMsg = encodeURIComponent(waMessage)
      
      setTimeout(() => {
        window.open(`https://wa.me/${WHATSAPP_NUM}?text=${encodedMsg}`, '_blank')
        router.push('/dashboard')
      }, 1500)

    } catch (error) {
      toast({ title: "Submission Error", description: "There was a problem sending your request.", variant: "destructive" })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 py-12">
        <div className="container mx-auto px-4 max-w-4xl space-y-12">
          {/* Main Request Form */}
          <Card className="glass border-border/50 shadow-2xl">
            <CardHeader className="text-center">
              <CardTitle className="font-headline text-4xl font-bold">Request Your Website</CardTitle>
              <CardDescription>All requests are now saved securely in our cloud database.</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Basic Info */}
                  <div className="space-y-4">
                    <h3 className="font-headline font-semibold text-lg border-b border-border pb-2">Contact Details</h3>
                    <div className="space-y-2">
                      <Label htmlFor="fullName">Full Name</Label>
                      <Input id="fullName" required value={formData.fullName} onChange={e => setFormData({...formData, fullName: e.target.value})} className="glass" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input id="email" type="email" required value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="glass" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input id="phone" type="tel" required value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} className="glass" />
                    </div>
                  </div>

                  {/* Website Info */}
                  <div className="space-y-4">
                    <h3 className="font-headline font-semibold text-lg border-b border-border pb-2">Website Specification</h3>
                    <div className="space-y-2">
                      <Label htmlFor="websiteType">Website Type</Label>
                      <Select value={formData.websiteType} onValueChange={val => setFormData({...formData, websiteType: val})}>
                        <SelectTrigger id="websiteType" className="glass">
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                        <SelectContent>
                          {WEBSITE_TYPES.map(t => (
                            <SelectItem key={t.id} value={t.id}>{t.label}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="budget">Budget Amount (NPR / USD)</Label>
                      <Input id="budget" placeholder="e.g. $100 or 15,000 NPR" required value={formData.budget} onChange={e => setFormData({...formData, budget: e.target.value})} className="glass" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="pages">Pages Needed</Label>
                      <Input id="pages" placeholder="Home, About..." required value={formData.pages} onChange={e => setFormData({...formData, pages: e.target.value})} className="glass" />
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                  <h3 className="font-headline font-semibold text-lg border-b border-border pb-2">Project Details</h3>
                  <div className="space-y-2">
                    <Label htmlFor="description">Vision Description</Label>
                    <Textarea id="description" className="min-h-[100px] glass" placeholder="Explain what your website should do..." required value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} />
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="designStyle">Design Style & Idea</Label>
                      <Button type="button" variant="ghost" size="sm" onClick={handleAiSuggestion} disabled={aiLoading} className="text-primary">
                        {aiLoading ? "Thinking..." : <><Sparkles className="w-4 h-4 mr-2" /> AI Suggest Design</>}
                      </Button>
                    </div>
                    <Textarea id="designStyle" className="min-h-[120px] glass" value={formData.designStyle} onChange={e => setFormData({...formData, designStyle: e.target.value})} />
                  </div>
                </div>

                <div className="pt-6 flex flex-col md:flex-row gap-4">
                  <Button type="submit" size="lg" className="flex-1 h-14 rounded-full text-lg shadow-xl" disabled={loading}>
                    <Send className="w-5 h-5 mr-2" />
                    {loading ? "Submitting..." : "Submit to Cloud"}
                  </Button>
                  <Button type="button" variant="outline" size="lg" className="flex-1 h-14 rounded-full text-lg glass shadow-xl" onClick={() => window.open(`https://wa.me/${WHATSAPP_NUM}`, '_blank')}>
                    <MessageCircle className="w-5 h-5 mr-2" />
                    Direct WhatsApp
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>

          {/* Review Submission Form */}
          {user && (
            <Card className="glass border-accent/30 shadow-2xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Star className="w-6 h-6 text-accent fill-accent" />
                  Leave a Review
                </CardTitle>
                <CardDescription>Share your experience with others.</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmitReview} className="space-y-4">
                  <div className="space-y-2">
                    <Label>Rating (1-5)</Label>
                    <div className="flex gap-2">
                      {[1, 2, 3, 4, 5].map((num) => (
                        <button
                          key={num}
                          type="button"
                          onClick={() => setReviewData({ ...reviewData, rating: num })}
                          className={cn(
                            "p-2 rounded-lg border transition-all",
                            reviewData.rating >= num ? "bg-accent border-accent text-white" : "glass border-border"
                          )}
                        >
                          {num}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Your Feedback</Label>
                    <Textarea 
                      placeholder="How was our service?" 
                      value={reviewData.text} 
                      onChange={e => setReviewData({ ...reviewData, text: e.target.value })}
                      className="glass"
                    />
                  </div>
                  <Button type="submit" variant="secondary" className="w-full font-bold">Post Review</Button>
                </form>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
      <Footer />
    </div>
  )
}
