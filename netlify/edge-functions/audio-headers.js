export default async (request, context) => {
  const response = await context.next()

  // Add enhanced headers for audio files
  if (request.url.includes("/audio/")) {
    response.headers.set("Access-Control-Allow-Origin", "*")
    response.headers.set("Accept-Ranges", "bytes")
    response.headers.set("Cache-Control", "public, max-age=31536000, immutable")

    // Set proper MIME type based on file extension
    const url = new URL(request.url)
    const pathname = url.pathname

    if (pathname.endsWith(".mp3")) {
      response.headers.set("Content-Type", "audio/mpeg")
    } else if (pathname.endsWith(".ogg")) {
      response.headers.set("Content-Type", "audio/ogg")
    } else if (pathname.endsWith(".wav")) {
      response.headers.set("Content-Type", "audio/wav")
    }
  }

  return response
}
