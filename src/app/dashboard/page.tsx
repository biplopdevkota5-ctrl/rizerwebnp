"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { Navbar } from "@/components/Navbar"
import { Footer } from "@/components/Footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useToast } from "@/hooks/use-toast"
import { Trash2, Plus, RefreshCw, LayoutDashboard } from "lucide-react"
import Link from "next/link"
import { useFirestore, useCollection, useUser, useMemoFirebase } from "@/firebase"
import { collection, query, where, orderBy, deleteDoc, doc } from "firebase/firestore"
import { cn } from "@/lib/utils"
import { errorEmitter } from "@/firebase/error-emitter"
import { FirestorePermissionError } from "@/firebase/errors"

export default function DashboardPage() {
  const { user, isUserLoading: authLoading } = useUser()
  const router = useRouter()
  const { toast } = useToast()
  const db = useFirestore()

  React.useEffect(() => {
    if (!authLoading && !user) {
      router.push('/auth/login')
    }
  }, [user, authLoading, router])

  const userRequestsQuery = useMemoFirebase(() => {
    if (!db || !user) return null
    // Updated path to match backend.json: /users/{userId}/website_requests
    return query(
      collection(db, "users", user.uid, "website_requests"),
      orderBy("createdAt", "desc")
    )
  }, [db, user])

  const { data: requests, isLoading: dataLoading } = useCollection(userRequestsQuery)

  const deleteRequest = (id: string) => {
    if (!db || !user || !confirm("Are you sure you want to delete this request?")) return
    
    const docRef = doc(db, "users", user.uid, "website_requests", id);
    deleteDoc(docRef).catch(async (error) => {
      const permissionError = new FirestorePermissionError({
        path: docRef.path,
        operation: 'delete',
      });
      errorEmitter.emit('permission-error', permissionError);
    });
    
    toast({ title: "Deleting...", description: "Request removal initiated." })
  }

  if (authLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <RefreshCw className="w-10 h-10 animate-spin text-primary" />
        <p className="mt-4 font-bold text-primary">Verifying Session...</p>
      </div>
    )
  }

  if (!user) return null

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center">
                  <LayoutDashboard className="w-6 h-6 text-primary" />
                </div>
                <h1 className="text-4xl font-headline font-bold">Client Dashboard</h1>
              </div>
              <p className="text-muted-foreground font-medium pl-1">Welcome back, <span className="text-foreground font-bold">{user.displayName || user.email}</span></p>
            </div>
            <Link href="/request">
              <Button size="lg" className="rounded-full shadow-2xl shadow-primary/30 h-14 px-8 font-black hover:scale-105 transition-all">
                <Plus className="w-5 h-5 mr-2" />
                New Build Request
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <Card className="glass border-primary/20 shadow-xl">
              <CardHeader className="pb-2">
                <CardDescription className="font-bold uppercase tracking-widest text-[10px]">Total Requests</CardDescription>
                <CardTitle className="text-4xl font-headline">{requests?.length || 0}</CardTitle>
              </CardHeader>
            </Card>
            <Card className="glass border-accent/20 shadow-xl">
              <CardHeader className="pb-2">
                <CardDescription className="font-bold uppercase tracking-widest text-[10px]">Processing</CardDescription>
                <CardTitle className="text-4xl font-headline text-primary">
                  {requests?.filter(r => r.status === 'processing' || r.status === 'pending').length || 0}
                </CardTitle>
              </CardHeader>
            </Card>
            <Card className="glass border-white/10 shadow-xl">
              <CardHeader className="pb-2">
                <CardDescription className="font-bold uppercase tracking-widest text-[10px]">Completed</CardDescription>
                <CardTitle className="text-4xl font-headline text-accent">
                  {requests?.filter(r => r.status === 'completed').length || 0}
                </CardTitle>
              </CardHeader>
            </Card>
          </div>

          <Card className="glass border-white/10 shadow-2xl rounded-[2rem] overflow-hidden">
            <CardHeader className="bg-white/5 p-8">
              <CardTitle className="font-headline text-2xl">Project History</CardTitle>
              <CardDescription className="font-medium">Manage your active and past website builds.</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              {dataLoading ? (
                <div className="flex flex-col items-center justify-center py-24 gap-4">
                  <RefreshCw className="w-8 h-8 animate-spin text-primary opacity-50" />
                  <p className="text-sm font-bold text-muted-foreground uppercase tracking-widest">Fetching your builds...</p>
                </div>
              ) : !requests?.length ? (
                <div className="text-center py-24 space-y-6">
                  <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                    <Plus className="w-10 h-10 text-primary opacity-50" />
                  </div>
                  <div className="space-y-2">
                    <p className="text-xl font-headline font-bold">No Projects Found</p>
                    <p className="text-muted-foreground max-w-xs mx-auto">You haven't submitted any website requests yet.</p>
                  </div>
                  <Link href="/request">
                    <Button variant="outline" className="rounded-full font-bold glass border-white/10">Start Your First Project</Button>
                  </Link>
                </div>
              ) : (
                <Table>
                  <TableHeader className="bg-white/5 border-b border-white/10">
                    <TableRow className="hover:bg-transparent border-none">
                      <TableHead className="font-black uppercase tracking-tighter text-[11px] h-14 pl-8">Project Details</TableHead>
                      <TableHead className="font-black uppercase tracking-tighter text-[11px] h-14">Category</TableHead>
                      <TableHead className="font-black uppercase tracking-tighter text-[11px] h-14">Submitted</TableHead>
                      <TableHead className="font-black uppercase tracking-tighter text-[11px] h-14">Status</TableHead>
                      <TableHead className="text-right font-black uppercase tracking-tighter text-[11px] h-14 pr-8">Manage</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {requests.map((req) => (
                      <TableRow key={req.id} className="hover:bg-white/5 border-white/5 transition-colors group">
                        <TableCell className="pl-8 py-6">
                          <div className="font-bold text-lg leading-none mb-1 group-hover:text-primary transition-colors">{req.title || "Untitled Project"}</div>
                          <div className="text-xs text-muted-foreground font-medium italic">Budget: {req.budget}</div>
                        </TableCell>
                        <TableCell className="capitalize font-bold text-sm text-foreground/80">{req.websiteType}</TableCell>
                        <TableCell className="text-muted-foreground font-medium text-sm">{new Date(req.createdAt).toLocaleDateString()}</TableCell>
                        <TableCell>
                          <Badge 
                            variant={req.status === 'completed' ? 'default' : req.status === 'processing' ? 'outline' : 'secondary'}
                            className={cn(
                              "font-black uppercase text-[9px] tracking-[0.1em] px-3 py-1 rounded-lg",
                              req.status === 'completed' && "bg-accent text-white border-accent",
                              req.status === 'pending' && "bg-primary/20 text-primary border-primary/30"
                            )}
                          >
                            {req.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right pr-8">
                          <Button variant="ghost" size="icon" onClick={() => deleteRequest(req.id)} className="text-destructive hover:bg-destructive/10 rounded-xl">
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  )
}
