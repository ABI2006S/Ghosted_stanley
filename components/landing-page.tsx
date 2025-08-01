"use client"

import { useState, useEffect } from "react"
import { useOperationAudio } from "./audio-provider"

interface LandingPageProps {
  onBoot: () => void
}

const bootLore = [
  "📜 THE LEGACY OF STANLEY'S DESKTOP",
  "",
  "In 1998, during the cyber-administrative resistance in post-war France,",
  "a government clerk named Stanley built a personal operating system",
  "on a recycled machine salvaged from a military warehouse.",
  "",
  "This was no ordinary system.",
  "",
  "StanleyOS v1.98 was designed to run forever,",
  "clean nothing, crash frequently, and remember everything.",
  "",
  "It has not been shut down in 9,447 days.",
  "",
]

const glitchChars = "█▓▒░▄▀■□▪▫"
const originalChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789 "

export default function LandingPage({ onBoot }: LandingPageProps) {
  const [displayedText, setDisplayedText] = useState<string[]>([])
  const [currentLine, setCurrentLine] = useState(0)
  const [showBootButton, setShowBootButton] = useState(false)
  const [glitchActive, setGlitchActive] = useState(false)
  const [corruptedLines, setCorruptedLines] = useState<{ [key: number]: string }>({})
  const [permanentGlitch, setPermanentGlitch] = useState(false)
  const [screenTear, setScreenTear] = useState(false)
  const { playOperationSound, playSound, enableAudio } = useOperationAudio()

  // Enable audio on component mount
  useEffect(() => {
    enableAudio()
  }, [enableAudio])

  // Realistic glitch effect for text corruption
  const corruptText = (text: string, intensity = 0.15): string => {
    return text
      .split("")
      .map((char) => {
        if (Math.random() < intensity && originalChars.includes(char)) {
          return glitchChars[Math.floor(Math.random() * glitchChars.length)]
        }
        return char
      })
      .join("")
  }

  // Realistic glitch activation with synchronized audio
  useEffect(() => {
    const glitchInterval = setInterval(() => {
      if (Math.random() < 0.15) {
        setGlitchActive(true)

        // Calculate glitch duration and play sounds accordingly
        const glitchDuration = Math.random() * 600 + 200

        // Play glitch sound for exact duration of visual glitch
        playOperationSound("glitch", glitchDuration, { volume: 0.3 })

        // Play error sound on more severe glitches
        if (Math.random() < 0.3) {
          playOperationSound("error", glitchDuration, { volume: 0.4 })
        }

        // Reduce screen tear chance from 30% to 10%
        if (Math.random() < 0.1) {
          setScreenTear(true)
        }

        // Reduce corruption chance from 60% to 25%
        const newCorrupted: { [key: number]: string } = {}
        displayedText.forEach((line, index) => {
          if (Math.random() < 0.25 && line.trim()) {
            newCorrupted[index] = corruptText(line, 0.1)
          }
        })
        setCorruptedLines(newCorrupted)

        setTimeout(() => {
          setGlitchActive(false)
          setScreenTear(false)
          // Reduce permanent glitch chance from 30% to 10%
          if (Math.random() < 0.1) {
            setPermanentGlitch(true)
            setTimeout(() => setPermanentGlitch(false), 1000)
          } else {
            setCorruptedLines({})
          }
        }, glitchDuration)
      }
    }, 2500)

    return () => clearInterval(glitchInterval)
  }, [displayedText, playOperationSound])

  useEffect(() => {
    if (currentLine < bootLore.length) {
      const timer = setTimeout(
        () => {
          // Add glitch to text as it appears - LESS INTENSIVE
          const originalText = bootLore[currentLine]
          const glitchedText = Math.random() < 0.1 ? corruptText(originalText, 0.05) : originalText

          setDisplayedText((prev) => [...prev, glitchedText])
          setCurrentLine((prev) => prev + 1)

          // Random glitch sounds during text appearance
          if (bootLore[currentLine].trim()) {
            if (Math.random() < 0.08) {
              const soundDuration = Math.random() * 500 + 200
              setTimeout(() => {
                playOperationSound("glitch", soundDuration, { volume: 0.2 })
              }, Math.random() * 500)
            }
          }
        },
        bootLore[currentLine] === "" ? 500 : Math.random() * 800 + 600,
      )

      return () => clearTimeout(timer)
    } else {
      setTimeout(() => {
        playSound("success", { volume: 0.6 })
        setShowBootButton(true)
      }, 1000)
    }
  }, [currentLine, playOperationSound, playSound])

  const handleBoot = () => {
    // Boot click sound as specified
    playSound("boot", { volume: 0.8 })
    // Add glitch effect on boot
    setGlitchActive(true)
    setTimeout(() => onBoot(), 500)
  }

  return (
    <div className="relative h-screen w-screen bg-black overflow-hidden">
      {/* Realistic CRT Scanlines */}
      <div
        className={`absolute inset-0 pointer-events-none transition-opacity duration-200 ${
          glitchActive ? "opacity-60" : "opacity-30"
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

      {/* Realistic Static Noise */}
      {(glitchActive || permanentGlitch) && (
        <div
          className="absolute inset-0 pointer-events-none opacity-10"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.2'/%3E%3C/svg%3E")`,
            animation: "staticNoise 0.15s infinite",
          }}
        />
      )}

      {/* Screen Tear Effect */}
      {screenTear && (
        <div
          className="absolute inset-0 pointer-events-none opacity-80"
          style={{
            background: `repeating-linear-gradient(
              0deg,
              transparent 0px,
              transparent ${Math.random() * 50 + 20}px,
              rgba(255, 255, 255, 0.1) ${Math.random() * 50 + 20}px,
              rgba(255, 255, 255, 0.1) ${Math.random() * 50 + 25}px,
              transparent ${Math.random() * 50 + 25}px,
              transparent ${Math.random() * 100 + 50}px
            )`,
            transform: `translateX(${Math.random() * 10 - 5}px)`,
          }}
        />
      )}

      {/* Brightness Flicker */}
      <div
        className={`absolute inset-0 bg-white pointer-events-none ${
          glitchActive ? "opacity-2 animate-pulse" : "opacity-0"
        }`}
      />

      {/* Terminal Content with realistic glitch effects */}
      <div className="flex flex-col items-center justify-center h-full p-8 text-green-400">
        <div className="max-w-4xl w-full">
          {displayedText.map((line, index) => (
            <div
              key={index}
              className={`mb-2 transition-all duration-200 ${
                line.includes("📜 THE LEGACY") ? "text-yellow-400 text-xl font-bold mb-6" : "text-green-300"
              } ${glitchActive ? "animate-pulse" : ""} ${
                corruptedLines[index] || permanentGlitch ? "text-white animate-bounce" : ""
              }`}
              style={{
                textShadow: glitchActive
                  ? `${Math.random() * 2 - 1}px 0 rgba(255, 255, 255, 0.5)`
                  : permanentGlitch
                    ? "1px 0 rgba(255, 255, 255, 0.3)"
                    : "none",
                transform: glitchActive
                  ? `translateX(${Math.random() * 8 - 4}px) translateY(${Math.random() * 4 - 2}px)`
                  : permanentGlitch
                    ? `translateX(${Math.random() * 2 - 1}px)`
                    : "none",
                filter: glitchActive
                  ? `brightness(${0.8 + Math.random() * 0.4}) contrast(${1 + Math.random() * 0.5})`
                  : "none",
              }}
            >
              {line === ""
                ? "\u00A0"
                : corruptedLines[index] || (permanentGlitch && Math.random() < 0.1 ? corruptText(line, 0.05) : line)}
            </div>
          ))}

          {showBootButton && (
            <div className="mt-8 text-center">
              <button
                onClick={handleBoot}
                className={`px-8 py-3 border-2 border-green-400 bg-black text-green-400 hover:bg-green-400 hover:text-black transition-all duration-200 text-lg font-bold ${
                  glitchActive ? "animate-bounce" : "animate-pulse"
                }`}
                style={{
                  textShadow: glitchActive ? "1px 0 rgba(255, 255, 255, 0.5)" : "none",
                  transform: glitchActive ? `rotate(${Math.random() * 2 - 1}deg)` : "none",
                }}
              >
                [ Boot StanleyOS ]
              </button>
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        @keyframes staticNoise {
          0% { transform: translateX(0) translateY(0); opacity: 0.2; }
          10% { transform: translateX(-1px) translateY(1px); opacity: 0.3; }
          20% { transform: translateX(1px) translateY(-1px); opacity: 0.1; }
          30% { transform: translateX(-1px) translateY(1px); opacity: 0.25; }
          40% { transform: translateX(1px) translateY(-1px); opacity: 0.2; }
          50% { transform: translateX(-1px) translateY(-1px); opacity: 0.35; }
          60% { transform: translateX(1px) translateY(1px); opacity: 0.15; }
          70% { transform: translateX(-1px) translateY(-1px); opacity: 0.25; }
          80% { transform: translateX(1px) translateY(1px); opacity: 0.2; }
          90% { transform: translateX(-1px) translateY(1px); opacity: 0.3; }
          100% { transform: translateX(0) translateY(0); opacity: 0.2; }
        }
      `}</style>
    </div>
  )
}
