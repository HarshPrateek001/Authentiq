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
    <section id="how-it-works" className="py-24 md:py-32 relative bg-background border-y border-border/50">
        <style dangerouslySetInnerHTML={{__html: `
        @keyframes flow-x {
          0% { background-position: 0 0; }
          100% { background-position: -24px 0; }
        }
        @keyframes flow-y {
          0% { background-position: 0 0; }
          100% { background-position: 0 -24px; }
        }
        .animate-flowing-x {
          background: linear-gradient(90deg, currentColor 50%, transparent 50%);
          background-size: 16px 2px;
          animation: flow-x 1s linear infinite;
        }
        .animate-flowing-y {
          background: linear-gradient(180deg, currentColor 50%, transparent 50%);
          background-size: 2px 16px;
          animation: flow-y 1s linear infinite;
        }
        @keyframes scanline {
          0% { transform: translateY(-100%); opacity: 0; }
          50% { opacity: 1; }
          100% { transform: translateY(100%); opacity: 0; }
        }
        .animate-scan {
          animation: scanline 3s cubic-bezier(0.4, 0, 0.2, 1) infinite;
        }
        @keyframes packet-x {
          0% { left: 0%; opacity: 0; transform: scaleX(0.5); }
          15% { opacity: 1; transform: scaleX(1); }
          85% { opacity: 1; transform: scaleX(1); }
          100% { left: 100%; opacity: 0; transform: scaleX(0.5); }
        }
        @keyframes packet-y {
          0% { top: 0%; opacity: 0; transform: scaleY(0.5); }
          15% { opacity: 1; transform: scaleY(1); }
          85% { opacity: 1; transform: scaleY(1); }
          100% { top: 100%; opacity: 0; transform: scaleY(0.5); }
        }
        .animate-packet-x { animation: packet-x 4s linear infinite; }
        .animate-packet-y { animation: packet-y 4s linear infinite; }
        .delay-1500 { animation-delay: 1.5s; }
        .delay-3000 { animation-delay: 3s; }
      `}} />

      {/* Blueprint background grid */}
      <div className="absolute inset-0 -z-20 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:24px_24px]" />

      <div className="container mx-auto px-4 md:px-8 relative z-10">
        
        {/* Wireframe Header */}
        <div className="mb-20 md:flex justify-between items-end border-b-2 border-foreground/10 pb-6 max-w-5xl mx-auto">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <span className="h-2 w-2 bg-primary animate-pulse shadow-[0_0_8px_rgba(13,148,136,0.8)]" />
              <span className="text-xs font-mono font-bold tracking-widest text-primary uppercase">Pipeline Architecture</span>
            </div>
            <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight text-foreground">
              Processing Workflow
            </h2>
          </div>
          <div className="mt-4 md:mt-0 max-w-sm">
            <p className="text-sm font-mono text-muted-foreground bg-muted/50 p-3 border border-border/50 rounded-md shadow-inner">
              <span className="text-primary italic">// System mapped map input</span>
              <br/>
              Validation layers processing active...
            </p>
          </div>
        </div>

        <div className="relative max-w-5xl mx-auto">
          {/* Animated Connecting Line - Desktop */}
          <div className="hidden md:block absolute top-[39px] left-[10%] right-[10%] h-[2px] animate-flowing-x text-primary/40 -z-10" />

          {/* Animated Connecting Line - Mobile */}
          <div className="block md:hidden absolute left-[39px] top-6 bottom-6 w-[2px] animate-flowing-y text-primary/40 -z-10" />

          {/* Flowing Data Packets - Desktop */}
          <div className="hidden md:block absolute top-[38px] left-[10%] right-[10%] h-[4px] -z-10">
            <div className="absolute top-0 h-full w-[60px] bg-primary rounded-full blur-[2px] shadow-[0_0_15px_rgba(13,148,136,1)] animate-packet-x" />
            <div className="absolute top-0 h-full w-[60px] bg-primary rounded-full blur-[2px] shadow-[0_0_15px_rgba(13,148,136,1)] animate-packet-x delay-1500" />
          </div>

          {/* Flowing Data Packets - Mobile */}
          <div className="block md:hidden absolute left-[38px] top-6 bottom-6 w-[4px] -z-10">
            <div className="absolute left-0 w-full h-[60px] bg-primary rounded-full blur-[2px] shadow-[0_0_15px_rgba(13,148,136,1)] animate-packet-y" />
            <div className="absolute left-0 w-full h-[60px] bg-primary rounded-full blur-[2px] shadow-[0_0_15px_rgba(13,148,136,1)] animate-packet-y delay-1500" />
          </div>

          <div className="grid gap-12 md:gap-6 md:grid-cols-4 relative pl-4 md:pl-0">
            {steps.map((step, index) => (
              <div key={index} className="relative flex md:block items-start gap-6 group">
                
                {/* Master Node Container */}
                <div className="relative z-10 w-[80px] h-[80px] md:mx-auto shrink-0 group-hover:translate-x-[4px] group-hover:-translate-y-[4px] transition-transform duration-300">
                  
                  {/* Outer Node Box */}
                  <div className="absolute inset-0 flex items-center justify-center bg-background border-[2px] border-foreground/20 rounded-[16px] overflow-hidden group-hover:bg-foreground group-hover:text-background group-hover:border-foreground transition-all duration-300 shadow-[4px_4px_0px_0px_rgba(0,0,0,0.05)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,0.05)] group-hover:shadow-none">
                    
                    {/* Scanning Beam (High Optimization Vibe) */}
                    <div 
                      className="absolute inset-x-0 h-full bg-gradient-to-b from-transparent via-primary/30 to-transparent animate-scan" 
                      style={{ animationDelay: `${index * 0.7}s` }}
                    />
                    
                    {/* Rotating Inner Mechanism */}
                    <div 
                      className="absolute inset-2 border border-dashed border-foreground/30 rounded-full animate-[spin_8s_linear_infinite] group-hover:border-background/30" 
                      style={{ animationDirection: index % 2 === 0 ? 'normal' : 'reverse' }}
                    />
                    
                    {/* Center Icon */}
                    <step.icon strokeWidth={1.5} className="w-8 h-8 relative z-10 transition-transform duration-300 group-hover:scale-110" />
                  </div>

                  {/* Status Indicator Plug */}
                  <div className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-background border-[3px] border-foreground/20 group-hover:bg-primary group-hover:border-primary transition-colors duration-300 z-20 shadow-sm" />
                  
                  {/* Action Glow */}
                  <div className="absolute inset-0 bg-primary/20 blur-2xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10" />
                </div>

                {/* Wireframe Text Label */}
                <div className="mt-2 md:mt-6 md:text-center text-left pt-1">
                  <div className="inline-flex items-center gap-2 mb-3">
                    <span className="bg-foreground/5 text-foreground px-2 py-0.5 text-[10px] font-mono tracking-widest font-bold border border-foreground/10 rounded-sm">
                      {step.step}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold mb-2 tracking-tight text-foreground transition-colors group-hover:text-primary">{step.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed md:px-2">
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
