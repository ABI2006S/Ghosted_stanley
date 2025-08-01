"use client"

import { useState } from "react"
import { useOperationAudio } from "../audio-provider"

interface DeskCleanProps {
  onCleanComplete: () => void
}

const cleaningMessages = [
  "Removing nostalgia.log...",
  "Wiping sadness.tmp...",
  "Deleting emotional_residue.dll...",
  "Clearing regret.ini...",
  "Recycle Bin emptied.",
  "",
  "Done.",
]

export default function DeskClean({ onCleanComplete }: DeskCleanProps) {
  const [isRunning, setIsRunning] = useState(false)
  const [messages, setMessages] = useState<string[]>([])
  const [currentMessage, setCurrentMessage] = useState(0)
  const { playOperationSound, playSound, stopSound } = useOperationAudio()

  const runCleaner = () => {
    setIsRunning(true)
    setMessages([])
    setCurrentMessage(0)

    // Calculate total operation duration
    const totalDuration = cleaningMessages.length * 1000 + 1000 // ~7 seconds

    // Play scan sound for the entire cleaning operation duration
    playOperationSound("scan", totalDuration, {
      volume: 0.4,
      loop: true, // Will loop if operation takes longer than audio
    })

    const showNextMessage = (index: number) => {
      if (index < cleaningMessages.length) {
        setTimeout(
          () => {
            setMessages((prev) => [...prev, cleaningMessages[index]])
            setCurrentMessage(index + 1)

            if (cleaningMessages[index] === "Done.") {
              // Stop scan sound and play success
              stopSound("scan")
              playSound("success", { volume: 0.7 })
              setTimeout(() => {
                onCleanComplete()
                setIsRunning(false)
              }, 1000)
            } else {
              showNextMessage(index + 1)
            }
          },
          cleaningMessages[index] === "" ? 500 : 1000,
        )
      }
    }

    showNextMessage(0)
  }

  return (
    <div className="p-4">
      <h2 className="text-lg font-bold mb-4">StanleyOS Digital Desk Cleaner v1.98</h2>

      <div className="mb-4">
        <button
          onClick={runCleaner}
          disabled={isRunning}
          className="px-4 py-2 bg-gray-500 border-2 border-gray-700 text-white font-bold hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isRunning ? "Running..." : "[ Run Cleaner ]"}
        </button>
      </div>

      <div className="bg-black text-green-400 p-3 font-mono text-sm h-48 overflow-y-auto">
        {messages.map((message, index) => (
          <div key={index} className="mb-1">
            {message === "" ? "\u00A0" : message}
          </div>
        ))}
        {isRunning && currentMessage < cleaningMessages.length && <span className="animate-pulse">_</span>}
      </div>
    </div>
  )
}
