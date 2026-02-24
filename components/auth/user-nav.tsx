"use client"

import { LocalDB, LocalUser } from "@/lib/local-db"
import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { User, LogOut, LayoutDashboard } from "lucide-react"
import { useRouter } from "next/navigation"

export function UserNav() {
    const [user, setUser] = useState<LocalUser | null>(null)
    const router = useRouter()

    useEffect(() => {
        // Check local DB on mount
        const localUser = LocalDB.getUser()
        if (localUser) {
            setUser(localUser)
        }

        // Listen for storage events (if login happens in another tab/window)
        const handleStorageChange = () => {
            setUser(LocalDB.getUser())
        }
        window.addEventListener('storage', handleStorageChange)
        // Custom event for same-tab updates
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

    if (user) {
        return (
            <div className="hidden md:flex items-center gap-4">
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                            <Avatar className="h-9 w-9 border">
                                <AvatarImage src={user.avatarUrl} alt={user.fullName} />
                                <AvatarFallback>{user.fullName.charAt(0)}</AvatarFallback>
                            </Avatar>
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-56" align="end" forceMount>
                        <DropdownMenuLabel className="font-normal">
                            <div className="flex flex-col space-y-1">
                                <p className="text-sm font-medium leading-none">{user.fullName}</p>
                                <p className="text-xs leading-none text-muted-foreground">
                                    {user.email}
                                </p>
                            </div>
                        </DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem asChild>
                            <Link href="/dashboard" className="cursor-pointer">
                                <LayoutDashboard className="mr-2 h-4 w-4" />
                                Dashboard
                            </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                            <Link href="/dashboard/profile" className="cursor-pointer">
                                <User className="mr-2 h-4 w-4" />
                                Profile
                            </Link>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={handleLogout} className="text-destructive cursor-pointer">
                            <LogOut className="mr-2 h-4 w-4" />
                            Log out
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        )
    }

    return (
        <div className="hidden md:flex items-center gap-3">
            <Button variant="ghost" asChild>
                <Link href="/login?redirect=/">Log in</Link>
            </Button>
            <Button asChild>
                <Link href="/signup?redirect=/">Get Started</Link>
            </Button>
        </div>
    )
}
