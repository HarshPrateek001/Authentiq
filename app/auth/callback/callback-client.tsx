"use client"

import { useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"

export default function CallbackClient() {
  const router = useRouter()
  const params = useSearchParams()

  useEffect(() => {
    const token = params.get("token")
    const user = params.get("user")

    if (token && user) {
      localStorage.setItem("access_token", token)
      localStorage.setItem("user", decodeURIComponent(user))
      router.replace("/dashboard")
    } else {
      router.replace("/login?error=auth_failed")
    }
  }, [params, router])

  return <p className="p-6 text-center">Signing you in…</p>
}
