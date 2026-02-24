import { Badge } from "@/components/ui/badge"
import { Check, X, Minus } from "lucide-react"

const features = [
  { name: "AI-Powered Detection", plagchecker: true, turnitin: true, grammarly: "partial", quetext: true },
  { name: "Real-Time Live Check", plagchecker: true, turnitin: false, grammarly: false, quetext: false },
  { name: "AI Rewriting Tools", plagchecker: true, turnitin: false, grammarly: true, quetext: false },
  { name: "Cross-Language Detection", plagchecker: true, turnitin: true, grammarly: false, quetext: false },
  { name: "Sentence-Level Heatmap", plagchecker: true, turnitin: "partial", grammarly: false, quetext: false },
  { name: "AI Content Bypass", plagchecker: true, turnitin: false, grammarly: false, quetext: false },
  { name: "Internal Matching (Student)", plagchecker: true, turnitin: true, grammarly: false, quetext: false },
  { name: "Document Integrity Score", plagchecker: true, turnitin: false, grammarly: "partial", quetext: false },
  { name: "Free Tier Available", plagchecker: true, turnitin: false, grammarly: true, quetext: true },
  { name: "API Access", plagchecker: true, turnitin: true, grammarly: false, quetext: true },
]

const renderFeatureStatus = (status: boolean | string) => {
  if (status === true) {
    return <Check className="h-5 w-5 text-success mx-auto" />
  }
  if (status === false) {
    return <X className="h-5 w-5 text-muted-foreground/50 mx-auto" />
  }
  return <Minus className="h-5 w-5 text-warning mx-auto" />
}

export function ComparisonTable() {
  return (
    <section className="py-20 bg-muted/30">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center space-y-4 mb-12">
          <Badge variant="secondary">Comparison</Badge>
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">How We Compare</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            See why thousands of users are switching to Plag Checker
          </p>
        </div>

        <div className="max-w-5xl mx-auto overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr>
                <th className="text-left p-4 font-medium text-muted-foreground">Feature</th>
                <th className="p-4 text-center">
                  <div className="inline-flex flex-col items-center">
                    <span className="font-bold text-primary">Authentiq</span>
                    <Badge className="mt-1">Recommended</Badge>
                  </div>
                </th>
                <th className="p-4 text-center font-medium">Turnitin</th>
                <th className="p-4 text-center font-medium">Grammarly</th>
                <th className="p-4 text-center font-medium">Quetext</th>
              </tr>
            </thead>
            <tbody>
              {features.map((feature, index) => (
                <tr
                  key={index}
                  className={`border-t border-border ${index % 2 === 0 ? "bg-background" : "bg-muted/30"}`}
                >
                  <td className="p-4 font-medium">{feature.name}</td>
                  <td className="p-4 bg-primary/5">{renderFeatureStatus(feature.plagchecker)}</td>
                  <td className="p-4">{renderFeatureStatus(feature.turnitin)}</td>
                  <td className="p-4">{renderFeatureStatus(feature.grammarly)}</td>
                  <td className="p-4">{renderFeatureStatus(feature.quetext)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  )
}
