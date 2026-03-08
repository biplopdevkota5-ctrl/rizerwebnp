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
import { Trash2, ShieldCheck, Megaphone, Star, ClipboardList, RefreshCw, AlertCircle } from "lucide-react"
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

  React.useEffect(() => {
    setMounted(true)
  }, [])

  const requestsQuery = useMemoFirebase(() => 
    (db && isAuthorized && mounted) ? query(collection(db, "requests"), orderBy("createdAt", "desc")) : null, 
    [db, isAuthorized, mounted]
  )
  const { data: requests, isLoading: requestsLoading, error: requestsError } = useCollection(requestsQuery)

  const reviewsQuery = useMemoFirebase(() => 
    (db && isAuthorized && mounted) ? query(collection(db, "reviews"), orderBy("createdAt", "desc")) : null, 
    [db, isAuthorized, mounted]
  )
  const { data: reviews, error: reviewsError } = useCollection(reviewsQuery)

  const announcementsQuery = useMemoFirebase(() => 
    (db && isAuthorized && mounted) ? query(collection(db, "announcements"), orderBy("createdAt", "desc")) : null, 
    [db, isAuthorized, mounted]
  )
  const { data: announcements, error: announcementsError } = useCollection(announcementsQuery)

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    if (password === ADMIN_PASSWORD) {
      setIsAuthorized(true)
      toast({ title: "Authorized", description: "Admin access granted." })
    } else {
      toast({ title: "Access Denied", description: "Incorrect password.", variant: "destructive" })
    }
  }

  const handleUpdateStatus = async (id: string, newStatus: string) => {
    if (!db) return
    try {
      await updateDoc(doc(db, "requests", id), { status: newStatus })
      toast({ title: "Updated", description: "Request status changed." })
    } catch (err) {
      console.error(err)
    }
  }

  const handleDeleteRequest = async (id: string) => {
    if (!db || !confirm("Delete this request?")) return
    try {
      await deleteDoc(doc(db, "requests", id))
      toast({ title: "Deleted", description: "Request removed." })
    } catch (err) {
      console.error(err)
    }
  }

  const handleReviewStatus = async (id: string, newStatus: string) => {
    if (!db) return
    try {
      await updateDoc(doc(db, "reviews", id), { status: newStatus })
      toast({ title: "Updated", description: "Review status changed." })
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
      toast({ title: "Published", description: "New announcement live." })
    } catch (err) {
      console.error(err)
    }
  }

  const formatDate = (dateValue: any) => {
    if (!dateValue) return "N/A"
    try {
      const d = dateValue?.toDate ? dateValue.toDate() : new Date(dateValue)
      return isNaN(d.getTime()) ? "Invalid" : d.toLocaleDateString()
    } catch {
      return "Format Error"
    }
  }

  if (!mounted) return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <RefreshCw className="w-8 h-8 animate-spin text-primary opacity-50" />
    </div>
  )

  if (!isAuthorized) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 flex items-center justify-center p-4">
          <Card className="w-full max-w-md glass border-primary/20">
            <CardHeader className="text-center">
              <ShieldCheck className="w-12 h-12 text-primary mx-auto mb-4" />
              <CardTitle className="text-2xl font-headline font-bold">Admin Portal</CardTitle>
              <CardDescription>Enter password to manage RIZERWEBNP</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="password">Admin Password</Label>
                  <Input 
                    id="password" 
                    type="password" 
                    value={password} 
                    onChange={e => setPassword(e.target.value)} 
                    className="bg-background" 
                    required 
                  />
                </div>
                <Button type="submit" className="w-full">Authorize</Button>
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
        <div className="container mx-auto px-4">
          <div className="mb-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-3xl font-headline font-bold">Admin Management</h1>
              <p className="text-muted-foreground">Control Panel</p>
            </div>
            <Button variant="outline" size="sm" onClick={() => setIsAuthorized(false)}>Logout</Button>
          </div>

          <Tabs defaultValue="requests" className="space-y-6">
            <TabsList className="bg-muted p-1">
              <TabsTrigger value="requests"><ClipboardList className="w-4 h-4 mr-2" /> Requests</TabsTrigger>
              <TabsTrigger value="reviews"><Star className="w-4 h-4 mr-2" /> Reviews</TabsTrigger>
              <TabsTrigger value="announcements"><Megaphone className="w-4 h-4 mr-2" /> Announcements</TabsTrigger>
            </TabsList>

            <TabsContent value="requests">
              <Card className="glass overflow-hidden">
                <CardContent className="p-0">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Client</TableHead>
                        <TableHead>Service</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Action</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {requests?.map((req) => (
                        <TableRow key={req.id}>
                          <TableCell>
                            <div className="font-bold">{req.fullName || "Guest"}</div>
                            <div className="text-[10px] text-muted-foreground uppercase">{formatDate(req.createdAt)}</div>
                          </TableCell>
                          <TableCell className="capitalize">{req.websiteType}</TableCell>
                          <TableCell>
                            <Select value={req.status} onValueChange={(val) => handleUpdateStatus(req.id, val)}>
                              <SelectTrigger className="w-[110px] h-8 text-xs">
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
              <Card className="glass">
                <CardContent className="p-0">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Author</TableHead>
                        <TableHead>Review</TableHead>
                        <TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {reviews?.map((rev) => (
                        <TableRow key={rev.id}>
                          <TableCell className="font-bold">{rev.userName}</TableCell>
                          <TableCell className="max-w-xs truncate">{rev.text}</TableCell>
                          <TableCell>
                            <Select value={rev.status} onValueChange={(val) => handleReviewStatus(rev.id, val)}>
                              <SelectTrigger className="w-[110px] h-8 text-xs">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
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

            <TabsContent value="announcements">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="glass">
                  <CardHeader><CardTitle>Post Announcement</CardTitle></CardHeader>
                  <CardContent className="space-y-4">
                    <Input 
                      placeholder="Special offer description..." 
                      value={announcementInput} 
                      onChange={e => setAnnouncementInput(e.target.value)}
                    />
                    <Button onClick={handleAddAnnouncement} className="w-full">Publish</Button>
                  </CardContent>
                </Card>
                <Card className="glass">
                  <CardHeader><CardTitle>Active History</CardTitle></CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {announcements?.map(ann => (
                        <div key={ann.id} className="p-3 bg-muted rounded-lg flex justify-between items-center">
                          <span className="text-sm font-medium">{ann.content}</span>
                          <Badge variant={ann.isActive ? "default" : "outline"}>
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