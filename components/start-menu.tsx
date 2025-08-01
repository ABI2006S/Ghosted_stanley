"use client"

import type React from "react"

import { useState } from "react"
import { useAudio } from "./audio-provider"

interface StartMenuProps {
  isOpen: boolean
  onClose: () => void
  onOpenWindow: (id: string, title: string, component: React.ReactNode) => void
  onRestart: () => void
  onShutdown: () => void
}

export default function StartMenu({ isOpen, onClose, onOpenWindow, onRestart, onShutdown }: StartMenuProps) {
  const [expandedMenu, setExpandedMenu] = useState<string | null>(null)
  const { playSound } = useAudio()

  if (!isOpen) return null

  const handleMenuClick = (menu: string) => {
    playSound("click")
    setExpandedMenu(expandedMenu === menu ? null : menu)
  }

  const handleItemClick = (action: string) => {
    playSound("click")
    onClose()

    switch (action) {
      case "deskclean":
        onOpenWindow("deskclean", "StanleyOS Digital Desk Cleaner v1.98", <div>DeskClean</div>)
        break
      case "trustpod":
        onOpenWindow("trustpod", "TrustPod™ AI Assistant", <div>TrustPod</div>)
        break
      case "notepad":
        onOpenWindow(
          "notepad",
          "Notepad",
          <div className="p-4">
            <textarea
              className="w-full h-64 p-2 border font-mono text-sm resize-none"
              defaultValue="You left this thought in 2001..."
              readOnly
            />
          </div>,
        )
        break
      case "mycomputer":
        onOpenWindow("mycomputer", "My Computer", <div>My Computer</div>)
        break
      case "stanleys-docs":
        onOpenWindow("stanleys-docs", "Stanley's Documents", <div>Stanley's Docs</div>)
        break
      case "control-panel":
        onOpenWindow(
          "control-panel",
          "Control Panel",
          <div className="p-4 space-y-4">
            <h3 className="font-bold">System Settings</h3>
            <div className="space-y-2">
              <label className="flex items-center gap-2">
                <input type="checkbox" defaultChecked />
                <span>Simulate Progress</span>
              </label>
              <label className="flex items-center gap-2">
                <input type="checkbox" />
                <span>Force Positivity</span>
              </label>
              <label className="flex items-center gap-2">
                <input type="checkbox" />
                <span>Auto-Destruct Mode</span>
              </label>
              <label className="flex items-center gap-2">
                <input type="checkbox" defaultChecked />
                <span>Delusion Mode</span>
              </label>
            </div>
          </div>,
        )
        break
      case "restart":
        onRestart()
        break
      case "shutdown":
        onShutdown()
        break
    }
  }

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 z-40" onClick={onClose} />

      {/* Start Menu */}
      <div className="absolute bottom-8 left-0 z-50 bg-gray-300 border-2 border-gray-600 shadow-lg min-w-48">
        <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white px-3 py-2 font-bold text-sm">
          StanleyOS Start Menu
        </div>

        <div className="p-1">
          {/* Programs */}
          <div className="relative">
            <div
              className="px-3 py-1 hover:bg-blue-600 hover:text-white cursor-pointer text-sm flex items-center justify-between"
              onClick={() => handleMenuClick("programs")}
            >
              <span>📁 Programs</span>
              <span>▶</span>
            </div>
            {expandedMenu === "programs" && (
              <div className="absolute left-full top-0 bg-gray-300 border-2 border-gray-600 shadow-lg min-w-40">
                <div className="p-1">
                  <div
                    className="px-3 py-1 hover:bg-blue-600 hover:text-white cursor-pointer text-sm"
                    onClick={() => handleItemClick("deskclean")}
                  >
                    🧹 deskclean.exe
                  </div>
                  <div
                    className="px-3 py-1 hover:bg-blue-600 hover:text-white cursor-pointer text-sm"
                    onClick={() => handleItemClick("trustpod")}
                  >
                    🤖 trustpod.exe
                  </div>
                  <div
                    className="px-3 py-1 hover:bg-blue-600 hover:text-white cursor-pointer text-sm"
                    onClick={() => handleItemClick("notepad")}
                  >
                    📝 notepad
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Explorer */}
          <div className="relative">
            <div
              className="px-3 py-1 hover:bg-blue-600 hover:text-white cursor-pointer text-sm flex items-center justify-between"
              onClick={() => handleMenuClick("explorer")}
            >
              <span>🗂️ Explorer</span>
              <span>▶</span>
            </div>
            {expandedMenu === "explorer" && (
              <div className="absolute left-full top-0 bg-gray-300 border-2 border-gray-600 shadow-lg min-w-40">
                <div className="p-1">
                  <div
                    className="px-3 py-1 hover:bg-blue-600 hover:text-white cursor-pointer text-sm"
                    onClick={() => handleItemClick("mycomputer")}
                  >
                    💻 My Computer
                  </div>
                  <div
                    className="px-3 py-1 hover:bg-blue-600 hover:text-white cursor-pointer text-sm"
                    onClick={() => handleItemClick("stanleys-docs")}
                  >
                    📁 Stanley's Docs
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Control Panel */}
          <div
            className="px-3 py-1 hover:bg-blue-600 hover:text-white cursor-pointer text-sm"
            onClick={() => handleItemClick("control-panel")}
          >
            ⚙️ Control Panel
          </div>

          <hr className="my-1 border-gray-500" />

          {/* Restart */}
          <div
            className="px-3 py-1 hover:bg-blue-600 hover:text-white cursor-pointer text-sm"
            onClick={() => handleItemClick("restart")}
          >
            🔄 Restart
          </div>

          {/* Shutdown */}
          <div
            className="px-3 py-1 hover:bg-blue-600 hover:text-white cursor-pointer text-sm"
            onClick={() => handleItemClick("shutdown")}
          >
            🔌 Shutdown
          </div>
        </div>
      </div>
    </>
  )
}
