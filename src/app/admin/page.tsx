"use client"

import * as React from "react"
import { Navbar } from "@/components/Navbar"
import { Footer } from "@/components/Footer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { useToast } from "@/hooks/use-toast"
import { Trash2, ShieldCheck, Megaphone, Star, ClipboardList, LogOut, Phone, Tag, Percent } from "lucide-react"
import { useFirestore, useCollection, useMemoFirebase } from "@/firebase"
import { collection, doc, updateDoc, deleteDoc, addDoc, query, orderBy, setDoc } from "firebase/firestore"
import { IOSSpinner } from "@/components/ui/ios-spinner"
import { WEBSITE_TYPES } from "@/lib/types"
import { useSound } from "@/hooks/use-sound"
import { cn } from "@/lib/utils"

const ADMIN_PASSWORD = "090102030405"

export default function AdminPage() {
  const [mounted, setMounted] = React.useState(false)
  const [isAuthorized, setIsAuthorized] = React.useState(false)
  const [password, setPassword] = React.useState("")
  const [announcementInput, setAnnouncementInput] = React.useState("")
  const [isActionLoading, setIsActionLoading] = React.useState(false)
  const { toast } = useToast()
  const { play } = useSound()
  const db = useFirestore()

  React.useEffect(() => {
    setMounted(true)
    const saved = localStorage.getItem("rizer_admin_session")
    if (saved === "active") setIsAuthorized(true)
  }, [])

  const requestsQuery = useMemoFirebase(() => 
    (db && mounted && isAuthorized) ? query(collection(db, "requests"), orderBy("createdAt", "desc")) : null, 
    [db, mounted, isAuthorized]
  )
  const { data: requests, isLoading: requestsLoading } = useCollection(requestsQuery)

  const reviewsQuery = useMemoFirebase(() => 
    (db && mounted && isAuthorized) ? query(collection(db, "reviews"), orderBy("createdAt", "desc")) : null, 
    [db, mounted, isAuthorized]
  )
  const { data: reviews } = useCollection(reviewsQuery)

  const announcementsQuery = useMemoFirebase(() => 
    (db && mounted && isAuthorized) ? query(collection(db, "announcements"), orderBy("createdAt", "desc")) : null, 
    [db, mounted, isAuthorized]
  )
  const { data: announcements } = useCollection(announcementsQuery)

  const adjustmentsQuery = useMemoFirebase(() => 
    (db && mounted && isAuthorized) ? collection(db, "website_adjustments") : null, 
    [db, mounted, isAuthorized]
  )
  const { data: adjustments } = useCollection(adjustmentsQuery)

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    setIsActionLoading(true)
    
    setTimeout(() => {
      if (password === ADMIN_PASSWORD) {
        setIsAuthorized(true)
        localStorage.setItem("rizer_admin_session", "active")
        play('success')
        toast({ title: "Authorized", description: "Welcome back, Manager." })
      } else {
        play('error')
        toast({ title: "Denied", description: "Invalid management key.", variant: "destructive" })
      }
      setIsActionLoading(false)
    }, 1000)
  }

  const handleLogout = () => {
    setIsAuthorized(false)
    localStorage.removeItem("rizer_admin_session")
    play('click')
    toast({ title: "Logged Out", description: "Session ended." })
  }

  const handleUpdateStatus = async (id: string, newStatus: string) => {
    if (!db) return
    try {
      await updateDoc(doc(db, "requests", id), { status: newStatus })
      play('success')
      toast({ title: "Updated", description: "Status modified." })
    } catch (err) {
      console.error(err)
    }
  }

  const handleAdjustmentChange = async (typeId: string, field: string, value: any) => {
    if (!db) return
    const docRef = doc(db, "website_adjustments", typeId)
    try {
      const finalValue = field === 'discountPercentage' ? (Number(value) || 0) : value;
      await setDoc(docRef, { [field]: finalValue, updatedAt: new Date().toISOString() }, { merge: true })
      if (typeof value === 'boolean') play('success')
    } catch (err) {
      console.error(err)
    }
  }

  const handleDeleteRequest = async (id: string) => {
    if (!db || !confirm("Delete this request forever?")) return
    try {
      await deleteDoc(doc(db, "requests", id))
      play('error')
      toast({ title: "Deleted", description: "Request removed from admin view." })
    } catch (e) { console.error(e) }
  }

  const handleAddAnnouncement = async () => {
    if (!db || !announcementInput) return
    setIsActionLoading(true)
    try {
      await addDoc(collection(db, "announcements"), {
        content: announcementInput,
        isActive: true,
        createdAt: new Date().toISOString()
      })
      setAnnouncementInput("")
      play('success')
      toast({ title: "Live", description: "Notice published." })
    } catch (err) {
      console.error(err)
    } finally {
      setIsActionLoading(false)
    }
  }

  if (!mounted) return (
    <div className="min-h-screen flex items-center justify-center">
      <IOSSpinner size="lg" />
    </div>
  )

  if (!isAuthorized) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Navbar />
        <main className="flex-1 flex items-center justify-center p-4">
          <Card className="w-full max-w-md glass border-primary/20 shadow-2xl animate-fade-in">
            <CardHeader className="text-center">
              <div className="w-16 h-16 bg-primary/20 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-xl">
                <ShieldCheck className="w-8 h-8 text-primary" />
              </div>
              <CardTitle className="text-3xl font-headline font-bold">Manager Login</CardTitle>
              <CardDescription>RIZER STUDIO Internal Console</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleLogin} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="password">Management Key</Label>
                  <Input 
                    id="password" 
                    type="password"
                    value={password} 
                    onChange={e => setPassword(e.target.value)} 
                    placeholder="Enter key..."
                    className="glass h-12 rounded-xl" 
                    required 
                  />
                </div>
                <Button type="submit" className="w-full h-12 rounded-xl font-bold" disabled={isActionLoading}>
                  {isActionLoading ? <IOSSpinner size="sm" /> : "Enter Portal"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="flex-1 py-8 md:py-16">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="mb-10 md:mb-16 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div className="space-y-1">
              <h1 className="text-3xl md:text-5xl font-headline font-bold flex items-center gap-3">
                <ShieldCheck className="w-8 h-8 md:w-10 md:h-10 text-primary" />
                Admin Panel
              </h1>
              <p className="text-muted-foreground font-medium md:text-lg">Managing Rizer Studio Projects</p>
            </div>
            <Button variant="outline" onClick={handleLogout} className="rounded-full h-12 px-8 glass shadow-lg">
              <LogOut className="w-4 h-4 mr-2" />
              Exit Console
            </Button>
          </div>

          <Tabs defaultValue="requests" className="space-y-10">
            <TabsList className="glass p-1 h-auto md:h-16 rounded-2xl flex-wrap justify-start gap-1">
              <TabsTrigger value="requests" className="rounded-xl px-4 md:px-6 h-10 md:h-full"><ClipboardList className="w-4 h-4 mr-2" /> Requests</TabsTrigger>
              <TabsTrigger value="pricing" className="rounded-xl px-4 md:px-6 h-10 md:h-full"><Percent className="w-4 h-4 mr-2" /> Pricing</TabsTrigger>
              <TabsTrigger value="reviews" className="rounded-xl px-4 md:px-6 h-10 md:h-full"><Star className="w-4 h-4 mr-2" /> Reviews</TabsTrigger>
              <TabsTrigger value="announcements" className="rounded-xl px-4 md:px-6 h-10 md:h-full"><Megaphone className="w-4 h-4 mr-2" /> Notices</TabsTrigger>
            </TabsList>

            <TabsContent value="requests" className="animate-fade-in">
              <Card className="glass overflow-hidden rounded-[2rem] shadow-2xl">
                <CardContent className="p-0 overflow-x-auto">
                  <Table className="min-w-[800px]">
                    <TableHeader className="bg-white/5">
                      <TableRow className="border-white/10 hover:bg-transparent">
                        <TableHead className="pl-8 py-6 uppercase tracking-wider text-[11px] font-black opacity-60">Client</TableHead>
                        <TableHead className="py-6 uppercase tracking-wider text-[11px] font-black opacity-60">Type</TableHead>
                        <TableHead className="py-6 uppercase tracking-wider text-[11px] font-black opacity-60">Status</TableHead>
                        <TableHead className="text-right pr-8 py-6 uppercase tracking-wider text-[11px] font-black opacity-60">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {requestsLoading ? (
                        <TableRow><TableCell colSpan={4} className="text-center py-32"><IOSSpinner size="lg" className="mx-auto" /></TableCell></TableRow>
                      ) : !requests || requests.length === 0 ? (
                        <TableRow><TableCell colSpan={4} className="text-center py-32 text-muted-foreground font-medium">No active build requests found.</TableCell></TableRow>
                      ) : requests.map((req) => (
                        <TableRow key={req.id} className="border-white/5 hover:bg-white/5 transition-colors">
                          <TableCell className="pl-8 py-8">
                            <div className="font-bold text-xl mb-1">{req.fullName || "Anonymous Client"}</div>
                            <div className="text-[10px] text-muted-foreground uppercase tracking-[0.2em] font-black">{req.email}</div>
                            <div className="flex items-center gap-2 text-[12px] text-primary font-bold mt-2 bg-primary/10 w-fit px-3 py-1 rounded-full border border-primary/20">
                              <Phone className="w-3.5 h-3.5" />
                              {req.phone || req.whatsapp || 'N/A'}
                            </div>
                          </TableCell>
                          <TableCell className="capitalize font-black text-foreground/80">{req.websiteType}</TableCell>
                          <TableCell>
                            <Select value={req.status || 'pending'} onValueChange={(val) => handleUpdateStatus(req.id, val)}>
                              <SelectTrigger className="w-[160px] h-11 glass rounded-xl text-[13px] font-bold">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent className="glass">
                                <SelectItem value="pending">Pending</SelectItem>
                                <SelectItem value="processing">Processing</SelectItem>
                                <SelectItem value="completed">Completed</SelectItem>
                                <SelectItem value="cancelled">Cancelled</SelectItem>
                              </SelectContent>
                            </Select>
                          </TableCell>
                          <TableCell className="text-right pr-8">
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              onClick={() => handleDeleteRequest(req.id)} 
                              className="text-destructive hover:bg-destructive/10 rounded-xl h-12 w-12 transition-all border border-transparent hover:border-destructive/20"
                            >
                              <Trash2 className="w-5 h-5" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Other tabs remain unchanged for brevity but ensure they also use correct Rizer Studio branding and logic */}
            <TabsContent value="pricing" className="animate-fade-in">
              <Card className="glass overflow-hidden rounded-[2rem] shadow-2xl">
                <CardHeader className="p-8 md:p-12 bg-white/5">
                  <CardTitle className="font-headline text-2xl md:text-3xl font-bold">Pricing & Tag Management</CardTitle>
                  <CardDescription className="text-lg font-medium opacity-70">Adjust discounts and promotional labels. Changes apply instantly to the website packages.</CardDescription>
                </CardHeader>
                <CardContent className="p-0 overflow-x-auto">
                  <Table className="min-w-[900px]">
                    <TableHeader className="bg-white/5">
                      <TableRow className="border-white/10 hover:bg-transparent">
                        <TableHead className="pl-8 py-6 uppercase tracking-wider text-[11px] font-black opacity-60">Package Category</TableHead>
                        <TableHead className="py-6 uppercase tracking-wider text-[11px] font-black opacity-60">Discount (%)</TableHead>
                        <TableHead className="py-6 uppercase tracking-wider text-[11px] font-black opacity-60">Promo Label</TableHead>
                        <TableHead className="text-right pr-8 py-6 uppercase tracking-wider text-[11px] font-black opacity-60">Visibility</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {WEBSITE_TYPES.map((type) => {
                        const adj = adjustments?.find(a => a.id === type.id) || { discountPercentage: 0, customTag: "", isActive: false }
                        return (
                          <TableRow key={type.id} className="border-white/5 hover:bg-white/5 transition-colors">
                            <TableCell className="pl-8 py-8">
                              <div className="font-bold text-xl mb-1">{type.label}</div>
                              <div className="text-[10px] text-muted-foreground uppercase tracking-[0.2em] font-black">Base Pricing: {type.price}</div>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-3 max-w-[140px]">
                                <Input 
                                  type="number" 
                                  placeholder="0"
                                  value={adj.discountPercentage} 
                                  onChange={(e) => handleAdjustmentChange(type.id, "discountPercentage", e.target.value)}
                                  className="glass h-12 rounded-xl text-center font-black text-lg"
                                />
                                <span className="font-black text-muted-foreground text-xl">%</span>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="relative max-w-[200px]">
                                <Input 
                                  placeholder="e.g. HOT DEAL"
                                  value={adj.customTag} 
                                  onChange={(e) => handleAdjustmentChange(type.id, "customTag", e.target.value)}
                                  className="glass h-12 rounded-xl pl-10 font-bold"
                                />
                                <Tag className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-primary opacity-50" />
                              </div>
                            </TableCell>
                            <TableCell className="text-right pr-8">
                              <div className="flex items-center justify-end gap-4">
                                <span className={cn(
                                  "font-black text-[11px] tracking-widest",
                                  adj.isActive ? "text-accent" : "text-muted-foreground"
                                )}>
                                  {adj.isActive ? "LIVE" : "DORMANT"}
                                </span>
                                <Switch 
                                  checked={adj.isActive || false} 
                                  onCheckedChange={(val) => handleAdjustmentChange(type.id, "isActive", val)}
                                  className="data-[state=checked]:bg-accent"
                                />
                              </div>
                            </TableCell>
                          </TableRow>
                        )
                      })}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="reviews" className="animate-fade-in">
              <Card className="glass overflow-hidden rounded-[2rem] shadow-2xl">
                <CardContent className="p-0 overflow-x-auto">
                  <Table className="min-w-[800px]">
                    <TableHeader className="bg-white/5">
                      <TableRow className="border-white/10 hover:bg-transparent">
                        <TableHead className="pl-8 py-6 uppercase tracking-wider text-[11px] font-black opacity-60">Review Author</TableHead>
                        <TableHead className="py-6 uppercase tracking-wider text-[11px] font-black opacity-60">Feedback Content</TableHead>
                        <TableHead className="text-right pr-8 py-6 uppercase tracking-wider text-[11px] font-black opacity-60">Approval Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {!reviews || reviews.length === 0 ? (
                        <TableRow><TableCell colSpan={3} className="text-center py-32 text-muted-foreground font-medium">No client reviews submitted yet.</TableCell></TableRow>
                      ) : reviews.map((rev) => (
                        <TableRow key={rev.id} className="border-white/5 hover:bg-white/5 transition-colors">
                          <TableCell className="pl-8 py-8">
                            <div className="font-bold text-lg">{rev.userName}</div>
                            <div className="flex gap-1 mt-1">
                              {[1, 2, 3, 4, 5].map(s => (
                                <Star key={s} className={cn("w-3 h-3", s <= rev.rating ? "fill-accent text-accent" : "text-white/10")} />
                              ))}
                            </div>
                          </TableCell>
                          <TableCell className="max-w-md py-8">
                            <p className="italic text-muted-foreground leading-relaxed">"{rev.text}"</p>
                          </TableCell>
                          <TableCell className="text-right pr-8">
                            <Select value={rev.status} onValueChange={async (val) => {
                               try {
                                 await updateDoc(doc(db!, "reviews", rev.id), { status: val })
                                 play('success')
                                 toast({ title: "Review Updated" })
                               } catch (e) { console.error(e) }
                            }}>
                              <SelectTrigger className="w-[140px] h-10 glass rounded-xl text-xs font-black ml-auto">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent className="glass">
                                <SelectItem value="pending">Pending</SelectItem>
                                <SelectItem value="approved">Approved</SelectItem>
                                <SelectItem value="rejected">Rejected</SelectItem>
                              </SelectContent>
                            </Select>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="announcements" className="animate-fade-in">
              <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
                <Card className="lg:col-span-2 glass rounded-[2.5rem] shadow-2xl h-fit">
                  <CardHeader className="p-8"><CardTitle className="font-headline text-2xl">Publish New Notice</CardTitle></CardHeader>
                  <CardContent className="p-8 pt-0 space-y-8">
                    <div className="space-y-3">
                      <Label className="font-bold text-sm">Announcement Message</Label>
                      <Input 
                        placeholder="e.g. Season Sale: 30% OFF on all builds!" 
                        value={announcementInput} 
                        onChange={e => setAnnouncementInput(e.target.value)}
                        className="glass h-14 rounded-2xl font-medium px-6 text-lg"
                      />
                    </div>
                    <Button onClick={handleAddAnnouncement} className="w-full h-16 rounded-2xl font-black text-xl shadow-2xl shadow-primary/30" disabled={isActionLoading}>
                      {isActionLoading ? <IOSSpinner size="sm" /> : "Post Announcement"}
                    </Button>
                  </CardContent>
                </Card>
                
                <Card className="lg:col-span-3 glass rounded-[2.5rem] shadow-2xl overflow-hidden">
                  <CardHeader className="p-8 bg-white/5"><CardTitle className="font-headline text-2xl">Broadcast History</CardTitle></CardHeader>
                  <CardContent className="p-0">
                    <div className="divide-y divide-white/5">
                      {!announcements || announcements.length === 0 ? (
                        <div className="p-20 text-center text-muted-foreground font-medium italic">No announcement history found.</div>
                      ) : announcements.map(ann => (
                        <div key={ann.id} className="p-6 md:p-8 flex justify-between items-center hover:bg-white/5 transition-colors">
                          <div className="flex flex-col gap-1.5">
                            <span className="text-lg font-bold leading-tight">{ann.content}</span>
                            <span className="text-[11px] text-muted-foreground font-black uppercase tracking-widest">{new Date(ann.createdAt).toLocaleDateString()}</span>
                          </div>
                          <div className="flex items-center gap-4">
                            <Badge className={cn(
                              "h-7 px-4 rounded-lg font-black text-[10px] tracking-widest uppercase",
                              ann.isActive ? "bg-accent text-white" : "bg-white/10 text-muted-foreground"
                            )}>
                              {ann.isActive ? "Active" : "Archived"}
                            </Badge>
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              onClick={async () => {
                                if(confirm("Permanently delete this notice?")) {
                                  try {
                                    await deleteDoc(doc(db!, "announcements", ann.id))
                                    play('error')
                                    toast({ title: "Deleted", description: "Notice removed from database." })
                                  } catch (e) { console.error(e) }
                                }
                              }}
                              className="text-destructive hover:bg-destructive/10 h-12 w-12 rounded-xl transition-all"
                            >
                              <Trash2 className="w-5 h-5" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>
      <Footer />
    </div>
  )
}
