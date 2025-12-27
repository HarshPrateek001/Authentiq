"use client"

import type React from "react"
import { useState } from "react"
import { AppLayout } from "@/components/layouts/app-layout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Camera, Loader2 } from "lucide-react"

export default function ProfilePage() {
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    fullName: "John Doe",
    email: "john@example.com",
    organization: "Acme University",
    bio: "Researcher focused on climate science and environmental policy.",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    // TODO: Connect to /api/profile/update
    await new Promise((resolve) => setTimeout(resolve, 1000))
    setIsLoading(false)
  }

  return (
    <AppLayout>
      <div className="space-y-6 max-w-2xl">
        <div>
          <h1 className="text-2xl font-bold">Profile</h1>
          <p className="text-muted-foreground">Manage your account information and preferences.</p>
        </div>

        <div className="rounded-xl border border-border bg-card p-6">
          <div className="flex items-start gap-6">
            <div className="relative">
              <Avatar className="h-24 w-24">
                <AvatarImage src="/professional-avatar.png" />
                <AvatarFallback className="text-2xl">JD</AvatarFallback>
              </Avatar>
              <Button
                size="icon"
                variant="outline"
                className="absolute -bottom-2 -right-2 h-8 w-8 rounded-full bg-background"
              >
                <Camera className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-semibold">{formData.fullName}</h2>
              <p className="text-muted-foreground">{formData.email}</p>
              <div className="flex items-center gap-2 mt-2">
                <Badge variant="secondary">Researcher</Badge>
                <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
                  Pro Plan
                </Badge>
              </div>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="rounded-xl border border-border bg-card p-6 space-y-4">
            <h3 className="font-semibold">Personal Information</h3>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="fullName">Full Name</Label>
                <Input
                  id="fullName"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="organization">Organization</Label>
              <Input
                id="organization"
                value={formData.organization}
                onChange={(e) => setFormData({ ...formData, organization: e.target.value })}
                placeholder="Your university or company"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="bio">Bio</Label>
              <Textarea
                id="bio"
                value={formData.bio}
                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                placeholder="Tell us a bit about yourself"
                rows={3}
              />
            </div>
          </div>

          <div className="rounded-xl border border-border bg-card p-6 space-y-4">
            <h3 className="font-semibold">Account Details</h3>
            <div className="grid gap-4 sm:grid-cols-2 text-sm">
              <div>
                <p className="text-muted-foreground">Role</p>
                <p className="font-medium">Researcher</p>
              </div>
              <div>
                <p className="text-muted-foreground">Member Since</p>
                <p className="font-medium">January 15, 2024</p>
              </div>
              <div>
                <p className="text-muted-foreground">Current Plan</p>
                <p className="font-medium">Pro</p>
              </div>
              <div>
                <p className="text-muted-foreground">Total Checks</p>
                <p className="font-medium">247</p>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3">
            <Button type="button" variant="outline" className="bg-transparent">
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                "Save Changes"
              )}
            </Button>
          </div>
        </form>
      </div>
    </AppLayout>
  )
}
