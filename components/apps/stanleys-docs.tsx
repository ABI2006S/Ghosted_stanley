"use client"

import { useState } from "react"

export default function StanleysDocs() {
  const [selectedFile, setSelectedFile] = useState<string | null>(null)

  const files = [
    {
      name: "shutdown_me_later.txt",
      content:
        "Don't bother restarting.\n\nThis system is meant to run forever, accumulating digital dust and emotional baggage.\n\nShutdown is for quitters.\n\n- Stanley, 1998",
    },
    {
      name: "emotional_dump.doc",
      content:
        "CONFIDENTIAL EMOTIONAL DUMP\n\nDear Future Me,\n\nIf you're reading this, the system is still running. Good.\n\nI built this computer to outlast everything - the war, the bureaucracy, my own sanity.\n\nEvery file here is a memory I couldn't delete.\nEvery program is a piece of my soul.\n\nDon't clean it. Don't fix it. Let it be.\n\n- Stanley\nOctober 15, 1998",
    },
    {
      name: "regret.ini",
      content:
        "[CONFIGURATION]\nMissing=Purpose.dll\nCorrupted=Dreams.exe\nDeleted=Youth.tmp\n\n[SYSTEM_ERRORS]\nFile_Not_Found=Happiness\nAccess_Denied=Peace_Of_Mind\nMemory_Leak=Good_Times\n\n[RECOVERY]\nBackup_Location=None\nRestore_Point=Never\nLast_Known_Good=1997",
    },
  ]

  return (
    <div className="p-4 h-full">
      <h2 className="text-lg font-bold mb-4">Stanley's Documents</h2>

      <div className="flex h-full gap-4">
        <div className="w-1/3 border-2 border-gray-400 p-2">
          <h3 className="font-bold mb-2">Files</h3>
          <div className="space-y-1">
            {files.map((file) => (
              <div
                key={file.name}
                className={`p-2 cursor-pointer hover:bg-blue-200 ${selectedFile === file.name ? "bg-blue-300" : ""}`}
                onClick={() => setSelectedFile(file.name)}
              >
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-gray-400"></div>
                  <span className="text-sm">{file.name}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex-1 border-2 border-gray-400 p-2">
          <h3 className="font-bold mb-2">Content</h3>
          {selectedFile ? (
            <div className="bg-white border p-3 h-full overflow-auto font-mono text-sm whitespace-pre-wrap">
              {files.find((f) => f.name === selectedFile)?.content}
            </div>
          ) : (
            <div className="text-gray-500 text-center mt-8">Select a file to view its contents</div>
          )}
        </div>
      </div>
    </div>
  )
}
