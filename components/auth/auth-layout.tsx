import type React from "react"
import Link from "next/link"
import { FileCheck } from "lucide-react"

export function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex">
      {/* Left side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-primary relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary-foreground/10 via-transparent to-transparent" />
        <div className="relative z-10 flex flex-col justify-between p-12 w-full">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary-foreground/20">
              <FileCheck className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-semibold text-primary-foreground">Authentiq</span>
          </Link>

          <div className="space-y-6 max-w-md">
            <blockquote className="text-2xl font-medium text-primary-foreground leading-relaxed">
              &ldquo;Authentiq has been invaluable for our academic integrity program. The accuracy and speed are
              unmatched.&rdquo;
            </blockquote>
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-full bg-primary-foreground/20" />
              <div>
                <p className="font-medium text-primary-foreground">Dr. Mehul Dutta</p>
                <p className="text-sm text-primary-foreground/70">Dean of Students, Amity University</p>
              </div>
            </div>
          </div>

          <p className="text-sm text-primary-foreground/50">Trusted by 50,000+ users worldwide</p>
        </div>
      </div>

      {/* Right side - Auth form */}
      <div className="flex-1 flex items-center justify-center p-6 md:p-12 bg-background">
        <div className="w-full max-w-md">
          <Link href="/" className="flex items-center gap-2 mb-8 lg:hidden">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
              <FileCheck className="h-4 w-4 text-primary-foreground" />
            </div>
            <span className="text-lg font-semibold">Authentiq</span>
          </Link>
          {children}
        </div>
      </div>
    </div>
  )
}
