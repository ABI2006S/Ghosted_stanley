const fs = require("fs")
const path = require("path")

// Post-build script to optimize for Netlify
console.log("🔧 Running post-build optimizations...")

const outDir = path.join(process.cwd(), "out")

// Ensure audio directory exists
const audioDir = path.join(outDir, "audio")
if (!fs.existsSync(audioDir)) {
  fs.mkdirSync(audioDir, { recursive: true })
  console.log("📁 Created audio directory")
}

// Create audio manifest for better caching
const audioFiles = [
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

const manifest = {
  version: Date.now(),
  files: audioFiles.filter((file) => {
    const filePath = path.join(audioDir, file)
    return fs.existsSync(filePath)
  }),
}

fs.writeFileSync(path.join(audioDir, "manifest.json"), JSON.stringify(manifest, null, 2))

console.log(`✅ Audio manifest created with ${manifest.files.length} files`)

// Add service worker for better caching (optional)
const swContent = `
self.addEventListener('fetch', event => {
  if (event.request.url.includes('/audio/')) {
    event.respondWith(
      caches.open('stanley-audio-v1').then(cache => {
        return cache.match(event.request).then(response => {
          if (response) {
            return response;
          }
          return fetch(event.request).then(fetchResponse => {
            cache.put(event.request, fetchResponse.clone());
            return fetchResponse;
          });
        });
      })
    );
  }
});
`

fs.writeFileSync(path.join(outDir, "sw.js"), swContent)
console.log("🔄 Service worker created for audio caching")

console.log("✅ Post-build optimizations complete!")
