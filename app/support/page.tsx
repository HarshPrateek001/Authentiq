import type { Metadata } from "next"
import Link from "next/link"
import { MainLayout } from "@/components/layouts/main-layout"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import {
  HelpCircle,
  MessageCircle,
  Mail,
  FileText,
  Video,
  BookOpen,
  Search,
  CreditCard,
  Shield,
  Zap,
  Users,
  Settings,
} from "lucide-react"
import { Input } from "@/components/ui/input"

export const metadata: Metadata = {
  title: "Help & Support | Plag Checker",
  description: "Get help with Plag Checker. Browse FAQs, contact support, and access resources.",
}

const supportOptions = [
  {
    icon: MessageCircle,
    title: "Live Chat",
    description: "Chat with our support team",
    action: "Start Chat",
    available: "Available 9AM-6PM EST",
  },
  {
    icon: Mail,
    title: "Email Support",
    description: "Get help via email",
    action: "Send Email",
    href: "mailto:support@plagchecker.com",
    available: "Response within 24 hours",
  },
  {
    icon: FileText,
    title: "Documentation",
    description: "Browse our guides",
    action: "View Docs",
    href: "#resources",
    available: "Always available",
  },
]

const categories = [
  { icon: Zap, title: "Getting Started", count: 12 },
  { icon: Search, title: "Using Plag Checker", count: 18 },
  { icon: CreditCard, title: "Billing & Plans", count: 8 },
  { icon: Shield, title: "Account & Security", count: 10 },
  { icon: Users, title: "Team Management", count: 6 },
  { icon: Settings, title: "Integrations", count: 5 },
]

const faqs = [
  {
    question: "How does Plag Checker detect plagiarism?",
    answer:
      "Plag Checker uses advanced AI algorithms to compare your text against billions of web pages, academic papers, and publications. Our system identifies matching phrases and calculates an originality score based on the percentage of unique content.",
  },
  {
    question: "What file formats are supported?",
    answer:
      "We support a wide range of formats including PDF, DOCX, DOC, TXT, RTF, and ODT. You can also paste text directly into the editor. Maximum file size is 25MB for standard plans and 100MB for enterprise plans.",
  },
  {
    question: "How accurate are the results?",
    answer:
      "Our plagiarism detection achieves 99.9% accuracy by using multiple comparison algorithms and continuously updated databases. We detect both exact matches and paraphrased content.",
  },
  {
    question: "Is my content kept confidential?",
    answer:
      "Yes, absolutely. Your documents are encrypted during transmission and storage. We never share your content with third parties or add it to public databases. Documents are automatically deleted after 30 days unless you choose to retain them.",
  },
  {
    question: "Can I check content in languages other than English?",
    answer:
      "Yes! Plag Checker supports over 30 languages including Spanish, French, German, Chinese, Japanese, and more. Our multilingual AI can detect plagiarism across different language sources.",
  },
  {
    question: "How do I cancel my subscription?",
    answer:
      "You can cancel your subscription anytime from Settings > Billing in your dashboard. Your access continues until the end of your current billing period. No cancellation fees apply.",
  },
  {
    question: "What's included in the free plan?",
    answer:
      "The free plan includes 3 plagiarism checks per month, up to 1,000 words per check, basic similarity reports, and access to our web-based editor. Upgrade anytime for more features.",
  },
  {
    question: "Do you offer educational discounts?",
    answer:
      "Yes! We offer 50% discounts for students with valid .edu emails and special institutional pricing for schools and universities. Contact our sales team for volume licensing options.",
  },
]

const resources = [
  { icon: BookOpen, title: "User Guide", description: "Complete guide to using Plag Checker", href: "#" },
  { icon: Video, title: "Video Tutorials", description: "Step-by-step video walkthroughs", href: "#" },
  { icon: FileText, title: "API Documentation", description: "Integrate Plag Checker into your app", href: "#" },
]

export default function SupportPage() {
  return (
    <MainLayout>
      {/* Hero */}
      <section className="py-20 md:py-28 bg-muted/30">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-3xl mx-auto text-center">
            <Badge variant="secondary" className="mb-4">
              Support Center
            </Badge>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-6">How can we help you?</h1>
            <p className="text-lg text-muted-foreground mb-8">
              Search our knowledge base or browse topics below to find answers.
            </p>
            <div className="relative max-w-xl mx-auto">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input placeholder="Search for help articles..." className="pl-12 h-12 text-base" />
            </div>
          </div>
        </div>
      </section>

      {/* Support Options */}
      <section className="py-16">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {supportOptions.map((option) => (
              <Card key={option.title} className="border-none shadow-md text-center">
                <CardContent className="p-6">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 mx-auto mb-4">
                    <option.icon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="font-semibold mb-1">{option.title}</h3>
                  <p className="text-sm text-muted-foreground mb-3">{option.description}</p>
                  <p className="text-xs text-muted-foreground mb-4">{option.available}</p>
                  <Button variant="outline" className="w-full bg-transparent" asChild={!!option.href}>
                    {option.href ? <Link href={option.href}>{option.action}</Link> : option.action}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Help Categories */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4 md:px-6">
          <h2 className="text-2xl font-bold text-center mb-8">Browse by Category</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-4xl mx-auto">
            {categories.map((category) => (
              <Card
                key={category.title}
                className="border-none shadow-sm hover:shadow-md transition-shadow cursor-pointer"
              >
                <CardContent className="p-4 flex items-center gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 shrink-0">
                    <category.icon className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium">{category.title}</h3>
                    <p className="text-xs text-muted-foreground">{category.count} articles</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16">
        <div className="container mx-auto px-4 md:px-6 max-w-3xl">
          <h2 className="text-2xl font-bold text-center mb-8">Frequently Asked Questions</h2>
          <Card className="border-none shadow-lg">
            <CardContent className="p-6">
              <Accordion type="single" collapsible className="w-full">
                {faqs.map((faq, index) => (
                  <AccordionItem key={index} value={`item-${index}`}>
                    <AccordionTrigger className="text-left">{faq.question}</AccordionTrigger>
                    <AccordionContent className="text-muted-foreground">{faq.answer}</AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Resources */}
      <section id="resources" className="py-16 bg-muted/30">
        <div className="container mx-auto px-4 md:px-6">
          <h2 className="text-2xl font-bold text-center mb-8">Resources</h2>
          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {resources.map((resource) => (
              <Card key={resource.title} className="border-none shadow-md hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <resource.icon className="h-8 w-8 text-primary mb-4" />
                  <h3 className="font-semibold mb-1">{resource.title}</h3>
                  <p className="text-sm text-muted-foreground mb-4">{resource.description}</p>
                  <Link href={resource.href} className="text-sm text-primary hover:underline">
                    Learn more →
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Still Need Help */}
      <section className="py-16">
        <div className="container mx-auto px-4 md:px-6">
          <Card className="border-none shadow-lg max-w-2xl mx-auto">
            <CardContent className="p-8 text-center">
              <HelpCircle className="h-12 w-12 text-primary mx-auto mb-4" />
              <h2 className="text-2xl font-bold mb-2">Still need help?</h2>
              <p className="text-muted-foreground mb-6">
                Can't find what you're looking for? Our support team is ready to assist you.
              </p>
              <Button asChild>
                <Link href="/contact">Contact Support</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>
    </MainLayout>
  )
}
