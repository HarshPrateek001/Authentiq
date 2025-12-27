import Link from "next/link"
import { MainLayout } from "@/components/layouts/main-layout"
import { Button } from "@/components/ui/button"
import { FileQuestion, Home, Search } from "lucide-react"

export default function NotFound() {
  return (
    <MainLayout>
      <section className="py-20 md:py-32">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-lg mx-auto text-center">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-muted mx-auto mb-6">
              <FileQuestion className="h-10 w-10 text-muted-foreground" />
            </div>
            <h1 className="text-6xl font-bold text-primary mb-4">404</h1>
            <h2 className="text-2xl font-semibold mb-4">Page Not Found</h2>
            <p className="text-muted-foreground mb-8">
              Oops! The page you're looking for doesn't exist or has been moved. Let's get you back on track.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <Button asChild>
                <Link href="/">
                  <Home className="mr-2 h-4 w-4" />
                  Go to Homepage
                </Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href="/support">
                  <Search className="mr-2 h-4 w-4" />
                  Search Help
                </Link>
              </Button>
            </div>
            <div className="mt-8 pt-8 border-t">
              <p className="text-sm text-muted-foreground">
                If you believe this is an error, please{" "}
                <Link href="/contact" className="text-primary hover:underline">
                  contact our support team
                </Link>
                .
              </p>
            </div>
          </div>
        </div>
      </section>
    </MainLayout>
  )
}
