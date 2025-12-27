"use client"

import { AppLayout } from "@/components/layouts/app-layout"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Check, CreditCard, Download, Sparkles } from "lucide-react"

const plans = [
  {
    name: "Free",
    price: "$0",
    description: "For individuals just getting started",
    features: ["5 checks per month", "1,000 words per check", "Basic report", "Web scanning"],
    current: false,
  },
  {
    name: "Pro",
    price: "$19",
    period: "/month",
    description: "For professionals and researchers",
    features: [
      "100 checks per month",
      "25,000 words per check",
      "Detailed reports",
      "Web + academic databases",
      "Priority processing",
      "PDF export",
    ],
    current: true,
    popular: true,
  },
  {
    name: "Team",
    price: "$49",
    period: "/month",
    description: "For teams and organizations",
    features: [
      "Unlimited checks",
      "100,000 words per check",
      "Advanced analytics",
      "All databases",
      "API access",
      "Team management",
      "Dedicated support",
    ],
    current: false,
  },
]

const invoices = [
  { id: "INV-001", date: "Dec 1, 2024", amount: "$19.00", status: "Paid" },
  { id: "INV-002", date: "Nov 1, 2024", amount: "$19.00", status: "Paid" },
  { id: "INV-003", date: "Oct 1, 2024", amount: "$19.00", status: "Paid" },
]

export default function BillingPage() {
  return (
    <AppLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Billing & Subscription</h1>
          <p className="text-muted-foreground">Manage your subscription and payment methods.</p>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-6">
            <div className="rounded-xl border border-border bg-card p-6">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-semibold">Pro Plan</h3>
                    <Badge variant="secondary">Current</Badge>
                  </div>
                  <p className="text-muted-foreground mt-1">$19/month, billed monthly</p>
                </div>
                <Button variant="outline" className="bg-transparent">
                  Change Plan
                </Button>
              </div>

              <div className="space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-muted-foreground">Checks used this month</span>
                    <span className="text-sm font-medium">78 / 100</span>
                  </div>
                  <Progress value={78} className="h-2" />
                </div>
                <p className="text-sm text-muted-foreground">Resets on January 1, 2025</p>
              </div>
            </div>

            <div className="rounded-xl border border-border bg-card p-6">
              <h3 className="font-semibold mb-4">Payment Method</h3>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
                    <CreditCard className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="font-medium">Visa ending in 4242</p>
                    <p className="text-sm text-muted-foreground">Expires 12/25</p>
                  </div>
                </div>
                <Button variant="outline" size="sm" className="bg-transparent">
                  Update
                </Button>
              </div>
            </div>

            <div className="rounded-xl border border-border bg-card">
              <div className="p-4 border-b border-border">
                <h3 className="font-semibold">Invoice History</h3>
              </div>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Invoice</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="w-[100px]"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {invoices.map((invoice) => (
                    <TableRow key={invoice.id}>
                      <TableCell className="font-medium">{invoice.id}</TableCell>
                      <TableCell className="text-muted-foreground">{invoice.date}</TableCell>
                      <TableCell>{invoice.amount}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className="bg-success/10 text-success border-success/20">
                          {invoice.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Button variant="ghost" size="sm">
                          <Download className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="font-semibold">Available Plans</h3>
            {plans.map((plan) => (
              <div
                key={plan.name}
                className={`rounded-xl border p-4 ${
                  plan.current ? "border-primary bg-primary/5" : "border-border bg-card"
                }`}
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-semibold">{plan.name}</h4>
                      {plan.popular && (
                        <Badge className="bg-primary/10 text-primary border-primary/20">
                          <Sparkles className="h-3 w-3 mr-1" />
                          Popular
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-baseline mt-1">
                      <span className="text-2xl font-bold">{plan.price}</span>
                      {plan.period && <span className="text-muted-foreground">{plan.period}</span>}
                    </div>
                  </div>
                </div>
                <ul className="space-y-2 mb-4">
                  {plan.features.slice(0, 3).map((feature, index) => (
                    <li key={index} className="flex items-center gap-2 text-sm">
                      <Check className="h-4 w-4 text-primary shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
                {plan.current ? (
                  <Badge variant="secondary" className="w-full justify-center py-1">
                    Current Plan
                  </Badge>
                ) : (
                  <Button variant="outline" size="sm" className="w-full bg-transparent">
                    {plan.name === "Free" ? "Downgrade" : "Upgrade"}
                  </Button>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </AppLayout>
  )
}
