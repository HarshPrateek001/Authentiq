"use client"
export const dynamic = "force-dynamic"

import { Suspense } from "react"
import SignupClient from "./SignupClient"

export default function SignupPage() {
  return (
    <Suspense fallback={<div className="p-6 text-center">Loading…</div>}>
      <SignupClient />
    </Suspense>
  )
}