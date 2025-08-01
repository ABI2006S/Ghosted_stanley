"use client"

import { useState, useEffect } from "react"
import { useOperationAudio } from "./audio-provider"

interface GlitchSystemProps {
  windowCount: number
}

export default function GlitchSystem({ windowCount }: GlitchSystemProps) {
  const [activeGlitch, setActiveGlitch] = useState<string | null>(null)
  const [isSystemFrozen, setIsSystemFrozen] = useState(false)
  const { playOperationSound, playSound } = useOperationAudio()
  const [crashCount, setCrashCount] = useState(0)
  const MAX_CRASHES = 2

  useEffect(() => {
    const sessionCrashes = sessionStorage.getItem("stanley-crashes") || "0"
    const currentCrashes = Number.parseInt(sessionCrashes)

    // Guarantee at least 1 crash per session with 35% overall probability
    const baseInterval = Math.random() * 15000 + 10000 // 10-25 seconds

    const glitchInterval = setInterval(() => {
      const sessionTime = Date.now() - Number.parseInt(sessionStorage.getItem("stanley-session-start") || "0")
      const hasHadCrash = currentCrashes > 0

      // 35% base chance, but guarantee at least 1 crash after 2 minutes if none occurred
      let crashChance = 0.35
      if (!hasHadCrash && sessionTime > 120000) {
        // 2 minutes
        crashChance = 0.8 // Force crash if none happened
      }

      const shouldCrash = Math.random() < crashChance && !activeGlitch

      if (shouldCrash) {
        triggerRandomGlitch()
        // Update session crash count
        sessionStorage.setItem("stanley-crashes", (currentCrashes + 1).toString())
      }
    }, baseInterval)

    return () => clearInterval(glitchInterval)
  }, [windowCount, activeGlitch])

  // Add session initialization
  useEffect(() => {
    if (!sessionStorage.getItem("stanley-session-start")) {
      sessionStorage.setItem("stanley-session-start", Date.now().toString())
      sessionStorage.setItem("stanley-crashes", "0")
    }
  }, [])

  const triggerRandomGlitch = () => {
    const glitches = ["bluescreen", "freeze", "static", "error", "corruption", "memoryLeak", "screenBurn", "diskError"]

    // Filter out major crash types if we've reached the limit
    const crashTypes = ["bluescreen", "freeze", "diskError", "memoryLeak"]
    const availableGlitches =
      crashCount >= MAX_CRASHES ? glitches.filter((glitch) => !crashTypes.includes(glitch)) : glitches

    const randomGlitch = availableGlitches[Math.floor(Math.random() * availableGlitches.length)]

    setActiveGlitch(randomGlitch)

    // Increment crash count for major crashes
    if (crashTypes.includes(randomGlitch)) {
      setCrashCount((prev) => prev + 1)
    }

    const randomMultiplier = 0.7 + Math.random() * 0.6

    // Calculate glitch duration and play appropriate sounds
    let glitchDuration: number

    switch (randomGlitch) {
      case "freeze":
        glitchDuration = 5000 * randomMultiplier
        setIsSystemFrozen(true)
        // Play error sound for freeze duration
        playOperationSound("error", glitchDuration, { volume: 0.6 })
        setTimeout(() => {
          setIsSystemFrozen(false)
          setActiveGlitch(null)
          playSound("success", { volume: 0.3 })
        }, glitchDuration)
        break

      case "static":
        glitchDuration = 3000 * randomMultiplier
        // Play error + glitch sounds for static duration
        playOperationSound("error", glitchDuration, { volume: 0.6 })
        playOperationSound("glitch", glitchDuration, { volume: 0.4, loop: true })
        setTimeout(() => setActiveGlitch(null), glitchDuration)
        break

      case "bluescreen":
        glitchDuration = 6000 * randomMultiplier
        // Play error sound for bluescreen duration
        playOperationSound("error", glitchDuration, { volume: 0.6 })
        setTimeout(() => {
          setActiveGlitch(null)
          playSound("success", { volume: 0.4 })
        }, glitchDuration)
        break

      case "error":
        glitchDuration = 4000 * randomMultiplier
        // Double error sound for error-specific crashes
        playOperationSound("error", glitchDuration, { volume: 0.7 })
        setTimeout(() => setActiveGlitch(null), glitchDuration)
        break

      case "corruption":
        glitchDuration = 3500 * randomMultiplier
        // Play error + glitch for corruption
        playOperationSound("error", glitchDuration, { volume: 0.6 })
        playOperationSound("glitch", glitchDuration, { volume: 0.3 })
        setTimeout(() => setActiveGlitch(null), glitchDuration)
        break

      case "memoryLeak":
        glitchDuration = 4500 * randomMultiplier
        // Extended error sound for memory leak
        playOperationSound("error", glitchDuration, { volume: 0.6 })
        setTimeout(() => setActiveGlitch(null), glitchDuration)
        break

      case "screenBurn":
        glitchDuration = 5000 * randomMultiplier
        // Subtle error sound for screen burn
        playOperationSound("error", glitchDuration, { volume: 0.4 })
        setTimeout(() => setActiveGlitch(null), glitchDuration)
        break

      case "diskError":
        glitchDuration = 4000 * randomMultiplier
        // Play floppy sound + error for disk errors
        playOperationSound("floppy", Math.min(glitchDuration, 3000), { volume: 0.5 })
        playOperationSound("error", glitchDuration, { volume: 0.6 })
        setTimeout(() => setActiveGlitch(null), glitchDuration)
        break
    }
  }

  if (!activeGlitch) return null

  return (
    <>
      {/* System Freeze Overlay */}
      {isSystemFrozen && <div className="fixed inset-0 z-[9999] bg-transparent cursor-wait" />}

      {/* All glitch visual effects remain the same */}
      {activeGlitch === "bluescreen" && (
        <div className="fixed inset-0 z-[9998] bg-blue-900 text-white p-8 font-mono">
          <div
            className="absolute inset-0 opacity-20"
            style={{
              backgroundImage: `repeating-linear-gradient(
                0deg,
                transparent,
                transparent 2px,
                rgba(255, 255, 255, 0.05) 2px,
                rgba(255, 255, 255, 0.05) 4px
              )`,
            }}
          />
          <div className="text-center mt-32 relative z-10">
            <h1 className="text-3xl mb-6 animate-pulse">STANLEY_OS_FATAL_ERROR</h1>
            <p className="mb-4">The system has encountered an existential crisis and needs to restart.</p>
            <p className="text-sm mb-2">Error Code: 0x00DESPAIR</p>
            <p className="text-sm mb-2">Module: emotional_baggage.dll</p>
            <p className="text-sm mb-8">Memory dump: 9447 days of regret</p>
            <div className="animate-pulse">
              <p className="text-sm">Press any key to continue wallowing...</p>
              <p className="text-xs mt-4 opacity-50">System will recover automatically...</p>
            </div>
          </div>
        </div>
      )}

      {activeGlitch === "diskError" && (
        <div className="fixed inset-0 z-[9998] bg-black text-white p-8 font-mono">
          <div className="text-center mt-32">
            <h1 className="text-2xl mb-4 animate-pulse">DISK READ ERROR</h1>
            <p className="mb-4">Cannot read from emotional storage device.</p>
            <p className="text-sm mb-2">Drive C: contains 9,447 days of unprocessed feelings</p>
            <p className="text-sm mb-2">Attempting to recover lost memories...</p>
            <p className="text-sm mt-8 animate-bounce">Please wait while system suffers...</p>
          </div>
        </div>
      )}

      {activeGlitch === "screenBurn" && (
        <div className="fixed inset-0 z-[9998] pointer-events-none">
          <div
            className="w-full h-full opacity-30"
            style={{
              backgroundImage: `radial-gradient(circle at 50% 50%, 
                rgba(255, 255, 255, 0.1) 0%, 
                transparent 30%),
                linear-gradient(0deg, 
                transparent 0%, 
                rgba(255, 255, 255, 0.05) 50%, 
                transparent 100%)`,
            }}
          />
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-white opacity-10 text-6xl font-mono">
            StanleyOS
          </div>
        </div>
      )}

      {activeGlitch === "memoryLeak" && (
        <div className="fixed inset-0 z-[9998] bg-black text-white p-8 font-mono">
          <div className="text-center mt-32">
            <h1 className="text-2xl mb-4 animate-pulse">MEMORY LEAK DETECTED</h1>
            <p className="mb-4">StanleyOS is leaking emotional memories...</p>
            <p className="text-sm mb-2">Available RAM: -64MB</p>
            <p className="text-sm mb-2">Leaked memories: 9,447 days worth</p>
            <p className="text-sm mt-8 animate-bounce">Attempting to contain the leak...</p>
          </div>
        </div>
      )}

      {activeGlitch === "static" && (
        <div className="fixed inset-0 z-[9998] opacity-50">
          <div
            className="w-full h-full"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.6'/%3E%3C/svg%3E")`,
              animation: "intensiveStatic 0.05s infinite",
            }}
          />
        </div>
      )}

      {activeGlitch === "corruption" && (
        <div className="fixed inset-0 z-[9998] pointer-events-none">
          <div
            className="w-full h-full opacity-40"
            style={{
              background: `repeating-linear-gradient(
                45deg,
                transparent 0px,
                transparent 10px,
                rgba(255, 255, 255, 0.1) 10px,
                rgba(255, 255, 255, 0.1) 12px,
                transparent 12px,
                transparent 20px
              )`,
              animation: "realisticCorruption 0.2s infinite",
            }}
          />
        </div>
      )}

      {activeGlitch === "error" && (
        <div className="fixed inset-0 z-[9998] flex items-center justify-center bg-black bg-opacity-80">
          <div className="bg-gray-300 border-4 border-gray-600 p-6 max-w-md">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center text-white font-bold text-xl">
                !
              </div>
              <span className="font-bold text-lg">CRITICAL SYSTEM ERROR</span>
            </div>
            <p className="mb-4 font-mono">StanleyOS has performed an illegal emotional operation.</p>
            <p className="text-sm text-gray-600 mb-4">
              This system is too old to understand modern problems.
              <br />
              Emotional overflow detected in memory sector 0x1998.
              <br />
              <span className="text-black font-bold">Warning: Nostalgia buffer overflow!</span>
            </p>
            <div className="text-right">
              <button
                className="px-6 py-2 bg-gray-500 border-2 border-gray-700 text-white font-bold hover:bg-gray-600"
                onClick={() => setActiveGlitch(null)}
              >
                IGNORE PROBLEM
              </button>
            </div>
          </div>
        </div>
      )}

      {crashCount >= MAX_CRASHES && (
        <div className="fixed bottom-4 right-4 z-[9999] bg-green-800 text-green-300 p-2 text-xs font-mono border border-green-600">
          System stabilized - Major crashes disabled
        </div>
      )}

      <style jsx>{`
        @keyframes intensiveStatic {
          0% { transform: translateX(0) translateY(0); opacity: 0.5; }
          10% { transform: translateX(-1px) translateY(1px); opacity: 0.6; }
          20% { transform: translateX(1px) translateY(-1px); opacity: 0.4; }
          30% { transform: translateX(-1px) translateY(1px); opacity: 0.55; }
          40% { transform: translateX(1px) translateY(-1px); opacity: 0.5; }
          50% { transform: translateX(-1px) translateY(-1px); opacity: 0.65; }
          60% { transform: translateX(1px) translateY(1px); opacity: 0.45; }
          70% { transform: translateX(-1px) translateY(-1px); opacity: 0.55; }
          80% { transform: translateX(1px) translateY(1px); opacity: 0.5; }
          90% { transform: translateX(-1px) translateY(1px); opacity: 0.6; }
          100% { transform: translateX(0) translateY(0); opacity: 0.5; }
        }
        
        @keyframes realisticCorruption {
          0% { filter: brightness(1) contrast(1); }
          25% { filter: brightness(1.2) contrast(1.5); }
          50% { filter: brightness(0.8) contrast(0.8); }
          75% { filter: brightness(1.1) contrast(1.2); }
          100% { filter: brightness(1) contrast(1); }
        }
      `}</style>
    </>
  )
}
