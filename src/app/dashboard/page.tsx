
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
import { Trash2, Plus, RefreshCw } from "lucide-react"
import Link from "next/link"
import { useFirestore, useCollection } from "@/firebase"
import { collection, query, where, orderBy, deleteDoc, doc } from "firebase/firestore"

export default function DashboardPage() {
  const [user, setUser] = React.useState<any>(null)
  const router = useRouter()
  const { toast } = useToast()
  const db = useFirestore()

  React.useEffect(() => {
    const savedUser = localStorage.getItem('rizerweb_user')
    if (!savedUser) {
      router.push('/auth/login')
      return
    }
    setUser(JSON.parse(savedUser))
  }, [router])

  const userRequestsQuery = React.useMemo(() => {
    if (!db || !user) return null
    return query(
      collection(db, "requests"),
      where("userId", "==", user.id),
      orderBy("createdAt", "desc")
    )
  }, [db, user])

  const { data: requests, loading } = useCollection(userRequestsQuery)

  const deleteRequest = async (id: string) => {
    if (!db || !confirm("Are you sure you want to delete this request from our database?")) return
    try {
      await deleteDoc(doc(db, "requests", id))
      toast({ title: "Request Deleted", description: "Successfully removed from Firestore." })
    } catch (e) {
      toast({ title: "Error", description: "Could not delete from cloud.", variant: "destructive" })
    }
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-10">
            <div>
              <h1 className="text-4xl font-headline font-bold">Client Dashboard</h1>
              <p className="text-muted-foreground">Manage your cloud-synced website requests.</p>
            </div>
            <Link href="/request">
              <Button className="rounded-full shadow-lg">
                <Plus className="w-4 h-4 mr-2" />
                New Request
              </Button>
            </Link>
          </div>

          {loading ? (
            <div className="flex justify-center py-20">
              <RefreshCw className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                <Card className="glass border-primary/20">
                  <CardHeader className="pb-2">
                    <CardDescription>Total Cloud Requests</CardDescription>
                    <CardTitle className="text-3xl font-headline">{requests?.length || 0}</CardTitle>
                  </CardHeader>
                </Card>
                <Card className="glass border-accent/20">
                  <CardHeader className="pb-2">
                    <CardDescription>Active Projects</CardDescription>
                    <CardTitle className="text-3xl font-headline text-primary">
                      {requests?.filter(r => r.status === 'processing').length || 0}
                    </CardTitle>
                  </CardHeader>
                </Card>
                <Card className="glass border-white/10">
                  <CardHeader className="pb-2">
                    <CardDescription>Completed Builds</CardDescription>
                    <CardTitle className="text-3xl font-headline text-accent">
                      {requests?.filter(r => r.status === 'completed').length || 0}
                    </CardTitle>
                  </CardHeader>
                </Card>
              </div>

              <Card className="glass border-border/50 shadow-xl overflow-hidden">
                <CardHeader className="bg-white/5">
                  <CardTitle className="font-headline">Your Website History</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  {!requests?.length ? (
                    <div className="text-center py-20">
                      <p className="text-muted-foreground mb-6">No requests found in our database.</p>
                      <Link href="/request">
                        <Button variant="outline" className="rounded-full">Submit Your First Build</Button>
                      </Link>
                    </div>
                  ) : (
                    <Table>
                      <TableHeader className="bg-black/20">
                        <TableRow>
                          <TableHead className="font-bold">Project Title</TableHead>
                          <TableHead className="font-bold">Type</TableHead>
                          <TableHead className="font-bold">Submitted</TableHead>
                          <TableHead className="font-bold">Status</TableHead>
                          <TableHead className="text-right font-bold pr-6">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {requests.map((req) => (
                          <TableRow key={req.id} className="hover:bg-white/5 transition-colors">
                            <TableCell className="font-bold pl-6">{req.title}</TableCell>
                            <TableCell className="capitalize font-medium">{req.websiteType}</TableCell>
                            <TableCell className="text-muted-foreground">{new Date(req.createdAt).toLocaleDateString()}</TableCell>
                            <TableCell>
                              <Badge 
                                variant={req.status === 'completed' ? 'default' : req.status === 'processing' ? 'outline' : 'secondary'}
                                className={cn(
                                  "font-bold uppercase tracking-wider text-[10px]",
                                  req.status === 'completed' && "bg-accent text-white border-accent"
                                )}
                              >
                                {req.status}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-right pr-6 space-x-2">
                              <Button variant="ghost" size="icon" onClick={() => deleteRequest(req.id)} className="text-destructive hover:bg-destructive/10">
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
            </>
          )}
        </div>
      </main>
      <Footer />
    </div>
  )
}
