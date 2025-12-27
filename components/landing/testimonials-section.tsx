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
      "Plag Checker has transformed how I handle student submissions. The internal matching feature caught several cases of collaboration that would have gone unnoticed before.",
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
      "The live detection feature is perfect for my workflow. I can see potential issues as I write and fix them immediately. No more surprises at the end!",
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
    <section className="py-20">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center space-y-4 mb-12">
          <Badge variant="secondary">Testimonials</Badge>
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Loved by Thousands</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Join educators, writers, and professionals who trust Plag Checker for their originality needs
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="border-none shadow-md hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center gap-1 mb-4">
                  {Array.from({ length: testimonial.rating }).map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>

                <div className="relative mb-4">
                  <Quote className="absolute -top-2 -left-2 h-8 w-8 text-primary/10" />
                  <p className="text-sm text-muted-foreground leading-relaxed pl-4">{testimonial.content}</p>
                </div>

                <div className="flex items-center gap-3 pt-4 border-t">
                  <img
                    src={testimonial.avatar || "/placeholder.svg"}
                    alt={testimonial.name}
                    className="h-12 w-12 rounded-full object-cover bg-muted"
                  />
                  <div>
                    <p className="font-semibold text-sm">{testimonial.name}</p>
                    <p className="text-xs text-muted-foreground">{testimonial.role}</p>
                    <Badge variant="outline" className="mt-1 text-[10px] px-1.5 py-0">
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
