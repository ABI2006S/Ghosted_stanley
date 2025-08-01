"use client"

import { useState } from "react"

interface DesktopIconProps {
  id: string
  label: string
  icon: string
  x: number
  y: number
  onClick: (id: string) => void
}

export default function DesktopIcon({ id, label, icon, x, y, onClick }: DesktopIconProps) {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <div
      className="absolute cursor-pointer select-none"
      style={{ left: x, top: y }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onDoubleClick={() => onClick(id)}
    >
      <div
        className={`flex flex-col items-center p-2 rounded transition-all duration-200 ${
          isHovered ? "bg-blue-600 bg-opacity-50" : ""
        }`}
      >
        <div className={`text-4xl mb-1 transition-transform duration-200 ${isHovered ? "scale-110" : ""}`}>{icon}</div>
        <div className={`text-xs text-center max-w-20 leading-tight ${isHovered ? "text-white" : "text-black"}`}>
          {label}
        </div>
      </div>
    </div>
  )
}
