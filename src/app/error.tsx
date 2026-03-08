"use client"

import { useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Navbar } from "@/components/Navbar"
import { Footer } from "@/components/Footer"
import { AlertCircle, RefreshCcw } from "lucide-react"

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error("Application Error:", error)
  }, [error])

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 flex items-center justify-center p-4">
        <div className="max-w-md w-full glass p-8 rounded-[2rem] text-center space-y-6 border-destructive/20">
          <div className="w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center mx-auto">
            <AlertCircle className="w-8 h-8 text-destructive" />
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl font-headline font-bold">Something went wrong</h2>
            <p className="text-muted-foreground text-sm">
              We encountered a client-side exception. This might be due to a connection issue or a temporary service interruption.
            </p>
          </div>
          <div className="flex flex-col gap-3">
            <Button onClick={() => reset()} className="w-full rounded-xl h-12 font-bold">
              <RefreshCcw className="w-4 h-4 mr-2" />
              Try Again
            </Button>
            <Button variant="outline" onClick={() => window.location.href = '/'} className="w-full rounded-xl h-12 font-bold">
              Back to Home
            </Button>
          </div>
          {process.env.NODE_ENV === 'development' && (
            <div className="mt-4 p-4 bg-black/40 rounded-lg text-left overflow-auto max-h-40">
              <p className="text-[10px] font-mono text-destructive">{error.message}</p>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  )
}
