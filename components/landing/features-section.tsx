import { Brain, Globe, FileText, BarChart3, Clock, Lock, Wand2, Bot } from "lucide-react"

const features = [
  {
    icon: Brain,
    title: "Deep AI Detection",
    description:
      "Advanced machine learning algorithms detect even the most subtle instances of plagiarism across your content.",
  },
  {
    icon: Wand2,
    title: "AI Humanizer",
    description: "Transform AI-generated content into natural, human-like text that bypasses AI detection systems.",
    highlight: true,
  },
  {
    icon: Globe,
    title: "Multi-Source Scanning",
    description: "Scan against billions of web pages, academic papers, and your internal document database.",
  },
  {
    icon: Bot,
    title: "AI Content Detection",
    description: "Identify whether content was written by AI tools like ChatGPT, Claude, or other language models.",
  },
  {
    icon: FileText,
    title: "Detailed Reports",
    description: "Get comprehensive reports with highlighted matches, source links, and similarity percentages.",
  },
  {
    icon: BarChart3,
    title: "Analytics Dashboard",
    description: "Track your usage, monitor trends, and gain insights into your content originality over time.",
  },
  {
    icon: Clock,
    title: "Lightning Fast",
    description: "Get results in seconds, not minutes. Our optimized infrastructure ensures rapid processing.",
  },
  {
    icon: Lock,
    title: "Privacy First",
    description: "Your documents are encrypted and never stored longer than necessary. GDPR compliant.",
  },
]

export function FeaturesSection() {
  return (
    <section id="features" className="py-24 md:py-32 relative overflow-hidden bg-background">
      {/* Subtle Dotted Background Pattern matching the image */}
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(#d1d5db_1px,transparent_1px)] dark:bg-[radial-gradient(#374151_1px,transparent_1px)] [background-size:32px_32px] opacity-40" />

      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <div className="text-center space-y-5 mb-20 max-w-3xl mx-auto">
          {/* Solid bold dark title, no gradient, exactly like the image */}
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-foreground">
            Everything you need to ensure originality
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
            Powerful features designed to help you create authentic content with confidence.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feature, index) => (
            <div
              key={index}
              className={`group relative rounded-[24px] border p-8 transition-all duration-300 hover:shadow-lg hover:-translate-y-1 bg-card ${
                feature.highlight
                  ? "border-primary/30 bg-primary/[0.02]"
                  : "border-border/60"
              }`}
            >
              {feature.highlight && (
                <div className="absolute -top-3 left-8">
                  <span className="inline-flex items-center rounded-full bg-primary px-3 py-1 text-xs font-bold text-white shadow-sm">
                    New
                  </span>
                </div>
              )}
              
              <div
                className={`mb-5 inline-flex h-12 w-12 items-center justify-center rounded-2xl transition-all duration-300 ${
                  feature.highlight
                    ? "bg-primary text-white shadow-sm"
                    : "bg-primary/10 text-primary group-hover:bg-primary group-hover:text-white"
                }`}
              >
                <feature.icon className="h-6 w-6" />
              </div>
              
              <div className="relative z-10">
                <h3 className="mb-3 text-lg font-bold tracking-tight text-foreground">{feature.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{feature.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
