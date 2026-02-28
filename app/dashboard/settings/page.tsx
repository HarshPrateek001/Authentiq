"use client"

import { useState, useEffect } from "react"
import { AppLayout } from "@/components/layouts/app-layout"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Slider } from "@/components/ui/slider"
import { LocalDB } from "@/lib/local-db"
import { toast } from "sonner"

export default function SettingsPage() {
  const [loading, setLoading] = useState(false)
  const [settings, setSettings] = useState({
    language: "en",
    defaultDocType: "assignment",
    reportPrivacy: "private",
    emailNotifications: true,
    reportReady: true,
    highRiskAlerts: true,
    usageWarnings: true,
    weeklyDigest: false,
    analysisDepth: [75],
  })

  useEffect(() => {
    LocalDB.logView('settings')
    const user = LocalDB.getUser()
    if (!user) return

    fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/api/settings`, {
      headers: { 'Authorization': `Bearer ${user.token}` }
    })
    .then(res => res.json())
    .then(data => {
      if (data && !data.detail) {
        setSettings({
          language: data.language || "en",
          defaultDocType: data.default_doc_type || "assignment",
          reportPrivacy: data.report_privacy || "private",
          emailNotifications: data.email_notifications ?? true,
          reportReady: data.report_ready ?? true,
          highRiskAlerts: data.high_risk_alerts ?? true,
          usageWarnings: data.usage_warnings ?? true,
          weeklyDigest: data.weekly_digest ?? false,
          analysisDepth: [data.analysis_depth || 75]
        })
      }
    })
    .catch(err => console.error("Error fetching settings:", err))
  }, [])

  const handleSave = async () => {
    setLoading(true)
    try {
      const user = LocalDB.getUser()
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/api/settings`, {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user?.token}`
        },
        body: JSON.stringify({
          language: settings.language,
          default_doc_type: settings.defaultDocType,
          report_privacy: settings.reportPrivacy,
          email_notifications: settings.emailNotifications,
          report_ready: settings.reportReady,
          high_risk_alerts: settings.highRiskAlerts,
          usage_warnings: settings.usageWarnings,
          weekly_digest: settings.weeklyDigest,
          analysis_depth: settings.analysisDepth[0]
        })
      })
      if (res.ok) {
        toast.success("Settings saved successfully!")
      } else {
        toast.error("Failed to save settings.")
      }
    } catch (e) {
      toast.error("An error occurred.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <AppLayout>
      <div className="space-y-6 max-w-2xl">
        <div>
          <h1 className="text-2xl font-bold">Settings</h1>
          <p className="text-muted-foreground">Manage your application preferences.</p>
        </div>

        <Tabs defaultValue="general" className="space-y-6">
          <TabsList>
            <TabsTrigger value="general">General</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
            <TabsTrigger value="analysis">Analysis</TabsTrigger>
          </TabsList>

          <TabsContent value="general" className="space-y-6">
            <div className="rounded-xl border border-border bg-card p-6 space-y-6">
              <h3 className="font-semibold">General Settings</h3>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Language</Label>
                    <p className="text-sm text-muted-foreground">Select your preferred language</p>
                  </div>
                  <Select
                    value={settings.language}
                    onValueChange={(value) => setSettings({ ...settings, language: value })}
                  >
                    <SelectTrigger className="w-[180px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="en">English</SelectItem>
                      <SelectItem value="es">Spanish</SelectItem>
                      <SelectItem value="fr">French</SelectItem>
                      <SelectItem value="de">German</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Default Document Type</Label>
                    <p className="text-sm text-muted-foreground">Automatically apply to new checks</p>
                  </div>
                  <Select
                    value={settings.defaultDocType}
                    onValueChange={(value) => setSettings({ ...settings, defaultDocType: value })}
                  >
                    <SelectTrigger className="w-[180px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="assignment">Assignment</SelectItem>
                      <SelectItem value="blog">Blog Post</SelectItem>
                      <SelectItem value="research">Research Paper</SelectItem>
                      <SelectItem value="article">Article</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Report Privacy</Label>
                    <p className="text-sm text-muted-foreground">Default privacy for new reports</p>
                  </div>
                  <Select
                    value={settings.reportPrivacy}
                    onValueChange={(value) => setSettings({ ...settings, reportPrivacy: value })}
                  >
                    <SelectTrigger className="w-[180px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="private">Private</SelectItem>
                      <SelectItem value="team">Team Only</SelectItem>
                      <SelectItem value="public">Public</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="notifications" className="space-y-6">
            <div className="rounded-xl border border-border bg-card p-6 space-y-6">
              <h3 className="font-semibold">Email Notifications</h3>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Email Notifications</Label>
                    <p className="text-sm text-muted-foreground">Receive email updates</p>
                  </div>
                  <Switch
                    checked={settings.emailNotifications}
                    onCheckedChange={(checked) => setSettings({ ...settings, emailNotifications: checked })}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Report Ready</Label>
                    <p className="text-sm text-muted-foreground">Notify when reports are complete</p>
                  </div>
                  <Switch
                    checked={settings.reportReady}
                    onCheckedChange={(checked) => setSettings({ ...settings, reportReady: checked })}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>High-Risk Alerts</Label>
                    <p className="text-sm text-muted-foreground">Alert for high similarity documents</p>
                  </div>
                  <Switch
                    checked={settings.highRiskAlerts}
                    onCheckedChange={(checked) => setSettings({ ...settings, highRiskAlerts: checked })}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Usage Warnings</Label>
                    <p className="text-sm text-muted-foreground">Warn when approaching quota limit</p>
                  </div>
                  <Switch
                    checked={settings.usageWarnings}
                    onCheckedChange={(checked) => setSettings({ ...settings, usageWarnings: checked })}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Weekly Digest</Label>
                    <p className="text-sm text-muted-foreground">Receive weekly summary email</p>
                  </div>
                  <Switch
                    checked={settings.weeklyDigest}
                    onCheckedChange={(checked) => setSettings({ ...settings, weeklyDigest: checked })}
                  />
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="analysis" className="space-y-6">
            <div className="rounded-xl border border-border bg-card p-6 space-y-6">
              <h3 className="font-semibold">AI & Analysis Settings</h3>

              <div className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label>Analysis Depth</Label>
                    <span className="text-sm font-medium">{settings.analysisDepth[0]}%</span>
                  </div>
                  <Slider
                    value={settings.analysisDepth}
                    onValueChange={(value) => setSettings({ ...settings, analysisDepth: value })}
                    max={100}
                    step={5}
                    className="w-full"
                  />
                  <p className="text-sm text-muted-foreground">
                    Higher depth provides more thorough analysis but takes longer to process.
                  </p>
                </div>

                <div className="rounded-lg bg-muted/50 p-4">
                  <p className="text-sm text-muted-foreground">
                    <strong className="text-foreground">Note:</strong> These settings affect processing speed and
                    accuracy. Higher analysis depth may use more of your monthly quota.
                  </p>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        <div className="flex justify-end gap-3">
          <Button variant="outline" className="bg-transparent">
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={loading}>
            {loading ? "Saving..." : "Save Settings"}
          </Button>
        </div>
      </div>
    </AppLayout>
  )
}
