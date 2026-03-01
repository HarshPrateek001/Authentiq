import Link from "next/link"
import React from "react"

export function Logo({ className = "" }: { className?: string }) {
  return (
    <Link href="/" className={`flex items-center gap-3 relative group ${className}`}>
      <img 
        src="/Authentiq_logo.svg" 
        alt="Authentiq Logo" 
        className="h-25 md:h-30 w-auto transition-transform duration-300 group-hover:scale-105" 
      />
    </Link>
  )
}
