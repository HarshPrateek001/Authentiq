"use client"

import { useMemo } from "react"

interface PasswordStrengthProps {
  password: string
}

export function PasswordStrength({ password }: PasswordStrengthProps) {
  const strength = useMemo(() => {
    if (!password) return { score: 0, label: "", color: "" }

    let score = 0
    if (password.length >= 8) score++
    if (password.length >= 12) score++
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score++
    if (/\d/.test(password)) score++
    if (/[^a-zA-Z0-9]/.test(password)) score++

    if (score <= 2) return { score, label: "Weak", color: "bg-destructive" }
    if (score <= 3) return { score, label: "Medium", color: "bg-warning" }
    return { score, label: "Strong", color: "bg-success" }
  }, [password])

  if (!password) return null

  return (
    <div className="space-y-2">
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className={`h-1 flex-1 rounded-full ${i <= strength.score ? strength.color : "bg-muted"}`} />
        ))}
      </div>
      <p className="text-xs text-muted-foreground">
        Password strength: <span className="font-medium">{strength.label}</span>
      </p>
    </div>
  )
}
