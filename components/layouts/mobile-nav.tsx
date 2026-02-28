"use client"

import React from "react"
import Link from "next/link"
import { LocalDB, LocalUser } from "@/lib/local-db"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Menu, User, LogOut, LayoutDashboard } from "lucide-react"
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { useRouter } from "next/navigation"

export function MobileNav() {
  const [user, setUser] = useState<LocalUser | null>(null)
  const router = useRouter()

  useEffect(() => {
    // Check local DB on mount
    const localUser = LocalDB.getUser()
    if (localUser) {
      setUser(localUser)
    }

    const handleStorageChange = () => {
      setUser(LocalDB.getUser())
    }
    window.addEventListener('storage', handleStorageChange)
    window.addEventListener('local-user-update', handleStorageChange)

    return () => {
      window.removeEventListener('storage', handleStorageChange)
      window.removeEventListener('local-user-update', handleStorageChange)
    }
  }, [])

  const handleLogout = () => {
    LocalDB.clearUser()
    setUser(null)
    window.dispatchEvent(new Event('local-user-update'))
    window.location.reload()
  }

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden">
          <Menu className="h-6 w-6" />
          <span className="sr-only">Toggle menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-[85vw] max-w-sm flex flex-col">
        <SheetHeader className="mb-8 mt-2 space-y-4">
          <SheetTitle className="text-left flex items-center gap-2">
            <img src="/Authentiq_logo.svg" alt="Authentiq Logo" className="h-30 w-auto" />
          </SheetTitle>
        </SheetHeader>

        {/* User Status Area inside Mobile Menu */}
        {user ? (
          <div className="flex items-center gap-4 mb-8 bg-muted/50 p-4 rounded-xl border border-border/50">
            <Avatar className="h-12 w-12 border-2 border-primary/20">
              <AvatarImage src={user.avatarUrl} alt={user.fullName} />
              <AvatarFallback className="bg-primary/10 text-primary">{(user.fullName || user.first_name || user.email || "U").charAt(0).toUpperCase()}</AvatarFallback>
            </Avatar>
            <div className="flex flex-col overflow-hidden">
              <span className="font-semibold text-foreground truncate">{user.fullName}</span>
              <span className="text-sm text-muted-foreground truncate">{user.email}</span>
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-3 mb-8">
            <SheetClose asChild>
              <Button variant="outline" className="w-full justify-center" asChild>
                <Link href="/login?redirect=/">Log in</Link>
              </Button>
            </SheetClose>
            <SheetClose asChild>
              <Button className="w-full justify-center bg-primary text-primary-foreground" asChild>
                <Link href="/signup?redirect=/">Get Started</Link>
              </Button>
            </SheetClose>
          </div>
        )}

        {/* Navigation Links */}
        <div className="flex flex-col gap-2 flex-1">
          <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 px-2">Menu</span>
          <SheetClose asChild>
            <Link href="/#features" className="flex items-center py-3 px-4 rounded-xl text-base font-semibold text-muted-foreground hover:bg-muted/60 hover:text-foreground transition-all">
              Features
            </Link>
          </SheetClose>
          <SheetClose asChild>
            <Link href="/#how-it-works" className="flex items-center py-3 px-4 rounded-xl text-base font-semibold text-muted-foreground hover:bg-muted/60 hover:text-foreground transition-all">
              How It Works
            </Link>
          </SheetClose>
          <SheetClose asChild>
            <Link href="/#pricing" className="flex items-center py-3 px-4 rounded-xl text-base font-semibold text-muted-foreground hover:bg-muted/60 hover:text-foreground transition-all">
              Pricing
            </Link>
          </SheetClose>
          <SheetClose asChild>
            <Link href="/#faq" className="flex items-center py-3 px-4 rounded-xl text-base font-semibold text-muted-foreground hover:bg-muted/60 hover:text-foreground transition-all">
              FAQ
            </Link>
          </SheetClose>
        </div>

        {/* User Account Links at the Bottom */}
        {user && (
          <div className="mt-auto pt-6 border-t border-border/50 flex flex-col gap-2">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 px-2">Account</span>
            <SheetClose asChild>
              <Link href="/dashboard" className="flex items-center gap-3 py-3 px-4 rounded-xl text-base font-semibold text-foreground hover:bg-primary/10 hover:text-primary transition-all">
                <LayoutDashboard className="h-5 w-5" />
                Dashboard
              </Link>
            </SheetClose>
            <SheetClose asChild>
              <Link href="/dashboard/profile" className="flex items-center gap-3 py-3 px-4 rounded-xl text-base font-semibold text-foreground hover:bg-primary/10 hover:text-primary transition-all">
                <User className="h-5 w-5" />
                Profile
              </Link>
            </SheetClose>
            <button onClick={() => { handleLogout() }} className="flex items-center gap-3 py-3 px-4 rounded-xl text-base font-semibold text-destructive hover:bg-destructive/10 transition-all text-left w-full mt-2">
              <LogOut className="h-5 w-5" />
              Log out
            </button>
          </div>
        )}
      </SheetContent>
    </Sheet>
  )
}
