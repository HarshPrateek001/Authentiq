"use client"

import { useState } from "react"
import { checkPlagiarism } from "@/lib/api"

export default function CheckTester() {
  const [result, setResult] = useState<any>(null)

  const runCheck = async () => {
    const res = await checkPlagiarism("hello world", true)
    setResult(res)
  }

  return (
    <>
      <button onClick={runCheck}>Check</button>
      <pre>{JSON.stringify(result, null, 2)}</pre>
    </>
  )
}
