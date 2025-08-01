"use client"

import { createContext, useContext, useRef, useEffect, useCallback, type ReactNode } from "react"

interface AudioContextType {
  playSound: (soundName: string, options?: AudioOptions) => Promise<AudioController | null>
  stopSound: (soundName: string) => void
  playAmbient: () => Promise<void>
  stopAmbient: () => void
  preloadSounds: () => Promise<void>
  isAudioEnabled: () => boolean
  enableAudio: () => Promise<void>
  getAudioStatus: () => AudioStatus
}

interface AudioOptions {
  loop?: boolean
  volume?: number
  duration?: number
  fadeIn?: number
  fadeOut?: number
  operationDuration?: number
}

interface AudioController {
  stop: () => void
  setVolume: (volume: number) => void
  fadeOut: (duration?: number) => Promise<void>
  isPlaying: () => boolean
}

interface AudioStatus {
  contextState: string
  userInteracted: boolean
  buffersLoaded: number
  totalBuffers: number
  lastError: string | null
}

const AudioContext = createContext<AudioContextType | null>(null)

// Optimized sound files with fallbacks for Netlify
const SOUND_FILES = {
  ambient: ["/audio/ambient.mp3", "/audio/ambient.ogg", "/audio/ambient.wav"],
  boot: ["/audio/boot.mp3", "/audio/boot.ogg", "/audio/boot.wav"],
  typing: ["/audio/typing.mp3", "/audio/typing.ogg", "/audio/typing.wav"],
  floppy: ["/audio/floppy.mp3", "/audio/floppy.ogg", "/audio/floppy.wav"],
  success: ["/audio/success.mp3", "/audio/success.ogg", "/audio/success.wav"],
  click: ["/audio/click.mp3", "/audio/click.ogg", "/audio/click.wav"],
  open: ["/audio/open.mp3", "/audio/open.ogg", "/audio/open.wav"],
  close: ["/audio/close.mp3", "/audio/close.ogg", "/audio/close.wav"],
  scan: ["/audio/scan.mp3", "/audio/scan.ogg", "/audio/scan.wav"],
  error: ["/audio/error.mp3", "/audio/error.ogg", "/audio/error.wav"],
  shutdown: ["/audio/shutdown.mp3", "/audio/shutdown.ogg", "/audio/shutdown.wav"],
  glitch: ["/audio/glitch.mp3", "/audio/glitch.ogg", "/audio/glitch.wav"],
  reboot: ["/audio/reboot.mp3", "/audio/reboot.ogg", "/audio/reboot.wav"],
} as const

const AUDIO_DURATIONS = {
  ambient: Number.POSITIVE_INFINITY,
  boot: 2000,
  typing: 1000,
  floppy: 2500,
  success: 1500,
  click: 300,
  open: 800,
  close: 600,
  scan: 3000,
  error: 1200,
  shutdown: 3000,
  glitch: 800,
  reboot: 2500,
} as const

export function AudioProvider({ children }: { children: ReactNode }) {
  const audioContextRef = useRef<AudioContext | null>(null)
  const audioBuffers = useRef<{ [key: string]: AudioBuffer }>({})
  const activeAudioSources = useRef<{ [key: string]: AudioController }>({})
  const ambientController = useRef<AudioController | null>(null)
  const isInitialized = useRef(false)
  const userInteracted = useRef(false)
  const loadingPromises = useRef<{ [key: string]: Promise<AudioBuffer> }>({})
  const lastError = useRef<string | null>(null)
  const retryAttempts = useRef<{ [key: string]: number }>({})

  // Enhanced audio context initialization with better error handling
  const initializeAudioContext = useCallback(async (): Promise<AudioContext | null> => {
    if (typeof window === "undefined") return null

    try {
      if (audioContextRef.current && audioContextRef.current.state !== "closed") {
        return audioContextRef.current
      }

      // Enhanced browser compatibility
      const AudioContextClass =
        window.AudioContext ||
        (window as any).webkitAudioContext ||
        (window as any).mozAudioContext ||
        (window as any).msAudioContext

      if (!AudioContextClass) {
        lastError.current = "Web Audio API not supported in this browser"
        console.warn("Web Audio API not supported")
        return null
      }

      const context = new AudioContextClass({
        sampleRate: 44100,
        latencyHint: "interactive",
      })

      audioContextRef.current = context

      // Enhanced state management
      const handleStateChange = async () => {
        if (context.state === "suspended" && userInteracted.current) {
          try {
            await context.resume()
          } catch (error) {
            lastError.current = `Failed to resume audio context: ${error}`
            console.warn("Failed to resume audio context:", error)
          }
        }
      }

      context.addEventListener("statechange", handleStateChange)

      // Force resume if user has interacted
      if (userInteracted.current && context.state === "suspended") {
        await context.resume()
      }

      return context
    } catch (error) {
      lastError.current = `Failed to initialize audio context: ${error}`
      console.warn("Failed to initialize audio context:", error)
      return null
    }
  }, [])

  // Enhanced audio loading with multiple format fallbacks
  const loadAudioBuffer = useCallback(
    async (soundName: string, urls: string[]): Promise<AudioBuffer | null> => {
      if (typeof window === "undefined") return null

      try {
        if (audioBuffers.current[soundName]) {
          return audioBuffers.current[soundName]
        }

        if (loadingPromises.current[soundName]) {
          return await loadingPromises.current[soundName]
        }

        const context = await initializeAudioContext()
        if (!context) return null

        const loadingPromise = (async (): Promise<AudioBuffer> => {
          let lastLoadError: Error | null = null

          // Try each URL format until one works
          for (const url of urls) {
            try {
              // Enhanced fetch with better error handling and timeout
              const controller = new AbortController()
              const timeoutId = setTimeout(() => controller.abort(), 10000) // 10 second timeout

              const response = await fetch(url, {
                signal: controller.signal,
                headers: {
                  Accept: "audio/*",
                  "Cache-Control": "public, max-age=31536000",
                },
              })

              clearTimeout(timeoutId)

              if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`)
              }

              const contentType = response.headers.get("content-type")
              if (contentType && !contentType.startsWith("audio/")) {
                console.warn(`Unexpected content type for ${url}: ${contentType}`)
              }

              const arrayBuffer = await response.arrayBuffer()

              if (arrayBuffer.byteLength === 0) {
                throw new Error("Empty audio file")
              }

              const audioBuffer = await context.decodeAudioData(arrayBuffer)

              if (audioBuffer.length === 0) {
                throw new Error("Invalid audio data")
              }

              audioBuffers.current[soundName] = audioBuffer
              delete loadingPromises.current[soundName]
              retryAttempts.current[soundName] = 0

              return audioBuffer
            } catch (error) {
              lastLoadError = error as Error
              console.warn(`Failed to load ${url}:`, error)
              continue
            }
          }

          // If all formats failed, throw the last error
          throw lastLoadError || new Error(`Failed to load any format for ${soundName}`)
        })()

        loadingPromises.current[soundName] = loadingPromise
        return await loadingPromise
      } catch (error) {
        const attempts = (retryAttempts.current[soundName] || 0) + 1
        retryAttempts.current[soundName] = attempts

        lastError.current = `Failed to load audio ${soundName} (attempt ${attempts}): ${error}`
        console.warn(`Failed to load audio ${soundName}:`, error)
        delete loadingPromises.current[soundName]

        // Retry up to 3 times with exponential backoff
        if (attempts < 3) {
          setTimeout(() => {
            delete retryAttempts.current[soundName]
          }, attempts * 2000)
        }

        return null
      }
    },
    [initializeAudioContext],
  )

  // Enhanced audio controller with better error handling
  const createAudioController = useCallback(
    (buffer: AudioBuffer, context: AudioContext, options: AudioOptions = {}): AudioController => {
      let source: AudioBufferSourceNode | null = null
      let gainNode: GainNode | null = null
      let isActive = true
      let fadeTimeout: NodeJS.Timeout | null = null

      const setup = () => {
        if (!isActive || !context || context.state === "closed") return false

        try {
          source = context.createBufferSource()
          gainNode = context.createGain()

          source.buffer = buffer
          source.connect(gainNode)
          gainNode.connect(context.destination)

          const volume = Math.min(Math.max(options.volume || 0.5, 0), 1.0)
          gainNode.gain.setValueAtTime(volume, context.currentTime)

          // Enhanced looping logic
          if (options.operationDuration) {
            const audioDuration = buffer.duration * 1000
            if (options.operationDuration > audioDuration && !options.loop) {
              source.loop = true
            }
          } else if (options.loop) {
            source.loop = true
          }

          // Enhanced fade in
          if (options.fadeIn && options.fadeIn > 0) {
            gainNode.gain.setValueAtTime(0, context.currentTime)
            gainNode.gain.exponentialRampToValueAtTime(volume, context.currentTime + options.fadeIn / 1000)
          }

          return true
        } catch (error) {
          lastError.current = `Failed to setup audio source: ${error}`
          console.warn("Failed to setup audio source:", error)
          return false
        }
      }

      const controller: AudioController = {
        stop: () => {
          if (!isActive) return
          isActive = false

          if (fadeTimeout) {
            clearTimeout(fadeTimeout)
            fadeTimeout = null
          }

          try {
            if (source) {
              source.stop()
              source.disconnect()
              source = null
            }
            if (gainNode) {
              gainNode.disconnect()
              gainNode = null
            }
          } catch (error) {
            // Ignore errors when stopping already stopped sources
          }
        },

        setVolume: (volume: number) => {
          if (!isActive || !gainNode || !context) return
          try {
            const clampedVolume = Math.min(Math.max(volume, 0), 1)
            gainNode.gain.setValueAtTime(clampedVolume, context.currentTime)
          } catch (error) {
            console.warn("Failed to set volume:", error)
          }
        },

        fadeOut: async (duration = 500) => {
          if (!isActive || !gainNode || !context) return

          return new Promise<void>((resolve) => {
            try {
              const fadeTime = duration / 1000
              const currentVolume = gainNode!.gain.value

              if (currentVolume > 0.01) {
                gainNode!.gain.exponentialRampToValueAtTime(0.01, context.currentTime + fadeTime)
              }

              fadeTimeout = setTimeout(() => {
                controller.stop()
                resolve()
              }, duration)
            } catch (error) {
              console.warn("Failed to fade out:", error)
              controller.stop()
              resolve()
            }
          })
        },

        isPlaying: () => isActive && source !== null,
      }

      if (setup()) {
        try {
          source!.start()

          // Enhanced timing control
          if (options.operationDuration && !options.loop) {
            const stopTime = Math.min(options.operationDuration, buffer.duration * 1000)
            setTimeout(() => {
              if (options.fadeOut) {
                controller.fadeOut(options.fadeOut)
              } else {
                controller.stop()
              }
            }, stopTime)
          } else if (options.duration && !options.loop) {
            setTimeout(() => {
              if (options.fadeOut) {
                controller.fadeOut(options.fadeOut)
              } else {
                controller.stop()
              }
            }, options.duration)
          }

          source!.onended = () => {
            if (isActive && !source!.loop) {
              controller.stop()
            }
          }
        } catch (error) {
          lastError.current = `Failed to start audio source: ${error}`
          console.warn("Failed to start audio source:", error)
          controller.stop()
        }
      }

      return controller
    },
    [],
  )

  const playSound = useCallback(
    async (soundName: string, options: AudioOptions = {}): Promise<AudioController | null> => {
      if (typeof window === "undefined") return null

      try {
        // Ensure user interaction and context initialization
        if (!userInteracted.current) {
          userInteracted.current = true
          await initializeAudioContext()
        }

        const context = audioContextRef.current
        if (!context) {
          lastError.current = "Audio context not available"
          return null
        }

        // Enhanced context state management
        if (context.state === "suspended") {
          try {
            await context.resume()
          } catch (error) {
            lastError.current = `Failed to resume context: ${error}`
            console.warn("Failed to resume context:", error)
            return null
          }
        }

        // Stop existing sound if not looping
        if (activeAudioSources.current[soundName] && !options.loop) {
          activeAudioSources.current[soundName].stop()
          delete activeAudioSources.current[soundName]
        }

        const soundUrls = SOUND_FILES[soundName as keyof typeof SOUND_FILES]
        if (!soundUrls) {
          lastError.current = `Unknown sound: ${soundName}`
          return null
        }

        const buffer = await loadAudioBuffer(soundName, soundUrls)
        if (!buffer) {
          lastError.current = `Failed to load buffer for: ${soundName}`
          return null
        }

        // Enhanced default volumes optimized for web
        if (options.volume === undefined) {
          const defaultVolumes: { [key: string]: number } = {
            ambient: 0.25,
            boot: 0.7,
            typing: 0.35,
            floppy: 0.45,
            success: 0.6,
            click: 0.5,
            open: 0.45,
            close: 0.45,
            scan: 0.35,
            error: 0.55,
            shutdown: 0.7,
            glitch: 0.4,
            reboot: 0.7,
          }
          options.volume = defaultVolumes[soundName] || 0.5
        }

        const controller = createAudioController(buffer, context, options)
        activeAudioSources.current[soundName] = controller

        const originalStop = controller.stop
        controller.stop = () => {
          originalStop()
          if (activeAudioSources.current[soundName] === controller) {
            delete activeAudioSources.current[soundName]
          }
        }

        return controller
      } catch (error) {
        lastError.current = `Failed to play sound ${soundName}: ${error}`
        console.warn(`Failed to play sound ${soundName}:`, error)
        return null
      }
    },
    [loadAudioBuffer, createAudioController, initializeAudioContext],
  )

  const stopSound = useCallback((soundName: string) => {
    const controller = activeAudioSources.current[soundName]
    if (controller) {
      controller.stop()
      delete activeAudioSources.current[soundName]
    }
  }, [])

  const playAmbient = useCallback(async () => {
    try {
      if (ambientController.current?.isPlaying()) return

      const controller = await playSound("ambient", {
        loop: true,
        volume: 0.25,
        fadeIn: 2000,
      })

      if (controller) {
        ambientController.current = controller
      }
    } catch (error) {
      lastError.current = `Failed to play ambient: ${error}`
      console.warn("Failed to play ambient:", error)
    }
  }, [playSound])

  const stopAmbient = useCallback(() => {
    if (ambientController.current) {
      ambientController.current.fadeOut(2000)
      ambientController.current = null
    }
  }, [])

  const preloadSounds = useCallback(async () => {
    if (isInitialized.current || typeof window === "undefined") return

    try {
      const context = await initializeAudioContext()
      if (!context) return

      // Preload critical sounds first
      const criticalSounds = ["click", "boot", "success", "error"]
      const allSounds = Object.keys(SOUND_FILES)

      // Load critical sounds first
      for (const soundName of criticalSounds) {
        const urls = SOUND_FILES[soundName as keyof typeof SOUND_FILES]
        await loadAudioBuffer(soundName, urls).catch((error) => {
          console.warn(`Failed to preload critical sound ${soundName}:`, error)
        })
      }

      // Load remaining sounds
      const remainingSounds = allSounds.filter((s) => !criticalSounds.includes(s))
      const loadPromises = remainingSounds.map((soundName) => {
        const urls = SOUND_FILES[soundName as keyof typeof SOUND_FILES]
        return loadAudioBuffer(soundName, urls).catch((error) => {
          console.warn(`Failed to preload ${soundName}:`, error)
          return null
        })
      })

      await Promise.allSettled(loadPromises)
      isInitialized.current = true
    } catch (error) {
      lastError.current = `Failed to preload sounds: ${error}`
      console.warn("Failed to preload sounds:", error)
    }
  }, [loadAudioBuffer, initializeAudioContext])

  const isAudioEnabled = useCallback(() => {
    return audioContextRef.current !== null && audioContextRef.current.state !== "closed"
  }, [])

  const enableAudio = useCallback(async () => {
    if (typeof window === "undefined") return

    userInteracted.current = true
    const context = await initializeAudioContext()
    if (context && context.state === "suspended") {
      try {
        await context.resume()
      } catch (error) {
        lastError.current = `Failed to enable audio: ${error}`
        console.warn("Failed to enable audio:", error)
      }
    }
    await preloadSounds()
  }, [initializeAudioContext, preloadSounds])

  const getAudioStatus = useCallback((): AudioStatus => {
    return {
      contextState: audioContextRef.current?.state || "none",
      userInteracted: userInteracted.current,
      buffersLoaded: Object.keys(audioBuffers.current).length,
      totalBuffers: Object.keys(SOUND_FILES).length,
      lastError: lastError.current,
    }
  }, [])

  // Enhanced initialization with multiple interaction events
  useEffect(() => {
    if (typeof window === "undefined") return

    initializeAudioContext()

    const handleUserInteraction = async () => {
      try {
        await enableAudio()
      } catch (error) {
        console.warn("Failed to enable audio on interaction:", error)
      }

      // Remove listeners after first successful interaction
      document.removeEventListener("click", handleUserInteraction)
      document.removeEventListener("keydown", handleUserInteraction)
      document.removeEventListener("touchstart", handleUserInteraction)
      document.removeEventListener("pointerdown", handleUserInteraction)
      document.removeEventListener("mousedown", handleUserInteraction)
    }

    // Multiple interaction event types for better compatibility
    const events = ["click", "keydown", "touchstart", "pointerdown", "mousedown"]
    events.forEach((event) => {
      document.addEventListener(event, handleUserInteraction, { passive: true, once: true })
    })

    return () => {
      events.forEach((event) => {
        document.removeEventListener(event, handleUserInteraction)
      })

      Object.values(activeAudioSources.current).forEach((controller) => controller.stop())
      activeAudioSources.current = {}

      if (ambientController.current) {
        ambientController.current.stop()
        ambientController.current = null
      }

      if (audioContextRef.current && audioContextRef.current.state !== "closed") {
        audioContextRef.current.close().catch(console.warn)
      }
    }
  }, [initializeAudioContext, enableAudio])

  return (
    <AudioContext.Provider
      value={{
        playSound,
        stopSound,
        playAmbient,
        stopAmbient,
        preloadSounds,
        isAudioEnabled,
        enableAudio,
        getAudioStatus,
      }}
    >
      {children}
    </AudioContext.Provider>
  )
}

export function useAudio() {
  const context = useContext(AudioContext)
  if (!context) {
    throw new Error("useAudio must be used within AudioProvider")
  }
  return context
}

export function useOperationAudio() {
  const audio = useAudio()

  const playOperationSound = useCallback(
    async (soundName: string, operationDuration: number, options: Omit<AudioOptions, "operationDuration"> = {}) => {
      return await audio.playSound(soundName, {
        ...options,
        operationDuration,
        fadeOut: Math.min(operationDuration * 0.1, 500),
      })
    },
    [audio],
  )

  return {
    ...audio,
    playOperationSound,
  }
}
