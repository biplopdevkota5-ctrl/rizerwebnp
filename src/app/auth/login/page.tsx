
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
import { useAuth, useUser } from "@/firebase"
import { signInWithEmailAndPassword } from "firebase/auth"
import { LogIn, RefreshCw } from "lucide-react"

export default function LoginPage() {
  const [email, setEmail] = React.useState("")
  const [password, setPassword] = React.useState("")
  const [loading, setLoading] = React.useState(false)
  const router = useRouter()
  const { toast } = useToast()
  const auth = useAuth()
  const { user, loading: authLoading } = useUser()

  // Redirect if already logged in
  React.useEffect(() => {
    if (!authLoading && user) {
      router.push('/dashboard')
    }
  }, [user, authLoading, router])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      await signInWithEmailAndPassword(auth, email, password)
      toast({ title: "Welcome Back", description: "Successfully logged into RIZERWEBNP." })
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

  if (authLoading) return null

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex-1 flex items-center justify-center p-4">
        <Card className="w-full max-w-md glass border-white/10 shadow-2xl rounded-[2rem] overflow-hidden">
          <CardHeader className="text-center bg-white/5 pt-10 pb-8">
            <div className="w-16 h-16 bg-primary/20 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-xl">
              <LogIn className="w-8 h-8 text-primary" />
            </div>
            <CardTitle className="font-headline text-3xl font-bold">Sign In</CardTitle>
            <CardDescription className="font-medium">Access your cloud-synced dashboard.</CardDescription>
          </CardHeader>
          <form onSubmit={handleLogin}>
            <CardContent className="space-y-6 pt-8 px-8">
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input 
                  id="email" 
                  type="email" 
                  placeholder="name@example.com" 
                  required 
                  value={email} 
                  onChange={(e) => setEmail(e.target.value)} 
                  className="glass h-12 rounded-xl focus:ring-primary/50" 
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input 
                  id="password" 
                  type="password" 
                  required 
                  value={password} 
                  onChange={(e) => setPassword(e.target.value)} 
                  className="glass h-12 rounded-xl focus:ring-primary/50" 
                />
              </div>
            </CardContent>
            <CardFooter className="flex flex-col gap-6 p-8">
              <Button type="submit" className="w-full h-14 rounded-2xl font-black text-lg shadow-2xl shadow-primary/20 hover:scale-[1.02] transition-all" disabled={loading}>
                {loading ? <RefreshCw className="w-5 h-5 animate-spin mr-2" /> : "Sign In to Dashboard"}
              </Button>
              <div className="text-center space-y-2">
                <p className="text-sm text-muted-foreground font-medium">
                  Don't have an account? <Link href="/auth/signup" className="text-primary hover:underline font-bold">Create Account</Link>
                </p>
                <Link href="/" className="text-xs text-muted-foreground hover:text-foreground font-bold uppercase tracking-widest transition-colors">
                  ← Back to Home
                </Link>
              </div>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  )
}
