"use client"

import * as React from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { useToast } from "@/hooks/use-toast"
import { Navbar } from "@/components/Navbar"
import { useAuth, useUser, initiateEmailSignIn, initiateGoogleSignIn } from "@/firebase"
import { LogIn, RefreshCw, Chrome } from "lucide-react"

export default function LoginPage() {
  const [email, setEmail] = React.useState("")
  const [password, setPassword] = React.useState("")
  const [loading, setLoading] = React.useState(false)
  const router = useRouter()
  const { toast } = useToast()
  const auth = useAuth()
  const { user, isUserLoading: authLoading } = useUser()

  // Snap redirect as soon as auth state changes to a user
  React.useEffect(() => {
    if (user) {
      router.replace('/dashboard')
    }
  }, [user, router])

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    
    // Fire and forget - the useEffect above handles the redirect
    initiateEmailSignIn(auth, email, password)
    toast({ title: "Connecting...", description: "Authenticating your credentials." })
  }

  const handleGoogleLogin = async () => {
    setLoading(true)
    try {
      // Use the new helper for cleaner logic
      await initiateGoogleSignIn(auth)
      // Redirect happens via useEffect
    } catch (error: any) {
      setLoading(false)
      toast({ 
        title: "Login Failed", 
        description: error.message || "Google sign-in was interrupted.", 
        variant: "destructive" 
      })
    }
  }

  // If already logged in, show a simple transition instead of the whole form
  if (user) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <RefreshCw className="w-10 h-10 animate-spin text-primary" />
        <p className="mt-4 font-bold text-primary">Redirecting to dashboard...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col selection:bg-primary/30 selection:text-primary">
      <Navbar />
      <div className="flex-1 flex items-center justify-center p-4">
        <Card className="w-full max-w-md glass border-white/10 shadow-2xl rounded-[2.5rem] overflow-hidden animate-fade-in">
          <CardHeader className="text-center bg-white/5 pt-10 pb-8">
            <div className="w-16 h-16 bg-primary/20 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-xl">
              <LogIn className="w-8 h-8 text-primary" />
            </div>
            <CardTitle className="font-headline text-3xl font-bold">Welcome Back</CardTitle>
            <CardDescription className="font-medium">Sign in to manage your website projects.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6 pt-8 px-8">
            <form onSubmit={handleLogin} className="space-y-6">
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
              <Button type="submit" className="w-full h-14 rounded-2xl font-black text-lg shadow-2xl hover:scale-[1.02] transition-all" disabled={loading || authLoading}>
                {loading ? <RefreshCw className="w-5 h-5 animate-spin mr-2" /> : "Sign In Now"}
              </Button>
            </form>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <Separator className="w-full" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground font-bold">Or</span>
              </div>
            </div>

            <Button 
              variant="outline" 
              className="w-full h-14 rounded-2xl font-bold glass border-white/10 hover:bg-white/5 transition-all flex items-center justify-center gap-3"
              onClick={handleGoogleLogin}
              disabled={loading || authLoading}
            >
              <Chrome className="w-5 h-5 text-primary" />
              Continue with Google
            </Button>
          </CardContent>
          <CardFooter className="flex flex-col gap-6 p-8 pt-0">
            <div className="text-center space-y-2">
              <p className="text-sm text-muted-foreground font-medium">
                New to RIZERWEBNP? <Link href="/auth/signup" className="text-primary hover:underline font-bold">Create Account</Link>
              </p>
              <Link href="/" className="text-xs text-muted-foreground hover:text-foreground font-bold uppercase tracking-widest transition-colors">
                ← Back to Home
              </Link>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
