'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { Card, CardContent } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { CheckCircle2, XCircle, ArrowRight, FileText } from 'lucide-react'

const eligibleCases = [
    'Technical issues preventing service use that we cannot resolve',
    'Accidental duplicate purchases',
    'Service significantly different from description',
    'Billing errors or unauthorized charges',
]

const nonEligibleCases = [
    'Change of mind after using check credits',
    'Failure to cancel before renewal date',
    'Violation of Terms of Service',
    'Requests made after the 14-day window',
]

export function RefundContent() {
    return (
        <section className="py-20">
            <div className="container mx-auto px-4 md:px-6 max-w-4xl">
                <div className="text-center mb-12">
                    <div className="inline-block rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary mb-4">
                        Legal
                    </div>
                    <h1 className="text-4xl font-bold mb-4">Refund Policy</h1>
                    <p className="text-muted-foreground">Last updated: January 1, 2024</p>
                </div>

                <Alert className="mb-8 bg-primary/10 border-primary/20">
                    <AlertDescription className="text-base">
                        <strong className="block mb-2">14-Day Money-Back Guarantee</strong>
                        We offer a 14-day refund window for all new subscriptions. If you're not satisfied, request a refund within 14 days of your initial purchase.
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
                                            Use the refund form below or email billing@plagchecker.com with your account email and reason for the refund request.
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
                                            Our team will review your request within 2-3 business days and may ask for additional information.
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
                                You can cancel your subscription at any time from your account settings. Cancellation takes effect at the end of your current billing period. You will retain access to paid features until then.
                            </p>
                            <div className="flex items-center gap-2 p-3 rounded-lg bg-muted/50">
                                <span className="text-sm">Cancel at least 24 hours before renewal to avoid charges</span>
                            </div>
                        </div>

                        <div>
                            <h2 className="text-xl font-semibold mb-4">Partial Refunds</h2>
                            <p className="text-muted-foreground leading-relaxed">
                                In certain cases, we may offer partial refunds or account credits. This is determined on a case-by-case basis depending on usage and time elapsed since purchase.
                            </p>
                        </div>
                    </CardContent>
                </Card>

                {/* Refund Request Form Section */}
                <div className="mt-16">
                    <div className="text-center mb-8">
                        <h2 className="text-2xl font-bold mb-2">Request a Refund</h2>
                        <p className="text-muted-foreground">
                            Submit your refund request below and our team will review it within 2-3 business days.
                        </p>
                    </div>

                    <Card className="border-none shadow-lg">
                        <CardContent className="p-8 md:p-12">
                            <RefundRequestForm />
                        </CardContent>
                    </Card>
                </div>

                {/* FAQ Section */}
                <div className="mt-16">
                    <div className="text-center mb-8">
                        <h2 className="text-2xl font-bold mb-2">Refund FAQs</h2>
                        <p className="text-muted-foreground">Common questions about our refund process</p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                        <Card className="border-none shadow-md">
                            <CardContent className="p-6">
                                <h3 className="font-semibold mb-2 flex items-center gap-2">
                                    <ArrowRight className="h-4 w-4 text-primary" />
                                    How long does the refund take?
                                </h3>
                                <p className="text-sm text-muted-foreground">
                                    Once approved, refunds are processed within 5-10 business days. Your bank may take an additional 1-3 business days to reflect the amount.
                                </p>
                            </CardContent>
                        </Card>

                        <Card className="border-none shadow-md">
                            <CardContent className="p-6">
                                <h3 className="font-semibold mb-2 flex items-center gap-2">
                                    <ArrowRight className="h-4 w-4 text-primary" />
                                    Can I get a partial refund?
                                </h3>
                                <p className="text-sm text-muted-foreground">
                                    Yes, we may offer partial refunds in certain cases. These are reviewed on a case-by-case basis and depend on your usage and time elapsed.
                                </p>
                            </CardContent>
                        </Card>

                        <Card className="border-none shadow-md">
                            <CardContent className="p-6">
                                <h3 className="font-semibold mb-2 flex items-center gap-2">
                                    <ArrowRight className="h-4 w-4 text-primary" />
                                    What if I cancel my subscription?
                                </h3>
                                <p className="text-sm text-muted-foreground">
                                    Cancellation is free and can be done anytime from your settings. You keep access until the end of your billing period.
                                </p>
                            </CardContent>
                        </Card>

                        <Card className="border-none shadow-md">
                            <CardContent className="p-6">
                                <h3 className="font-semibold mb-2 flex items-center gap-2">
                                    <ArrowRight className="h-4 w-4 text-primary" />
                                    Do I lose my data after refund?
                                </h3>
                                <p className="text-sm text-muted-foreground">
                                    After a full refund, your account may be downgraded to Free tier. You can request data export before this happens.
                                </p>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </section>
    )
}

// Refund Request Form Component with Integration
function RefundRequestForm() {
    const [formData, setFormData] = useState({
        email: '',
        orderID: '',
        reason: '',
        description: '',
    })
    const [submitted, setSubmitted] = useState(false)
    const [loading, setLoading] = useState(false)

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setLoading(true)

        try {
            const response = await fetch('http://localhost:8000/api/request-refund', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: formData.email,
                    order_id: formData.orderID,
                    reason: formData.reason,
                    description: formData.description
                })
            })

            if (!response.ok) {
                throw new Error("Failed to submit refund request")
            }

            setSubmitted(true)
        } catch (error) {
            console.error('Error submitting refund request:', error)
            alert("Failed to submit request. Please try again.")
        } finally {
            setLoading(false)
        }
    }

    if (submitted) {
        return (
            <div className="text-center py-8">
                <div className="mb-4 flex justify-center">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
                        <CheckCircle2 className="h-6 w-6 text-green-600" />
                    </div>
                </div>
                <h3 className="text-xl font-semibold mb-2">Request Submitted!</h3>
                <p className="text-muted-foreground mb-6">
                    Your refund request has been received. You'll receive an email update within 2-3 business days.
                </p>
                <div className="bg-muted/50 rounded-lg p-4 mb-6 text-left">
                    <p className="text-sm">
                        <strong>Confirmation:</strong> A receipt has been sent to <span className="font-mono">{formData.email}</span>
                    </p>
                </div>
                <Button
                    onClick={() => {
                        setSubmitted(false)
                        setFormData({ email: '', orderID: '', reason: '', description: '' })
                    }}
                >
                    Submit Another Request
                </Button>
            </div>
        )
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div>
                <label className="block text-sm font-medium mb-2">Email Address</label>
                <input
                    type="email"
                    required
                    placeholder="your@email.com"
                    value={formData.email}
                    onChange={e => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                />
            </div>

            <div>
                <label className="block text-sm font-medium mb-2">Order ID (from confirmation email)</label>
                <input
                    type="text"
                    required
                    placeholder="ORD-2024..."
                    value={formData.orderID}
                    onChange={e => setFormData({ ...formData, orderID: e.target.value })}
                    className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                />
            </div>

            <div>
                <label className="block text-sm font-medium mb-2">Reason for Refund</label>
                <select
                    required
                    value={formData.reason}
                    onChange={e => setFormData({ ...formData, reason: e.target.value })}
                    className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                >
                    <option value="">Select a reason...</option>
                    <option value="technical">Technical issues</option>
                    <option value="duplicate">Duplicate purchase</option>
                    <option value="service">Service not as described</option>
                    <option value="billing">Billing error</option>
                    <option value="other">Other</option>
                </select>
            </div>

            <div>
                <label className="block text-sm font-medium mb-2">Description</label>
                <textarea
                    required
                    placeholder="Please provide details about your refund request..."
                    value={formData.description}
                    onChange={e => setFormData({ ...formData, description: e.target.value })}
                    rows={4}
                    className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                />
            </div>

            <Alert>
                <FileText className="h-4 w-4" />
                <AlertDescription>
                    Make sure you have your order confirmation email and any relevant screenshots handy.
                </AlertDescription>
            </Alert>

            <div className="flex gap-3 pt-4">
                <Button type="submit" disabled={loading} className="flex-1">
                    {loading ? 'Submitting...' : 'Submit Refund Request'}
                </Button>
                <Button type="button" variant="outline" asChild>
                    <Link href="/contact">Contact Support</Link>
                </Button>
            </div>
        </form>
    )
}
