
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
import { useAuth, useUser, initiateEmailSignIn } from "@/firebase"
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth"
import { LogIn, RefreshCw } from "lucide-react"

export default function LoginPage() {
  const [email, setEmail] = React.useState("")
  const [password, setPassword] = React.useState("")
  const [loading, setLoading] = React.useState(false)
  const router = useRouter()
  const { toast } = useToast()
  const auth = useAuth()
  const { user, isUserLoading: authLoading } = useUser()

  // Snap redirect if session is detected
  React.useEffect(() => {
    if (user) {
      router.push('/dashboard')
    }
  }, [user, router])

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    
    // Non-blocking sign in as per Firebase performance guidelines
    initiateEmailSignIn(auth, email, password)
    toast({ title: "Authenticating...", description: "Connecting to secure servers." })
    
    // We don't await here. The onAuthStateChanged listener in the provider 
    // will trigger the redirect in the useEffect above automatically.
  }

  const handleGoogleLogin = async () => {
    setLoading(true)
    const provider = new GoogleAuthProvider()
    try {
      await signInWithPopup(auth, provider)
      // Redirection is handled by the useEffect watching the 'user' state
    } catch (error: any) {
      setLoading(false)
      toast({ 
        title: "Google Login Failed", 
        description: error.message || "Could not sign in with Google.", 
        variant: "destructive" 
      })
    }
  }

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
          <CardContent className="space-y-6 pt-8 px-8">
            {authLoading && !user ? (
              <div className="flex flex-col items-center justify-center py-12 gap-4">
                <RefreshCw className="w-8 h-8 animate-spin text-primary" />
                <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Checking Session...</p>
              </div>
            ) : (
              <>
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
                  <Button type="submit" className="w-full h-14 rounded-2xl font-black text-lg shadow-2xl shadow-primary/20 hover:scale-[1.02] transition-all" disabled={loading}>
                    {loading ? <RefreshCw className="w-5 h-5 animate-spin mr-2" /> : "Sign In to Dashboard"}
                  </Button>
                </form>

                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <Separator className="w-full" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-background px-2 text-muted-foreground font-bold">Or continue with</span>
                  </div>
                </div>

                <Button 
                  variant="outline" 
                  className="w-full h-14 rounded-2xl font-bold glass border-white/10 hover:bg-white/5 transition-all flex items-center justify-center gap-3"
                  onClick={handleGoogleLogin}
                  disabled={loading}
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path
                      fill="currentColor"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="currentColor"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="currentColor"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    />
                    <path
                      fill="currentColor"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    />
                  </svg>
                  Continue with Google
                </Button>
              </>
            )}
          </CardContent>
          <CardFooter className="flex flex-col gap-6 p-8 pt-0">
            <div className="text-center space-y-2">
              <p className="text-sm text-muted-foreground font-medium">
                Don't have an account? <Link href="/auth/signup" className="text-primary hover:underline font-bold">Create Account</Link>
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
