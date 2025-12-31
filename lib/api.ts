import { supabase } from "./supabase"

export async function checkPlagiarism(text: string, check_ai_content = true) {
  const { data: { session } } = await supabase.auth.getSession()
  const token = session?.access_token

  const res = await fetch("http://localhost:8000/api/check-plagiarism", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify({ text, check_ai_content })
  })

  if (!res.ok) throw new Error("Request failed")
  return res.json()
}
