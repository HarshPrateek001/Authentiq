import type { Metadata } from "next"
import { MainLayout } from "@/components/layouts/main-layout"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import Link from "next/link"
import { Info, Clock, CheckCircle2, XCircle, HelpCircle } from "lucide-react"

export const metadata: Metadata = {
  title: "Refund Policy | Plag Checker",
  description: "Understand Plag Checker's refund policy for subscription plans and services.",
}

const eligibleCases = [
  "Technical issues preventing service use that we cannot resolve",
  "Accidental duplicate purchases",
  "Service significantly different from description",
  "Billing errors or unauthorized charges",
]

const nonEligibleCases = [
  "Change of mind after using check credits",
  "Failure to cancel before renewal date",
  "Violation of Terms of Service",
  "Requests made after the 14-day window",
]

export default function RefundPage() {
  return (
    <MainLayout>
      <section className="py-20">
        <div className="container mx-auto px-4 md:px-6 max-w-4xl">
          <div className="text-center mb-12">
            <Badge variant="secondary" className="mb-4">
              Legal
            </Badge>
            <h1 className="text-4xl font-bold mb-4">Refund Policy</h1>
            <p className="text-muted-foreground">Last updated: January 1, 2024</p>
          </div>

          <Alert className="mb-8 bg-primary/10 border-primary/20">
            <Info className="h-4 w-4 text-primary" />
            <AlertTitle>14-Day Money-Back Guarantee</AlertTitle>
            <AlertDescription>
              We offer a 14-day refund window for all new subscriptions. If you're not satisfied, request a refund
              within 14 days of your initial purchase.
            </AlertDescription>
          </Alert>

          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <Card className="border-none shadow-md">
              <CardContent className="p-6">
                <div className="flex items-center gap-2 mb-4">
                  <CheckCircle2 className="h-5 w-5 text-green-600" />
                  <h3 className="font-semibold">Eligible for Refund</h3>
                </div>
                <ul className="space-y-3">
                  {eligibleCases.map((item, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                      <CheckCircle2 className="h-4 w-4 text-green-600 shrink-0 mt-0.5" />
                      {item}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            <Card className="border-none shadow-md">
              <CardContent className="p-6">
                <div className="flex items-center gap-2 mb-4">
                  <XCircle className="h-5 w-5 text-destructive" />
                  <h3 className="font-semibold">Not Eligible for Refund</h3>
                </div>
                <ul className="space-y-3">
                  {nonEligibleCases.map((item, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                      <XCircle className="h-4 w-4 text-destructive shrink-0 mt-0.5" />
                      {item}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>

          <Card className="border-none shadow-lg">
            <CardContent className="p-8 md:p-12 space-y-8">
              <div>
                <h2 className="text-xl font-semibold mb-4">How to Request a Refund</h2>
                <div className="space-y-4">
                  <div className="flex items-start gap-4">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-medium">
                      1
                    </div>
                    <div>
                      <h4 className="font-medium">Contact Support</h4>
                      <p className="text-sm text-muted-foreground">
                        Email billing@plagchecker.com or use our Contact page with your account email and reason for the
                        refund request.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-medium">
                      2
                    </div>
                    <div>
                      <h4 className="font-medium">Review Process</h4>
                      <p className="text-sm text-muted-foreground">
                        Our team will review your request within 2-3 business days and may ask for additional
                        information.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-medium">
                      3
                    </div>
                    <div>
                      <h4 className="font-medium">Refund Processing</h4>
                      <p className="text-sm text-muted-foreground">
                        Approved refunds are processed within 5-10 business days to your original payment method.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h2 className="text-xl font-semibold mb-4">Subscription Cancellation</h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  You can cancel your subscription at any time from your account settings. Cancellation takes effect at
                  the end of your current billing period. You will retain access to paid features until then.
                </p>
                <div className="flex items-center gap-2 p-3 rounded-lg bg-muted/50">
                  <Clock className="h-5 w-5 text-primary" />
                  <span className="text-sm">Cancel at least 24 hours before renewal to avoid charges</span>
                </div>
              </div>

              <div>
                <h2 className="text-xl font-semibold mb-4">Partial Refunds</h2>
                <p className="text-muted-foreground leading-relaxed">
                  In certain cases, we may offer partial refunds or account credits. This is determined on a
                  case-by-case basis depending on usage and time elapsed since purchase.
                </p>
              </div>

              <div className="pt-4 border-t">
                <div className="flex items-center gap-3">
                  <HelpCircle className="h-5 w-5 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">
                    Have questions about our refund policy?{" "}
                    <Link href="/contact" className="text-primary hover:underline">
                      Contact our support team
                    </Link>
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </MainLayout>
  )
}
