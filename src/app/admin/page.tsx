
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
      await setDoc(docRef, { [field]: value, updatedAt: new Date().toISOString() }, { merge: true })
      // Silent update for better UX on text inputs, but maybe play sound for toggle
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
      <main className="flex-1 py-12">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="mb-12 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div className="space-y-1">
              <h1 className="text-4xl font-headline font-bold flex items-center gap-3">
                <ShieldCheck className="w-8 h-8 text-primary" />
                Admin Panel
              </h1>
              <p className="text-muted-foreground font-medium">Managing Rizer Studio Projects</p>
            </div>
            <Button variant="outline" onClick={handleLogout} className="rounded-full h-10 px-6 glass">
              <LogOut className="w-4 h-4 mr-2" />
              Exit Console
            </Button>
          </div>

          <Tabs defaultValue="requests" className="space-y-8">
            <TabsList className="glass p-1 h-14 rounded-2xl flex-wrap justify-start">
              <TabsTrigger value="requests" className="rounded-xl px-6"><ClipboardList className="w-4 h-4 mr-2" /> Requests</TabsTrigger>
              <TabsTrigger value="pricing" className="rounded-xl px-6"><Percent className="w-4 h-4 mr-2" /> Pricing</TabsTrigger>
              <TabsTrigger value="reviews" className="rounded-xl px-6"><Star className="w-4 h-4 mr-2" /> Reviews</TabsTrigger>
              <TabsTrigger value="announcements" className="rounded-xl px-6"><Megaphone className="w-4 h-4 mr-2" /> Notices</TabsTrigger>
            </TabsList>

            <TabsContent value="requests" className="animate-fade-in">
              <Card className="glass overflow-hidden rounded-[2rem]">
                <CardContent className="p-0">
                  <Table>
                    <TableHeader className="bg-white/5">
                      <TableRow className="border-white/10">
                        <TableHead className="pl-8">Client</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right pr-8">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {requestsLoading ? (
                        <TableRow><TableCell colSpan={4} className="text-center py-20"><IOSSpinner size="lg" className="mx-auto" /></TableCell></TableRow>
                      ) : !requests || requests.length === 0 ? (
                        <TableRow><TableCell colSpan={4} className="text-center py-20 text-muted-foreground">No build requests found.</TableCell></TableRow>
                      ) : requests.map((req) => (
                        <TableRow key={req.id} className="border-white/5 hover:bg-white/5">
                          <TableCell className="pl-8 py-6">
                            <div className="font-bold text-lg">{req.fullName || "Anonymous Client"}</div>
                            <div className="text-[10px] text-muted-foreground uppercase tracking-widest">{req.email}</div>
                            <div className="flex items-center gap-1.5 text-[11px] text-primary font-bold mt-1">
                              <Phone className="w-3 h-3" />
                              {req.phone || req.whatsapp || 'N/A'}
                            </div>
                          </TableCell>
                          <TableCell className="capitalize font-bold">{req.websiteType}</TableCell>
                          <TableCell>
                            <Select value={req.status || 'pending'} onValueChange={(val) => handleUpdateStatus(req.id, val)}>
                              <SelectTrigger className="w-[140px] h-10 glass rounded-xl text-xs font-bold">
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
                            <Button variant="ghost" size="icon" onClick={() => handleDeleteRequest(req.id)} className="text-destructive hover:bg-destructive/10 rounded-xl">
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="pricing" className="animate-fade-in">
              <Card className="glass overflow-hidden rounded-[2rem]">
                <CardHeader>
                  <CardTitle className="font-headline">Pricing & Tag Management</CardTitle>
                  <CardDescription>Adjust discounts and labels. Changes apply instantly to the Website Types page.</CardDescription>
                </CardHeader>
                <CardContent className="p-0">
                  <Table>
                    <TableHeader className="bg-white/5">
                      <TableRow className="border-white/10">
                        <TableHead className="pl-8">Package</TableHead>
                        <TableHead>Discount (%)</TableHead>
                        <TableHead>Custom Tag</TableHead>
                        <TableHead className="text-right pr-8">Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {WEBSITE_TYPES.map((type) => {
                        const adj = adjustments?.find(a => a.id === type.id) || { discountPercentage: 0, customTag: "", isActive: false }
                        return (
                          <TableRow key={type.id} className="border-white/5 hover:bg-white/5">
                            <TableCell className="pl-8 py-6">
                              <div className="font-bold text-lg">{type.label}</div>
                              <div className="text-[10px] text-muted-foreground uppercase tracking-widest">Base: {type.price}</div>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2 max-w-[120px]">
                                <Input 
                                  type="number" 
                                  placeholder="0"
                                  value={adj.discountPercentage} 
                                  onChange={(e) => handleAdjustmentChange(type.id, "discountPercentage", Number(e.target.value))}
                                  className="glass h-10 rounded-xl text-center"
                                />
                                <span className="font-bold text-muted-foreground">%</span>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="relative max-w-[180px]">
                                <Input 
                                  placeholder="e.g. HOT DEAL"
                                  value={adj.customTag} 
                                  onChange={(e) => handleAdjustmentChange(type.id, "customTag", e.target.value)}
                                  className="glass h-10 rounded-xl pl-9"
                                />
                                <Tag className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-primary opacity-50" />
                              </div>
                            </TableCell>
                            <TableCell className="text-right pr-8">
                              <div className="flex items-center justify-end gap-3">
                                <span className={adj.isActive ? "text-accent font-bold text-xs" : "text-muted-foreground font-bold text-xs"}>
                                  {adj.isActive ? "ACTIVE" : "OFF"}
                                </span>
                                <Switch 
                                  checked={adj.isActive} 
                                  onCheckedChange={(val) => handleAdjustmentChange(type.id, "isActive", val)}
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
              <Card className="glass overflow-hidden rounded-[2rem]">
                <CardContent className="p-0">
                  <Table>
                    <TableHeader className="bg-white/5">
                      <TableRow className="border-white/10">
                        <TableHead className="pl-8">Author</TableHead>
                        <TableHead>Content</TableHead>
                        <TableHead className="text-right pr-8">Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {!reviews || reviews.length === 0 ? (
                        <TableRow><TableCell colSpan={3} className="text-center py-20 text-muted-foreground">No reviews yet.</TableCell></TableRow>
                      ) : reviews.map((rev) => (
                        <TableRow key={rev.id} className="border-white/5 hover:bg-white/5">
                          <TableCell className="pl-8 font-bold">{rev.userName}</TableCell>
                          <TableCell className="max-w-md italic text-muted-foreground">"{rev.text}"</TableCell>
                          <TableCell className="text-right pr-8">
                            <Select value={rev.status} onValueChange={async (val) => {
                               try {
                                 await updateDoc(doc(db!, "reviews", rev.id), { status: val })
                                 play('success')
                                 toast({ title: "Review Updated" })
                               } catch (e) { console.error(e) }
                            }}>
                              <SelectTrigger className="w-[120px] h-9 glass rounded-xl text-xs ml-auto">
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
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <Card className="glass rounded-[2rem]">
                  <CardHeader><CardTitle>New Notice</CardTitle></CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-2">
                      <Label>Announcement Text</Label>
                      <Input 
                        placeholder="e.g. New Year Discount!" 
                        value={announcementInput} 
                        onChange={e => setAnnouncementInput(e.target.value)}
                        className="glass h-12 rounded-xl"
                      />
                    </div>
                    <Button onClick={handleAddAnnouncement} className="w-full h-12 rounded-xl font-bold" disabled={isActionLoading}>
                      {isActionLoading ? <IOSSpinner size="sm" /> : "Post Notice"}
                    </Button>
                  </CardContent>
                </Card>
                <Card className="glass rounded-[2rem] overflow-hidden">
                  <CardHeader><CardTitle>History</CardTitle></CardHeader>
                  <CardContent className="p-0">
                    <div className="divide-y divide-white/5">
                      {!announcements || announcements.length === 0 ? (
                        <div className="p-10 text-center text-muted-foreground">No announcement history.</div>
                      ) : announcements.map(ann => (
                        <div key={ann.id} className="p-4 flex justify-between items-center hover:bg-white/5 transition-colors">
                          <div className="flex flex-col">
                            <span className="text-sm font-medium">{ann.content}</span>
                            <span className="text-[10px] text-muted-foreground">{new Date(ann.createdAt).toLocaleDateString()}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge className={ann.isActive ? "bg-accent" : "bg-muted"}>
                              {ann.isActive ? "Active" : "Archived"}
                            </Badge>
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              onClick={async () => {
                                if(confirm("Delete notice?")) {
                                  try {
                                    await deleteDoc(doc(db!, "announcements", ann.id))
                                    play('error')
                                    toast({ title: "Deleted" })
                                  } catch (e) { console.error(e) }
                                }
                              }}
                              className="text-destructive hover:bg-destructive/10 h-8 w-8 rounded-lg"
                            >
                              <Trash2 className="w-4 h-4" />
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
