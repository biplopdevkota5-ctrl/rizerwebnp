
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
import { Trash2, Edit, ExternalLink, Plus } from "lucide-react"
import Link from "next/link"

export default function DashboardPage() {
  const [user, setUser] = React.useState<any>(null)
  const [requests, setRequests] = React.useState<any[]>([])
  const router = useRouter()
  const { toast } = useToast()

  React.useEffect(() => {
    const savedUser = localStorage.getItem('rizerweb_user')
    if (!savedUser) {
      router.push('/auth/login')
      return
    }
    const u = JSON.parse(savedUser)
    setUser(u)

    const requestsRaw = localStorage.getItem('rizerweb_requests_db')
    const allRequests = requestsRaw ? JSON.parse(requestsRaw) : []
    const userRequests = allRequests.filter((r: any) => r.userId === u.id || r.userId === 'guest')
    setRequests(userRequests)
  }, [router])

  const deleteRequest = (id: string) => {
    if (confirm("Are you sure you want to delete this request?")) {
      const updated = requests.filter(r => r.id !== id)
      setRequests(updated)
      
      const allRequestsRaw = localStorage.getItem('rizerweb_requests_db')
      const allRequests = allRequestsRaw ? JSON.parse(allRequestsRaw) : []
      const filtered = allRequests.filter((r: any) => r.id !== id)
      localStorage.setItem('rizerweb_requests_db', JSON.stringify(filtered))
      
      toast({ title: "Request Deleted", description: "The request has been removed from your history." })
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
              <p className="text-muted-foreground">Manage your website requests and track their progress.</p>
            </div>
            <Link href="/request">
              <Button className="rounded-full">
                <Plus className="w-4 h-4 mr-2" />
                New Request
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
            <Card className="glass">
              <CardHeader className="pb-2">
                <CardDescription>Total Requests</CardDescription>
                <CardTitle className="text-3xl font-headline">{requests.length}</CardTitle>
              </CardHeader>
            </Card>
            <Card className="glass">
              <CardHeader className="pb-2">
                <CardDescription>Active Projects</CardDescription>
                <CardTitle className="text-3xl font-headline text-primary">
                  {requests.filter(r => r.status === 'processing').length}
                </CardTitle>
              </CardHeader>
            </Card>
            <Card className="glass">
              <CardHeader className="pb-2">
                <CardDescription>Completed</CardDescription>
                <CardTitle className="text-3xl font-headline text-accent">
                  {requests.filter(r => r.status === 'completed').length}
                </CardTitle>
              </CardHeader>
            </Card>
          </div>

          <Card className="glass border-border/50">
            <CardHeader>
              <CardTitle className="font-headline">Your Requests</CardTitle>
            </CardHeader>
            <CardContent>
              {requests.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-muted-foreground mb-4">You haven't submitted any requests yet.</p>
                  <Link href="/request">
                    <Button variant="outline">Create Your First Request</Button>
                  </Link>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Project Title</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {requests.map((req) => (
                      <TableRow key={req.id}>
                        <TableCell className="font-medium">{req.title}</TableCell>
                        <TableCell className="capitalize">{req.websiteType}</TableCell>
                        <TableCell>{new Date(req.createdAt).toLocaleDateString()}</TableCell>
                        <TableCell>
                          <Badge variant={req.status === 'completed' ? 'default' : req.status === 'processing' ? 'outline' : 'secondary'}>
                            {req.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right space-x-2">
                          <Button variant="ghost" size="icon" onClick={() => deleteRequest(req.id)} className="text-destructive hover:text-destructive">
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
