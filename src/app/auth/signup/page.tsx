
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
import { useAuth, useUser } from "@/firebase"
import { createUserWithEmailAndPassword, updateProfile, GoogleAuthProvider, signInWithPopup } from "firebase/auth"
import { UserPlus, RefreshCw } from "lucide-react"

export default function SignupPage() {
  const [formData, setFormData] = React.useState({
    name: "",
    email: "",
    phone: "",
    password: ""
  })
  const [loading, setLoading] = React.useState(false)
  const router = useRouter()
  const { toast } = useToast()
  const auth = useAuth()
  const { user, isUserLoading: authLoading } = useUser()

  // Redirect if already logged in
  React.useEffect(() => {
    if (!authLoading && user) {
      router.push('/dashboard')
    }
  }, [user, authLoading, router])

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, formData.email, formData.password)
      await updateProfile(userCredential.user, { displayName: formData.name })
      
      toast({ title: "Welcome to RIZERWEBNP", description: "Your account has been created successfully." })
      router.push('/dashboard')
    } catch (error: any) {
      toast({ 
        title: "Account Creation Failed", 
        description: error.message || "Could not complete registration.", 
        variant: "destructive" 
      })
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleSignup = async () => {
    setLoading(true)
    const provider = new GoogleAuthProvider()
    try {
      await signInWithPopup(auth, provider)
      toast({ title: "Welcome to RIZERWEBNP", description: "Successfully signed up with Google." })
      router.push('/dashboard')
    } catch (error: any) {
      toast({ 
        title: "Google Signup Failed", 
        description: error.message || "Could not complete Google signup.", 
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
            <div className="w-16 h-16 bg-accent/20 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-xl">
              <UserPlus className="w-8 h-8 text-accent" />
            </div>
            <CardTitle className="font-headline text-3xl font-bold">Sign Up</CardTitle>
            <CardDescription className="font-medium">Join our community and build your dream site.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6 pt-8 px-8">
            <form onSubmit={handleSignup} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input 
                  id="name" 
                  placeholder="e.g. Biplop Devkota" 
                  required 
                  value={formData.name} 
                  onChange={(e) => setFormData({...formData, name: e.target.value})} 
                  className="glass h-12 rounded-xl focus:ring-accent/50" 
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input 
                  id="email" 
                  type="email" 
                  placeholder="name@example.com" 
                  required 
                  value={formData.email} 
                  onChange={(e) => setFormData({...formData, email: e.target.value})} 
                  className="glass h-12 rounded-xl focus:ring-accent/50" 
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input 
                  id="phone" 
                  type="tel" 
                  placeholder="98XXXXXXXX" 
                  required 
                  value={formData.phone} 
                  onChange={(e) => setFormData({...formData, phone: e.target.value})} 
                  className="glass h-12 rounded-xl focus:ring-accent/50" 
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input 
                  id="password" 
                  type="password" 
                  required 
                  value={formData.password} 
                  onChange={(e) => setFormData({...formData, password: e.target.value})} 
                  className="glass h-12 rounded-xl focus:ring-accent/50" 
                />
              </div>
              <Button type="submit" variant="secondary" className="w-full h-14 rounded-2xl font-black text-lg shadow-2xl hover:scale-[1.02] transition-all" disabled={loading}>
                {loading ? <RefreshCw className="w-5 h-5 animate-spin mr-2" /> : "Create Free Account"}
              </Button>
            </form>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <Separator className="w-full" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground font-bold">Or join with</span>
              </div>
            </div>

            <Button 
              variant="outline" 
              className="w-full h-14 rounded-2xl font-bold glass border-white/10 hover:bg-white/5 transition-all flex items-center justify-center gap-3"
              onClick={handleGoogleSignup}
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
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              Join with Google
            </Button>
          </CardContent>
          <CardFooter className="flex flex-col gap-6 p-8 pt-0">
            <div className="text-center space-y-2">
              <p className="text-sm text-muted-foreground font-medium">
                Already have an account? <Link href="/auth/login" className="text-primary hover:underline font-bold">Sign In</Link>
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
