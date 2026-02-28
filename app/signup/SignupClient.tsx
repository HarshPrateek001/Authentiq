"use client"

import type React from "react"
import { useState } from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { motion } from "framer-motion"
import { AuthLayout } from "@/components/auth/auth-layout"
import { PasswordStrength } from "@/components/auth/password-strength"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Eye, EyeOff, Loader2 } from "lucide-react"

const staggerContainer = {
  initial: { opacity: 0 },
  animate: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
}

const staggerItem = {
  initial: { opacity: 0, y: 15 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } },
}

export default function SignupPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirectUrl = searchParams.get("redirect") || "/dashboard"

  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "",
    agreeToTerms: false,
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setSuccess("")

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match")
      return
    }

    if (!formData.agreeToTerms) {
      setError("Please agree to the Terms & Privacy Policy")
      return
    }

    setIsLoading(true)

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"}/api/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName: formData.fullName,
          email: formData.email,
          password: formData.password,
          userType: formData.role,
        }),
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.detail || "Registration failed")
      }

      // On success, redirect to login with the original redirect intent
      setSuccess("Account created successfully! Redirecting to login...")
      
      setTimeout(() => {
        router.push(`/login?redirect=${redirectUrl}`)
      }, 1500)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <AuthLayout>
      <motion.div variants={staggerContainer} initial="initial" animate="animate" className="space-y-4">
        <motion.div variants={staggerItem} className="space-y-1 text-center">
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Create account</h1>
          <p className="text-muted-foreground text-sm">Start your free trial today. No credit card required.</p>
        </motion.div>

        {error && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="rounded-xl border border-destructive/50 bg-destructive/10 p-4 text-sm text-destructive font-medium shadow-sm"
          >
            {error}
          </motion.div>
        )}

        {success && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="rounded-xl border border-green-500/50 bg-green-500/10 p-4 text-sm text-green-600 dark:text-green-500 font-medium shadow-sm"
          >
            {success}
          </motion.div>
        )}

        <motion.form variants={staggerContainer} initial="initial" animate="animate" onSubmit={handleSubmit} className="space-y-3.5">
          <motion.div variants={staggerItem} className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div className="space-y-1.5">
              <Label htmlFor="fullName" className="text-foreground/80 font-medium">Full name</Label>
              <Input
                id="fullName"
                type="text"
                placeholder="John Doe"
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                required
                disabled={isLoading}
                className="h-10 bg-background/50 backdrop-blur-sm border-border/60 hover:border-primary/50 focus:border-primary rounded-xl transition-colors shadow-sm"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="email" className="text-foreground/80 font-medium">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
                disabled={isLoading}
                className="h-10 bg-background/50 backdrop-blur-sm border-border/60 hover:border-primary/50 focus:border-primary rounded-xl transition-colors shadow-sm"
              />
            </div>
          </motion.div>

          <motion.div variants={staggerItem} className="space-y-1.5">
            <Label htmlFor="role" className="text-foreground/80 font-medium">I am a</Label>
            <Select
              value={formData.role}
              onValueChange={(value) => setFormData({ ...formData, role: value })}
              disabled={isLoading}
            >
              <SelectTrigger id="role" className="h-10 bg-background/50 backdrop-blur-sm border-border/60 hover:border-primary/50 focus:border-primary rounded-xl transition-colors shadow-sm">
                <SelectValue placeholder="Select your role" />
              </SelectTrigger>
              <SelectContent className="rounded-xl shadow-xl border-border/50">
                <SelectItem value="student" className="cursor-pointer">Student</SelectItem>
                <SelectItem value="teacher" className="cursor-pointer">Teacher / Educator</SelectItem>
                <SelectItem value="writer" className="cursor-pointer">Content Writer</SelectItem>
                <SelectItem value="other" className="cursor-pointer">Other</SelectItem>
              </SelectContent>
            </Select>
          </motion.div>

          <motion.div variants={staggerItem} className="space-y-1.5">
            <Label htmlFor="password" className="text-foreground/80 font-medium">Password</Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Create a password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                required
                disabled={isLoading}
                className="h-10 pr-10 bg-background/50 backdrop-blur-sm border-border/60 hover:border-primary/50 focus:border-primary rounded-xl transition-colors shadow-sm"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors p-1.5 rounded-full hover:bg-foreground/5"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            <div className="pt-0.5">
              <PasswordStrength password={formData.password} />
            </div>
          </motion.div>

          <motion.div variants={staggerItem} className="space-y-1.5">
            <Label htmlFor="confirmPassword" className="text-foreground/80 font-medium">Confirm password</Label>
            <div className="relative">
              <Input
                id="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Confirm your password"
                value={formData.confirmPassword}
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                required
                disabled={isLoading}
                className="h-10 pr-10 bg-background/50 backdrop-blur-sm border-border/60 hover:border-primary/50 focus:border-primary rounded-xl transition-colors shadow-sm"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors p-1.5 rounded-full hover:bg-foreground/5"
              >
                {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </motion.div>

          <motion.div variants={staggerItem} className="flex items-start gap-2.5">
            <Checkbox
              id="terms"
              checked={formData.agreeToTerms}
              onCheckedChange={(checked) => setFormData({ ...formData, agreeToTerms: checked as boolean })}
              disabled={isLoading}
              className="mt-0.5 rounded text-primary data-[state=checked]:bg-primary"
            />
            <Label htmlFor="terms" className="text-sm font-medium text-muted-foreground cursor-pointer leading-relaxed select-none">
              I agree to the{" "}
              <Link href="/terms" className="text-primary font-semibold hover:text-primary/80 transition-colors">
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link href="/privacy" className="text-primary font-semibold hover:text-primary/80 transition-colors">
                Privacy Policy
              </Link>
            </Label>
          </motion.div>

          <motion.div variants={staggerItem}>
            <Button type="submit" className="w-full h-10 rounded-xl font-semibold shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all active:scale-[0.98]" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Creating account...
                </>
              ) : (
                "Create account"
              )}
            </Button>
          </motion.div>
        </motion.form>

        <motion.div variants={staggerItem} className="relative pt-2">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-border/60" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-card px-4 text-muted-foreground font-semibold tracking-wider rounded-full border border-border/50">Or continue with</span>
          </div>
        </motion.div>

        <motion.div variants={staggerItem}>
          <Button variant="outline" className="w-full h-10 rounded-xl gap-2.5 bg-background/50 backdrop-blur-sm border-border/60 hover:bg-muted/50 hover:border-primary/30 transition-all font-medium active:scale-[0.98]" disabled={isLoading} onClick={() => { window.location.href = `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"}/api/auth/google/login` }}>

            <svg className="h-5 w-5" viewBox="0 0 24 24">
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
        </motion.div>

        <motion.p variants={staggerItem} className="text-center text-sm text-muted-foreground">
          Already have an account?{" "}
          <Link href={`/login?redirect=${redirectUrl}`} className="font-semibold text-primary hover:text-primary/80 transition-colors ml-1">
            Sign in now &rarr;
          </Link>
        </motion.p>
      </motion.div>
    </AuthLayout>
  )
}
