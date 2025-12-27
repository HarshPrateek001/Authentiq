import { Upload, Cpu, FileCheck, Wand2 } from "lucide-react"

const steps = [
  {
    icon: Upload,
    step: "01",
    title: "Upload or paste your content",
    description: "Simply paste your text or upload documents in PDF, DOCX, or TXT format. We support files up to 50MB.",
  },
  {
    icon: Cpu,
    step: "02",
    title: "AI analyzes your content",
    description:
      "Our advanced AI engine scans your content against billions of sources including web pages and academic databases.",
  },
  {
    icon: FileCheck,
    step: "03",
    title: "Get your detailed report",
    description: "Receive a comprehensive report with highlighted matches, similarity scores, and source attributions.",
  },
  {
    icon: Wand2,
    step: "04",
    title: "Humanize AI content (optional)",
    description: "Use our AI Humanizer to transform AI-generated text into natural, human-written content.",
  },
]

export function HowItWorksSection() {
  return (
    <section id="how-it-works" className="py-20 md:py-32">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">How it works</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Check your content for plagiarism and humanize AI text in four simple steps.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-4">
          {steps.map((step, index) => (
            <div key={index} className="relative text-center">
              {index < steps.length - 1 && (
                <div className="hidden md:block absolute top-12 left-[60%] w-[80%] border-t-2 border-dashed border-border" />
              )}

              <div className="relative mx-auto mb-6 flex h-24 w-24 items-center justify-center">
                <div className={`absolute inset-0 rounded-full ${index === 3 ? "bg-primary/20" : "bg-primary/10"}`} />
                <div
                  className={`relative flex h-16 w-16 items-center justify-center rounded-full text-primary-foreground ${
                    index === 3 ? "bg-gradient-to-br from-primary to-primary/70" : "bg-primary"
                  }`}
                >
                  <step.icon className="h-7 w-7" />
                </div>
                <span className="absolute -top-2 -right-2 flex h-8 w-8 items-center justify-center rounded-full bg-card border-2 border-primary text-xs font-bold text-primary">
                  {step.step}
                </span>
              </div>

              <h3 className="mb-3 text-xl font-semibold">{step.title}</h3>
              <p className="text-muted-foreground max-w-xs mx-auto">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
