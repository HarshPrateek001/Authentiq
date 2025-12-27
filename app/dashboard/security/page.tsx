"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Shield,
  Smartphone,
  Key,
  Globe,
  Clock,
  AlertTriangle,
  Check,
  Laptop,
  Monitor,
  Trash2,
  Plus,
  Copy,
  Eye,
  EyeOff,
  RefreshCw,
} from "lucide-react"

const sessions = [
  {
    id: 1,
    device: "MacBook Pro",
    browser: "Chrome 120",
    location: "San Francisco, CA",
    ip: "192.168.1.***",
    lastActive: "Active now",
    current: true,
    icon: Laptop,
  },
  {
    id: 2,
    device: "iPhone 15 Pro",
    browser: "Safari Mobile",
    location: "San Francisco, CA",
    ip: "192.168.1.***",
    lastActive: "2 hours ago",
    current: false,
    icon: Smartphone,
  },
  {
    id: 3,
    device: "Windows Desktop",
    browser: "Firefox 121",
    location: "New York, NY",
    ip: "10.0.0.***",
    lastActive: "1 day ago",
    current: false,
    icon: Monitor,
  },
]

const activityLog = [
  { action: "Password changed", time: "2 days ago", status: "success" },
  { action: "Login from new device", time: "5 days ago", status: "warning" },
  { action: "API key generated", time: "1 week ago", status: "success" },
  { action: "2FA enabled", time: "2 weeks ago", status: "success" },
  { action: "Failed login attempt", time: "3 weeks ago", status: "danger" },
]

export default function SecurityPage() {
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(true)
  const [loginAlerts, setLoginAlerts] = useState(true)
  const [apiKeyVisible, setApiKeyVisible] = useState(false)
  const [apiKey] = useState("pk_live_51NxKj2...")

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-foreground">Security Center</h1>
        <p className="text-muted-foreground">Manage your account security and access</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Two-Factor Authentication */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                  <Shield className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <CardTitle className="text-base">Two-Factor Authentication</CardTitle>
                  <CardDescription>Add an extra layer of security</CardDescription>
                </div>
              </div>
              <Badge variant={twoFactorEnabled ? "default" : "secondary"}>
                {twoFactorEnabled ? "Enabled" : "Disabled"}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between rounded-lg border p-4">
              <div className="flex items-center gap-3">
                <Smartphone className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="font-medium">Authenticator App</p>
                  <p className="text-sm text-muted-foreground">Use Google Authenticator or similar</p>
                </div>
              </div>
              <Switch checked={twoFactorEnabled} onCheckedChange={setTwoFactorEnabled} />
            </div>
            <div className="flex items-center justify-between rounded-lg border p-4">
              <div className="flex items-center gap-3">
                <Key className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="font-medium">Recovery Codes</p>
                  <p className="text-sm text-muted-foreground">8 codes remaining</p>
                </div>
              </div>
              <Button variant="outline" size="sm">
                View Codes
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Password Settings */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                <Key className="h-5 w-5 text-primary" />
              </div>
              <div>
                <CardTitle className="text-base">Password</CardTitle>
                <CardDescription>Last changed 2 days ago</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Current Password</Label>
              <Input type="password" placeholder="Enter current password" />
            </div>
            <div className="space-y-2">
              <Label>New Password</Label>
              <Input type="password" placeholder="Enter new password" />
            </div>
            <div className="space-y-2">
              <Label>Confirm New Password</Label>
              <Input type="password" placeholder="Confirm new password" />
            </div>
            <Button className="w-full">Update Password</Button>
          </CardContent>
        </Card>

        {/* API Keys */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                  <Globe className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <CardTitle className="text-base">API Keys</CardTitle>
                  <CardDescription>Manage API access to your account</CardDescription>
                </div>
              </div>
              <Dialog>
                <DialogTrigger asChild>
                  <Button size="sm">
                    <Plus className="mr-2 h-4 w-4" />
                    New Key
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Create API Key</DialogTitle>
                    <DialogDescription>Generate a new API key for external integrations</DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <Label>Key Name</Label>
                      <Input placeholder="e.g., Production Server" />
                    </div>
                    <div className="space-y-2">
                      <Label>Permissions</Label>
                      <div className="space-y-2">
                        <label className="flex items-center gap-2">
                          <input type="checkbox" className="rounded" defaultChecked />
                          <span className="text-sm">Read access</span>
                        </label>
                        <label className="flex items-center gap-2">
                          <input type="checkbox" className="rounded" />
                          <span className="text-sm">Write access</span>
                        </label>
                      </div>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline">Cancel</Button>
                    <Button>Generate Key</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between rounded-lg border p-4">
                <div>
                  <p className="font-medium">Production API Key</p>
                  <div className="mt-1 flex items-center gap-2">
                    <code className="rounded bg-muted px-2 py-0.5 text-sm">
                      {apiKeyVisible ? apiKey : "pk_live_••••••••"}
                    </code>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6"
                      onClick={() => setApiKeyVisible(!apiKeyVisible)}
                    >
                      {apiKeyVisible ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
                    </Button>
                    <Button variant="ghost" size="icon" className="h-6 w-6">
                      <Copy className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="icon">
                    <RefreshCw className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" className="text-destructive">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Login Alerts */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                <AlertTriangle className="h-5 w-5 text-primary" />
              </div>
              <div>
                <CardTitle className="text-base">Security Alerts</CardTitle>
                <CardDescription>Get notified about suspicious activity</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Login from new device</p>
                <p className="text-sm text-muted-foreground">Email when a new device logs in</p>
              </div>
              <Switch checked={loginAlerts} onCheckedChange={setLoginAlerts} />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Failed login attempts</p>
                <p className="text-sm text-muted-foreground">Email after 3 failed attempts</p>
              </div>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Password changes</p>
                <p className="text-sm text-muted-foreground">Email when password is changed</p>
              </div>
              <Switch defaultChecked />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Active Sessions */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                <Clock className="h-5 w-5 text-primary" />
              </div>
              <div>
                <CardTitle className="text-base">Active Sessions</CardTitle>
                <CardDescription>Devices currently logged into your account</CardDescription>
              </div>
            </div>
            <Button variant="outline" size="sm" className="text-destructive bg-transparent">
              Sign out all devices
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {sessions.map((session) => (
              <div key={session.id} className="flex items-center justify-between rounded-lg border p-4">
                <div className="flex items-center gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
                    <session.icon className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-medium">{session.device}</p>
                      {session.current && (
                        <Badge variant="secondary" className="text-xs">
                          Current
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {session.browser} • {session.location}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      IP: {session.ip} • {session.lastActive}
                    </p>
                  </div>
                </div>
                {!session.current && (
                  <Button variant="ghost" size="sm" className="text-destructive">
                    Revoke
                  </Button>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Activity Log */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Recent Security Activity</CardTitle>
          <CardDescription>A log of security-related events on your account</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {activityLog.map((item, index) => (
              <div key={index} className="flex items-center justify-between py-2">
                <div className="flex items-center gap-3">
                  <div
                    className={`flex h-8 w-8 items-center justify-center rounded-full ${
                      item.status === "success"
                        ? "bg-green-100 text-green-600"
                        : item.status === "warning"
                          ? "bg-amber-100 text-amber-600"
                          : "bg-red-100 text-red-600"
                    }`}
                  >
                    {item.status === "success" ? <Check className="h-4 w-4" /> : <AlertTriangle className="h-4 w-4" />}
                  </div>
                  <p className="font-medium">{item.action}</p>
                </div>
                <p className="text-sm text-muted-foreground">{item.time}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
