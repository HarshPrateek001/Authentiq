import { LocalDB } from "./local-db"

export async function checkPlagiarism(text: string, check_ai_content = true) {
  const user = LocalDB.getUser()
  const token = user?.token

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

export async function humanizeText(
  text: string,
  writing_style = "natural",
  complexity_level = "moderate",
  target_language = "English",
  content_type = "article"
) {
  const user = LocalDB.getUser()
  const token = user?.token

  const res = await fetch("http://localhost:8000/api/humanizer", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify({
      text,
      writing_style,
      complexity_level,
      target_language,
      content_type
    })
  })

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}))
    throw new Error(errorData.detail || "Humanization failed")
  }
  return res.json()
}

export async function downloadHumanizedContent(text: string, format: "txt" | "word" | "pdf") {
  const user = LocalDB.getUser()
  const token = user?.token

  const res = await fetch("http://localhost:8000/api/download-humanized-content", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify({ text, format })
  })

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}))
    throw new Error(errorData.detail || "Download failed")
  }
  return res.blob()
}

export async function checkFilePlagiarism(file: File, language = "en", category = "other") {
  const user = LocalDB.getUser()
  const token = user?.token

  const formData = new FormData()
  formData.append("file", file)
  formData.append("language", language)
  formData.append("category", category)

  const res = await fetch("http://localhost:8000/api/check-file-plagiarism", {
    method: "POST",
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      // Content-Type is set automatically for FormData
    },
    body: formData
  })

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}))
    throw new Error(errorData.detail || "File check failed")
  }
  return res.json()
}
