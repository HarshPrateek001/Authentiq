"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Check } from "lucide-react"
import { SmartAction } from "@/components/ui/smart-action"

const plans = {
  student: [
    {
      name: "Free",
      monthlyPrice: 0,
      yearlyPrice: 0,
      description: "Perfect for trying out Plag Checker",
      features: ["5 checks per month", "Up to 1,000 words per check", "Basic report", "Web source scanning"],
      cta: "Get Started",
      popular: false,
    },
    {
      name: "Student Pro",
      monthlyPrice: 9,
      yearlyPrice: 7,
      description: "For students who need more power",
      features: [
        "50 checks per month",
        "Up to 10,000 words per check",
        "Detailed reports with sources",
        "Web + academic database",
        "AI rewriting suggestions",
        "Export to PDF",
      ],
      cta: "Start Trial",
      popular: true,
    },
    {
      name: "Student Plus",
      monthlyPrice: 15,
      yearlyPrice: 12,
      description: "For heavy research needs",
      features: [
        "Unlimited checks",
        "Up to 25,000 words per check",
        "All databases",
        "Cross-language detection",
        "Live typing detection",
        "Priority support",
      ],
      cta: "Start Trial",
      popular: false,
    },
  ],
  professional: [
    {
      name: "Starter",
      monthlyPrice: 0,
      yearlyPrice: 0,
      description: "Try before you commit",
      features: ["5 checks per month", "Up to 1,000 words per check", "Basic report", "Web source scanning"],
      cta: "Get Started",
      popular: false,
    },
    {
      name: "Pro",
      monthlyPrice: 29,
      yearlyPrice: 24,
      description: "For professionals and teams",
      features: [
        "200 checks per month",
        "Up to 50,000 words per check",
        "Detailed reports with sources",
        "All source databases",
        "AI rewriting + bypass tools",
        "API access (1000 calls)",
        "Export to PDF/DOCX",
      ],
      cta: "Start Trial",
      popular: true,
    },
    {
      name: "Enterprise",
      monthlyPrice: 99,
      yearlyPrice: 79,
      description: "For organizations at scale",
      features: [
        "Unlimited checks",
        "Up to 100,000 words per check",
        "Internal matching (student-to-student)",
        "Team management",
        "Dedicated support",
        "Custom integrations",
        "SLA guarantee",
      ],
      cta: "Contact Sales",
      popular: false,
    },
  ],
}

export function PricingSection() {
  const [isYearly, setIsYearly] = useState(false)
  const [userType, setUserType] = useState<"student" | "professional">("student")

  const currentPlans = plans[userType]

  return (
    <section id="pricing" className="py-20 md:py-32">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center space-y-4 mb-12">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Simple, transparent pricing</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Choose the plan that fits your needs. All plans include our core plagiarism detection.
          </p>
        </div>

        {/* Toggles */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mb-12">
          {/* User Type Toggle */}
          <div className="flex items-center gap-2 p-1 rounded-full bg-muted">
            <button
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${userType === "student" ? "bg-background shadow-sm" : "text-muted-foreground"
                }`}
              onClick={() => setUserType("student")}
            >
              Student
            </button>
            <button
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${userType === "professional" ? "bg-background shadow-sm" : "text-muted-foreground"
                }`}
              onClick={() => setUserType("professional")}
            >
              Professional
            </button>
          </div>

          {/* Billing Toggle */}
          <div className="flex items-center gap-3">
            <span className={`text-sm ${!isYearly ? "font-medium" : "text-muted-foreground"}`}>Monthly</span>
            <Switch checked={isYearly} onCheckedChange={setIsYearly} />
            <span className={`text-sm ${isYearly ? "font-medium" : "text-muted-foreground"}`}>
              Yearly
              <Badge className="ml-2 bg-success text-success-foreground">Save 20%</Badge>
            </span>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-3 max-w-5xl mx-auto">
          {currentPlans.map((plan, index) => {
            const price = isYearly ? plan.yearlyPrice : plan.monthlyPrice
            return (
              <div
                key={index}
                className={`relative rounded-2xl border p-6 transition-all duration-300 ${plan.popular
                  ? "border-primary bg-primary/5 shadow-lg shadow-primary/10 scale-105"
                  : "border-border bg-card hover:border-primary/50 hover:shadow-md"
                  }`}
              >
                {plan.popular && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-primary px-3 py-1 text-xs font-medium text-primary-foreground">
                    Most Popular
                  </span>
                )}

                <div className="mb-6">
                  <h3 className="text-xl font-semibold">{plan.name}</h3>
                  <div className="mt-2 flex items-baseline">
                    <span className="text-4xl font-bold">${price}</span>
                    {price > 0 && <span className="ml-1 text-muted-foreground">/month</span>}
                  </div>
                  {isYearly && price > 0 && (
                    <p className="text-xs text-muted-foreground mt-1">Billed ${price * 12}/year</p>
                  )}
                  <p className="mt-2 text-sm text-muted-foreground">{plan.description}</p>
                </div>

                <ul className="mb-6 space-y-3">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-start gap-3 text-sm">
                      <Check className="h-4 w-4 mt-0.5 text-primary shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>

                <SmartAction
                  variant={plan.popular ? "default" : "outline"}
                  className="w-full"
                  href={`/signup?redirect=${encodeURIComponent(`/purchase?plan=${plan.name.toLowerCase().replace(/\s+/g, '-')}&billing=${isYearly ? 'yearly' : 'monthly'}&userType=${userType}`)}`}
                  loggedInHref={`/purchase?plan=${plan.name.toLowerCase().replace(/\s+/g, '-')}&billing=${isYearly ? 'yearly' : 'monthly'}&userType=${userType}`}
                >
                  {plan.cta}
                </SmartAction>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
