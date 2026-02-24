import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight, Sparkles, ShieldCheck } from "lucide-react"

export function CtaSection() {
  return (
    <section className="py-24 md:py-32 relative overflow-hidden bg-muted/10">
      <div className="container mx-auto px-4 md:px-6 relative z-10">
        
        {/* Main interactive wrapper */}
        <div className="group relative overflow-hidden rounded-[2.5rem] border border-primary/20 bg-background shadow-2xl transition-all duration-500 hover:shadow-primary/10">
          
          {/* Animated Background Layers */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary/5 via-background to-background" />
          
          {/* Sweeping Light Effect on Hover */}
          <div className="absolute -top-[25%] -left-[10%] w-[50%] h-[150%] bg-gradient-to-r from-transparent via-primary/10 to-transparent -rotate-45 translate-x-[-200%] group-hover:translate-x-[300%] transition-transform duration-[1.5s] ease-in-out" />
          
          {/* Glowing Blobs */}
          <div className="absolute top-0 right-0 -translate-y-12 translate-x-1/3 w-96 h-96 bg-primary/20 rounded-full blur-[80px] opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
          <div className="absolute bottom-0 left-0 translate-y-1/3 -translate-x-1/3 w-96 h-96 bg-blue-500/20 rounded-full blur-[80px] opacity-0 group-hover:opacity-100 transition-opacity duration-700 delay-100" />

          {/* Dotted pattern overlay */}
          <div className="absolute inset-0 opacity-30 bg-[radial-gradient(#80808080_1px,transparent_1px)] [background-size:24px_24px] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_50%,#000_10%,transparent_100%)]" />

          <div className="relative px-6 py-20 md:px-16 md:py-28 flex flex-col items-center text-center">
            
            {/* Top Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary mb-8 shadow-sm transition-transform duration-500 hover:scale-105">
              <ShieldCheck className="w-4 h-4" />
              <span className="text-sm font-bold tracking-wide uppercase">Bank-grade Security</span>
            </div>

            <h2 className="text-4xl md:text-6xl font-extrabold tracking-tight text-foreground max-w-3xl mb-6">
              Ready to ensure your <br className="hidden md:block" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-500">
                content is original?
              </span>
            </h2>
            
            <p className="text-lg md:text-xl text-muted-foreground/90 max-w-2xl font-medium leading-relaxed mb-10">
              Join thousands of writers, students, and educators who trust Authentiq to verify their content authenticity and humanize AI text.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
              {/* Primary Action Button */}
              <Button 
                size="lg" 
                className="h-14 px-8 text-base font-bold bg-primary hover:bg-primary/90 text-primary-foreground shadow-[0_0_20px_rgba(13,148,136,0.4)] hover:shadow-[0_0_30px_rgba(13,148,136,0.6)] transition-all duration-300 hover:-translate-y-1 group/btn rounded-2xl" 
                asChild
              >
                <Link href="/signup">
                  Get Started for Free
                  <ArrowRight className="ml-2 h-5 w-5 transition-transform duration-300 group-hover/btn:translate-x-1" />
                </Link>
              </Button>
              
              {/* Secondary Action Button */}
              <Button
                size="lg"
                variant="outline"
                className="h-14 px-8 text-base font-bold border-2 border-border/50 hover:border-primary/50 hover:bg-primary/5 hover:text-primary transition-all duration-300 hover:-translate-y-1 rounded-2xl group/demo"
              >
                <Sparkles className="mr-2 h-5 w-5 text-muted-foreground group-hover/demo:text-primary transition-colors duration-300" />
                See Interactive Demo
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
