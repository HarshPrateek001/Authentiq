import type React from "react"
import Link from "next/link"
import Image from "next/image"
import { FileCheck } from "lucide-react"

function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link href={href} className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
      {children}
    </Link>
  )
}

import { UserNav } from "@/components/auth/user-nav"

import { MobileNav } from "@/components/layouts/mobile-nav"

function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6">
        <Link href="/" className="flex items-center group">
          <Image src="/logo-full.png" alt="Authentiq Logo" width={160} height={40} className="h-10 w-auto group-hover:scale-[1.02] transition-transform drop-shadow-sm" priority />
        </Link>

        <nav className="hidden md:flex items-center gap-8">
          <NavLink href="/#features">Features</NavLink>
          <NavLink href="/#how-it-works">How It Works</NavLink>
          <NavLink href="/#pricing">Pricing</NavLink>
          <NavLink href="/#faq">FAQ</NavLink>
        </nav>

        <UserNav />
        <MobileNav />
      </div>
    </header>
  )
}

import { Facebook, Twitter, Instagram, Linkedin, Send } from "lucide-react"

function Footer() {
  return (
    <footer className="relative border-t border-border bg-background pt-16 pb-8 overflow-hidden">
      {/* Background Glow Effects */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-3xl h-[400px] bg-primary/5 blur-[120px] rounded-full pointer-events-none -z-10" />
      <div className="absolute bottom-0 right-0 w-[500px] h-[300px] bg-blue-500/5 blur-[100px] rounded-full pointer-events-none -z-10" />

      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-5 xl:grid-cols-6 border-b border-border/40 pb-16">
          
          {/* Brand & Newsletter Column (Takes up more space) */}
          <div className="lg:col-span-2 xl:col-span-2 space-y-6">
            <Link href="/" className="inline-flex relative group">
              <div className="relative flex items-center justify-center transition-transform duration-300 group-hover:scale-[1.02]">
                <Image src="/logo-full.png" alt="Authentiq Logo" width={220} height={55} className="h-14 w-auto relative z-10 drop-shadow-[0_0_15px_rgba(13,148,136,0.15)]" />
              </div>
            </Link>
            
            <p className="text-muted-foreground leading-relaxed max-w-sm">
              The world's most advanced AI-powered platform for detecting plagiarism and humanizing AI content seamlessly.
            </p>

            <div className="pt-2">
              <span className="text-sm font-semibold tracking-wide uppercase text-foreground mb-3 inline-block">Subscribe to Updates</span>
              <div className="relative max-w-md">
                <input 
                  type="email" 
                  placeholder="Enter your email" 
                  className="w-full h-12 bg-muted/30 border border-border/50 rounded-xl pl-4 pr-12 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all shadow-sm"
                />
                <button className="absolute right-1 top-1 bottom-1 w-10 flex items-center justify-center bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg transition-colors shadow-sm">
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Product Links */}
          <div className="space-y-5 lg:col-start-3">
            <h4 className="text-sm font-bold tracking-wider uppercase text-foreground">Product</h4>
            <ul className="space-y-3 text-sm text-muted-foreground font-medium">
              <li>
                <Link href="/#features" className="hover:text-primary transition-colors flex items-center gap-2 group">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary/0 group-hover:bg-primary transition-colors" />
                  Features
                </Link>
              </li>
              <li>
                <Link href="/#pricing" className="hover:text-primary transition-colors flex items-center gap-2 group">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary/0 group-hover:bg-primary transition-colors" />
                  Pricing
                </Link>
              </li>
              <li>
                <Link href="/#how-it-works" className="hover:text-primary transition-colors flex items-center gap-2 group">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary/0 group-hover:bg-primary transition-colors" />
                  How It Works
                </Link>
              </li>
              <li>
                <Link href="/dashboard" className="hover:text-primary transition-colors flex items-center gap-2 group">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary/0 group-hover:bg-primary transition-colors" />
                  Dashboard
                </Link>
              </li>
            </ul>
          </div>

          {/* Company Links */}
          <div className="space-y-5">
            <h4 className="text-sm font-bold tracking-wider uppercase text-foreground">Company</h4>
            <ul className="space-y-3 text-sm text-muted-foreground font-medium">
              <li>
                <Link href="/about" className="hover:text-primary transition-colors flex items-center gap-2 group">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary/0 group-hover:bg-primary transition-colors" />
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-primary transition-colors flex items-center gap-2 group">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary/0 group-hover:bg-primary transition-colors" />
                  Contact
                </Link>
              </li>
              <li>
                <div className="flex items-center gap-2">
                  <Link href="/careers" className="hover:text-primary transition-colors flex items-center gap-2 group">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary/0 group-hover:bg-primary transition-colors" />
                    Careers
                  </Link>
                  <span className="px-2 py-0.5 rounded-full bg-primary/10 text-primary text-[10px] font-bold uppercase tracking-widest leading-none">Hiring</span>
                </div>
              </li>
              <li>
                <Link href="/blog" className="hover:text-primary transition-colors flex items-center gap-2 group">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary/0 group-hover:bg-primary transition-colors" />
                  Blog
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal Links */}
          <div className="space-y-5">
            <h4 className="text-sm font-bold tracking-wider uppercase text-foreground">Legal</h4>
            <ul className="space-y-3 text-sm text-muted-foreground font-medium">
              <li>
                <Link href="/privacy" className="hover:text-primary transition-colors flex items-center gap-2 group">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary/0 group-hover:bg-primary transition-colors" />
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-primary transition-colors flex items-center gap-2 group">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary/0 group-hover:bg-primary transition-colors" />
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/security" className="hover:text-primary transition-colors flex items-center gap-2 group">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary/0 group-hover:bg-primary transition-colors" />
                  Security
                </Link>
              </li>
              <li>
                <Link href="/status" className="hover:text-primary transition-colors flex items-center gap-2 group">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.8)]" />
                  Status
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar: Copyright & Socials */}
        <div className="flex flex-col md:flex-row items-center justify-between pt-8 gap-4">
          <p className="text-sm font-medium text-muted-foreground">
            &copy; {new Date().getFullYear()} Authentiq Technologies, Inc. All rights reserved.
          </p>
          
          <div className="flex items-center gap-4">
            <a href="#" className="w-9 h-9 flex items-center justify-center rounded-full bg-muted/50 border border-border/50 text-muted-foreground hover:text-primary hover:border-primary/50 hover:bg-primary/10 transition-all duration-300">
              <Twitter className="w-4 h-4 fill-current" />
            </a>
            <a href="#" className="w-9 h-9 flex items-center justify-center rounded-full bg-muted/50 border border-border/50 text-muted-foreground hover:text-primary hover:border-primary/50 hover:bg-primary/10 transition-all duration-300">
              <Facebook className="w-4 h-4 fill-current" />
            </a>
            <a href="#" className="w-9 h-9 flex items-center justify-center rounded-full bg-muted/50 border border-border/50 text-muted-foreground hover:text-primary hover:border-primary/50 hover:bg-primary/10 transition-all duration-300">
              <Instagram className="w-4 h-4" />
            </a>
            <a href="#" className="w-9 h-9 flex items-center justify-center rounded-full bg-muted/50 border border-border/50 text-muted-foreground hover:text-primary hover:border-primary/50 hover:bg-primary/10 transition-all duration-300">
              <Linkedin className="w-4 h-4 fill-current" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}

export function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  )
}
