"use client"

import { useState } from "react"
import { MainLayout } from "@/components/layouts/main-layout"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { FileText, MessageSquare } from "lucide-react"

const legalContent = {
  acceptance: {
    legal:
      "By accessing or using Plag Checker ('Service'), you agree to be bound by these Terms of Service ('Terms'). If you do not agree to these Terms, you may not use the Service. We reserve the right to modify these Terms at any time, and such modifications will be effective immediately upon posting.",
    human:
      "When you use Plag Checker, you're agreeing to these rules. If you don't agree, please don't use our service. We might update these rules sometimes, and the new version counts as soon as we post it.",
  },
  description: {
    legal:
      "Plag Checker provides AI-powered plagiarism detection services that allow users to check documents for potential plagiarism. Our Service compares submitted content against a database of web pages, academic papers, and other documents to identify similarities.",
    human:
      "We help you check if your writing is original. Our AI compares your text against millions of web pages, articles, and papers to find any matching content.",
  },
  accounts: {
    legal:
      "To access certain features, you must create an account. You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account. You must immediately notify us of any unauthorized use of your account.",
    human:
      "You need an account for some features. Keep your password safe - you're responsible for anything that happens on your account. If someone else gets in, tell us right away.",
  },
  acceptableUse: {
    legal:
      "You agree not to: use the Service for any unlawful purpose; submit content that infringes upon intellectual property rights; attempt unauthorized access to our systems; use automated tools without permission; resell the Service without authorization; interfere with service performance.",
    human:
      "Don't do bad stuff: No illegal activities, no stealing others' work, no hacking, no bots without asking, no reselling our service, and don't try to break things.",
  },
  ownership: {
    legal:
      "You retain all ownership rights to content you submit to the Service. By submitting content, you grant us a limited license to process and analyze it solely for the purpose of providing plagiarism detection services. We do not claim ownership of your submitted content.",
    human:
      "Your writing stays yours. We only use it to check for plagiarism - we don't own it, sell it, or use it for anything else.",
  },
  privacy: {
    legal:
      "Your privacy is important to us. Please review our Privacy Policy, which explains how we collect, use, and protect your personal information. By using the Service, you consent to our data practices as described in the Privacy Policy.",
    human:
      "We care about your privacy. Check our Privacy Policy to see exactly what data we collect and how we use it.",
  },
  payments: {
    legal:
      "Certain features require a paid subscription. Payments are processed securely through our payment partners. Subscriptions automatically renew unless cancelled before the renewal date. Refunds are handled according to our Refund Policy.",
    human:
      "Some features cost money. Payments are secure. Your subscription renews automatically unless you cancel. Check our Refund Policy if you need your money back.",
  },
  liability: {
    legal:
      'The Service is provided "as is" without warranties of any kind. We are not liable for any indirect, incidental, special, or consequential damages arising from your use of the Service. Our total liability shall not exceed the amount paid by you in the twelve months preceding the claim.',
    human:
      "We do our best, but we can't guarantee perfection. If something goes wrong, the most we'd owe you is what you paid us in the last year.",
  },
  termination: {
    legal:
      "We may suspend or terminate your access to the Service at any time for violation of these Terms or for any other reason. Upon termination, your right to use the Service will immediately cease, and we may delete your account and associated data.",
    human:
      "If you break the rules, we might close your account. When that happens, you lose access and we might delete your data.",
  },
  contact: {
    legal:
      "If you have any questions about these Terms, please contact us at legal@plagchecker.com or through our Contact page.",
    human: "Questions? Email us at legal@plagchecker.com or use our Contact page.",
  },
}

export default function TermsPage() {
  const [isHumanMode, setIsHumanMode] = useState(false)

  return (
    <MainLayout>
      <section className="py-20">
        <div className="container mx-auto px-4 md:px-6 max-w-4xl">
          <div className="text-center mb-12">
            <Badge variant="secondary" className="mb-4">
              Legal
            </Badge>
            <h1 className="text-4xl font-bold mb-4">Terms of Service</h1>
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

          <Card className="border-none shadow-lg">
            <CardContent className="p-8 md:p-12 space-y-8">
              <section>
                <h2 className="text-xl font-semibold mb-3">1. Acceptance of Terms</h2>
                <p className="text-muted-foreground leading-relaxed">
                  {isHumanMode ? legalContent.acceptance.human : legalContent.acceptance.legal}
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-3">2. Description of Service</h2>
                <p className="text-muted-foreground leading-relaxed">
                  {isHumanMode ? legalContent.description.human : legalContent.description.legal}
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-3">3. User Accounts</h2>
                <p className="text-muted-foreground leading-relaxed">
                  {isHumanMode ? legalContent.accounts.human : legalContent.accounts.legal}
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-3">4. Acceptable Use</h2>
                <p className="text-muted-foreground leading-relaxed">
                  {isHumanMode ? legalContent.acceptableUse.human : legalContent.acceptableUse.legal}
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-3">5. Content Ownership</h2>
                <p className="text-muted-foreground leading-relaxed">
                  {isHumanMode ? legalContent.ownership.human : legalContent.ownership.legal}
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-3">6. Privacy and Data Protection</h2>
                <p className="text-muted-foreground leading-relaxed">
                  {isHumanMode ? legalContent.privacy.human : legalContent.privacy.legal}
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-3">7. Subscription and Payments</h2>
                <p className="text-muted-foreground leading-relaxed">
                  {isHumanMode ? legalContent.payments.human : legalContent.payments.legal}
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-3">8. Limitation of Liability</h2>
                <p className="text-muted-foreground leading-relaxed">
                  {isHumanMode ? legalContent.liability.human : legalContent.liability.legal}
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-3">9. Termination</h2>
                <p className="text-muted-foreground leading-relaxed">
                  {isHumanMode ? legalContent.termination.human : legalContent.termination.legal}
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-3">10. Contact Information</h2>
                <p className="text-muted-foreground leading-relaxed">
                  {isHumanMode ? legalContent.contact.human : legalContent.contact.legal}
                </p>
              </section>
            </CardContent>
          </Card>
        </div>
      </section>
    </MainLayout>
  )
}
