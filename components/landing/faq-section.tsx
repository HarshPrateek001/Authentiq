"use client"

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

const faqs = [
  {
    question: "How accurate is Plag Checker?",
    answer:
      "Plag Checker uses advanced AI algorithms that achieve over 99% accuracy in detecting plagiarism. We continuously update our database and improve our detection methods to ensure the best results.",
  },
  {
    question: "What file formats are supported?",
    answer:
      "We support PDF, DOCX, TXT, and RTF files. You can also paste text directly into our editor. Maximum file size is 50MB for Pro and Team plans.",
  },
  {
    question: "How is my content protected?",
    answer:
      "Your documents are encrypted during transfer and at rest. We do not store your content longer than necessary for processing, and we are fully GDPR compliant. Your work is never added to any public database.",
  },
  {
    question: "Can I check academic papers?",
    answer:
      "Yes! Our Pro and Team plans include access to academic databases, allowing you to check against millions of published papers, journals, and academic sources.",
  },
  {
    question: "Is there an API available?",
    answer:
      "Yes, our Team plan includes API access that allows you to integrate plagiarism checking into your own applications, LMS, or content management systems.",
  },
  {
    question: "Can I cancel my subscription anytime?",
    answer:
      "You can cancel your subscription at any time. You&apos;ll continue to have access until the end of your billing period. No hidden fees or cancellation charges.",
  },
]

export function FaqSection() {
  return (
    <section id="faq" className="py-20 md:py-32 bg-muted/30">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Frequently asked questions</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">Got questions? We&apos;ve got answers.</p>
        </div>

        <div className="max-w-3xl mx-auto">
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`} className="border-border">
                <AccordionTrigger className="text-left hover:no-underline hover:text-primary">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground">{faq.answer}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  )
}
