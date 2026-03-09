
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
import { useAuth, useUser, initiateEmailSignUp, initiateGoogleSignIn, initiateFacebookSignIn, initiateMicrosoftSignIn } from "@/firebase"
import { UserPlus, Chrome, Facebook } from "lucide-react"
import { IOSSpinner } from "@/components/ui/ios-spinner"

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

  React.useEffect(() => {
    if (user) {
      router.replace('/dashboard')
    }
  }, [user, router])

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    initiateEmailSignUp(auth, formData.email, formData.password)
    toast({ title: "Creating Account", description: "Setting up your workspace..." })
  }

  const handleGoogleSignup = async () => {
    setLoading(true)
    try {
      await initiateGoogleSignIn(auth)
    } catch (error: any) {
      setLoading(false)
      toast({ 
        title: "Signup Failed", 
        description: error.message || "Google signup was interrupted.", 
        variant: "destructive" 
      })
    }
  }

  const handleFacebookSignup = async () => {
    setLoading(true)
    try {
      await initiateFacebookSignIn(auth)
    } catch (error: any) {
      setLoading(false)
      toast({ 
        title: "Signup Failed", 
        description: error.message || "Facebook signup was interrupted.", 
        variant: "destructive" 
      })
    }
  }

  const handleMicrosoftSignup = async () => {
    setLoading(true)
    try {
      await initiateMicrosoftSignIn(auth)
    } catch (error: any) {
      setLoading(false)
      toast({ 
        title: "Signup Failed", 
        description: error.message || "Microsoft signup was interrupted.", 
        variant: "destructive" 
      })
    }
  }

  if (user) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <IOSSpinner size="lg" />
        <p className="mt-4 font-bold text-accent animate-pulse">Preparing your dashboard...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col selection:bg-primary/30 selection:text-primary">
      <Navbar />
      <div className="flex-1 flex items-center justify-center p-4">
        <Card className="w-full max-w-md glass border-white/10 shadow-2xl rounded-[2rem] overflow-hidden animate-fade-in">
          <CardHeader className="text-center bg-white/5 pt-10 pb-8">
            <div className="w-16 h-16 bg-accent/20 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-xl">
              <UserPlus className="w-8 h-8 text-accent" />
            </div>
            <CardTitle className="font-headline text-3xl font-bold uppercase tracking-tight">RIZER <span className="text-primary italic">STUDIO</span></CardTitle>
            <CardDescription className="font-medium">Join us and build your digital empire.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6 pt-8 px-8">
            <form onSubmit={handleSignup} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input 
                  id="name" 
                  placeholder="Your Name" 
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
              <Button type="submit" variant="secondary" className="w-full h-14 rounded-2xl font-black text-lg shadow-2xl hover:scale-[1.02] transition-all" disabled={loading || authLoading}>
                {loading ? <IOSSpinner size="sm" /> : "Create Free Account"}
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

            <div className="grid grid-cols-1 gap-3">
              <Button 
                variant="outline" 
                className="w-full h-12 rounded-xl font-bold glass border-white/10 hover:bg-white/5 transition-all flex items-center justify-center gap-3"
                onClick={handleGoogleSignup}
                disabled={loading || authLoading}
              >
                <Chrome className="w-5 h-5 text-accent" />
                Google
              </Button>
              <div className="grid grid-cols-2 gap-3">
                <Button 
                  variant="outline" 
                  className="w-full h-12 rounded-xl font-bold glass border-white/10 hover:bg-[#1877F2]/10 hover:text-[#1877F2] transition-all flex items-center justify-center gap-3"
                  onClick={handleFacebookSignup}
                  disabled={loading || authLoading}
                >
                  <Facebook className="w-5 h-5 text-[#1877F2]" />
                  Facebook
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full h-12 rounded-xl font-bold glass border-white/10 hover:bg-white/5 transition-all flex items-center justify-center gap-3"
                  onClick={handleMicrosoftSignup}
                  disabled={loading || authLoading}
                >
                  <svg className="w-5 h-5" viewBox="0 0 23 23" xmlns="http://www.w3.org/2000/svg"><path d="M11.4 24H0V12.6h11.4V24zM24 24H12.6V12.6H24V24zM11.4 11.4H0V0h11.4v11.4zM24 11.4H12.6V0H24v11.4z" fill="#f25022"/></svg>
                  Microsoft
                </Button>
              </div>
            </div>
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
