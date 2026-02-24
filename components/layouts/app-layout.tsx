"use client"

import type React from "react"
import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  FileCheck,
  LayoutDashboard,
  FilePlus,
  History,
  Upload,
  FileText,
  User,
  Settings,
  CreditCard,
  Shield,
  Search,
  Bell,
  ChevronLeft,
  LogOut,
  Menu,
  Wand2,
} from "lucide-react"

const sidebarLinks = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/dashboard/new-check", label: "New Check", icon: FilePlus },
  { href: "/dashboard/humanizer", label: "AI Humanizer", icon: Wand2 }, // Added AI Humanizer link
  { href: "/dashboard/history", label: "History", icon: History },
  { href: "/dashboard/bulk-upload", label: "Bulk Upload", icon: Upload },
  { href: "/dashboard/reports", label: "Reports", icon: FileText },
]

const settingsLinks = [
  { href: "/dashboard/profile", label: "Profile", icon: User },
  { href: "/dashboard/settings", label: "Settings", icon: Settings },
  { href: "/dashboard/billing", label: "Billing", icon: CreditCard },
  { href: "/dashboard/security", label: "Security", icon: Shield },
]

function Sidebar({ collapsed, onToggle, onLinkClick }: { collapsed: boolean; onToggle: () => void; onLinkClick?: () => void }) {
  const pathname = usePathname()

  return (
    <aside
      className={cn(
        "fixed left-0 top-0 z-40 h-screen border-r border-border bg-sidebar transition-all duration-300",
        collapsed ? "w-16" : "w-64",
      )}
    >
      <div className="flex h-full flex-col">
        <div className="flex h-16 items-center justify-between border-b border-sidebar-border px-4">
          <Link href="/dashboard" className="flex items-center group">
            {collapsed ? (
              <div className="bg-white p-1 rounded-lg shrink-0">
                <Image src="/logo.png" alt="Authentiq Logo" width={32} height={32} className="w-8 h-8 group-hover:scale-105 transition-transform" />
              </div>
            ) : (
              <div className="bg-white px-2 py-1 rounded-xl shrink-0">
                <Image src="/logo-full.png" alt="Authentiq Logo" width={180} height={42} className="h-10 w-auto group-hover:scale-[1.02] transition-transform drop-shadow-sm" priority />
              </div>
            )}
          </Link>
          <Button
            variant="ghost"
            size="icon"
            onClick={onToggle}
            className={cn("hidden md:flex shrink-0", collapsed && "absolute -right-3 top-6 bg-card border shadow-sm")}
          >
            <ChevronLeft className={cn("h-4 w-4 transition-transform", collapsed && "rotate-180")} />
          </Button>
        </div>

        <nav className="flex-1 space-y-1 p-2 overflow-y-auto">
          <div className="space-y-1">
            {sidebarLinks.map((link) => {
              const isActive = pathname === link.href
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={onLinkClick}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                    isActive
                      ? "bg-sidebar-accent text-sidebar-accent-foreground"
                      : "text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground",
                    collapsed && "justify-center px-2",
                  )}
                >
                  <link.icon className="h-5 w-5 shrink-0" />
                  {!collapsed && <span>{link.label}</span>}
                </Link>
              )
            })}
          </div>

          <div className="my-4 border-t border-sidebar-border" />

          <div className="space-y-1">
            {!collapsed && (
              <p className="px-3 py-2 text-xs font-medium text-sidebar-foreground/50 uppercase tracking-wider">
                Account
              </p>
            )}
            {settingsLinks.map((link) => {
              const isActive = pathname === link.href
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={onLinkClick}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                    isActive
                      ? "bg-sidebar-accent text-sidebar-accent-foreground"
                      : "text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground",
                    collapsed && "justify-center px-2",
                  )}
                >
                  <link.icon className="h-5 w-5 shrink-0" />
                  {!collapsed && <span>{link.label}</span>}
                </Link>
              )
            })}
          </div>
        </nav>

        {!collapsed && (
          <div className="border-t border-sidebar-border p-4">
            <div className="rounded-lg bg-primary/10 p-3">
              <p className="text-sm font-medium">Pro Plan</p>
              <p className="text-xs text-muted-foreground">78 / 100 checks used</p>
              <div className="mt-2 h-1.5 rounded-full bg-muted overflow-hidden">
                <div className="h-full w-[78%] rounded-full bg-primary" />
              </div>
            </div>
          </div>
        )}
      </div>
    </aside>
  )
}

function TopBar({ sidebarCollapsed, onMenuClick }: { sidebarCollapsed: boolean; onMenuClick: () => void }) {
  return (
    <header
      className={cn(
        "sticky top-0 z-30 flex h-16 items-center gap-4 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-4 md:px-6 transition-all duration-300",
        sidebarCollapsed ? "md:pl-20" : "md:pl-68",
      )}
      style={{ paddingLeft: sidebarCollapsed ? "5rem" : "17rem" }}
    >
      <Button variant="ghost" size="icon" className="md:hidden" onClick={onMenuClick}>
        <Menu className="h-5 w-5" />
      </Button>

      <div className="relative flex-1 max-w-md">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input placeholder="Search documents..." className="pl-9 bg-muted/50 border-0" />
      </div>

      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] font-medium text-primary-foreground">
            3
          </span>
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="gap-2">
              <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center">
                <User className="h-4 w-4" />
              </div>
              <span className="hidden sm:inline-block">John Doe</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href="/dashboard/profile">
                <User className="mr-2 h-4 w-4" />
                Profile
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/dashboard/settings">
                <Settings className="mr-2 h-4 w-4" />
                Settings
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/dashboard/billing">
                <CreditCard className="mr-2 h-4 w-4" />
                Billing
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href="/">
                <LogOut className="mr-2 h-4 w-4" />
                Log out
              </Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}

export function AppLayout({ children }: { children: React.ReactNode }) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <div className="min-h-screen bg-background">
      <div className="hidden md:block">
        <Sidebar collapsed={sidebarCollapsed} onToggle={() => setSidebarCollapsed(!sidebarCollapsed)} />
      </div>

      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div className="fixed inset-0 bg-background/80 backdrop-blur-sm" onClick={() => setMobileMenuOpen(false)} />
          <Sidebar collapsed={false} onToggle={() => setMobileMenuOpen(false)} onLinkClick={() => setMobileMenuOpen(false)} />
        </div>
      )}

      <div className={cn("transition-all duration-300", sidebarCollapsed ? "md:ml-16" : "md:ml-64")}>
        <TopBar sidebarCollapsed={sidebarCollapsed} onMenuClick={() => setMobileMenuOpen(true)} />
        <main className="p-4 md:p-6">{children}</main>
      </div>
    </div>
  )
}
