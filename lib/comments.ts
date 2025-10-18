export type Comment = {
  id: number
  name: string
  game: string
  comment: string
  created_at: string
}

export async function getComments(): Promise<Comment[]> {
  try {
    const res = await fetch(`/api/comments`, { cache: "no-store" })
    if (!res.ok) return []
    const data = await res.json()
    return data?.comments || []
  } catch (e) {
    console.error("Failed to fetch comments:", e)
    return []
  }
}

export async function addComment(name: string, game: string, comment: string): Promise<boolean> {
  try {
    const res = await fetch(`/api/comments`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: name.trim(), game: game.trim(), comment: comment.trim() }),
    })

    if (!res.ok) {
      console.error("Failed to add comment", await res.text())
      return false
    }

    return true
  } catch (e) {
    console.error("Failed to add comment:", e)
    return false
  }
}
