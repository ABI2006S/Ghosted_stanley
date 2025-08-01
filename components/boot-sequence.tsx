"use client"

import { useState, useEffect } from "react"
import { useOperationAudio } from "./audio-provider"

interface BootSequenceProps {
  onComplete: () => void
}

const bootMessages = [
  "[ Initializing system... ]",
  "[ BIOS version: Dust v1.9.8 ]",
  "[ Scanning boot sectors... OK ]",
  "[ Hard Drive detected — Last boot: 9,447 days ago ]",
  "[ Welcome back, Stanley. ]",
  "[ This system hasn't been cleaned since 1998. ]",
  "",
  "Booting StanleyOS v1.98...",
  "Loading TrustPod™...",
  "Resurrecting desktop garbage...",
  "Checking emotional memory sectors...",
  "",
  "Done.",
]

const glitchChars = "█▓▒░▄▀■□▪▫"

export default function BootSequence({ onComplete }: BootSequenceProps) {
  const [displayedMessages, setDisplayedMessages] = useState<string[]>([])
  const [currentMessage, setCurrentMessage] = useState(0)
  const [glitchActive, setGlitchActive] = useState(false)
  const [corruptedMessages, setCorruptedMessages] = useState<{ [key: number]: string }>({})
  const [horizontalBars, setHorizontalBars] = useState(false)
  const { playOperationSound, playSound, enableAudio } = useOperationAudio()

  // Enable audio on component mount
  useEffect(() => {
    enableAudio()
  }, [enableAudio])

  // Realistic glitch effects during boot (NO CRASHES)
  useEffect(() => {
    const glitchInterval = setInterval(() => {
      if (Math.random() < 0.2) {
        // Reduced glitch frequency
        setGlitchActive(true)

        // Play glitch sound for the duration of visual glitch
        const glitchDuration = Math.random() * 300 + 150 // Shorter glitch duration
        playOperationSound("glitch", glitchDuration, { volume: 0.1 })

        if (Math.random() < 0.1) {
          // Reduced horizontal bars frequency
          setHorizontalBars(true)
        }

        const newCorrupted: { [key: number]: string } = {}
        displayedMessages.forEach((msg, index) => {
          if (Math.random() < 0.15 && msg.trim()) {
            // Reduced corruption chance
            newCorrupted[index] = corruptText(msg, 0.08) // Less intensive corruption
          }
        })
        setCorruptedMessages(newCorrupted)

        setTimeout(() => {
          setGlitchActive(false)
          setHorizontalBars(false)
          if (Math.random() < 0.1) {
            // Reduced permanent corruption
            setTimeout(() => setCorruptedMessages({}), 800)
          } else {
            setCorruptedMessages({})
          }
        }, glitchDuration)
      }
    }, 2000) // Longer intervals between glitches

    return () => clearInterval(glitchInterval)
  }, [displayedMessages, playOperationSound])

  const corruptText = (text: string, intensity = 0.1): string => {
    return text
      .split("")
      .map((char) => {
        if (Math.random() < intensity && char !== " " && char !== "[" && char !== "]") {
          return glitchChars[Math.floor(Math.random() * glitchChars.length)]
        }
        return char
      })
      .join("")
  }

  useEffect(() => {
    if (currentMessage < bootMessages.length) {
      const delay =
        bootMessages[currentMessage] === ""
          ? 500
          : bootMessages[currentMessage].includes("Done.")
            ? 2000
            : Math.random() * 800 + 400 // Slightly faster boot

      const timer = setTimeout(() => {
        const originalMessage = bootMessages[currentMessage]
        const glitchedMessage = Math.random() < 0.15 ? corruptText(originalMessage, 0.05) : originalMessage // Less corruption

        setDisplayedMessages((prev) => [...prev, glitchedMessage])
        setCurrentMessage((prev) => prev + 1)

        // Enhanced audio timing based on message type with operation duration
        const message = bootMessages[currentMessage]
        if (message.trim()) {
          if (message.includes("Hard Drive") || message.includes("Scanning")) {
            // Floppy spin sound for exact duration of scanning operation
            playOperationSound("floppy", 2000, { volume: 0.4 })
          } else if (message.includes("Loading") || message.includes("Booting")) {
            // Scan sound for loading operations
            playOperationSound("scan", 1200, { volume: 0.25 })
          } else if (message.includes("Done")) {
            playSound("success", { volume: 0.6 })
          } else {
            // Typing sound for text appearance duration
            const textDuration = message.length * 40 + 250 // Estimate based on text length
            playOperationSound("typing", textDuration, { volume: 0.25 })
          }

          // Reduced random additional glitch sounds
          if (Math.random() < 0.15) {
            setTimeout(() => {
              const glitchDuration = Math.random() * 200 + 150
              playOperationSound("glitch", glitchDuration, { volume: 0.08 })
            }, Math.random() * 600)
          }
        }
      }, delay)

      return () => clearTimeout(timer)
    } else {
      setTimeout(() => {
        playSound("success", { volume: 0.7 })
        setTimeout(onComplete, 1000)
      }, 500)
    }
  }, [currentMessage, playOperationSound, playSound, onComplete])

  return (
    <div className="relative h-screen w-screen bg-black overflow-hidden">
      <div
        className={`absolute inset-0 pointer-events-none transition-opacity duration-200 ${
          glitchActive ? "opacity-50" : "opacity-25"
        }`}
        style={{
          backgroundImage: `repeating-linear-gradient(
            0deg,
            transparent,
            transparent 1px,
            rgba(255, 255, 255, 0.02) 1px,
            rgba(255, 255, 255, 0.02) 3px
          )`,
        }}
      />

      {horizontalBars && (
        <div
          className="absolute inset-0 pointer-events-none opacity-30"
          style={{
            background: `repeating-linear-gradient(
              0deg,
              transparent 0px,
              transparent ${Math.random() * 25 + 10}px,
              rgba(255, 255, 255, 0.15) ${Math.random() * 25 + 10}px,
              rgba(255, 255, 255, 0.15) ${Math.random() * 25 + 12}px
            )`,
            animation: "horizontalGlitch 0.15s infinite",
          }}
        />
      )}

      {glitchActive && (
        <div
          className="absolute inset-0 pointer-events-none opacity-20"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.3'/%3E%3C/svg%3E")`,
            animation: "bootGlitch 0.08s infinite",
          }}
        />
      )}

      <div className="p-8 text-green-300 font-mono">
        {displayedMessages.map((message, index) => (
          <div
            key={index}
            className={`mb-1 transition-all duration-200 ${glitchActive ? "animate-pulse" : ""} ${
              corruptedMessages[index] ? "text-white animate-bounce" : ""
            }`}
            style={{
              textShadow: glitchActive
                ? `${Math.random() * 1.5 - 0.75}px 0 rgba(255, 255, 255, 0.2)`
                : corruptedMessages[index]
                  ? "0.5px 0 rgba(255, 255, 255, 0.3)"
                  : "none",
              transform: glitchActive
                ? `translateX(${Math.random() * 2 - 1}px) translateY(${Math.random() * 1 - 0.5}px)`
                : "none",
              filter: glitchActive
                ? `brightness(${0.8 + Math.random() * 0.4}) contrast(${1 + Math.random() * 0.3})`
                : "none",
            }}
          >
            {message === ""
              ? "\u00A0"
              : corruptedMessages[index] ||
                (glitchActive && Math.random() < 0.1 ? corruptText(message, 0.05) : message)}
            {index === displayedMessages.length - 1 && message.trim() && (
              <span className={`${glitchActive ? "animate-bounce text-white" : "animate-pulse"}`}>_</span>
            )}
          </div>
        ))}
      </div>

      <style jsx>{`
        @keyframes bootGlitch {
          0% { transform: translateX(0) translateY(0); opacity: 0.2; }
          10% { transform: translateX(-0.5px) translateY(0.5px); opacity: 0.25; }
          20% { transform: translateX(0.5px) translateY(-0.5px); opacity: 0.15; }
          30% { transform: translateX(-0.5px) translateY(0.5px); opacity: 0.22; }
          40% { transform: translateX(0.5px) translateY(-0.5px); opacity: 0.2; }
          50% { transform: translateX(-0.5px) translateY(-0.5px); opacity: 0.28; }
          60% { transform: translateX(0.5px) translateY(0.5px); opacity: 0.18; }
          70% { transform: translateX(-0.5px) translateY(-0.5px); opacity: 0.22; }
          80% { transform: translateX(0.5px) translateY(0.5px); opacity: 0.2; }
          90% { transform: translateX(-0.5px) translateY(0.5px); opacity: 0.25; }
          100% { transform: translateX(0) translateY(0); opacity: 0.2; }
        }
        
        @keyframes horizontalGlitch {
          0% { transform: translateX(0); }
          25% { transform: translateX(-1px); }
          50% { transform: translateX(1px); }
          75% { transform: translateX(-0.5px); }
          100% { transform: translateX(0); }
        }
      `}</style>
    </div>
  )
}
