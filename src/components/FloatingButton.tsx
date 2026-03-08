
"use client"

import { Button } from "@/components/ui/button"
import { ArrowUp, LayoutGrid } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"

export function FloatingButton() {
  const pathname = usePathname()

  const handleClick = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <div className="fixed bottom-6 right-6 z-[60] flex flex-col gap-3">
      {pathname !== '/' && (
        <Link href="/">
          <Button size="icon" className="rounded-full w-12 h-12 shadow-2xl animate-bounce">
            <LayoutGrid className="w-5 h-5" />
          </Button>
        </Link>
      )}
      <Button 
        size="icon" 
        variant="secondary" 
        className="rounded-full w-12 h-12 shadow-2xl glass"
        onClick={handleClick}
      >
        <ArrowUp className="w-5 h-5" />
      </Button>
    </div>
  )
}
