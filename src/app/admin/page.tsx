
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
import { useToast } from "@/hooks/use-toast"
import { Trash2, ShieldCheck, Megaphone, Star, ClipboardList, RefreshCw, LogOut } from "lucide-react"
import { useFirestore, useCollection, useMemoFirebase } from "@/firebase"
import { collection, doc, updateDoc, deleteDoc, addDoc, query, orderBy } from "firebase/firestore"
import { cn } from "@/lib/utils"

const ADMIN_PASSWORD = "090102030405"

export default function AdminPage() {
  const [mounted, setMounted] = React.useState(false)
  const [isAuthorized, setIsAuthorized] = React.useState(false)
  const [password, setPassword] = React.useState("")
  const [announcementInput, setAnnouncementInput] = React.useState("")
  const { toast } = useToast()
  const db = useFirestore()

  // Prevent hydration mismatches
  React.useEffect(() => {
    setMounted(true)
  }, [])

  // Strictly gate queries by authorization state to prevent permission errors/crashes for guests
  const requestsQuery = useMemoFirebase(() => 
    (db && isAuthorized && mounted) ? query(collection(db, "requests"), orderBy("createdAt", "desc")) : null, 
    [db, isAuthorized, mounted]
  )
  const { data: requests, isLoading: requestsLoading } = useCollection(requestsQuery)

  const reviewsQuery = useMemoFirebase(() => 
    (db && isAuthorized && mounted) ? query(collection(db, "reviews"), orderBy("createdAt", "desc")) : null, 
    [db, isAuthorized, mounted]
  )
  const { data: reviews } = useCollection(reviewsQuery)

  const announcementsQuery = useMemoFirebase(() => 
    (db && isAuthorized && mounted) ? query(collection(db, "announcements"), orderBy("createdAt", "desc")) : null, 
    [db, isAuthorized, mounted]
  )
  const { data: announcements } = useCollection(announcementsQuery)

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    if (password === ADMIN_PASSWORD) {
      setIsAuthorized(true)
      toast({ title: "Welcome Admin", description: "Full access to Rizer Web App granted." })
    } else {
      toast({ title: "Access Denied", description: "Incorrect management password.", variant: "destructive" })
    }
  }

  const handleUpdateStatus = async (id: string, newStatus: string) => {
    if (!db) return
    try {
      await updateDoc(doc(db, "requests", id), { status: newStatus })
      toast({ title: "Status Updated", description: `Request ${id.slice(0,5)} is now ${newStatus}.` })
    } catch (err) {
      console.error(err)
    }
  }

  const handleDeleteRequest = async (id: string) => {
    if (!db || !confirm("Permanently delete this project request?")) return
    try {
      await deleteDoc(doc(db, "requests", id))
      toast({ title: "Deleted", description: "Project removed from database." })
    } catch (err) {
      console.error(err)
    }
  }

  const handleReviewStatus = async (id: string, newStatus: string) => {
    if (!db) return
    try {
      await updateDoc(doc(db, "reviews", id), { status: newStatus })
      toast({ title: "Review Updated", description: "Client testimonial status changed." })
    } catch (err) {
      console.error(err)
    }
  }

  const handleAddAnnouncement = async () => {
    if (!db || !announcementInput) return
    try {
      await addDoc(collection(db, "announcements"), {
        content: announcementInput,
        isActive: true,
        createdAt: new Date().toISOString()
      })
      setAnnouncementInput("")
      toast({ title: "Announcement Live", description: "The homepage banner has been updated." })
    } catch (err) {
      console.error(err)
    }
  }

  const formatDate = (dateValue: any) => {
    if (!mounted || !dateValue) return "..."
    try {
      const d = new Date(dateValue)
      return isNaN(d.getTime()) ? "N/A" : d.toLocaleDateString()
    } catch {
      return "Error"
    }
  }

  if (!mounted) return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <RefreshCw className="w-10 h-10 animate-spin text-primary opacity-20" />
    </div>
  )

  if (!isAuthorized) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 flex items-center justify-center p-4">
          <Card className="w-full max-w-md glass border-primary/20 shadow-2xl animate-fade-in">
            <CardHeader className="text-center">
              <div className="w-16 h-16 bg-primary/20 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-xl">
                <ShieldCheck className="w-8 h-8 text-primary" />
              </div>
              <CardTitle className="text-3xl font-headline font-bold">Admin Portal</CardTitle>
              <CardDescription>RIZER WEB APP Management Console</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleLogin} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="password">Management Password</Label>
                  <Input 
                    id="password" 
                    type="password" 
                    value={password} 
                    onChange={e => setPassword(e.target.value)} 
                    placeholder="Enter admin key..."
                    className="glass h-12 rounded-xl" 
                    required 
                  />
                </div>
                <Button type="submit" className="w-full h-12 rounded-xl font-bold">Authenticate</Button>
              </form>
            </CardContent>
          </Card>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 py-12">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="mb-12 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div className="space-y-1">
              <h1 className="text-4xl font-headline font-bold flex items-center gap-3">
                <ShieldCheck className="w-8 h-8 text-primary" />
                Admin Panel
              </h1>
              <p className="text-muted-foreground font-medium">Managing RIZER Studio Operations</p>
            </div>
            <Button variant="outline" size="sm" onClick={() => setIsAuthorized(false)} className="rounded-full h-10 px-6 glass">
              <LogOut className="w-4 h-4 mr-2" />
              Lock Console
            </Button>
          </div>

          <Tabs defaultValue="requests" className="space-y-8">
            <TabsList className="glass p-1 h-14 rounded-2xl">
              <TabsTrigger value="requests" className="rounded-xl px-6"><ClipboardList className="w-4 h-4 mr-2" /> Requests</TabsTrigger>
              <TabsTrigger value="reviews" className="rounded-xl px-6"><Star className="w-4 h-4 mr-2" /> Reviews</TabsTrigger>
              <TabsTrigger value="announcements" className="rounded-xl px-6"><Megaphone className="w-4 h-4 mr-2" /> Notices</TabsTrigger>
            </TabsList>

            <TabsContent value="requests" className="animate-fade-in">
              <Card className="glass overflow-hidden rounded-[2rem]">
                <CardContent className="p-0">
                  <Table>
                    <TableHeader className="bg-white/5">
                      <TableRow className="border-white/10">
                        <TableHead className="pl-8">Client & Date</TableHead>
                        <TableHead>Service Type</TableHead>
                        <TableHead>Status Control</TableHead>
                        <TableHead className="text-right pr-8">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {requestsLoading ? (
                        <TableRow><TableCell colSpan={4} className="text-center py-20"><RefreshCw className="w-8 h-8 animate-spin mx-auto opacity-20" /></TableCell></TableRow>
                      ) : requests?.map((req) => (
                        <TableRow key={req.id} className="border-white/5 hover:bg-white/5">
                          <TableCell className="pl-8 py-6">
                            <div className="font-bold text-lg">{req.fullName || "Guest User"}</div>
                            <div className="text-[10px] text-muted-foreground font-black uppercase tracking-widest">{formatDate(req.createdAt)}</div>
                          </TableCell>
                          <TableCell className="capitalize font-bold">{req.websiteType}</TableCell>
                          <TableCell>
                            <Select value={req.status} onValueChange={(val) => handleUpdateStatus(req.id, val)}>
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

            <TabsContent value="reviews" className="animate-fade-in">
              <Card className="glass overflow-hidden rounded-[2rem]">
                <CardContent className="p-0">
                  <Table>
                    <TableHeader className="bg-white/5">
                      <TableRow className="border-white/10">
                        <TableHead className="pl-8">Author</TableHead>
                        <TableHead>Testimonial Content</TableHead>
                        <TableHead className="text-right pr-8">Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {reviews?.map((rev) => (
                        <TableRow key={rev.id} className="border-white/5 hover:bg-white/5">
                          <TableCell className="pl-8 font-bold">{rev.userName}</TableCell>
                          <TableCell className="max-w-md italic text-muted-foreground">"{rev.text}"</TableCell>
                          <TableCell className="text-right pr-8">
                            <Select value={rev.status} onValueChange={(val) => handleReviewStatus(rev.id, val)}>
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
                  <CardHeader><CardTitle>Publish New Notice</CardTitle></CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-2">
                      <Label>Announcement Text</Label>
                      <Input 
                        placeholder="e.g. 20% Discount for new clients!" 
                        value={announcementInput} 
                        onChange={e => setAnnouncementInput(e.target.value)}
                        className="glass h-12 rounded-xl"
                      />
                    </div>
                    <Button onClick={handleAddAnnouncement} className="w-full h-12 rounded-xl font-bold">Update Homepage Banner</Button>
                  </CardContent>
                </Card>
                <Card className="glass rounded-[2rem] overflow-hidden">
                  <CardHeader><CardTitle>Notice History</CardTitle></CardHeader>
                  <CardContent className="p-0">
                    <div className="divide-y divide-white/5">
                      {announcements?.map(ann => (
                        <div key={ann.id} className="p-4 flex justify-between items-center hover:bg-white/5 transition-colors">
                          <span className="text-sm font-medium">{ann.content}</span>
                          <Badge className={ann.isActive ? "bg-accent" : "bg-muted"}>
                            {ann.isActive ? "Live" : "Ended"}
                          </Badge>
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
