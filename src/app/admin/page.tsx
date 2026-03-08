
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
import { Trash2, ShieldCheck, Megaphone, Star, ClipboardList } from "lucide-react"
import { useFirestore, useCollection, useMemoFirebase } from "@/firebase"
import { collection, doc, updateDoc, deleteDoc, addDoc, query, orderBy } from "firebase/firestore"
import { cn } from "@/lib/utils"

const ADMIN_PASSWORD = "090102030405"

export default function AdminPage() {
  const [isAuthorized, setIsAuthorized] = React.useState(false)
  const [password, setPassword] = React.useState("")
  const [announcementInput, setAnnouncementInput] = React.useState("")
  const { toast } = useToast()
  const db = useFirestore()

  const requestsQuery = useMemoFirebase(() => db ? query(collection(db, "requests"), orderBy("createdAt", "desc")) : null, [db])
  const { data: requests } = useCollection(requestsQuery)

  const reviewsQuery = useMemoFirebase(() => db ? query(collection(db, "reviews"), orderBy("createdAt", "desc")) : null, [db])
  const { data: reviews } = useCollection(reviewsQuery)

  const announcementsQuery = useMemoFirebase(() => db ? query(collection(db, "announcements"), orderBy("createdAt", "desc")) : null, [db])
  const { data: announcements } = useCollection(announcementsQuery)

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    if (password === ADMIN_PASSWORD) {
      setIsAuthorized(true)
      toast({ title: "Admin Authorized", description: "Welcome back, Biplop." })
    } else {
      toast({ title: "Access Denied", description: "Incorrect admin password", variant: "destructive" })
    }
  }

  const handleUpdateStatus = (id: string, newStatus: string) => {
    if (!db) return
    updateDoc(doc(db, "requests", id), { status: newStatus })
    toast({ title: "Status Updated", description: "Request status sync with Firestore." })
  }

  const handleDeleteRequest = (id: string) => {
    if (!db || !confirm("Delete permanently?")) return
    deleteDoc(doc(db, "requests", id))
    toast({ title: "Deleted", description: "Request removed from database." })
  }

  const handleReviewStatus = (id: string, newStatus: string) => {
    if (!db) return
    updateDoc(doc(db, "reviews", id), { status: newStatus })
    toast({ title: "Review Updated", description: `Marked as ${newStatus}` })
  }

  const handleDeleteReview = (id: string) => {
    if (!db || !confirm("Delete review?")) return
    deleteDoc(doc(db, "reviews", id))
  }

  const handleAddAnnouncement = () => {
    if (!db || !announcementInput) return
    addDoc(collection(db, "announcements"), {
      content: announcementInput,
      isActive: true,
      type: "info",
      createdAt: new Date().toISOString()
    })
    setAnnouncementInput("")
    toast({ title: "Announcement Posted", description: "Now visible on home page." })
  }

  const toggleAnnouncement = (id: string, current: boolean) => {
    if (!db) return
    updateDoc(doc(db, "announcements", id), { isActive: !current })
  }

  if (!isAuthorized) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center p-4">
          <Card className="w-full max-w-md glass border-primary/30 shadow-2xl">
            <CardHeader className="text-center">
              <ShieldCheck className="w-12 h-12 text-primary mx-auto mb-4" />
              <CardTitle className="font-headline text-2xl font-bold">Admin Portal</CardTitle>
              <CardDescription>RIZERWEBNP Management System</CardDescription>
            </CardHeader>
            <form onSubmit={handleLogin}>
              <CardContent>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="password">Enter Admin Password</Label>
                    <Input id="password" type="password" value={password} onChange={e => setPassword(e.target.value)} className="glass" />
                  </div>
                  <Button type="submit" className="w-full shadow-lg">Authorize Access</Button>
                </div>
              </CardContent>
            </form>
          </Card>
        </div>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 py-12">
        <div className="container mx-auto px-4">
          <div className="mb-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-4xl font-headline font-bold">Admin Management</h1>
              <p className="text-muted-foreground">SuperAdmin Control Panel</p>
            </div>
            <div className="flex gap-2">
              <Badge variant="outline" className="text-primary border-primary bg-primary/10">Biplop Devkota (SuperAdmin)</Badge>
              <Button variant="ghost" size="sm" onClick={() => setIsAuthorized(false)}>Logout</Button>
            </div>
          </div>

          <Tabs defaultValue="requests" className="space-y-8">
            <TabsList className="glass border-primary/20 p-1">
              <TabsTrigger value="requests" className="data-[state=active]:bg-primary">
                <ClipboardList className="w-4 h-4 mr-2" /> Requests
              </TabsTrigger>
              <TabsTrigger value="reviews" className="data-[state=active]:bg-primary">
                <Star className="w-4 h-4 mr-2" /> Reviews
              </TabsTrigger>
              <TabsTrigger value="announcements" className="data-[state=active]:bg-primary">
                <Megaphone className="w-4 h-4 mr-2" /> Announcements
              </TabsTrigger>
            </TabsList>

            <TabsContent value="requests">
              <Card className="glass border-border/50">
                <CardHeader>
                  <CardTitle className="font-headline text-2xl">Client Requests</CardTitle>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Client</TableHead>
                        <TableHead>Website</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {requests?.map((req: any) => (
                        <TableRow key={req.id}>
                          <TableCell>
                            <div className="font-medium">{req.userName}</div>
                            <div className="text-xs text-muted-foreground">{new Date(req.createdAt).toLocaleDateString()}</div>
                          </TableCell>
                          <TableCell>
                            <div className="font-medium">{req.title}</div>
                            <div className="text-xs text-muted-foreground">{req.websiteType} • {req.budget}</div>
                          </TableCell>
                          <TableCell>
                            <Select value={req.status} onValueChange={(val) => handleUpdateStatus(req.id, val)}>
                              <SelectTrigger className="w-[120px] h-8 text-xs glass">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="pending">Pending</SelectItem>
                                <SelectItem value="processing">Processing</SelectItem>
                                <SelectItem value="completed">Completed</SelectItem>
                                <SelectItem value="cancelled">Cancelled</SelectItem>
                              </SelectContent>
                            </Select>
                          </TableCell>
                          <TableCell className="text-right">
                            <Button variant="ghost" size="icon" onClick={() => handleDeleteRequest(req.id)} className="text-destructive">
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

            <TabsContent value="reviews">
              <Card className="glass border-border/50">
                <CardHeader>
                  <CardTitle className="font-headline text-2xl">Manage Reviews</CardTitle>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Author</TableHead>
                        <TableHead>Review</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {reviews?.map((rev: any) => (
                        <TableRow key={rev.id}>
                          <TableCell className="font-medium">{rev.userName}</TableCell>
                          <TableCell className="max-w-md truncate">{rev.text}</TableCell>
                          <TableCell>
                            <Select value={rev.status} onValueChange={(val) => handleReviewStatus(rev.id, val)}>
                              <SelectTrigger className="w-[120px] h-8 text-xs glass">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="pending">Pending</SelectItem>
                                <SelectItem value="approved">Approved</SelectItem>
                                <SelectItem value="rejected">Rejected</SelectItem>
                              </SelectContent>
                            </Select>
                          </TableCell>
                          <TableCell className="text-right">
                            <Button variant="ghost" size="icon" onClick={() => handleDeleteReview(rev.id)} className="text-destructive">
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

            <TabsContent value="announcements">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <Card className="glass col-span-1">
                  <CardHeader>
                    <CardTitle>Post New Announcement</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <Label>Content</Label>
                    <Input 
                      placeholder="e.g. 50% discount this week!" 
                      value={announcementInput} 
                      onChange={e => setAnnouncementInput(e.target.value)}
                      className="glass"
                    />
                    <Button onClick={handleAddAnnouncement} className="w-full">Publish</Button>
                  </CardContent>
                </Card>
                
                <Card className="glass lg:col-span-2">
                  <CardHeader>
                    <CardTitle>History</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableBody>
                        {announcements?.map((ann: any) => (
                          <TableRow key={ann.id}>
                            <TableCell className={cn("font-medium", !ann.isActive && "opacity-40")}>{ann.content}</TableCell>
                            <TableCell className="text-right">
                              <Button variant="ghost" size="sm" onClick={() => toggleAnnouncement(ann.id, ann.isActive)}>
                                {ann.isActive ? "Deactivate" : "Activate"}
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
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
