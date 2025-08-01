"use client"

import { useState } from "react"
import LandingPage from "@/components/landing-page"
import BootSequence from "@/components/boot-sequence"
import Desktop from "@/components/desktop"
import { AudioProvider } from "@/components/audio-provider"

export default function StanleysDesktop() {
  const [currentScreen, setCurrentScreen] = useState<"landing" | "boot" | "desktop">("landing")

  return (
    <AudioProvider>
      <div className="h-screen w-screen overflow-hidden bg-black font-mono">
        {currentScreen === "landing" && <LandingPage onBoot={() => setCurrentScreen("boot")} />}
        {currentScreen === "boot" && <BootSequence onComplete={() => setCurrentScreen("desktop")} />}
        {currentScreen === "desktop" && <Desktop />}
      </div>
    </AudioProvider>
  )
}
