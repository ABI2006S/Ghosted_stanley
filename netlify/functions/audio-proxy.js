// Optional: Edge function for audio optimization
exports.handler = async (event, context) => {
  const { path } = event

  // Handle audio file requests with proper headers
  if (path.startsWith("/audio/")) {
    const audioFile = path.replace("/audio/", "")

    // Validate audio file exists
    const validAudioFiles = [
      "ambient.mp3",
      "boot.mp3",
      "typing.mp3",
      "floppy.mp3",
      "success.mp3",
      "click.mp3",
      "open.mp3",
      "close.mp3",
      "scan.mp3",
      "error.mp3",
      "shutdown.mp3",
      "glitch.mp3",
      "reboot.mp3",
    ]

    if (!validAudioFiles.includes(audioFile)) {
      return {
        statusCode: 404,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ error: "Audio file not found" }),
      }
    }

    // Return proper headers for audio streaming
    return {
      statusCode: 200,
      headers: {
        "Content-Type": "audio/mpeg",
        "Cache-Control": "public, max-age=31536000, immutable",
        "Access-Control-Allow-Origin": "*",
        "Accept-Ranges": "bytes",
      },
      body: "", // Actual file serving handled by Netlify
    }
  }

  return {
    statusCode: 404,
    body: "Not Found",
  }
}
