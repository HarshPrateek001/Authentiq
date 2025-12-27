import type { Metadata } from "next"
import { MainLayout } from "@/components/layouts/main-layout"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Target, Eye, Heart, Users, Award, Globe, Lightbulb, Shield } from "lucide-react"

export const metadata: Metadata = {
  title: "About Us | Plag Checker",
  description:
    "Learn about Plag Checker's mission to promote academic integrity and original content creation through AI-powered plagiarism detection.",
}

const stats = [
  { label: "Documents Checked", value: "10M+" },
  { label: "Active Users", value: "500K+" },
  { label: "Countries", value: "150+" },
  { label: "Accuracy Rate", value: "99.9%" },
]

const values = [
  {
    icon: Shield,
    title: "Integrity",
    description: "We believe in promoting honest, original work across all fields.",
  },
  {
    icon: Lightbulb,
    title: "Innovation",
    description: "Continuously improving our AI to deliver cutting-edge detection.",
  },
  {
    icon: Users,
    title: "Accessibility",
    description: "Making professional plagiarism checking available to everyone.",
  },
  {
    icon: Heart,
    title: "Trust",
    description: "Building lasting relationships through transparency and reliability.",
  },
]

const team = [
  { name: "Sarah Chen", role: "CEO & Co-Founder", image: "/professional-woman-ceo.png" },
  { name: "Michael Torres", role: "CTO & Co-Founder", image: "/professional-man-cto.png" },
  { name: "Emily Johnson", role: "Head of AI Research", image: "/professional-woman-scientist.png" },
  { name: "David Kim", role: "Head of Product", image: "/professional-product-manager.png" },
]

export default function AboutPage() {
  return (
    <MainLayout>
      {/* Hero Section */}
      <section className="py-20 md:py-28">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-3xl mx-auto text-center">
            <Badge variant="secondary" className="mb-4">
              About Us
            </Badge>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-6 text-balance">
              Empowering Originality Through Technology
            </h1>
            <p className="text-lg text-muted-foreground text-pretty">
              Plag Checker was founded with a simple mission: to help writers, students, and educators ensure the
              authenticity of their work. We leverage cutting-edge AI to make plagiarism detection accessible, accurate,
              and effortless.
            </p>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-primary mb-2">{stat.value}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-20">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid md:grid-cols-2 gap-12">
            <Card className="border-none shadow-lg">
              <CardContent className="p-8">
                <div className="flex items-center gap-3 mb-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                    <Target className="h-5 w-5 text-primary" />
                  </div>
                  <h2 className="text-2xl font-semibold">Our Mission</h2>
                </div>
                <p className="text-muted-foreground leading-relaxed">
                  To promote academic integrity and authentic content creation by providing the most accurate,
                  accessible, and user-friendly plagiarism detection tools. We empower individuals and institutions to
                  uphold the highest standards of originality.
                </p>
              </CardContent>
            </Card>
            <Card className="border-none shadow-lg">
              <CardContent className="p-8">
                <div className="flex items-center gap-3 mb-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                    <Eye className="h-5 w-5 text-primary" />
                  </div>
                  <h2 className="text-2xl font-semibold">Our Vision</h2>
                </div>
                <p className="text-muted-foreground leading-relaxed">
                  A world where original thinking is valued and protected. We envision a future where AI assists
                  creators in maintaining authenticity, fostering innovation, and building trust in every piece of
                  content produced.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Our Core Values</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              These principles guide everything we do at Plag Checker.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value) => (
              <Card key={value.title} className="border-none shadow-md">
                <CardContent className="p-6 text-center">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 mx-auto mb-4">
                    <value.icon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="font-semibold mb-2">{value.title}</h3>
                  <p className="text-sm text-muted-foreground">{value.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-20">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Meet Our Team</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">The passionate people behind Plag Checker.</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 max-w-4xl mx-auto">
            {team.map((member) => (
              <div key={member.name} className="text-center">
                <div className="w-32 h-32 rounded-full overflow-hidden mx-auto mb-4 bg-muted">
                  <img
                    src={member.image || "/placeholder.svg"}
                    alt={member.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <h3 className="font-semibold">{member.name}</h3>
                <p className="text-sm text-muted-foreground">{member.role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Awards */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Recognition</h2>
          </div>
          <div className="flex flex-wrap justify-center gap-8">
            <div className="flex items-center gap-3 px-6 py-3 bg-background rounded-lg shadow-sm">
              <Award className="h-8 w-8 text-primary" />
              <div>
                <div className="font-semibold text-sm">Best EdTech Tool</div>
                <div className="text-xs text-muted-foreground">2024 EdTech Awards</div>
              </div>
            </div>
            <div className="flex items-center gap-3 px-6 py-3 bg-background rounded-lg shadow-sm">
              <Globe className="h-8 w-8 text-primary" />
              <div>
                <div className="font-semibold text-sm">Global Innovation</div>
                <div className="text-xs text-muted-foreground">Tech Excellence 2024</div>
              </div>
            </div>
            <div className="flex items-center gap-3 px-6 py-3 bg-background rounded-lg shadow-sm">
              <Users className="h-8 w-8 text-primary" />
              <div>
                <div className="font-semibold text-sm">Top Rated SaaS</div>
                <div className="text-xs text-muted-foreground">G2 Spring 2024</div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </MainLayout>
  )
}
