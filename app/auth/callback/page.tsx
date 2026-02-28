import { Suspense } from "react"

export const dynamic = "force-dynamic"

import CallbackClient from "./callback-client"

export default function AuthCallbackPage() {
  return (
    <Suspense fallback={<p className="p-6 text-center">Signing you in…</p>}>
      <CallbackClient />
    </Suspense>
  )
}
