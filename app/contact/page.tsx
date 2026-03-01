"use client"

import type React from "react"
import { useState } from "react"
import { MainLayout } from "@/components/layouts/main-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Mail, Phone, MapPin, Clock, Send, CheckCircle2, MessageSquare, Headphones, Building2 } from "lucide-react"

const contactInfo = [
  {
    icon: Mail,
    title: "Email",
    value: "support@plagchecker.com",
    description: "We respond within 24 hours",
  },
  {
    icon: Phone,
    title: "Phone",
    value: "+1 (555) 123-4567",
    description: "Mon-Fri, 9AM-6PM EST",
  },
  {
    icon: MapPin,
    title: "Office",
    value: "123 Innovation Drive",
    description: "San Francisco, CA 94102",
  },
  {
    icon: Clock,
    title: "Business Hours",
    value: "9:00 AM - 6:00 PM",
    description: "Monday to Friday (EST)",
  },
]

const departments = [
  {
    icon: Headphones,
    title: "Customer Support",
    email: "support@plagchecker.com",
    description: "For help with your account",
  },
  {
    icon: Building2,
    title: "Enterprise Sales",
    email: "enterprise@plagchecker.com",
    description: "For institutional plans",
  },
  {
    icon: MessageSquare,
    title: "Partnerships",
    email: "partners@plagchecker.com",
    description: "For business inquiries",
  },
]

export default function ContactPage() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [subject, setSubject] = useState("")

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    // Grab form fields
    const target = e.target as typeof e.target & {
      firstName: { value: string };
      lastName: { value: string };
      email: { value: string };
      message: { value: string };
    };

    const payload = {
      firstName: target.firstName.value,
      lastName: target.lastName.value,
      email: target.email.value,
      subject: subject || "general",
      message: target.message.value
    };

    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"

    try {
      const response = await fetch(`${apiUrl}/api/contact`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      })

      if (response.ok) {
        setIsSubmitted(true)
      } else {
        alert("Failed to send message. Please try again.")
      }
    } catch (error) {
      console.error(error)
      alert("An error occurred. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <MainLayout>
      {/* Hero */}
      <section className="py-20 md:py-28">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-6">Get in Touch</h1>
            <p className="text-lg text-muted-foreground">
              Have a question or need assistance? Our team is here to help you with anything related to Plag Checker.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Form & Info */}
      <section className="py-16">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <Card className="border-none shadow-lg">
              <CardHeader>
                <CardTitle>Send us a Message</CardTitle>
                <CardDescription>Fill out the form below and we'll get back to you soon.</CardDescription>
              </CardHeader>
              <CardContent>
                {isSubmitted ? (
                  <Alert className="bg-primary/10 border-primary/20">
                    <CheckCircle2 className="h-4 w-4 text-primary" />
                    <AlertDescription className="text-foreground">
                      Thank you for your message! We'll respond within 24 hours.
                    </AlertDescription>
                  </Alert>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="firstName">First Name</Label>
                        <Input id="firstName" placeholder="John" required />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="lastName">Last Name</Label>
                        <Input id="lastName" placeholder="Doe" required />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input id="email" type="email" placeholder="john@example.com" required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="subject">Subject</Label>
                      <Select onValueChange={setSubject} value={subject}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a topic" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="general">General Inquiry</SelectItem>
                          <SelectItem value="support">Technical Support</SelectItem>
                          <SelectItem value="billing">Billing Question</SelectItem>
                          <SelectItem value="enterprise">Enterprise Plans</SelectItem>
                          <SelectItem value="feedback">Feedback</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="message">Message</Label>
                      <Textarea id="message" placeholder="Tell us how we can help..." rows={5} required />
                    </div>
                    <Button type="submit" className="w-full" disabled={isSubmitting}>
                      {isSubmitting ? (
                        "Sending..."
                      ) : (
                        <>
                          <Send className="mr-2 h-4 w-4" />
                          Send Message
                        </>
                      )}
                    </Button>
                  </form>
                )}
              </CardContent>
            </Card>

            {/* Contact Info */}
            <div className="space-y-8">
              <div className="grid sm:grid-cols-2 gap-6">
                {contactInfo.map((item) => (
                  <Card key={item.title} className="border-none shadow-md">
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                          <item.icon className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <h3 className="font-semibold mb-1">{item.title}</h3>
                          <p className="text-sm font-medium">{item.value}</p>
                          <p className="text-xs text-muted-foreground">{item.description}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Departments */}
              <Card className="border-none shadow-md">
                <CardHeader>
                  <CardTitle className="text-lg">Contact by Department</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {departments.map((dept) => (
                    <div key={dept.title} className="flex items-center gap-4 p-3 rounded-lg bg-muted/50">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-background">
                        <dept.icon className="h-5 w-5 text-primary" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium text-sm">{dept.title}</h4>
                        <p className="text-xs text-muted-foreground">{dept.description}</p>
                      </div>
                      <a href={`mailto:${dept.email}`} className="text-xs text-primary hover:underline">
                        {dept.email}
                      </a>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Map Placeholder */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4 md:px-6">
          <div className="aspect-[21/9] rounded-xl overflow-hidden bg-muted">
            <img src="/san-francisco-office-map.jpg" alt="Office location map" className="w-full h-full object-cover" />
          </div>
        </div>
      </section>
    </MainLayout>
  )
}
