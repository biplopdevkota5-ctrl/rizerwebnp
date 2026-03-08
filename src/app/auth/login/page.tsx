
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
import { useAuth } from "@/firebase"
import { signInWithEmailAndPassword } from "firebase/auth"

export default function LoginPage() {
  const [email, setEmail] = React.useState("")
  const [password, setPassword] = React.useState("")
  const [loading, setLoading] = React.useState(false)
  const router = useRouter()
  const { toast } = useToast()
  const auth = useAuth()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      await signInWithEmailAndPassword(auth, email, password)
      toast({ title: "Login Successful", description: "Welcome back to RIZERWEBNP!" })
      router.push('/dashboard')
    } catch (error: any) {
      toast({ 
        title: "Login Failed", 
        description: error.message || "Invalid email or password", 
        variant: "destructive" 
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex-1 flex items-center justify-center p-4">
        <Card className="w-full max-w-md glass border-border/50 shadow-2xl">
          <CardHeader className="text-center">
            <CardTitle className="font-headline text-3xl font-bold">Welcome Back</CardTitle>
            <CardDescription>Enter your credentials to access your dashboard.</CardDescription>
          </CardHeader>
          <form onSubmit={handleLogin}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" placeholder="name@example.com" required value={email} onChange={(e) => setEmail(e.target.value)} className="glass" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input id="password" type="password" required value={password} onChange={(e) => setPassword(e.target.value)} className="glass" />
              </div>
            </CardContent>
            <CardFooter className="flex flex-col gap-4">
              <Button type="submit" className="w-full h-11 rounded-full font-bold shadow-lg" disabled={loading}>
                {loading ? "Verifying..." : "Login"}
              </Button>
              <p className="text-sm text-center text-muted-foreground font-medium">
                Don't have an account? <Link href="/auth/signup" className="text-primary hover:underline font-bold">Sign Up</Link>
              </p>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  )
}
