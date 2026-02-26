"use client"
export const dynamic = "force-dynamic"

import type React from "react"
import { useState } from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { AuthLayout } from "@/components/auth/auth-layout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Eye, EyeOff, Loader2 } from "lucide-react"

import { LocalDB } from "@/lib/local-db"

export default function LoginPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirectUrl = searchParams.get("redirect") || "/dashboard"

  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false,
    agreeTerms: false,
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (!formData.agreeTerms) {
      setError("You must agree to the Terms & Conditions to log in.")
      return
    }

    setIsLoading(true)

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000"}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: formData.email, password: formData.password }),
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.detail || "Login failed")
      }

      const data = await res.json()
      // Store token (in localStorage for simplicity, or cookie)
      localStorage.setItem("access_token", data.access_token)
      localStorage.setItem("user", JSON.stringify(data.user))

      // Save to Local DB for UI consistency
      LocalDB.saveUser({
        id: data.user.id || '1',
        email: data.user.email,
        fullName: `${data.user.first_name || 'User'} ${data.user.last_name || ''}`.trim(),
        token: data.access_token
      })
      window.dispatchEvent(new Event('local-user-update'))

      router.push(redirectUrl)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <AuthLayout>
      <div className="space-y-6">
        <div className="space-y-2">
          <h1 className="text-2xl font-bold tracking-tight">Welcome back</h1>
          <p className="text-muted-foreground">Enter your credentials to access your account</p>
        </div>

        {error && (
          <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-3 text-sm text-destructive">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="you@example.com"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
              disabled={isLoading}
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="password">Password</Label>
              <Link href="/forgot-password" className="text-sm text-primary hover:underline">
                Forgot password?
              </Link>
            </div>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                required
                disabled={isLoading}
                className="pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Checkbox
              id="remember"
              checked={formData.rememberMe}
              onCheckedChange={(checked) => setFormData({ ...formData, rememberMe: checked as boolean })}
              disabled={isLoading}
            />
            <Label htmlFor="remember" className="text-sm font-normal cursor-pointer">
              Remember me for 30 days
            </Label>
          </div>

          <div className="flex items-start gap-2">
            <Checkbox
              id="terms"
              checked={formData.agreeTerms}
              onCheckedChange={(checked) => setFormData({ ...formData, agreeTerms: checked as boolean })}
              disabled={isLoading}
              className="mt-0.5"
            />
            <Label htmlFor="terms" className="text-sm font-normal cursor-pointer leading-relaxed">
              I agree to the{" "}
              <Link href="/terms" className="text-primary hover:underline">
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link href="/privacy" className="text-primary hover:underline">
                Privacy Policy
              </Link>
            </Label>
          </div>

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Signing in...
              </>
            ) : (
              "Sign in"
            )}
          </Button>

          <Button
            type="button"
            variant="secondary"
            className="w-full mt-2"
            onClick={() => {
              const demoUser = { id: "demo_ui_test", email: "ui_tester@example.com", first_name: "UI", last_name: "Tester" };
              const demoToken = "demo_token_for_ui_testing";
              localStorage.setItem("demo_mode", "true");
              localStorage.setItem("access_token", demoToken);
              localStorage.setItem("user", JSON.stringify(demoUser));
              LocalDB.saveUser({
                id: demoUser.id,
                email: demoUser.email,
                fullName: `${demoUser.first_name} ${demoUser.last_name}`,
                token: demoToken
              });
              window.dispatchEvent(new Event('local-user-update'));
              router.push(redirectUrl);
            }}
          >
            Auto Login (UI Testing)
          </Button>
        </form>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-border" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground">Or continue with</span>
          </div>
        </div>

        <Button variant="outline" className="w-full gap-2 bg-transparent" disabled={isLoading} onClick={() => { window.location.href = `${process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000"}/api/auth/google/login` }}>

          <svg className="h-4 w-4" viewBox="0 0 24 24">
            <path
              fill="currentColor"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="currentColor"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="currentColor"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
            />
            <path
              fill="currentColor"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            />
          </svg>
          Continue with Google
        </Button>

        <p className="text-center text-sm text-muted-foreground">
          Don&apos;t have an account?{" "}
          <Link href={`/signup?redirect=${redirectUrl}`} className="font-medium text-primary hover:underline">
            Sign up
          </Link>
        </p>
      </div>
    </AuthLayout>
  )
}
