const fs = require("fs")
const path = require("path")

// Test script to verify audio files
console.log("🎵 Testing audio files...")

const audioDir = path.join(process.cwd(), "public", "audio")
const requiredFiles = [
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

let allFilesExist = true

requiredFiles.forEach((file) => {
  const filePath = path.join(audioDir, file)
  if (fs.existsSync(filePath)) {
    const stats = fs.statSync(filePath)
    console.log(`✅ ${file} - ${(stats.size / 1024).toFixed(1)}KB`)
  } else {
    console.log(`❌ ${file} - MISSING`)
    allFilesExist = false
  }
})

if (allFilesExist) {
  console.log("🎉 All audio files are present!")
} else {
  console.log("⚠️  Some audio files are missing!")
  process.exit(1)
}
