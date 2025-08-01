"use client"

import type React from "react"

import { useState, useRef } from "react"
import { useOperationAudio } from "../audio-provider"

const sarcasticReplies = [
  "You're asking a 1998 bot to fix your future?",
  "Cry responsibly. Memory overflow.",
  "Your emotional files are beyond recovery.",
  "Your expectations have failed to launch.",
  "Error 404: Motivation not found.",
  "Have you tried turning your life off and on again?",
  "I'm sorry, I can't help you. I'm just a computer from 1998.",
  "Your problems are incompatible with this system.",
  "Please insert disk 2 of 'Getting Your Life Together'.",
  "Warning: Low self-esteem detected.",
  "This system is too old to understand your modern problems.",
  "Stanley left me here to mock people. Mission accomplished.",
]

export default function TrustPod() {
  const [input, setInput] = useState("")
  const [conversation, setConversation] = useState<Array<{ type: "user" | "bot"; message: string }>>([
    { type: "bot", message: "TrustPod™ AI Assistant v1.98 initialized. How can I disappoint you today?" },
  ])
  const [isTyping, setIsTyping] = useState(false)
  const { playOperationSound, stopSound } = useOperationAudio()
  const typingControllerRef = useRef<any>(null)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || isTyping) return

    const userMessage = input.trim()
    setInput("")
    setConversation((prev) => [...prev, { type: "user", message: userMessage }])

    setIsTyping(true)

    // Calculate typing duration based on response length
    const randomReply = sarcasticReplies[Math.floor(Math.random() * sarcasticReplies.length)]
    const typingDuration = Math.max(1500, randomReply.length * 80) // Minimum 1.5s, or 80ms per character

    // Play typing sound for exact duration of AI response typing
    playOperationSound("typing", typingDuration, {
      volume: 0.4,
      loop: true, // Loop if typing takes longer than expected
    }).then((controller) => {
      typingControllerRef.current = controller
    })

    setTimeout(() => {
      setConversation((prev) => [...prev, { type: "bot", message: randomReply }])
      setIsTyping(false)
      // Stop typing sound when AI response is complete
      if (typingControllerRef.current) {
        typingControllerRef.current.stop()
        typingControllerRef.current = null
      }
    }, typingDuration)
  }

  return (
    <div className="p-4 h-full flex flex-col">
      <h2 className="text-lg font-bold mb-4">TrustPod™ AI Assistant</h2>

      <div className="flex-1 bg-black text-green-400 p-3 font-mono text-sm overflow-y-auto mb-4">
        {conversation.map((msg, index) => (
          <div key={index} className="mb-2">
            <span className="text-yellow-400">{msg.type === "user" ? "> " : "TrustPod: "}</span>
            {msg.message}
          </div>
        ))}
        {isTyping && (
          <div className="mb-2">
            <span className="text-yellow-400">TrustPod: </span>
            <span className="animate-pulse">typing...</span>
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask TrustPod something..."
          className="flex-1 px-2 py-1 border-2 border-gray-600 font-mono text-sm"
          disabled={isTyping}
        />
        <button
          type="submit"
          disabled={isTyping || !input.trim()}
          className="px-3 py-1 bg-gray-500 border-2 border-gray-700 text-white font-bold hover:bg-gray-600 disabled:opacity-50"
        >
          Send
        </button>
      </form>
    </div>
  )
}
