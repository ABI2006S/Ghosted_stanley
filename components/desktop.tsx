"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useOperationAudio } from "./audio-provider"
import DesktopIcon from "./desktop-icon"
import Window from "./window"
import Taskbar from "./taskbar"
import StartMenu from "./start-menu"
import GlitchSystem from "./glitch-system"
import DeskClean from "./apps/desk-clean"
import TrustPod from "./apps/trust-pod"
import MyComputer from "./apps/my-computer"
import StanleysDocs from "./apps/stanleys-docs"

interface OpenWindow {
  id: string
  title: string
  component: React.ReactNode
  position: { x: number; y: number }
  zIndex: number
}

export default function Desktop() {
  const [openWindows, setOpenWindows] = useState<OpenWindow[]>([])
  const [nextZIndex, setNextZIndex] = useState(100)
  const [isDustVisible, setIsDustVisible] = useState(true)
  const [isRecycleBinEmpty, setIsRecycleBinEmpty] = useState(false)
  const [isStartMenuOpen, setIsStartMenuOpen] = useState(false)
  const [isShutdown, setIsShutdown] = useState(false)
  const { playSound, playAmbient, enableAudio } = useOperationAudio()

  useEffect(() => {
    // Enable audio and start ambient loop
    enableAudio().then(() => {
      playAmbient()
    })
  }, [playAmbient, enableAudio])

  const openWindow = (id: string, title: string, component: React.ReactNode) => {
    if (openWindows.find((w) => w.id === id)) return

    // Play window open sound
    playSound("open", { volume: 0.5 })
    const newWindow: OpenWindow = {
      id,
      title,
      component,
      position: {
        x: 100 + openWindows.length * 30,
        y: 100 + openWindows.length * 30,
      },
      zIndex: nextZIndex,
    }

    setOpenWindows((prev) => [...prev, newWindow])
    setNextZIndex((prev) => prev + 1)
  }

  const closeWindow = (id: string) => {
    // Play window close sound
    playSound("close", { volume: 0.5 })
    setOpenWindows((prev) => prev.filter((w) => w.id !== id))
  }

  const focusWindow = (id: string) => {
    setOpenWindows((prev) => prev.map((w) => (w.id === id ? { ...w, zIndex: nextZIndex } : w)))
    setNextZIndex((prev) => prev + 1)
  }

  const updateWindowPosition = (id: string, position: { x: number; y: number }) => {
    setOpenWindows((prev) => prev.map((w) => (w.id === id ? { ...w, position } : w)))
  }

  const handleIconClick = (iconId: string) => {
    // Click sound for icon interactions
    playSound("click", { volume: 0.6 })

    switch (iconId) {
      case "deskclean":
        openWindow(
          "deskclean",
          "StanleyOS Digital Desk Cleaner v1.98",
          <DeskClean
            onCleanComplete={() => {
              setIsDustVisible(false)
              setIsRecycleBinEmpty(true)
            }}
          />,
        )
        break
      case "trustpod":
        openWindow("trustpod", "TrustPod™ AI Assistant", <TrustPod />)
        break
      case "mycomputer":
        openWindow("mycomputer", "My Computer", <MyComputer />)
        break
      case "stanleys-docs":
        openWindow("stanleys-docs", "Stanley's Documents", <StanleysDocs />)
        break
      case "recycle-bin":
        if (isRecycleBinEmpty) {
          openWindow(
            "recycle-empty",
            "Recycle Bin (Empty)",
            <div className="p-4 text-center text-gray-600">
              <p>The Recycle Bin is empty.</p>
              <p className="text-sm mt-2">All emotional baggage has been disposed of.</p>
            </div>,
          )
        } else {
          openWindow(
            "recycle-full",
            "Recycle Bin",
            <div className="p-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-gray-400"></div>
                  <span>nostalgia.log</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-gray-400"></div>
                  <span>sadness.tmp</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-gray-400"></div>
                  <span>emotional_residue.dll</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-gray-400"></div>
                  <span>regret.ini</span>
                </div>
              </div>
            </div>,
          )
        }
        break
    }
  }

  const handleRestart = () => {
    // Play reboot sound for restart
    playSound("reboot", { volume: 0.8 })
    setOpenWindows([])
    setIsStartMenuOpen(false)
    // Brief black screen effect
    document.body.style.backgroundColor = "black"
    setTimeout(() => {
      document.body.style.backgroundColor = ""
      window.location.reload()
    }, 2500) // Match reboot sound duration
  }

  const handleShutdown = () => {
    // Shutdown sound when shutdown is clicked
    playSound("shutdown", { volume: 0.8 })
    setIsShutdown(true)
    setIsStartMenuOpen(false)
  }

  const desktopIcons = [
    { id: "mycomputer", label: "My Computer", icon: "💻", x: 50, y: 50 },
    { id: "stanleys-docs", label: "Stanley's Docs", icon: "📁", x: 50, y: 150 },
    { id: "deskclean", label: "deskclean.exe", icon: "🧹", x: 50, y: 250 },
    { id: "trustpod", label: "trustpod.exe", icon: "🤖", x: 50, y: 350 },
    {
      id: "recycle-bin",
      label: "Recycle Bin",
      icon: isRecycleBinEmpty ? "🗑️" : "🗂️",
      x: 50,
      y: 450,
    },
  ]

  if (isShutdown) {
    return (
      <div className="h-screen w-screen bg-black flex items-center justify-center">
        <div className="text-green-400 font-mono text-center">
          <p className="text-xl mb-4">StanleyOS is shutting down...</p>
          <p className="text-sm">It's safe to close your browser now.</p>
          <p className="text-xs mt-8 opacity-50">System uptime: 9,447 days</p>
        </div>
      </div>
    )
  }

  return (
    <div className="relative h-screen w-screen overflow-hidden bg-gray-900">
      {/* Desktop Background - Military SPEC.WI001 Wallpaper */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `url('https://hebbkx1anhila5yf.public.blob.vercel-storage.com/f335039d-ad23-480a-940b-e99cd7ddf094-0u1Ff8lI4KmVSPcxQ2OgPuOi6UDqpy.png')`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      />

      {/* Dust Overlay - Aged texture that fades when cleaned */}
      {isDustVisible && (
        <div
          className="absolute inset-0 pointer-events-none transition-opacity duration-2000"
          style={{
            backgroundImage: `url('https://hebbkx1anhila5yf.public.blob.vercel-storage.com/1000121695-MiX9Nj3hRRA3cyNmu5aR1YnkXtZruv.png')`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
            opacity: 0.4,
          }}
        />
      )}

      {/* Desktop Icons */}
      {desktopIcons.map((icon) => (
        <DesktopIcon
          key={icon.id}
          id={icon.id}
          label={icon.label}
          icon={icon.icon}
          x={icon.x}
          y={icon.y}
          onClick={handleIconClick}
        />
      ))}

      {/* Windows */}
      {openWindows.map((window) => (
        <Window
          key={window.id}
          id={window.id}
          title={window.title}
          position={window.position}
          zIndex={window.zIndex}
          onClose={() => closeWindow(window.id)}
          onFocus={() => focusWindow(window.id)}
          onMove={(position) => updateWindowPosition(window.id, position)}
        >
          {window.component}
        </Window>
      ))}

      {/* Start Menu */}
      <StartMenu
        isOpen={isStartMenuOpen}
        onClose={() => setIsStartMenuOpen(false)}
        onOpenWindow={openWindow}
        onRestart={handleRestart}
        onShutdown={handleShutdown}
      />

      {/* Glitch System */}
      <GlitchSystem windowCount={openWindows.length} />

      {/* Taskbar */}
      <Taskbar
        onStartClick={() => {
          // Click sound on taskbar clicks
          playSound("click", { volume: 0.6 })
          setIsStartMenuOpen(!isStartMenuOpen)
        }}
      />
    </div>
  )
}
