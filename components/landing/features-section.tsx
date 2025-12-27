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
    <section id="features" className="py-20 md:py-32 bg-muted/30">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Everything you need to ensure originality</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Powerful features designed to help you create authentic content with confidence.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feature, index) => (
            <div
              key={index}
              className={`group relative rounded-2xl border p-6 transition-all hover:shadow-lg hover:shadow-primary/5 ${
                feature.highlight
                  ? "border-primary/30 bg-primary/5 hover:border-primary/50"
                  : "border-border bg-card hover:border-primary/20"
              }`}
            >
              {feature.highlight && (
                <div className="absolute -top-2.5 left-4">
                  <span className="inline-flex items-center rounded-full bg-primary px-2.5 py-0.5 text-xs font-medium text-primary-foreground">
                    New
                  </span>
                </div>
              )}
              <div
                className={`mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl transition-colors ${
                  feature.highlight
                    ? "bg-primary text-primary-foreground"
                    : "bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground"
                }`}
              >
                <feature.icon className="h-6 w-6" />
              </div>
              <h3 className="mb-2 text-lg font-semibold">{feature.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
