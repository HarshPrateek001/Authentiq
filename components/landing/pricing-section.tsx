"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Check, X, Zap, AlertTriangle, Info } from "lucide-react"
import { SmartAction } from "@/components/ui/smart-action"

const plans = {
  student: [
    {
      name: "Free",
      monthlyPrice: 0,
      yearlyPrice: 0,
      description: "Best for quick testing & casual use. Ideal for: New users, basic checks, demos.",
      features: [
        { text: "Plagiarism Check: 5,000 words / month", type: "check" },
        { text: "AI Content Detection", type: "check" },
        { text: "AI Humanizer", type: "x" },
        { text: "Bulk Uploads", type: "x" },
        { text: "API Access", type: "x" },
        { text: "File Upload (PDF / DOCX)", type: "x" },
        { text: "Priority Processing", type: "x" },
      ],
      cta: "Get Started",
      popular: false,
    },
    {
      name: "Student Plus",
      monthlyPrice: 299,
      yearlyPrice: 2999,
      description: "For heavy academic & research work. Ideal for: Researchers, thesis writers, content-heavy students.",
      features: [
        { text: "Plagiarism Check: 800,000 words / month", type: "check" },
        { text: "AI Content Detection", type: "check" },
        { text: "AI Humanizer: 200,000 words / month", type: "check" },
        { text: "Bulk Uploads: 10 files / month", type: "check" },
        { text: "PDF & DOCX Uploads", type: "check" },
        { text: "API Access", type: "x" },
        { text: "Faster Processing", type: "zap" },
      ],
      cta: "Start Trial",
      popular: true,
    },
    {
      name: "Student Pro",
      monthlyPrice: 149,
      yearlyPrice: 1499,
      description: "Perfect for college students & assignments. Ideal for: Students, academic submissions, essays.",
      features: [
        { text: "Plagiarism Check: 300,000 words / month", type: "check" },
        { text: "AI Content Detection", type: "check" },
        { text: "AI Humanizer: 50,000 words / month", type: "check" },
        { text: "Bulk Uploads", type: "x" },
        { text: "API Access", type: "x" },
        { text: "File Uploads", type: "x" },
        { text: "Standard Processing Speed", type: "warn" },
      ],
      cta: "Start Trial",
      popular: false,
    },
  ],
  professional: [
   {
      name: "Free",
      monthlyPrice: 0,
      yearlyPrice: 0,
      description: "Best for quick testing & casual use. Ideal for: New users, basic checks, demos.",
      features: [
        { text: "Plagiarism Check: 5,000 words / month", type: "check" },
        { text: "AI Content Detection", type: "check" },
        { text: "AI Humanizer", type: "x" },
        { text: "Bulk Uploads", type: "x" },
        { text: "API Access", type: "x" },
        { text: "File Upload (PDF / DOCX)", type: "x" },
        { text: "Priority Processing", type: "x" },
      ],
      cta: "Get Started",
      popular: false,
    },
    {
      name: "Enterprise",
      monthlyPrice: 4999,
      yearlyPrice: 49999,
      description: "Full power. Full control. Full privacy. Ideal for: Enterprises, universities, legal firms, corporations.",
      features: [
        { text: "Unlimited Plagiarism (Fair Use)", type: "check" },
        { text: "Unlimited AI Humanizer", type: "check" },
        { text: "Unlimited Bulk Uploads", type: "check" },
        { text: "Local AI Models (Ollama / LLaMA / Mistral)", type: "check" },
        { text: "Offline Mode & Desktop App", type: "check" },
        { text: "Private API Gateway", type: "check" },
        { text: "Dedicated Support & Custom Rules", type: "check" },
        { text: "On-Premise / Local Deployment Option", type: "zap" },
      ],
      cta: "Contact Sales",
      popular: true,
    },
    {
      name: "Professional",
      monthlyPrice: 999,
      yearlyPrice: 9999,
      description: "Built for content creators & working professionals. Ideal for: Bloggers, SEO agencies, freelancers, educators.",
      features: [
        { text: "Plagiarism Check: 2,000,000 words / month", type: "check" },
        { text: "AI Content Detection", type: "check" },
        { text: "AI Humanizer: 1,000,000 words / month", type: "check" },
        { text: "Bulk Uploads: Unlimited", type: "check" },
        { text: "PDF & DOCX Uploads", type: "check" },
        { text: "API Access", type: "check" },
        { text: "High-Speed Processing", type: "zap" },
        { text: "Usage Analytics Dashboard", type: "check" },
      ],
      cta: "Start Trial",
      popular: false,
    },
  ],
}

export function PricingSection() {
  const [isYearly, setIsYearly] = useState(false)
  const [userType, setUserType] = useState<"student" | "professional">("student")

  const currentPlans = plans[userType]

  return (
    <section id="pricing" className="py-20 md:py-32 relative overflow-hidden bg-background">
      {/* Subtle Polka Dot Background matching image */}
      <div 
        className="absolute inset-0 z-0 opacity-[0.15] dark:opacity-5 pointer-events-none" 
        style={{ 
          backgroundImage: "radial-gradient(hsl(var(--primary)) 2px, transparent 2px)", 
          backgroundSize: "32px 32px",
          backgroundPosition: "center center"
        }} 
      />
      
      <div className="container relative z-10 mx-auto px-4 md:px-6">
        <div className="text-center space-y-4 mb-12">
          <h2 className="text-3xl font-bold tracking-tight md:text-5xl">Simple, transparent pricing</h2>
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
                className={`relative rounded-2xl border p-6 md:p-8 transition-all duration-300 flex flex-col ${plan.popular
                  ? "border-2 border-emerald-500 bg-gradient-to-b from-emerald-500/10 to-transparent dark:from-emerald-500/15 dark:to-background shadow-2xl shadow-emerald-500/20 lg:scale-105 z-10"
                  : "border-border bg-card hover:border-emerald-500/30 hover:shadow-md"
                  }`}
              >
                {plan.popular && (
                  <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 rounded-full border border-emerald-500 bg-gradient-to-r from-emerald-500 to-green-500 px-5 py-1.5 text-xs font-bold tracking-wide text-white shadow-sm">
                    Most Popular
                  </span>
                )}

                <div className="mb-6">
                  <h3 className="text-2xl font-semibold mb-2">{plan.name}</h3>
                  <div className="flex items-end mb-2">
                    <span className="text-5xl font-bold tracking-tight">₹{price.toLocaleString()}</span>
                    {price > 0 && <span className="ml-2 mb-1 text-lg text-muted-foreground">/month</span>}
                  </div>
                  {isYearly && price > 0 && (
                    <p className="text-xs text-muted-foreground mb-4 font-medium">Billed ₹{plan.yearlyPrice.toLocaleString()}/year</p>
                  )}
                  {(price === 0 || !isYearly) && <div className="h-4 mb-4" />}
                  <p className="text-sm text-muted-foreground">{plan.description}</p>
                </div>

                <ul className="mb-8 space-y-4 flex-1">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-start gap-3">
                      {feature.type === 'check' && <Check className="h-5 w-5 text-primary shrink-0" strokeWidth={2.5} />}
                      {feature.type === 'x' && <X className="h-5 w-5 text-muted-foreground/50 shrink-0" strokeWidth={2.5} />}
                      {feature.type === 'zap' && <Zap className="h-5 w-5 text-amber-500 shrink-0" strokeWidth={2.5} />}
                      {feature.type === 'warn' && <AlertTriangle className="h-5 w-5 text-orange-400 shrink-0" strokeWidth={2.5} />}
                      <span className={`text-sm ${feature.type === 'x' ? 'text-muted-foreground/50 line-through decoration-muted-foreground/30' : 'text-muted-foreground'}`}>{feature.text}</span>
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
        
        <div className="mt-16 max-w-3xl mx-auto rounded-lg border border-border bg-muted/40 p-6 flex items-start gap-4">
          <Info className="h-6 w-6 text-primary shrink-0 mt-0.5" />
          <div className="text-sm text-muted-foreground space-y-2">
            <h4 className="font-semibold text-foreground">Important Notes</h4>
            <ul className="list-disc pl-4 space-y-1">
              <li>Word limits reset monthly.</li>
              <li>Fair usage policy applies to Enterprise plan.</li>
              <li>API usage counted separately from dashboard usage.</li>
              <li>Local AI mode available only in Enterprise.</li>
              <li>No credit card required for Free plan.</li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  )
}
