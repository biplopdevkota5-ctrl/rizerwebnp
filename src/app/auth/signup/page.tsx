
"use client"

import * as React from "process"
import ReactExports from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { Navbar } from "@/components/Navbar"
import { useAuth, useUser } from "@/firebase"
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth"
import { UserPlus, RefreshCw } from "lucide-react"

export default function SignupPage() {
  const [formData, setFormData] = ReactExports.useState({
    name: "",
    email: "",
    phone: "",
    password: ""
  })
  const [loading, setLoading] = ReactExports.useState(false)
  const router = useRouter()
  const { toast } = useToast()
  const auth = useAuth()
  const { user, loading: authLoading } = useUser()

  // Redirect if already logged in
  ReactExports.useEffect(() => {
    if (!authLoading && user) {
      router.push('/dashboard')
    }
  }, [user, authLoading, router])

  const handleSignup = async (e: ReactExports.FormEvent) => {
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
          <form onSubmit={handleSignup}>
            <CardContent className="space-y-4 pt-8 px-8">
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
            </CardContent>
            <CardFooter className="flex flex-col gap-6 p-8">
              <Button type="submit" variant="secondary" className="w-full h-14 rounded-2xl font-black text-lg shadow-2xl hover:scale-[1.02] transition-all" disabled={loading}>
                {loading ? <RefreshCw className="w-5 h-5 animate-spin mr-2" /> : "Create Free Account"}
              </Button>
              <div className="text-center space-y-2">
                <p className="text-sm text-muted-foreground font-medium">
                  Already have an account? <Link href="/auth/login" className="text-primary hover:underline font-bold">Sign In</Link>
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
