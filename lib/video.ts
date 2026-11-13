export function isDirectVideoUrl(url: string): boolean {
  if (url.startsWith('/uploads/')) return /\.(mp4|webm)(\?|$)/i.test(url)
  try {
    const parsed = new URL(url)
    return /\.(mp4|webm)$/i.test(parsed.pathname)
  } catch {
    return false
  }
}

export function getVideoEmbedUrl(url: string): string | null {
  let parsed: URL
  try {
    parsed = new URL(url)
  } catch {
    return null
  }
  if (parsed.protocol !== 'https:' && parsed.protocol !== 'http:') return null

  const host = parsed.hostname.replace(/^www\./, '')

  if (host === 'youtu.be') {
    const id = parsed.pathname.split('/').filter(Boolean)[0]
    return id ? `https://www.youtube-nocookie.com/embed/${encodeURIComponent(id)}` : null
  }

  if (host === 'youtube.com' || host === 'm.youtube.com' || host === 'music.youtube.com') {
    if (parsed.pathname === '/watch') {
      const id = parsed.searchParams.get('v')
      return id
        ? `https://www.youtube-nocookie.com/embed/${encodeURIComponent(id)}`
        : null
    }
    const match = parsed.pathname.match(/^\/(embed|shorts|live)\/([^/]+)/)
    return match
      ? `https://www.youtube-nocookie.com/embed/${encodeURIComponent(match[2])}`
      : null
  }

  if (host === 'vimeo.com' || host === 'player.vimeo.com') {
    const match = parsed.pathname.match(/(\d{5,})/)
    return match ? `https://player.vimeo.com/video/${match[1]}` : null
  }

  return null
}
