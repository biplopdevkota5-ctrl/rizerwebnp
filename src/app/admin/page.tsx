
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
import { useToast } from "@/hooks/use-toast"
import { Trash2, Search, Filter, ShieldCheck } from "lucide-react"

const ADMIN_PASSWORD = "090102030405"

export default function AdminPage() {
  const [isAuthorized, setIsAuthorized] = React.useState(false)
  const [password, setPassword] = React.useState("")
  const [requests, setRequests] = React.useState<any[]>([])
  const { toast } = useToast()

  React.useEffect(() => {
    if (isAuthorized) {
      const requestsRaw = localStorage.getItem('rizerweb_requests_db')
      setRequests(requestsRaw ? JSON.parse(requestsRaw) : [])
    }
  }, [isAuthorized])

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    if (password === ADMIN_PASSWORD) {
      setIsAuthorized(true)
      toast({ title: "Admin Authorized", description: "Welcome back, Biplop." })
    } else {
      toast({ title: "Access Denied", description: "Incorrect admin password", variant: "destructive" })
    }
  }

  const updateStatus = (id: string, newStatus: string) => {
    const updated = requests.map(r => r.id === id ? { ...r, status: newStatus } : r)
    setRequests(updated)
    localStorage.setItem('rizerweb_requests_db', JSON.stringify(updated))
    toast({ title: "Status Updated", description: `Request marked as ${newStatus}.` })
  }

  const deleteRequest = (id: string) => {
    if (confirm("Permanently delete this request?")) {
      const updated = requests.filter(r => r.id !== id)
      setRequests(updated)
      localStorage.setItem('rizerweb_requests_db', JSON.stringify(updated))
      toast({ title: "Deleted", description: "Request removed from database." })
    }
  }

  if (!isAuthorized) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center p-4">
          <Card className="w-full max-w-md glass border-primary/30">
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
                    <Input id="password" type="password" value={password} onChange={e => setPassword(e.target.value)} />
                  </div>
                  <Button type="submit" className="w-full">Authorize Access</Button>
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
              <p className="text-muted-foreground">Viewing all website requests submitted to RIZERWEBNP.</p>
            </div>
            <div className="flex gap-2">
              <Badge variant="outline" className="text-primary border-primary">Biplop Devkota (SuperAdmin)</Badge>
              <Button variant="ghost" size="sm" onClick={() => setIsAuthorized(false)}>Logout</Button>
            </div>
          </div>

          <Card className="glass border-border/50">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-7">
              <CardTitle className="font-headline text-2xl">Client Requests</CardTitle>
              <div className="flex items-center gap-2">
                <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input placeholder="Search requests..." className="pl-8 w-[250px] glass" />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Client</TableHead>
                    <TableHead>Title</TableHead>
                    <TableHead>Contact</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {requests.map((req) => (
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
                        <div className="text-xs">{req.email}</div>
                        <div className="text-xs font-mono">{req.phone}</div>
                      </TableCell>
                      <TableCell>
                        <Select value={req.status} onValueChange={(val) => updateStatus(req.id, val)}>
                          <SelectTrigger className="w-[120px] h-8 text-xs">
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
                      <TableCell className="text-right space-x-2">
                        <Button variant="ghost" size="icon" onClick={() => deleteRequest(req.id)} className="text-destructive">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                  {requests.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-10 text-muted-foreground">No requests found in database.</TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  )
}
