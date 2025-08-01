"use client"

import { useState, useEffect } from "react"

interface TaskbarProps {
  onStartClick: () => void
}

export default function Taskbar({ onStartClick }: TaskbarProps) {
  const [currentTime, setCurrentTime] = useState("")

  useEffect(() => {
    const updateTime = () => {
      const now = new Date()
      const timeString = `Thu, Oct 15 1998 — ${now.getHours().toString().padStart(2, "0")}:${now.getMinutes().toString().padStart(2, "0")}:${now.getSeconds().toString().padStart(2, "0")}`
      setCurrentTime(timeString)
    }

    updateTime()
    const interval = setInterval(updateTime, 1000)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="absolute bottom-0 left-0 right-0 h-8 bg-gray-400 border-t-2 border-gray-600 flex items-center justify-between px-2">
      <button
        className="px-3 py-1 bg-gray-500 border border-gray-600 text-black text-sm font-bold hover:bg-gray-600 hover:text-white transition-colors"
        onClick={onStartClick}
      >
        Start
      </button>

      <div className="text-black text-sm font-mono bg-gray-300 border border-gray-500 px-2 py-1">{currentTime}</div>
    </div>
  )
}
