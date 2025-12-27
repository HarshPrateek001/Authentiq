"use client"

import { useState } from "react"
import { MainLayout } from "@/components/layouts/main-layout"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Shield, Lock, Eye, Trash2, FileText, MessageSquare } from "lucide-react"

const highlights = [
  { icon: Shield, title: "Data Protection", description: "Industry-standard encryption" },
  { icon: Lock, title: "Secure Storage", description: "SOC 2 compliant infrastructure" },
  { icon: Eye, title: "Transparency", description: "Clear data usage policies" },
  { icon: Trash2, title: "Data Deletion", description: "Request deletion anytime" },
]

const privacyContent = {
  intro: {
    legal:
      "At Plag Checker, we are committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our plagiarism detection service. Please read this policy carefully.",
    human:
      "We take your privacy seriously. This page explains what information we collect, why we need it, and how we keep it safe. Read on to understand how we handle your data.",
  },
  personalInfo: {
    legal:
      "We collect: Name and email address when you create an account; Billing information when you subscribe to paid plans; Profile information you choose to provide; Communications you send to our support team.",
    human:
      "We collect basics like your name, email, and payment info when you sign up or buy something. We also save any messages you send to our support team.",
  },
  usageInfo: {
    legal:
      "We collect: Documents you submit for plagiarism checking; Log data including IP address, browser type, and access times; Device information and operating system; Usage patterns and feature interactions.",
    human:
      "We keep track of what you check for plagiarism, plus technical stuff like your browser type and when you use the service. This helps us make things work better.",
  },
  howWeUse: {
    legal:
      "We use collected information to: Provide and maintain our plagiarism detection services; Process your transactions and manage subscriptions; Send you service updates and administrative messages; Improve our algorithms and service quality; Respond to your inquiries and provide customer support; Detect and prevent fraud or abuse.",
    human:
      "We use your data to: Run the plagiarism checker, process payments, send important updates, make our service better, help you when you need support, and stop bad actors.",
  },
  documentProcessing: {
    legal:
      "Documents you submit are processed securely for plagiarism detection. We do not share your documents with third parties, sell your content, or use it for purposes other than providing our services. Documents are automatically deleted after 30 days unless you choose to retain them.",
    human:
      "Your documents are checked securely and privately. We don't share or sell them to anyone. They're automatically deleted after 30 days unless you want to keep them longer.",
  },
  security: {
    legal:
      "We implement industry-standard security measures including encryption in transit and at rest, secure data centers, regular security audits, and access controls. However, no method of transmission over the Internet is 100% secure.",
    human:
      "We use strong encryption and secure servers to protect your data. We regularly check for security issues. While we do our best, no online service is 100% safe.",
  },
  sharing: {
    legal:
      "We do not sell your personal information. We may share data with trusted service providers who assist in operating our service (payment processors, cloud hosting), when required by law, or to protect our rights and safety.",
    human:
      "We never sell your data. We only share it with companies that help us run the service (like payment processors), or if the law requires it.",
  },
  rights: {
    legal:
      "You have the right to: Access and receive a copy of your personal data; Correct inaccurate or incomplete information; Request deletion of your personal data; Object to processing of your data; Export your data in a portable format; Withdraw consent at any time.",
    human:
      "You can: Get a copy of your data, fix any mistakes, delete your account, stop us from using your data, download everything, or change your mind about sharing data.",
  },
  cookies: {
    legal:
      "We use cookies and similar technologies to improve your experience, analyze usage patterns, and personalize content. You can control cookie settings through your browser preferences.",
    human:
      "We use cookies to make the site work better and understand how people use it. You can turn them off in your browser settings.",
  },
  transfers: {
    legal:
      "Your data may be transferred to and processed in countries other than your own. We ensure appropriate safeguards are in place to protect your information in accordance with this policy.",
    human: "Your data might be stored in other countries, but we make sure it's protected no matter where it goes.",
  },
  contact: {
    legal:
      "For privacy-related questions or to exercise your rights, contact our Data Protection Officer at privacy@plagchecker.com or through our Contact page.",
    human: "Questions about privacy? Email privacy@plagchecker.com or use our Contact page. We're happy to help!",
  },
}

export default function PrivacyPage() {
  const [isHumanMode, setIsHumanMode] = useState(false)

  return (
    <MainLayout>
      <section className="py-20">
        <div className="container mx-auto px-4 md:px-6 max-w-4xl">
          <div className="text-center mb-12">
            <Badge variant="secondary" className="mb-4">
              Legal
            </Badge>
            <h1 className="text-4xl font-bold mb-4">Privacy Policy</h1>
            <p className="text-muted-foreground">Last updated: January 1, 2024</p>
          </div>

          {/* Mode Toggle */}
          <div className="flex items-center justify-center gap-4 mb-8 p-4 rounded-xl bg-muted/50">
            <div className="flex items-center gap-2">
              <FileText className="h-4 w-4 text-muted-foreground" />
              <span className={`text-sm ${!isHumanMode ? "font-medium" : "text-muted-foreground"}`}>Legal Mode</span>
            </div>
            <Switch checked={isHumanMode} onCheckedChange={setIsHumanMode} />
            <div className="flex items-center gap-2">
              <MessageSquare className="h-4 w-4 text-primary" />
              <span className={`text-sm ${isHumanMode ? "font-medium text-primary" : "text-muted-foreground"}`}>
                Human-Readable Mode
              </span>
            </div>
          </div>

          {isHumanMode && (
            <div className="mb-8 p-4 rounded-xl bg-primary/5 border border-primary/20 text-center">
              <p className="text-sm text-muted-foreground">
                This is a simplified summary. For the full legal terms, switch to Legal Mode.
              </p>
            </div>
          )}

          {/* Highlights */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
            {highlights.map((item) => (
              <div key={item.title} className="flex items-center gap-3 p-4 rounded-lg bg-muted/50">
                <item.icon className="h-5 w-5 text-primary shrink-0" />
                <div>
                  <div className="font-medium text-sm">{item.title}</div>
                  <div className="text-xs text-muted-foreground">{item.description}</div>
                </div>
              </div>
            ))}
          </div>

          <Card className="border-none shadow-lg">
            <CardContent className="p-8 md:p-12 space-y-8">
              <section>
                <h2 className="text-xl font-semibold mb-3">1. Introduction</h2>
                <p className="text-muted-foreground leading-relaxed">
                  {isHumanMode ? privacyContent.intro.human : privacyContent.intro.legal}
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-3">2. Information We Collect</h2>
                <h3 className="text-lg font-medium mb-2">Personal Information</h3>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  {isHumanMode ? privacyContent.personalInfo.human : privacyContent.personalInfo.legal}
                </p>
                <h3 className="text-lg font-medium mb-2">Usage Information</h3>
                <p className="text-muted-foreground leading-relaxed">
                  {isHumanMode ? privacyContent.usageInfo.human : privacyContent.usageInfo.legal}
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-3">3. How We Use Your Information</h2>
                <p className="text-muted-foreground leading-relaxed">
                  {isHumanMode ? privacyContent.howWeUse.human : privacyContent.howWeUse.legal}
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-3">4. Document Processing</h2>
                <p className="text-muted-foreground leading-relaxed">
                  {isHumanMode ? privacyContent.documentProcessing.human : privacyContent.documentProcessing.legal}
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-3">5. Data Security</h2>
                <p className="text-muted-foreground leading-relaxed">
                  {isHumanMode ? privacyContent.security.human : privacyContent.security.legal}
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-3">6. Data Sharing</h2>
                <p className="text-muted-foreground leading-relaxed">
                  {isHumanMode ? privacyContent.sharing.human : privacyContent.sharing.legal}
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-3">7. Your Rights</h2>
                <p className="text-muted-foreground leading-relaxed">
                  {isHumanMode ? privacyContent.rights.human : privacyContent.rights.legal}
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-3">8. Cookies and Tracking</h2>
                <p className="text-muted-foreground leading-relaxed">
                  {isHumanMode ? privacyContent.cookies.human : privacyContent.cookies.legal}
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-3">9. International Transfers</h2>
                <p className="text-muted-foreground leading-relaxed">
                  {isHumanMode ? privacyContent.transfers.human : privacyContent.transfers.legal}
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-3">10. Contact Us</h2>
                <p className="text-muted-foreground leading-relaxed">
                  {isHumanMode ? privacyContent.contact.human : privacyContent.contact.legal}
                </p>
              </section>
            </CardContent>
          </Card>
        </div>
      </section>
    </MainLayout>
  )
}
