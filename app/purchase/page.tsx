'use client'

import React, { useState, useEffect, Suspense } from "react"
import { useSearchParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { MainLayout } from '@/components/layouts/main-layout'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Check, AlertCircle, Shield, Lock, CreditCard, Smartphone, DollarSign } from 'lucide-react'
import { LocalDB } from "@/lib/local-db"

const plans = {
    student: {
        'free': { name: 'Free', monthlyPrice: 0, yearlyPrice: 0, description: 'Best for quick testing' },
        'student-pro': { name: 'Student Pro', monthlyPrice: 149, yearlyPrice: 1499, description: 'Perfect for assignments' },
        'student-plus': { name: 'Student Plus', monthlyPrice: 299, yearlyPrice: 2999, description: 'Heavy academic work' },
    },
    professional: {
        'free': { name: 'Free', monthlyPrice: 0, yearlyPrice: 0, description: 'Best for quick testing' },
        'professional': { name: 'Professional', monthlyPrice: 999, yearlyPrice: 9999, description: 'For content creators' },
        'enterprise': { name: 'Enterprise', monthlyPrice: 4999, yearlyPrice: 49999, description: 'Full power & privacy' },
    },
}

const PurchasePage = () => {
    const searchParams = useSearchParams()
    const router = useRouter()
    const [selectedPlan, setSelectedPlan] = useState('')
    const [userType, setUserType] = useState<'student' | 'professional'>('student')
    const [billing, setBilling] = useState<'monthly' | 'yearly'>('monthly')
    const [paymentMethod, setPaymentMethod] = useState('card')
    const [processing, setProcessing] = useState(false)
    const [checkingAuth, setCheckingAuth] = useState(true)
    const [orderComplete, setOrderComplete] = useState(false)
    const [orderDetails, setOrderDetails] = useState({
        orderId: '',
        amount: 0,
        plan: '',
        date: new Date().toLocaleDateString(),
    })

    // Form state
    const [formData, setFormData] = useState({
        email: '',
        fullName: '',
        cardName: '',
        cardNumber: '',
        expiryDate: '',
        cvv: '',
        billingAddress: '',
        city: '',
        zipCode: '',
        country: '',
    })

    const [formErrors, setFormErrors] = useState<Record<string, string>>({})

    useEffect(() => {
        const checkUser = () => {
            const user = LocalDB.getUser()
            if (!user) {
                const currentParams = new URLSearchParams(searchParams?.toString())
                const returnUrl = encodeURIComponent(`/purchase?${currentParams.toString()}`)
                router.push(`/login?redirect=${returnUrl}`)
            } else {
                setCheckingAuth(false)
                // Pre-fill email if available
                if (user.email) {
                    setFormData(prev => ({ ...prev, email: user.email }))
                }
            }
        }
        checkUser()
    }, [router, searchParams])

    useEffect(() => {
        LocalDB.logView('purchase_page')
    }, [])

    useEffect(() => {
        const planParam = searchParams?.get('plan')
        const userTypeParam = searchParams?.get('userType')
        const billingParam = searchParams?.get('billing')

        if (planParam) setSelectedPlan(planParam)
        if (userTypeParam) setUserType(userTypeParam as 'student' | 'professional')
        if (billingParam) setBilling(billingParam as 'monthly' | 'yearly')
    }, [searchParams])

    const getCurrentPlanDetails = () => {
        const plansOfType = plans[userType] as Record<string, any>
        return plansOfType[selectedPlan] || null
    }

    const planDetails = getCurrentPlanDetails()
    const price = planDetails ? (billing === 'yearly' ? planDetails.yearlyPrice : planDetails.monthlyPrice) : 0

    const validateForm = () => {
        const errors: Record<string, string> = {}

        if (!formData.email || !formData.email.includes('@')) errors.email = 'Valid email required'
        if (!formData.fullName || formData.fullName.length < 3) errors.fullName = 'Full name required'
        if (!formData.billingAddress) errors.billingAddress = 'Billing address required'
        if (!formData.city) errors.city = 'City required'
        if (!formData.zipCode) errors.zipCode = 'ZIP code required'
        if (!formData.country) errors.country = 'Country required'

        if (paymentMethod === 'card') {
            if (!formData.cardName) errors.cardName = 'Cardholder name required'
            if (!formData.cardNumber || formData.cardNumber.replace(/\s/g, '').length !== 16) {
                errors.cardNumber = 'Valid 16-digit card number required'
            }
            if (!formData.expiryDate || !/^\d{2}\/\d{2}$/.test(formData.expiryDate)) {
                errors.expiryDate = 'Format: MM/YY'
            }
            if (!formData.cvv || !/^\d{3,4}$/.test(formData.cvv)) errors.cvv = 'Valid CVV required'
        }

        setFormErrors(errors)
        return Object.keys(errors).length === 0
    }

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        setFormData(prev => ({
            ...prev,
            [name]: value,
        }))
        // Clear error for this field when user starts typing
        if (formErrors[name]) {
            setFormErrors(prev => ({
                ...prev,
                [name]: '',
            }))
        }
    }

    const formatCardNumber = (value: string) => {
        const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '')
        const matches = v.match(/\d{4,16}/g)
        const match = (matches && matches[0]) || ''
        const parts = []
        for (let i = 0, len = match.length; i < len; i += 4) {
            parts.push(match.substring(i, i + 4))
        }
        if (parts.length) {
            return parts.join(' ')
        } else {
            return value
        }
    }

    const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const formatted = formatCardNumber(e.target.value)
        setFormData(prev => ({
            ...prev,
            cardNumber: formatted,
        }))
    }

    const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        let value = e.target.value.replace(/\D/g, '')
        if (value.length >= 2) {
            value = value.substring(0, 2) + '/' + value.substring(2, 4)
        }
        setFormData(prev => ({
            ...prev,
            expiryDate: value,
        }))
    }

    const handlePurchase = async () => {
        if (!validateForm()) {
            console.log('[v0] Form validation failed')
            return
        }

        setProcessing(true)

        try {
            // Simulate payment processing delay
            await new Promise(resolve => setTimeout(resolve, 2000))

            const orderId = `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`

            // Call Backend API
            const user = LocalDB.getUser()
            if (!user || !user.token) {
                throw new Error("User session expired")
            }

            const response = await fetch('http://localhost:8000/api/subscribe', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${user.token}`
                },
                body: JSON.stringify({
                    plan_id: planDetails.name,
                    billing_cycle: billing,
                    amount: price,
                    payment_method: paymentMethod,
                    order_id: orderId
                })
            })

            if (!response.ok) {
                throw new Error("Subscription failed")
            }

            setOrderDetails({
                orderId,
                amount: price,
                plan: planDetails.name,
                date: new Date().toLocaleDateString(),
            })

            setOrderComplete(true)
        } catch (error) {
            console.error("Purchase Error:", error)
            alert("There was an issue processing your purchase. Please try again.")
        } finally {
            setProcessing(false)
        }
    }

    if (checkingAuth) {
        return (
            <MainLayout>
                <div className="flex justify-center items-center custom-min-h-screen py-20">
                    <p>Loading...</p>
                </div>
            </MainLayout>
        )
    }

    if (!planDetails) {
        return (
            <MainLayout>
                <section className="py-20">
                    <div className="container mx-auto px-4 md:px-6 max-w-2xl text-center">
                        <h1 className="text-3xl font-bold mb-4">Plan Selection Required</h1>
                        <p className="text-muted-foreground mb-8">Please select a plan from our pricing page</p>
                        <Button asChild>
                            <Link href="/#pricing">View Pricing</Link>
                        </Button>
                    </div>
                </section>
            </MainLayout>
        )
    }

    if (orderComplete) {
        return (
            <MainLayout>
                <section className="py-20">
                    <div className="container mx-auto px-4 md:px-6 max-w-2xl">
                        <Card className="border-none shadow-lg">
                            <CardContent className="p-8 md:p-12 text-center">
                                <div className="mb-6 flex justify-center">
                                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
                                        <Check className="h-8 w-8 text-green-600" />
                                    </div>
                                </div>
                                <h1 className="text-3xl font-bold mb-2">Order Confirmed!</h1>
                                <p className="text-muted-foreground mb-6">Your subscription has been activated successfully.</p>

                                <div className="bg-muted/50 rounded-lg p-6 mb-8 space-y-3 text-left">
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">Order ID:</span>
                                        <span className="font-mono font-semibold">{orderDetails.orderId}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">Plan:</span>
                                        <span className="font-semibold">{orderDetails.plan}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">Amount:</span>
                                        <span className="font-semibold">₹{orderDetails.amount.toLocaleString()}/{billing === 'yearly' ? 'year' : 'month'}</span>
                                    </div>
                                    <div className="flex justify-between border-t pt-3">
                                        <span className="text-muted-foreground">Date:</span>
                                        <span className="font-semibold">{orderDetails.date}</span>
                                    </div>
                                </div>

                                <Alert className="mb-6 bg-blue-50 border-blue-200">
                                    <AlertCircle className="h-4 w-4 text-blue-600" />
                                    <AlertDescription className="text-blue-800">
                                        A confirmation email has been sent to {formData.email}
                                    </AlertDescription>
                                </Alert>

                                <div className="space-y-3">
                                    <Button className="w-full" asChild>
                                        <Link href="/dashboard">Go to Dashboard</Link>
                                    </Button>
                                    <Button variant="outline" className="w-full bg-transparent" asChild>
                                        <Link href="/support">View Support</Link>
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </section>
            </MainLayout>
        )
    }

    return (
        <MainLayout>
            <section className="py-12 md:py-20">
                <div className="container mx-auto px-4 md:px-6">
                    <div className="max-w-6xl mx-auto">
                        <h1 className="text-3xl md:text-4xl font-bold mb-2">Complete Your Purchase</h1>
                        <p className="text-muted-foreground mb-8">Secure checkout for {planDetails.name} plan</p>

                        <div className="grid md:grid-cols-3 gap-8">
                            {/* Main Form */}
                            <div className="md:col-span-2 space-y-6">
                                {/* Order Summary Card */}
                                <Card className="border-2 border-primary/20 bg-primary/5">
                                    <CardContent className="p-6">
                                        <div className="flex justify-between items-start mb-4">
                                            <div>
                                                <h3 className="font-semibold text-lg">{planDetails.name}</h3>
                                                <p className="text-sm text-muted-foreground">{planDetails.description}</p>
                                            </div>
                                            <Badge className="text-lg px-3 py-1">₹{price.toLocaleString()}/{billing === 'yearly' ? 'year' : 'month'}</Badge>
                                        </div>
                                        <div className="text-sm text-muted-foreground">
                                            Billing: <span className="font-medium text-foreground">{billing === 'yearly' ? 'Yearly (Renews annually)' : 'Monthly (Renews monthly)'}</span>
                                        </div>
                                    </CardContent>
                                </Card>

                                {/* Contact Information */}
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="flex items-center gap-2">
                                            <div className="h-2 w-2 rounded-full bg-primary" />
                                            Contact Information
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <div>
                                            <Label htmlFor="email" className="text-sm font-medium">Email Address</Label>
                                            <Input
                                                id="email"
                                                name="email"
                                                type="email"
                                                placeholder="you@example.com"
                                                value={formData.email}
                                                onChange={handleInputChange}
                                                className={formErrors.email ? 'border-destructive' : ''}
                                            />
                                            {formErrors.email && <p className="text-xs text-destructive mt-1">{formErrors.email}</p>}
                                        </div>
                                        <div>
                                            <Label htmlFor="fullName" className="text-sm font-medium">Full Name</Label>
                                            <Input
                                                id="fullName"
                                                name="fullName"
                                                placeholder="John Doe"
                                                value={formData.fullName}
                                                onChange={handleInputChange}
                                                className={formErrors.fullName ? 'border-destructive' : ''}
                                            />
                                            {formErrors.fullName && <p className="text-xs text-destructive mt-1">{formErrors.fullName}</p>}
                                        </div>
                                    </CardContent>
                                </Card>

                                {/* Billing Address */}
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="flex items-center gap-2">
                                            <div className="h-2 w-2 rounded-full bg-primary" />
                                            Billing Address
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <div>
                                            <Label htmlFor="billingAddress" className="text-sm font-medium">Street Address</Label>
                                            <Input
                                                id="billingAddress"
                                                name="billingAddress"
                                                placeholder="123 Main Street"
                                                value={formData.billingAddress}
                                                onChange={handleInputChange}
                                                className={formErrors.billingAddress ? 'border-destructive' : ''}
                                            />
                                            {formErrors.billingAddress && <p className="text-xs text-destructive mt-1">{formErrors.billingAddress}</p>}
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <Label htmlFor="city" className="text-sm font-medium">City</Label>
                                                <Input
                                                    id="city"
                                                    name="city"
                                                    placeholder="New York"
                                                    value={formData.city}
                                                    onChange={handleInputChange}
                                                    className={formErrors.city ? 'border-destructive' : ''}
                                                />
                                                {formErrors.city && <p className="text-xs text-destructive mt-1">{formErrors.city}</p>}
                                            </div>
                                            <div>
                                                <Label htmlFor="zipCode" className="text-sm font-medium">ZIP Code</Label>
                                                <Input
                                                    id="zipCode"
                                                    name="zipCode"
                                                    placeholder="10001"
                                                    value={formData.zipCode}
                                                    onChange={handleInputChange}
                                                    className={formErrors.zipCode ? 'border-destructive' : ''}
                                                />
                                                {formErrors.zipCode && <p className="text-xs text-destructive mt-1">{formErrors.zipCode}</p>}
                                            </div>
                                        </div>
                                        <div>
                                            <Label htmlFor="country" className="text-sm font-medium">Country</Label>
                                            <Select value={formData.country} onValueChange={(value) => setFormData(prev => ({ ...prev, country: value }))}>
                                                <SelectTrigger className={formErrors.country ? 'border-destructive' : ''}>
                                                    <SelectValue placeholder="Select country" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="US">United States</SelectItem>
                                                    <SelectItem value="CA">Canada</SelectItem>
                                                    <SelectItem value="UK">United Kingdom</SelectItem>
                                                    <SelectItem value="AU">Australia</SelectItem>
                                                    <SelectItem value="IN">India</SelectItem>
                                                    <SelectItem value="Other">Other</SelectItem>
                                                </SelectContent>
                                            </Select>
                                            {formErrors.country && <p className="text-xs text-destructive mt-1">{formErrors.country}</p>}
                                        </div>
                                    </CardContent>
                                </Card>

                                {/* Payment Method */}
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="flex items-center gap-2">
                                            <div className="h-2 w-2 rounded-full bg-primary" />
                                            Payment Method
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>
                                            <div className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-muted/50 cursor-pointer">
                                                <RadioGroupItem value="card" id="card" />
                                                <Label htmlFor="card" className="flex items-center gap-2 cursor-pointer flex-1">
                                                    <CreditCard className="h-4 w-4" />
                                                    Credit/Debit Card
                                                </Label>
                                            </div>
                                            <div className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-muted/50 cursor-pointer opacity-50">
                                                <RadioGroupItem value="paypal" id="paypal" disabled />
                                                <Label htmlFor="paypal" className="flex items-center gap-2 cursor-pointer flex-1 opacity-50">
                                                    <DollarSign className="h-4 w-4" />
                                                    PayPal (Coming Soon)
                                                </Label>
                                            </div>
                                        </RadioGroup>

                                        {paymentMethod === 'card' && (
                                            <div className="space-y-4 mt-6 pt-6 border-t">
                                                <div>
                                                    <Label htmlFor="cardName" className="text-sm font-medium">Cardholder Name</Label>
                                                    <Input
                                                        id="cardName"
                                                        name="cardName"
                                                        placeholder="John Doe"
                                                        value={formData.cardName}
                                                        onChange={handleInputChange}
                                                        className={formErrors.cardName ? 'border-destructive' : ''}
                                                    />
                                                    {formErrors.cardName && <p className="text-xs text-destructive mt-1">{formErrors.cardName}</p>}
                                                </div>
                                                <div>
                                                    <Label htmlFor="cardNumber" className="text-sm font-medium">Card Number</Label>
                                                    <Input
                                                        id="cardNumber"
                                                        name="cardNumber"
                                                        placeholder="1234 5678 9012 3456"
                                                        value={formData.cardNumber}
                                                        onChange={handleCardNumberChange}
                                                        maxLength={19}
                                                        className={formErrors.cardNumber ? 'border-destructive' : ''}
                                                    />
                                                    {formErrors.cardNumber && <p className="text-xs text-destructive mt-1">{formErrors.cardNumber}</p>}
                                                </div>
                                                <div className="grid grid-cols-2 gap-4">
                                                    <div>
                                                        <Label htmlFor="expiryDate" className="text-sm font-medium">Expiry Date</Label>
                                                        <Input
                                                            id="expiryDate"
                                                            name="expiryDate"
                                                            placeholder="MM/YY"
                                                            value={formData.expiryDate}
                                                            onChange={handleExpiryChange}
                                                            maxLength={5}
                                                            className={formErrors.expiryDate ? 'border-destructive' : ''}
                                                        />
                                                        {formErrors.expiryDate && <p className="text-xs text-destructive mt-1">{formErrors.expiryDate}</p>}
                                                    </div>
                                                    <div>
                                                        <Label htmlFor="cvv" className="text-sm font-medium">CVV</Label>
                                                        <Input
                                                            id="cvv"
                                                            name="cvv"
                                                            type="password"
                                                            placeholder="123"
                                                            maxLength={4}
                                                            value={formData.cvv}
                                                            onChange={handleInputChange}
                                                            className={formErrors.cvv ? 'border-destructive' : ''}
                                                        />
                                                        {formErrors.cvv && <p className="text-xs text-destructive mt-1">{formErrors.cvv}</p>}
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </CardContent>
                                </Card>

                                {/* Security Info */}
                                <Alert className="bg-green-50 border-green-200">
                                    <Shield className="h-4 w-4 text-green-600" />
                                    <AlertTitle className="text-green-900">Secure Payment</AlertTitle>
                                    <AlertDescription className="text-green-800">
                                        Your payment information is encrypted and secure. We never store full card details.
                                    </AlertDescription>
                                </Alert>

                                {/* Terms */}
                                <div className="flex items-start gap-2 text-xs text-muted-foreground">
                                    <input type="checkbox" className="mt-1" defaultChecked aria-label="Agree to terms" />
                                    <span>
                                        By purchasing, you agree to our{' '}
                                        <Link href="/terms" className="text-primary hover:underline">
                                            Terms of Service
                                        </Link>
                                        ,{' '}
                                        <Link href="/privacy" className="text-primary hover:underline">
                                            Privacy Policy
                                        </Link>
                                        , and{' '}
                                        <Link href="/refund" className="text-primary hover:underline">
                                            Refund Policy
                                        </Link>
                                    </span>
                                </div>
                            </div>

                            {/* Order Summary Sidebar */}
                            <div>
                                <Card className="sticky top-24 border-2">
                                    <CardHeader className="pb-3">
                                        <CardTitle className="text-lg">Order Summary</CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <div className="space-y-2">
                                            <div className="flex justify-between text-sm">
                                                <span className="text-muted-foreground">Plan</span>
                                                <span className="font-medium">{planDetails.name}</span>
                                            </div>
                                            <div className="flex justify-between text-sm">
                                                <span className="text-muted-foreground">Billing Period</span>
                                                <span className="font-medium">{billing === 'yearly' ? 'Yearly' : 'Monthly'}</span>
                                            </div>
                                            <div className="flex justify-between text-sm">
                                                <span className="text-muted-foreground">Price</span>
                                                <span className="font-medium">₹{price.toLocaleString()}</span>
                                            </div>
                                        </div>

                                        <div className="border-t pt-4">
                                            <div className="flex justify-between items-center mb-4">
                                                <span className="font-semibold">Total Due Today</span>
                                                <span className="text-2xl font-bold text-primary">₹{price.toLocaleString()}</span>
                                            </div>
                                            {billing === 'yearly' && (
                                                <div className="bg-green-50 border border-green-200 rounded p-2 text-xs text-green-800 mb-4">
                                                    ✓ You save with yearly billing
                                                </div>
                                            )}
                                            <Button
                                                className="w-full"
                                                size="lg"
                                                disabled={processing}
                                                onClick={handlePurchase}
                                            >
                                                {processing ? 'Processing...' : `Pay ₹${price.toLocaleString()}`}
                                            </Button>
                                        </div>

                                        <div className="flex items-center gap-2 pt-4 border-t text-xs text-muted-foreground">
                                            <Lock className="h-3 w-3" />
                                            SSL Secure Checkout
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </MainLayout>
    )
}

export default function Page() {
    return (
        <Suspense fallback={null}>
            <PurchasePage />
        </Suspense>
    )
}
