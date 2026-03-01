"use client"

import { MainLayout } from "@/components/layouts/main-layout"
import { HeroSection } from "@/components/landing/hero-section"
import { DemoVideoSection } from "@/components/landing/demo-video-section"
import { InteractiveDemo } from "@/components/landing/interactive-demo"
import { FeaturesSection } from "@/components/landing/features-section"
import { FeatureShowcase } from "@/components/landing/feature-showcase"
import { HowItWorksSection } from "@/components/landing/how-it-works-section"
import { ComparisonTable } from "@/components/landing/comparison-table"
import { UseCasesSection } from "@/components/landing/use-cases-section"
import { TestimonialsSection } from "@/components/landing/testimonials-section"
import { PricingSection } from "@/components/landing/pricing-section"
import { FaqSection } from "@/components/landing/faq-section"
import { CtaSection } from "@/components/landing/cta-section"
import { ParticleBackground } from "@/components/ui/particle-background"

export default function HomePage() {
  return (
    <>
      <ParticleBackground />
      <MainLayout>
        <HeroSection />
        <DemoVideoSection />
        <InteractiveDemo />
        <FeaturesSection />
        <FeatureShowcase />
        <HowItWorksSection />
        <ComparisonTable />
        <UseCasesSection />
        <TestimonialsSection />
        <PricingSection />
        <FaqSection />
        <CtaSection />
      </MainLayout>
    </>
  )
}
