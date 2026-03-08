
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
import { Sparkles, Send, MessageCircle } from "lucide-react"
import { WEBSITE_TYPES } from "@/lib/types"
import { aiDesignSuggestion } from "@/ai/flows/ai-design-suggestion-flow"

const DISCORD_WEBHOOK = "https://discord.com/api/webhooks/1480167096888463401/Up3TfGIrO0qGw_Bh7CAe-FCQjKdEO2M5Np30CsxKARYThaQqRORkJwuTQycOuf34OBKv"
const WHATSAPP_NUM = "9805602394"

export default function RequestPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const { toast } = useToast()
  
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
      toast({ title: "AI Error", description: "Failed to get AI suggestions. Please try again.", variant: "destructive" })
    } finally {
      setAiLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      // 1. Send to Discord Webhook
      const discordPayload = {
        embeds: [{
          title: "New Website Request – RIZERWEBNP",
          color: 5789875, // Indigo #5858B3
          fields: Object.entries(formData).map(([key, value]) => ({
            name: key.replace(/([A-Z])/g, ' $1').toUpperCase(),
            value: value || "Not specified",
            inline: false
          })),
          timestamp: new Date().toISOString()
        }]
      }

      await fetch(DISCORD_WEBHOOK, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(discordPayload)
      })

      // 2. Save to local storage
      const requestsRaw = localStorage.getItem('rizerweb_requests_db')
      const requests = requestsRaw ? JSON.parse(requestsRaw) : []
      const newRequest = {
        ...formData,
        id: Math.random().toString(36).substr(2, 9),
        userId: user?.id || 'guest',
        userName: formData.fullName,
        status: 'pending',
        createdAt: new Date().toISOString()
      }
      requests.push(newRequest)
      localStorage.setItem('rizerweb_requests_db', JSON.stringify(requests))

      toast({ title: "Success!", description: "Your request has been submitted. Redirecting to WhatsApp..." })

      // 3. Redirect to WhatsApp
      const waMessage = `Hello, I submitted a website request on RIZERWEBNP.

Name: ${formData.fullName}
Email: ${formData.email}
Phone: ${formData.phone}
Website Type: ${formData.websiteType}
Budget: ${formData.budget}
Description: ${formData.description}
Functions Needed: ${formData.functions}`

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
        <div className="container mx-auto px-4 max-w-4xl">
          <Card className="glass border-border/50">
            <CardHeader className="text-center">
              <CardTitle className="font-headline text-4xl font-bold">Request Your Website</CardTitle>
              <CardDescription>Fill out the details below and we'll get started on your dream project.</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Basic Info */}
                  <div className="space-y-4">
                    <h3 className="font-headline font-semibold text-lg border-b border-border pb-2">Contact Details</h3>
                    <div className="space-y-2">
                      <Label htmlFor="fullName">Full Name</Label>
                      <Input id="fullName" required value={formData.fullName} onChange={e => setFormData({...formData, fullName: e.target.value})} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input id="email" type="email" required value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input id="phone" type="tel" required value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="whatsapp">WhatsApp Number</Label>
                      <Input id="whatsapp" type="tel" required value={formData.whatsapp} onChange={e => setFormData({...formData, whatsapp: e.target.value})} />
                    </div>
                  </div>

                  {/* Website Info */}
                  <div className="space-y-4">
                    <h3 className="font-headline font-semibold text-lg border-b border-border pb-2">Website Specification</h3>
                    <div className="space-y-2">
                      <Label htmlFor="websiteType">Website Type</Label>
                      <Select value={formData.websiteType} onValueChange={val => setFormData({...formData, websiteType: val})}>
                        <SelectTrigger id="websiteType">
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
                      <Input id="budget" placeholder="e.g. $100 or 15,000 NPR" required value={formData.budget} onChange={e => setFormData({...formData, budget: e.target.value})} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="title">Website Title</Label>
                      <Input id="title" placeholder="e.g. My Cool Shop" required value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="pages">Number of Pages Needed</Label>
                      <Input id="pages" placeholder="e.g. Home, About, Contact" required value={formData.pages} onChange={e => setFormData({...formData, pages: e.target.value})} />
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                  <h3 className="font-headline font-semibold text-lg border-b border-border pb-2">Project Details</h3>
                  <div className="space-y-2">
                    <Label htmlFor="description">Website Description (Vision)</Label>
                    <Textarea id="description" className="min-h-[100px]" placeholder="Explain what your website should do..." required value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} />
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="designStyle">Design Style & Idea</Label>
                      <Button 
                        type="button" 
                        variant="ghost" 
                        size="sm" 
                        className="text-primary hover:text-primary/80" 
                        onClick={handleAiSuggestion}
                        disabled={aiLoading}
                      >
                        {aiLoading ? "Thinking..." : <><Sparkles className="w-4 h-4 mr-2" /> AI Suggest Design</>}
                      </Button>
                    </div>
                    <Textarea id="designStyle" className="min-h-[120px]" placeholder="How should it look? (Glassmorphism, Dark, Modern...)" value={formData.designStyle} onChange={e => setFormData({...formData, designStyle: e.target.value})} />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="functions">Functions Required</Label>
                      <Textarea id="functions" placeholder="e.g. Login system, Cart, Blog section" value={formData.functions} onChange={e => setFormData({...formData, functions: e.target.value})} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="extraFeatures">Extra Features</Label>
                      <Textarea id="extraFeatures" placeholder="e.g. Live chat, Map integration" value={formData.extraFeatures} onChange={e => setFormData({...formData, extraFeatures: e.target.value})} />
                    </div>
                  </div>
                </div>

                <div className="pt-6 flex flex-col md:flex-row gap-4">
                  <Button type="submit" size="lg" className="flex-1 h-14 rounded-full text-lg" disabled={loading}>
                    <Send className="w-5 h-5 mr-2" />
                    {loading ? "Submitting..." : "Submit Request"}
                  </Button>
                  <Button type="button" variant="outline" size="lg" className="flex-1 h-14 rounded-full text-lg glass" onClick={() => window.open(`https://wa.me/${WHATSAPP_NUM}`, '_blank')}>
                    <MessageCircle className="w-5 h-5 mr-2" />
                    Direct WhatsApp
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  )
}
