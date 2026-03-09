
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
import { collection, query, orderBy, deleteDoc, doc } from "firebase/firestore"
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
    <div className="min-h-screen flex flex-col selection:bg-primary/30 selection:text-primary">
      <Navbar />
      <main className="flex-1 py-12 md:py-20 lg:py-24">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 mb-12 md:mb-16">
            <div className="space-y-3">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 md:w-16 md:h-16 rounded-2xl md:rounded-3xl bg-primary/10 flex items-center justify-center shadow-xl shadow-primary/5">
                  <LayoutDashboard className="w-7 h-7 md:w-8 md:h-8 text-primary" />
                </div>
                <div>
                  <h1 className="text-3xl md:text-5xl font-headline font-bold tracking-tight">Client Dashboard</h1>
                  <p className="text-muted-foreground font-medium md:text-lg">Managing your active and past website builds.</p>
                </div>
              </div>
            </div>
            <Link href="/request">
              <Button size="lg" className="w-full md:w-auto rounded-full shadow-2xl shadow-primary/30 h-16 md:h-14 px-10 font-black hover:scale-105 transition-all">
                <Plus className="w-5 h-5 mr-3" />
                New Build Request
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 mb-12 md:mb-16">
            <Card className="glass border-primary/20 shadow-xl p-6 md:p-8 rounded-[2rem]">
              <div className="space-y-1">
                <CardDescription className="font-black uppercase tracking-[0.2em] text-[10px] opacity-60">Total Requests</CardDescription>
                <CardTitle className="text-4xl md:text-6xl font-headline font-bold">{requests?.length || 0}</CardTitle>
              </div>
            </Card>
            <Card className="glass border-accent/20 shadow-xl p-6 md:p-8 rounded-[2rem]">
              <div className="space-y-1">
                <CardDescription className="font-black uppercase tracking-[0.2em] text-[10px] opacity-60">Processing Builds</CardDescription>
                <CardTitle className="text-4xl md:text-6xl font-headline font-bold text-primary">
                  {requests?.filter(r => r.status === 'processing' || r.status === 'pending').length || 0}
                </CardTitle>
              </div>
            </Card>
            <Card className="glass border-white/10 shadow-xl p-6 md:p-8 rounded-[2rem]">
              <div className="space-y-1">
                <CardDescription className="font-black uppercase tracking-[0.2em] text-[10px] opacity-60">Live Projects</CardDescription>
                <CardTitle className="text-4xl md:text-6xl font-headline font-bold text-accent">
                  {requests?.filter(r => r.status === 'completed').length || 0}
                </CardTitle>
              </div>
            </Card>
          </div>

          <Card className="glass border-white/10 shadow-2xl rounded-[2rem] md:rounded-[3rem] overflow-hidden">
            <CardHeader className="bg-white/5 p-8 md:p-12 border-b border-white/5">
              <CardTitle className="font-headline text-2xl md:text-4xl font-bold">Project History</CardTitle>
              <CardDescription className="font-medium text-lg mt-2">Track the live progress of your digital presence.</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              {dataLoading ? (
                <div className="flex flex-col items-center justify-center py-32 gap-6">
                  <RefreshCw className="w-10 h-10 animate-spin text-primary opacity-50" />
                  <p className="text-sm md:text-base font-black uppercase tracking-[0.2em] text-muted-foreground">Fetching your workspace...</p>
                </div>
              ) : !requests?.length ? (
                <div className="text-center py-32 space-y-8 px-6">
                  <div className="w-24 h-24 md:w-32 md:h-32 bg-primary/10 rounded-full flex items-center justify-center mx-auto shadow-inner">
                    <Plus className="w-12 h-12 md:w-16 md:h-16 text-primary opacity-30" />
                  </div>
                  <div className="space-y-3">
                    <p className="text-2xl md:text-4xl font-headline font-bold tracking-tight">No Active Projects</p>
                    <p className="text-muted-foreground text-lg md:text-xl max-w-sm mx-auto font-medium">You haven't submitted any website build requests yet.</p>
                  </div>
                  <Link href="/request" className="inline-block pt-4">
                    <Button variant="outline" className="rounded-full font-black h-14 md:h-16 px-10 md:px-12 glass border-white/10 text-lg hover:bg-primary transition-all">Start Your First Project</Button>
                  </Link>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <Table className="min-w-[900px]">
                    <TableHeader className="bg-white/5 border-b border-white/10">
                      <TableRow className="hover:bg-transparent border-none">
                        <TableHead className="font-black uppercase tracking-[0.2em] text-[11px] h-16 pl-10 opacity-60">Project Specifications</TableHead>
                        <TableHead className="font-black uppercase tracking-[0.2em] text-[11px] h-16 opacity-60">Build Category</TableHead>
                        <TableHead className="font-black uppercase tracking-[0.2em] text-[11px] h-16 opacity-60">Submission Date</TableHead>
                        <TableHead className="font-black uppercase tracking-[0.2em] text-[11px] h-16 opacity-60">Real-time Status</TableHead>
                        <TableHead className="text-right font-black uppercase tracking-[0.2em] text-[11px] h-16 pr-10 opacity-60">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {requests.map((req) => (
                        <TableRow key={req.id} className="hover:bg-white/5 border-white/5 transition-all duration-300 group">
                          <TableCell className="pl-10 py-8">
                            <div className="font-bold text-xl leading-none mb-2 group-hover:text-primary transition-colors">{req.title || "Untitled Website Build"}</div>
                            <div className="text-sm text-muted-foreground font-semibold flex items-center gap-2">
                              <span className="bg-primary/10 text-primary px-2 py-0.5 rounded-md text-[10px] font-black uppercase tracking-widest border border-primary/20">Budget</span>
                              {req.budget}
                            </div>
                          </TableCell>
                          <TableCell className="capitalize font-black text-sm text-foreground/90">{req.websiteType}</TableCell>
                          <TableCell className="text-muted-foreground font-bold text-sm">{new Date(req.createdAt).toLocaleDateString(undefined, { dateStyle: 'long' })}</TableCell>
                          <TableCell>
                            <Badge 
                              variant={req.status === 'completed' ? 'default' : req.status === 'processing' ? 'outline' : 'secondary'}
                              className={cn(
                                "font-black uppercase text-[10px] tracking-[0.1em] px-4 py-1.5 rounded-xl border-2 transition-all",
                                req.status === 'completed' && "bg-accent text-white border-accent shadow-lg shadow-accent/20",
                                req.status === 'pending' && "bg-primary/20 text-primary border-primary/40",
                                req.status === 'processing' && "bg-orange-500/20 text-orange-500 border-orange-500/40"
                              )}
                            >
                              {req.status}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right pr-10">
                            <Button variant="ghost" size="icon" onClick={() => deleteRequest(req.id)} className="text-destructive hover:bg-destructive/10 rounded-2xl h-12 w-12 transition-all active:scale-90">
                              <Trash2 className="w-5 h-5" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  )
}
