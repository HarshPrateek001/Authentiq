import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { MessageSquare, Send, Sparkles, Wand2, Search, FileText, Lightbulb, Loader2, Bot, User } from "lucide-react"

interface Message {
  id: string
  role: "user" | "assistant"
  content: string
  timestamp: Date
}

const quickActions = [
  { icon: Wand2, label: "Rewrite paragraph", prompt: "Please help me rewrite this paragraph to reduce similarity:" },
  {
    icon: Search,
    label: "Explain similarity",
    prompt: "Can you explain why this text might be flagged for similarity?",
  },
  { icon: FileText, label: "Reduce plagiarism", prompt: "How can I reduce the plagiarism in my document?" },
  { icon: Lightbulb, label: "Improve clarity", prompt: "Help me improve the clarity of this text:" },
]

const aiResponses: Record<string, string> = {
  rewrite:
    "I'd be happy to help you rewrite that paragraph. Here's a revised version that maintains the original meaning while using different phrasing and structure:\n\n[Your rewritten content would appear here with alternative vocabulary and sentence structures to reduce similarity while preserving the core message.]",
  explain:
    "This text may be flagged for similarity because it contains common phrases frequently found in academic literature. Phrases like 'studies show' or 'research indicates' are often matched against existing sources. To reduce flags, try paraphrasing these sections in your own words while citing your sources appropriately.",
  reduce:
    "Here are some strategies to reduce plagiarism:\n\n1. **Paraphrase thoroughly** - Don't just change a few words; restructure entire sentences\n2. **Use quotations** - When using exact phrases, properly quote and cite them\n3. **Add your analysis** - Include your own insights and interpretations\n4. **Vary your vocabulary** - Use synonyms and different sentence structures\n5. **Cite all sources** - Even paraphrased content needs attribution",
  clarity:
    "I can help improve the clarity of your text. Here are my suggestions:\n\n- Break long sentences into shorter ones\n- Use active voice instead of passive\n- Remove unnecessary jargon\n- Add transition words between ideas\n- Be specific rather than vague",
  default:
    "I'm here to help with your plagiarism checking needs. I can assist with:\n\n- Rewriting flagged content\n- Explaining why text might be flagged\n- Strategies to reduce similarity\n- Improving overall writing clarity\n\nHow can I help you today?",
}

export function AIAssistant() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      role: "assistant",
      content:
        "Hi! I'm your AI writing assistant. I can help you rewrite content, explain similarity issues, and improve your writing. What would you like help with?",
      timestamp: new Date(),
    },
  ])
  const [inputValue, setInputValue] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages])

  const handleSend = async (content: string) => {
    if (!content.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: content.trim(),
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInputValue("")
    setIsTyping(true)

    // Simulate AI response delay
    await new Promise((resolve) => setTimeout(resolve, 1500))

    let response = aiResponses.default
    const lowerContent = content.toLowerCase()

    if (lowerContent.includes("rewrite")) {
      response = aiResponses.rewrite
    } else if (lowerContent.includes("explain") || lowerContent.includes("why")) {
      response = aiResponses.explain
    } else if (lowerContent.includes("reduce") || lowerContent.includes("plagiarism")) {
      response = aiResponses.reduce
    } else if (lowerContent.includes("clarity") || lowerContent.includes("improve")) {
      response = aiResponses.clarity
    }

    const assistantMessage: Message = {
      id: (Date.now() + 1).toString(),
      role: "assistant",
      content: response,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, assistantMessage])
    setIsTyping(false)
  }

  const handleQuickAction = (prompt: string) => {
    handleSend(prompt)
  }

  return (
    <>
      {/* Floating Action Button */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Button 
            className="fixed bottom-6 right-6 h-16 w-16 rounded-full shadow-[0_0_25px_rgba(13,148,136,0.3)] hover:shadow-[0_0_35px_rgba(13,148,136,0.5)] z-50 bg-primary hover:bg-primary/90 transition-all duration-300 hover:scale-105" 
            size="icon"
          >
            <Sparkles className="h-7 w-7 text-primary-foreground absolute -top-1 -right-1 animate-pulse opacity-80" />
            <MessageSquare className="h-7 w-7 text-primary-foreground" />
          </Button>
        </DialogTrigger>
        
        {/* Chat Dialog Content - Fixed overflow and structure for proper mobile/desktop rendering */}
        <DialogContent className="sm:max-w-[440px] w-[95vw] h-[85vh] sm:h-[650px] flex flex-col p-0 gap-0 overflow-hidden bg-background border border-primary/20 shadow-2xl rounded-3xl">
          
          {/* Header - Fixed Height */}
          <DialogHeader className="p-4 md:p-5 border-b border-border/50 bg-muted/30 shrink-0">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 border border-primary/20">
                <Bot className="h-6 w-6 text-primary" />
              </div>
              <div className="text-left">
                <DialogTitle className="text-lg font-bold">Authentiq AI</DialogTitle>
                <DialogDescription className="text-xs font-medium text-muted-foreground mt-1">
                  Intelligent writing companion
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>

          {/* Messages Area - Flexible expanding height, independent scrolling */}
          <div 
            className="flex-1 overflow-y-auto p-4 md:p-5 scroll-smooth"
            ref={scrollRef}
          >
            <div className="space-y-6">
              {messages.map((message) => (
                <div key={message.id} className={`flex gap-3 max-w-[90%] ${message.role === "user" ? "ml-auto flex-row-reverse" : "mr-auto"}`}>
                  
                  {/* Chat Avatar */}
                  <div
                    className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full shadow-sm border ${
                      message.role === "assistant" ? "bg-primary/10 border-primary/20" : "bg-muted border-border/50"
                    }`}
                  >
                    {message.role === "assistant" ? (
                      <Bot className="h-4 w-4 text-primary" />
                    ) : (
                      <User className="h-4 w-4 text-muted-foreground" />
                    )}
                  </div>
                  
                  {/* Chat Bubble */}
                  <div
                    className={`rounded-2xl px-4 py-3 shadow-sm ${
                      message.role === "assistant" 
                        ? "bg-muted/50 border border-border/50 text-foreground rounded-tl-sm" 
                        : "bg-primary text-primary-foreground rounded-tr-sm"
                    }`}
                  >
                    <p className="text-[14px] leading-relaxed whitespace-pre-wrap">{message.content}</p>
                  </div>
                </div>
              ))}
              
              {/* Typing Indicator */}
              {isTyping && (
                <div className="flex gap-3 max-w-[90%] mr-auto">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 border border-primary/20">
                    <Bot className="h-4 w-4 text-primary" />
                  </div>
                  <div className="rounded-2xl px-4 py-3 bg-muted/50 border border-border/50 rounded-tl-sm flex items-center gap-1.5 shadow-sm">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary/50 animate-bounce" style={{ animationDelay: '0ms' }} />
                    <div className="w-1.5 h-1.5 rounded-full bg-primary/50 animate-bounce" style={{ animationDelay: '150ms' }} />
                    <div className="w-1.5 h-1.5 rounded-full bg-primary/50 animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Quick Actions Bar - Fixed Height at bottom */}
          <div className="px-4 py-3 border-t border-border/50 bg-muted/10 shrink-0">
            <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide -mx-2 px-2">
              {quickActions.map((action, index) => (
                <Button
                  key={index}
                  variant="outline"
                  size="sm"
                  className="shrink-0 gap-1.5 text-xs bg-background hover:bg-primary/5 hover:text-primary border-border/50 transition-colors rounded-full"
                  onClick={() => handleQuickAction(action.prompt)}
                >
                  <action.icon className="h-3.5 w-3.5" />
                  {action.label}
                </Button>
              ))}
            </div>
          </div>

          {/* Input Form Area - Fixed Height at bottom */}
          <div className="p-4 border-t border-border/50 bg-background shrink-0 rounded-b-3xl">
            <form
              onSubmit={(e) => {
                e.preventDefault()
                handleSend(inputValue)
              }}
              className="flex items-center gap-2 relative"
            >
              <Input
                placeholder="Message Authentiq AI..."
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                className="flex-1 h-12 pr-12 rounded-xl bg-muted/30 border-border/50 text-[14px] focus-visible:ring-primary/30"
              />
              <Button 
                type="submit" 
                size="icon" 
                disabled={!inputValue.trim() || isTyping}
                className="absolute right-1 top-1 h-10 w-10 rounded-lg bg-primary hover:bg-primary/90 text-primary-foreground transition-all shadow-sm"
              >
                {isTyping ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4 ml-0.5" />}
              </Button>
            </form>
          </div>
          
        </DialogContent>
      </Dialog>
    </>
  )
}
