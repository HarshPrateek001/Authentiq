"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { LocalDB } from "@/lib/local-db"
import { useEffect, useState } from "react"
import { ArrowRight, Loader2 } from "lucide-react"

interface SmartActionProps {
    href: string // The default link (usually signup)
    loggedInHref: string // The link if logged in
    children: React.ReactNode
    variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link"
    className?: string
    size?: "default" | "sm" | "lg" | "icon"
}

export function SmartAction({ href, loggedInHref, children, variant = "default", className, size = "default" }: SmartActionProps) {
    const [targetHref, setTargetHref] = useState(href)
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        setMounted(true)
        const user = LocalDB.getUser()
        if (user) {
            setTargetHref(loggedInHref)
        }
    }, [href, loggedInHref])

    if (!mounted) {
        // Return default state but maybe a loading state or just default to avoid flicker?
        // User requested "fixing misfunctional flow", avoiding flicker to 'signup' then 'dashboard' is good.
        // But since it's SSR, we might render default.
        return (
            <Button variant={variant} size={size} className={className} asChild>
                <Link href={href}>{children}</Link>
            </Button>
        )
    }

    return (
        <Button variant={variant} size={size} className={className} asChild>
            <Link href={targetHref}>{children}</Link>
        </Button>
    )
}
