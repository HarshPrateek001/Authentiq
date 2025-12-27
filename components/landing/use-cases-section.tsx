import { GraduationCap, BookOpen, Pencil, Building2 } from "lucide-react"

const useCases = [
  {
    icon: GraduationCap,
    title: "Students",
    description:
      "Ensure your assignments and papers are original before submission. Avoid accidental plagiarism and learn proper citation.",
  },
  {
    icon: BookOpen,
    title: "Teachers",
    description:
      "Quickly check student submissions for originality. Save time with batch processing and detailed reports.",
  },
  {
    icon: Pencil,
    title: "Content Writers",
    description:
      "Deliver plagiarism-free content to your clients. Build trust and protect your professional reputation.",
  },
  {
    icon: Building2,
    title: "Agencies",
    description: "Scale your content verification with team features, API access, and centralized billing.",
  },
]

export function UseCasesSection() {
  return (
    <section className="py-20 md:py-32 bg-muted/30">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Built for everyone who writes</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Whether you&apos;re a student, educator, or professional writer, we&apos;ve got you covered.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {useCases.map((useCase, index) => (
            <div
              key={index}
              className="group rounded-2xl border border-border bg-card p-6 text-center transition-all hover:shadow-lg hover:shadow-primary/5 hover:border-primary/20"
            >
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                <useCase.icon className="h-7 w-7" />
              </div>
              <h3 className="mb-2 text-lg font-semibold">{useCase.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{useCase.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
