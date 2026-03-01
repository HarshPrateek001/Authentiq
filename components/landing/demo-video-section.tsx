import { PlayCircle, ShieldCheck, Sparkles } from "lucide-react"

interface VideoCardProps {
  src: string
  title: string
  description: string
  ThemeIcon: any
  gradientClass: string
  borderClass: string
}

function VideoCard({ src, title, description, ThemeIcon, gradientClass, borderClass }: VideoCardProps) {
  return (
    <div className={`relative group rounded-3xl overflow-hidden border ${borderClass} bg-card/60 backdrop-blur-md shadow-xl transition-all duration-500 hover:shadow-2xl hover:-translate-y-2`}>
      {/* Background Gradient Glow */}
      <div className={`absolute inset-0 opacity-10 blur-2xl ${gradientClass} transition-opacity duration-500 group-hover:opacity-30`} />
      
      {/* Video Content Block */}
      <div className="relative aspect-video w-full bg-black/40 overflow-hidden border-b border-border/50">
        <video 
          className="w-full h-full object-cover opacity-80 transition-opacity duration-300 group-hover:opacity-100"
          autoPlay 
          muted 
          loop 
          playsInline
          poster="/placeholder.jpg" // Fallback until video loads
        >
          <source src={src} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        
        {/* Play Icon Overlay (Decorative) */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-40 group-hover:opacity-100 transition-all duration-500 transform group-hover:scale-110">
          <PlayCircle className="w-16 h-16 text-white drop-shadow-xl" />
        </div>
      </div>
      
      {/* Text Info */}
      <div className="p-6 md:p-8 relative z-10">
        <div className="flex items-center gap-3 mb-3">
           <div className={`p-2 rounded-xl ${gradientClass} text-white shadow-lg`}>
              <ThemeIcon className="w-5 h-5" />
           </div>
           <h3 className="text-xl font-bold tracking-tight text-foreground">{title}</h3>
        </div>
        <p className="text-muted-foreground text-sm leading-relaxed max-w-sm">
          {description}
        </p>
      </div>
    </div>
  )
}

export function DemoVideoSection() {
  return (
    <section id="demo-videos" className="py-24 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-primary/5 blur-[120px] rounded-full pointer-events-none -z-10" />

      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-semibold tracking-wide">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
            </span>
            Live Demonstration
          </span>
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-foreground">
            See Authentiq in <span className="text-primary bg-clip-text text-transparent bg-gradient-to-r from-primary to-blue-500">Action</span>
          </h2>
          <p className="text-muted-foreground text-lg md:text-xl">
            Watch how our advanced AI seamlessly detects plagiarism and humanizes your content with just a click.
          </p>
        </div>

        {/* Both Videos Side by Side Container */}
        <div className="grid md:grid-cols-2 gap-8 lg:gap-12 relative">
          
          <VideoCard 
            src="/videos/demo1.mp4" 
            title="Plagiarism Scanning" 
            description="Experience lightning-fast document scanning. See how we identify AI footprints and identical text matches with pinpoint accuracy."
            ThemeIcon={ShieldCheck}
            gradientClass="bg-blue-500"
            borderClass="border-blue-500/20 hover:border-blue-500/50"
          />

          <VideoCard 
            src="/videos/demo2.mp4" 
            title="Content Humanization" 
            description="Watch robotic AI text transform into natural, undetectable human-like writing while preserving the core message."
            ThemeIcon={Sparkles}
            gradientClass="bg-emerald-500"
            borderClass="border-emerald-500/20 hover:border-emerald-500/50"
          />

        </div>
      </div>
    </section>
  )
}
