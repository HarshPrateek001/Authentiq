"use client"

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
import { ScrollArea } from "@/components/ui/scroll-area"
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

    // Simulate AI response
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
      {/* Floating Button */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Button className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-lg z-50" size="icon">
            <MessageSquare className="h-6 w-6" />
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[440px] h-[600px] flex flex-col p-0">
          <DialogHeader className="p-4 pb-2 border-b">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                <Sparkles className="h-5 w-5 text-primary" />
              </div>
              <div>
                <DialogTitle>AI Assistant</DialogTitle>
                <DialogDescription>Your writing helper</DialogDescription>
              </div>
            </div>
          </DialogHeader>

          {/* Messages */}
          <ScrollArea className="flex-1 p-4" ref={scrollRef}>
            <div className="space-y-4">
              {messages.map((message) => (
                <div key={message.id} className={`flex gap-3 ${message.role === "user" ? "flex-row-reverse" : ""}`}>
                  <div
                    className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${
                      message.role === "assistant" ? "bg-primary/10" : "bg-muted"
                    }`}
                  >
                    {message.role === "assistant" ? (
                      <Bot className="h-4 w-4 text-primary" />
                    ) : (
                      <User className="h-4 w-4" />
                    )}
                  </div>
                  <div
                    className={`rounded-2xl px-4 py-2 max-w-[80%] ${
                      message.role === "assistant" ? "bg-muted" : "bg-primary text-primary-foreground"
                    }`}
                  >
                    <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                  </div>
                </div>
              ))}
              {isTyping && (
                <div className="flex gap-3">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10">
                    <Bot className="h-4 w-4 text-primary" />
                  </div>
                  <div className="rounded-2xl px-4 py-2 bg-muted">
                    <Loader2 className="h-4 w-4 animate-spin" />
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>

          {/* Quick Actions */}
          <div className="px-4 py-2 border-t">
            <div className="flex gap-2 overflow-x-auto pb-2">
              {quickActions.map((action, index) => (
                <Button
                  key={index}
                  variant="outline"
                  size="sm"
                  className="shrink-0 gap-1.5 text-xs bg-transparent"
                  onClick={() => handleQuickAction(action.prompt)}
                >
                  <action.icon className="h-3 w-3" />
                  {action.label}
                </Button>
              ))}
            </div>
          </div>

          {/* Input */}
          <div className="p-4 pt-2 border-t">
            <form
              onSubmit={(e) => {
                e.preventDefault()
                handleSend(inputValue)
              }}
              className="flex gap-2"
            >
              <Input
                placeholder="Ask me anything..."
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                className="flex-1"
              />
              <Button type="submit" size="icon" disabled={!inputValue.trim() || isTyping}>
                <Send className="h-4 w-4" />
              </Button>
            </form>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
