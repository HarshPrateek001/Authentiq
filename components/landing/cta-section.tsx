import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"

export function CtaSection() {
  return (
    <section className="py-20 md:py-32">
      <div className="container mx-auto px-4 md:px-6">
        <div className="relative overflow-hidden rounded-3xl bg-primary px-6 py-16 md:px-12 md:py-24">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary-foreground/10 via-transparent to-transparent" />

          <div className="relative text-center space-y-6 max-w-2xl mx-auto">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl text-primary-foreground">
              Ready to ensure your content is original?
            </h2>
            <p className="text-lg text-primary-foreground/80">
              Join thousands of writers, students, and educators who trust Plag Checker to verify their content
              authenticity.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Button size="lg" variant="secondary" asChild className="gap-2">
                <Link href="/signup">
                  Get Started Free
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="bg-transparent border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground"
              >
                Schedule a Demo
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
