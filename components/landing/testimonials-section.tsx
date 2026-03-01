import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Star, Quote } from "lucide-react"

const testimonials = [
  {
    name: "Dr. Sarah Mitchell",
    role: "Professor of English",
    institution: "Stanford University",
    avatar: "/professional-woman-professor.png",
    content:
      "Authentiq has transformed how I handle student submissions. The internal matching feature caught several cases of collaboration that would have gone unnoticed before.",
    rating: 5,
  },
  {
    name: "James Rodriguez",
    role: "Content Director",
    institution: "TechCrunch",
    avatar: "/professional-man-editor.png",
    content:
      "The AI rewriting suggestions are game-changing. Our editorial team saves hours every week on content originality checks and improvements.",
    rating: 5,
  },
  {
    name: "Emily Chen",
    role: "Graduate Student",
    institution: "MIT",
    avatar: "/young-asian-woman-student.jpg",
    content:
      "As a PhD candidate, I need to ensure my research is original. The cross-language detection found sources I didn't even know existed. Invaluable tool!",
    rating: 5,
  },
  {
    name: "Michael Thompson",
    role: "Academic Integrity Officer",
    institution: "University of Toronto",
    avatar: "/professional-man-administrator.jpg",
    content:
      "We've processed over 50,000 submissions this semester alone. The bulk upload feature and detailed reports make our work incredibly efficient.",
    rating: 5,
  },
  {
    name: "Lisa Wang",
    role: "Freelance Writer",
    institution: "Independent",
    avatar: "/creative-woman-writer.jpg",
    content:
      "The live detection feature in this software is perfect for my workflow. I can see potential issues as I write and fix them immediately. No more surprises at the end!",
    rating: 5,
  },
  {
    name: "David Park",
    role: "SEO Manager",
    institution: "HubSpot",
    avatar: "/professional-man-marketing.png",
    content:
      "Content originality is crucial for SEO. Plag Checker helps us ensure every piece we publish is unique. The API integration works seamlessly with our CMS.",
    rating: 5,
  },
]

export function TestimonialsSection() {
  return (
    <section className="py-24 relative overflow-hidden bg-muted/30">
      {/* Background Decor */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-4xl h-[300px] bg-primary/5 blur-[120px] rounded-full pointer-events-none -z-10" />

      <div className="container mx-auto px-4 md:px-6 mb-16">
        <div className="text-center space-y-4">
          <Badge variant="outline" className="px-3 py-1 bg-background border-border shadow-sm text-sm">
            Wall of Love
          </Badge>
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-foreground">
            Trusted by <span className="text-primary bg-clip-text text-transparent bg-gradient-to-r from-primary to-blue-500">Professionals</span>
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
            See what educators, content creators, and SEO experts have to say about Authentiq's groundbreaking AI tools.
          </p>
        </div>
      </div>

      {/* Infinite Auto-Slider Container */}
      <div className="relative w-full max-w-screen-2xl mx-auto overflow-hidden">
        {/* Left & Right Fade Masks for a premium look */}
        <div className="absolute top-0 bottom-0 left-0 w-32 bg-gradient-to-r from-muted/30 to-transparent z-10 pointer-events-none md:w-64" />
        <div className="absolute top-0 bottom-0 right-0 w-32 bg-gradient-to-l from-muted/30 to-transparent z-10 pointer-events-none md:w-64" />

        <div className="flex w-max animate-marquee hover:pause-animation gap-6 px-6">
          {/* Double the array to create a seamless infinite loop effect */}
          {[...testimonials, ...testimonials].map((testimonial, index) => (
            <Card key={index} className="w-[350px] md:w-[450px] shrink-0 border-border/60 bg-background/80 backdrop-blur-md shadow-xl hover:border-primary/30 transition-all duration-300">
              <CardContent className="p-8 h-full flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-1 mb-6">
                    {Array.from({ length: testimonial.rating }).map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400 drop-shadow-sm" />
                    ))}
                  </div>

                  <div className="relative mb-8">
                    <Quote className="absolute -top-4 -left-3 h-10 w-10 text-primary/10 -rotate-6" />
                    <p className="text-base text-foreground/90 leading-relaxed font-medium relative z-10">"{testimonial.content}"</p>
                  </div>
                </div>

                <div className="flex items-center gap-4 pt-4 border-t border-border/50">
                  <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-br from-primary to-blue-500 rounded-full opacity-20 blur-sm" />
                    <img
                      src={testimonial.avatar || "/placeholder.svg"}
                      alt={testimonial.name}
                      className="h-12 w-12 rounded-full object-cover border-2 border-background shadow-sm relative z-10"
                    />
                  </div>
                  <div>
                    <p className="font-bold text-foreground text-sm">{testimonial.name}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{testimonial.role}</p>
                    <Badge variant="secondary" className="mt-2 text-[10px] px-2 py-0 bg-primary/5 text-primary hover:bg-primary/10 border-none">
                      {testimonial.institution}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
