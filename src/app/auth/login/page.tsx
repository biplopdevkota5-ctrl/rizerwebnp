
"use client"

import * as React from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { Navbar } from "@/components/Navbar"

export default function LoginPage() {
  const [email, setEmail] = React.useState("")
  const [password, setPassword] = React.useState("")
  const [loading, setLoading] = React.useState(false)
  const router = useRouter()
  const { toast } = useToast()

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    setTimeout(() => {
      const usersRaw = localStorage.getItem('rizerweb_users_db')
      const users = usersRaw ? JSON.parse(usersRaw) : []
      const user = users.find((u: any) => u.email === email && u.password === password)

      if (user) {
        localStorage.setItem('rizerweb_user', JSON.stringify({
          id: user.id,
          name: user.name,
          email: user.email,
          phone: user.phone
        }))
        toast({ title: "Login Successful", description: "Welcome back to RIZERWEBNP!" })
        router.push('/dashboard')
      } else {
        toast({ title: "Login Failed", description: "Invalid email or password", variant: "destructive" })
      }
      setLoading(false)
    }, 1000)
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex-1 flex items-center justify-center p-4">
        <Card className="w-full max-w-md glass border-border/50">
          <CardHeader className="text-center">
            <CardTitle className="font-headline text-3xl font-bold">Welcome Back</CardTitle>
            <CardDescription>Enter your credentials to access your dashboard.</CardDescription>
          </CardHeader>
          <form onSubmit={handleLogin}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" placeholder="name@example.com" required value={email} onChange={(e) => setEmail(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input id="password" type="password" required value={password} onChange={(e) => setPassword(e.target.value)} />
              </div>
            </CardContent>
            <CardFooter className="flex flex-col gap-4">
              <Button type="submit" className="w-full h-11 rounded-full" disabled={loading}>
                {loading ? "Verifying..." : "Login"}
              </Button>
              <p className="text-sm text-center text-muted-foreground">
                Don't have an account? <Link href="/auth/signup" className="text-primary hover:underline font-medium">Sign Up</Link>
              </p>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  )
}
