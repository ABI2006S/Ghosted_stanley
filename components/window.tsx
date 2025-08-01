"use client"

import type React from "react"

import { useState, useRef, useEffect, type ReactNode } from "react"

interface WindowProps {
  id: string
  title: string
  children: ReactNode
  position: { x: number; y: number }
  zIndex: number
  onClose: () => void
  onFocus: () => void
  onMove: (position: { x: number; y: number }) => void
}

export default function Window({ id, title, children, position, zIndex, onClose, onFocus, onMove }: WindowProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 })
  const windowRef = useRef<HTMLDivElement>(null)

  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget || (e.target as HTMLElement).classList.contains("window-header")) {
      setIsDragging(true)
      setDragOffset({
        x: e.clientX - position.x,
        y: e.clientY - position.y,
      })
      onFocus()
    }
  }

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging) {
        const newX = Math.max(0, Math.min(window.innerWidth - 400, e.clientX - dragOffset.x))
        const newY = Math.max(0, Math.min(window.innerHeight - 300, e.clientY - dragOffset.y))
        onMove({ x: newX, y: newY })
      }
    }

    const handleMouseUp = () => {
      setIsDragging(false)
    }

    if (isDragging) {
      document.addEventListener("mousemove", handleMouseMove)
      document.addEventListener("mouseup", handleMouseUp)
    }

    return () => {
      document.removeEventListener("mousemove", handleMouseMove)
      document.removeEventListener("mouseup", handleMouseUp)
    }
  }, [isDragging, dragOffset, onMove])

  return (
    <div
      ref={windowRef}
      className="absolute bg-gray-300 border-2 border-gray-600 shadow-lg"
      style={{
        left: position.x,
        top: position.y,
        zIndex,
        minWidth: 400,
        minHeight: 300,
        maxWidth: "80vw",
        maxHeight: "80vh",
      }}
      onClick={onFocus}
    >
      {/* Window Header */}
      <div
        className="window-header bg-gray-400 border-b-2 border-gray-600 px-2 py-1 flex items-center justify-between cursor-move select-none"
        onMouseDown={handleMouseDown}
      >
        <span className="text-sm font-bold text-black">{title}</span>
        <button
          onClick={onClose}
          className="w-6 h-6 bg-red-500 border border-red-700 text-white text-xs font-bold hover:bg-red-600 flex items-center justify-center"
        >
          ×
        </button>
      </div>

      {/* Window Content */}
      <div className="p-4 bg-white overflow-auto" style={{ height: "calc(100% - 32px)" }}>
        {children}
      </div>
    </div>
  )
}
