
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
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth"

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

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, formData.email, formData.password)
      await updateProfile(userCredential.user, { displayName: formData.name })
      
      toast({ title: "Account Created", description: "Welcome to RIZERWEBNP!" })
      router.push('/dashboard')
    } catch (error: any) {
      toast({ 
        title: "Signup Failed", 
        description: error.message || "Failed to create account.", 
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
            <CardTitle className="font-headline text-3xl font-bold">Create Account</CardTitle>
            <CardDescription>Join RIZERWEBNP and start requesting websites.</CardDescription>
          </CardHeader>
          <form onSubmit={handleSignup}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input id="name" placeholder="John Doe" required value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="glass" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" placeholder="name@example.com" required value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} className="glass" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input id="phone" type="tel" placeholder="980XXXXXXX" required value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} className="glass" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input id="password" type="password" required value={formData.password} onChange={(e) => setFormData({...formData, password: e.target.value})} className="glass" />
              </div>
            </CardContent>
            <CardFooter className="flex flex-col gap-4">
              <Button type="submit" className="w-full h-11 rounded-full font-bold shadow-lg" disabled={loading}>
                {loading ? "Creating Account..." : "Sign Up"}
              </Button>
              <p className="text-sm text-center text-muted-foreground font-medium">
                Already have an account? <Link href="/auth/login" className="text-primary hover:underline font-bold">Login</Link>
              </p>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  )
}
