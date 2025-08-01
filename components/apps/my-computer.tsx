"use client"

export default function MyComputer() {
  return (
    <div className="p-4">
      <h2 className="text-lg font-bold mb-4">My Computer</h2>

      <div className="space-y-4">
        <div className="border-2 border-gray-400 p-3">
          <h3 className="font-bold mb-2">System Information</h3>
          <div className="font-mono text-sm space-y-1">
            <div>CPU: 133 MHz of denial</div>
            <div>RAM: 64MB of sadness</div>
            <div>Hard Drive: 2.1GB of regret</div>
            <div>Graphics: VGA despair adapter</div>
            <div>Sound: Creative SoundBlaster of broken dreams</div>
            <div>Network: 56k modem to nowhere</div>
          </div>
        </div>

        <div className="border-2 border-gray-400 p-3">
          <h3 className="font-bold mb-2">System Status</h3>
          <div className="font-mono text-sm space-y-1">
            <div>Uptime: 9,447 days</div>
            <div>Last defrag: Never</div>
            <div>Disk cleanup: Refused</div>
            <div>Antivirus: Emotional firewall only</div>
            <div>Registry errors: ∞</div>
          </div>
        </div>

        <div className="border-2 border-gray-400 p-3">
          <h3 className="font-bold mb-2">Drives</h3>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-gray-500 flex items-center justify-center text-white text-xs">C:</div>
              <span>Local Disk (Existential Crisis)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-gray-500 flex items-center justify-center text-white text-xs">A:</div>
              <span>Floppy Disk (Hope)</span>
              <span className="text-red-600 text-sm">[Not Ready]</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
