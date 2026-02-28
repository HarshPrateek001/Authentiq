"use client"

import type React from "react"
import { useState, useEffect, useRef } from "react"
import { AppLayout } from "@/components/layouts/app-layout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Camera, Loader2, User as UserIcon } from "lucide-react"
import { LocalDB } from "@/lib/local-db"
import { toast } from "sonner"

export default function ProfilePage() {
  const [isLoading, setIsLoading] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  
  const [user, setUser] = useState<any>(null)
  const [stats, setStats] = useState<any>(null)
  const [limits, setLimits] = useState<any>(null)

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    organization: "",
    bio: "",
  })

  useEffect(() => {
    // Load local data immediately for snap-loading
    const currentUser = LocalDB.getUser()
    if (currentUser) {
        setUser(currentUser)
        setFormData({
            firstName: currentUser.first_name || "",
            lastName: currentUser.last_name || "",
            email: currentUser.email || "",
            organization: currentUser.organization || "",
            bio: currentUser.bio || ""
        })
        
        // Fetch stats & limits
        const dbStats = LocalDB.getStats()
        if (dbStats) setStats(dbStats)
        
        const dbLimits = LocalDB.getUserLimits()
        if (dbLimits) setLimits(dbLimits)

        // Then fetch latest data from backend for perfect synchronization (real-time fetch)
        fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/api/user/me`, {
          headers: { 'Authorization': `Bearer ${currentUser.token}` }
        })
        .then(res => { if (res.ok) return res.json() })
        .then(freshData => {
           if (freshData) {
              const freshUser = { 
                 ...freshData, 
                 token: currentUser.token,
                 fullName: `${freshData.first_name || ''} ${freshData.last_name || ''}`.trim() || "User"
              }
              LocalDB.setUser(freshUser)
              setUser(freshUser)
              setFormData({
                  firstName: freshUser.first_name || "",
                  lastName: freshUser.last_name || "",
                  email: freshUser.email || "",
                  organization: freshUser.organization || "",
                  bio: freshUser.bio || ""
              })
              window.dispatchEvent(new Event("profileUpdated"))
              window.dispatchEvent(new Event('local-user-update'))
           }
        })
        .catch(err => console.error("Could not background refresh user:", err))
    }
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    
    try {
        const currentUser = LocalDB.getUser()
        const token = (typeof LocalDB.getToken === 'function') ? LocalDB.getToken() : currentUser?.token
        
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/api/profile`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                first_name: formData.firstName,
                last_name: formData.lastName,
                organization: formData.organization,
                bio: formData.bio
            })
        })
        
        if (!response.ok) throw new Error("Failed to update profile")
        
        const data = await response.json()
        
        // Preserve the token! The backend doesn't send the token back in the user object
        data.user.token = token 
        data.user.fullName = `${data.user.first_name || ''} ${data.user.last_name || ''}`.trim() || "User"
        
        LocalDB.setUser(data.user)
        setUser(data.user)
        
        // Dispatch event for TopBar and other components to update
        window.dispatchEvent(new Event("profileUpdated"))
        toast.success("Profile updated successfully")
    } catch (error: any) {
        console.error("Error updating profile:", error)
        toast.error("Failed to update profile: " + (error.message || "Unknown error"))
    } finally {
        setIsLoading(false)
    }
  }

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0]
      if (!file) return
      
      setIsUploading(true)
      try {
          const formData = new FormData()
          formData.append("file", file)
          
          const currentUser = LocalDB.getUser()
          const token = (typeof LocalDB.getToken === 'function') ? LocalDB.getToken() : currentUser?.token
          
          const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/api/profile/avatar`, {
              method: 'POST',
              headers: {
                  'Authorization': `Bearer ${token}`
              },
              body: formData
          })
          
          if (!response.ok) throw new Error("Failed to upload avatar")
          
          const data = await response.json()
          
          // Preserve the token! The backend doesn't send the token back in the user object
          data.user.token = token 
          data.user.fullName = `${data.user.first_name || ''} ${data.user.last_name || ''}`.trim() || "User"
          
          LocalDB.setUser(data.user)
          setUser(data.user)
          
          // Dispatch event for global updates
          window.dispatchEvent(new Event("profileUpdated"))
          toast.success("Profile picture updated")
      } catch (error) {
          console.error("Error uploading avatar:", error)
          toast.error("Failed to upload avatar")
      } finally {
          setIsUploading(false)
          // Reset input so they can upload the exact same file again if needed
          if (fileInputRef.current) fileInputRef.current.value = ""
      }
  }

  const fullName = `${formData.firstName} ${formData.lastName}`.trim() || "User"
  const planName = limits?.plan ? limits.plan.charAt(0).toUpperCase() + limits.plan.slice(1).replace('_', ' ') : "Free"

  return (
    <AppLayout>
      <div className="space-y-6 max-w-2xl">
        <div>
          <h1 className="text-2xl font-bold">Profile</h1>
          <p className="text-muted-foreground">Manage your account information and preferences.</p>
        </div>

        <div className="rounded-xl border border-border bg-card p-6">
          <div className="flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left gap-6">
            <div className="relative">
              <Avatar className="h-24 w-24">
                {user?.avatar_url ? (
                    <AvatarImage src={user.avatar_url} className="object-cover" />
                ) : null}
                <AvatarFallback className="text-2xl bg-primary/10 text-primary">
                    {formData.firstName ? formData.firstName.charAt(0).toUpperCase() : <UserIcon className="h-8 w-8" />}
                </AvatarFallback>
              </Avatar>
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleAvatarUpload} 
                className="hidden" 
                accept="image/*" 
                title="Upload Avatar"
                aria-label="Upload Avatar"
              />
              <Button
                size="icon"
                variant="outline"
                className="absolute -bottom-2 -right-2 h-8 w-8 rounded-full bg-background"
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploading}
              >
                {isUploading ? <Loader2 className="h-3 w-3 animate-spin" /> : <Camera className="h-4 w-4" />}
              </Button>
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-semibold break-words max-w-full">{fullName}</h2>
              <p className="text-muted-foreground break-all">{formData.email}</p>
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mt-2">
                <Badge variant="secondary" className="capitalize">{user?.user_type || 'Student'}</Badge>
                <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
                  {planName} Plan
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
                <Label htmlFor="firstName">First Name</Label>
                <Input
                  id="firstName"
                  value={formData.firstName}
                  onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name</Label>
                <Input
                  id="lastName"
                  value={formData.lastName}
                  onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                />
              </div>
              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  disabled
                  className="bg-muted/50"
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
                <p className="font-medium capitalize">{user?.user_type || 'Unknown'}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Member Since</p>
                <p className="font-medium">
                    {user?.created_at ? new Date(user.created_at).toLocaleDateString() : 'N/A'}
                </p>
              </div>
              <div>
                <p className="text-muted-foreground">Current Plan</p>
                <p className="font-medium">{planName}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Total Checks</p>
                <p className="font-medium">{stats?.total_checks || 0}</p>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3">
            <Button type="button" variant="outline" className="bg-transparent" onClick={() => window.history.back()}>
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
