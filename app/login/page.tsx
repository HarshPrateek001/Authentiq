"use client"
export const dynamic = "force-dynamic"

import { Suspense } from "react"
import LoginClient from "./LoginClient"

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="p-6 text-center">Loading…</div>}>
      <LoginClient />
    </Suspense>
  )
}
