"use client"

import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Wand2, Zap, Globe, BarChart3, Gauge, ShieldCheck, ArrowRight } from "lucide-react"

const features = [
  {
    icon: Wand2,
    title: "AI Rewrite",
    description: "Automatically rewrite flagged content while preserving meaning",
    color: "bg-purple-500/10 text-purple-600 border-purple-500/20",
    preview: "Transform plagiarized text into original content with one click",
  },
  {
    icon: Zap,
    title: "Live Detection",
    description: "Real-time plagiarism checking as you type",
    color: "bg-amber-500/10 text-amber-600 border-amber-500/20",
    preview: "See instant feedback with color-coded risk indicators",
  },
  {
    icon: Globe,
    title: "Cross-Language",
    description: "Detect translated plagiarism across 50+ languages",
    color: "bg-blue-500/10 text-blue-600 border-blue-500/20",
    preview: "Catch content copied and translated from foreign sources",
  },
  {
    icon: BarChart3,
    title: "Sentence Heatmap",
    description: "Visualize similarity at the sentence level",
    color: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
    preview: "Color-coded analysis shows exactly where issues lie",
  },
  {
    icon: Gauge,
    title: "Integrity Score",
    description: "Comprehensive document quality assessment",
    color: "bg-rose-500/10 text-rose-600 border-rose-500/20",
    preview: "Overall score combining originality, vocabulary, and structure",
  },
  {
    icon: ShieldCheck,
    title: "AI Bypass",
    description: "Convert AI content to human-written style",
    color: "bg-teal-500/10 text-teal-600 border-teal-500/20",
    preview: "Make AI-generated text undetectable by AI content detectors",
  },
]

export function FeatureShowcase() {
  const [activeFeature, setActiveFeature] = useState(0)

  return (
    <section className="py-20">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center space-y-4 mb-16">
          <Badge variant="secondary">Why We're Different</Badge>
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            AI-Powered Features You Won't Find Anywhere Else
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Beyond basic plagiarism detection - we provide intelligent tools to improve your writing
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-center max-w-6xl mx-auto">
          {/* Feature Cards */}
          <div className="grid sm:grid-cols-2 gap-4">
            {features.map((feature, index) => (
              <div
                key={index}
                className={`group relative p-5 rounded-xl border cursor-pointer transition-all duration-300 ${
                  activeFeature === index
                    ? "border-primary bg-primary/5 shadow-lg shadow-primary/10"
                    : "border-border bg-card hover:border-primary/50 hover:shadow-md"
                }`}
                onMouseEnter={() => setActiveFeature(index)}
              >
                <div className={`inline-flex p-2.5 rounded-lg mb-3 ${feature.color}`}>
                  <feature.icon className="h-5 w-5" />
                </div>
                <h3 className="font-semibold mb-1">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">{feature.description}</p>
                <ArrowRight
                  className={`absolute top-5 right-5 h-4 w-4 transition-all duration-300 ${
                    activeFeature === index ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-2"
                  }`}
                />
              </div>
            ))}
          </div>

          {/* Preview Panel */}
          <div className="relative">
            <div className="rounded-2xl border bg-card p-8 shadow-xl">
              <div className="flex items-center gap-3 mb-6">
                <div className={`p-3 rounded-xl ${features[activeFeature].color}`}>
                  {(() => {
                    const Icon = features[activeFeature].icon
                    return <Icon className="h-6 w-6" />
                  })()}
                </div>
                <div>
                  <h3 className="text-xl font-semibold">{features[activeFeature].title}</h3>
                  <p className="text-sm text-muted-foreground">{features[activeFeature].description}</p>
                </div>
              </div>

              <div className="p-6 rounded-xl bg-muted/50 border border-dashed">
                <p className="text-center text-muted-foreground">{features[activeFeature].preview}</p>
              </div>

              <div className="mt-6 flex items-center justify-center gap-2">
                {features.map((_, index) => (
                  <button
                    key={index}
                    className={`h-2 rounded-full transition-all ${
                      activeFeature === index ? "w-6 bg-primary" : "w-2 bg-muted-foreground/30"
                    }`}
                    onClick={() => setActiveFeature(index)}
                  />
                ))}
              </div>
            </div>

            {/* Decorative elements */}
            <div className="absolute -z-10 -top-4 -right-4 w-32 h-32 bg-primary/10 rounded-full blur-3xl" />
            <div className="absolute -z-10 -bottom-4 -left-4 w-24 h-24 bg-primary/5 rounded-full blur-2xl" />
          </div>
        </div>
      </div>
    </section>
  )
}
