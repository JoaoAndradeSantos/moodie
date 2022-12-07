import { createContext, useState, useEffect } from 'react'
import type { ReactNode, Dispatch, SetStateAction } from 'react'

type AudioData = {
  title: string
  author: string
  coverUrl: string
}

type ProgressData = {
  currentTime: number
  duration: number
  percentage: number
}

type AudioContextValue = {
  playing: boolean
  data: AudioData
  progressData: ProgressData
  play: (value: HTMLAudioElement) => void
  setAudio: Dispatch<SetStateAction<HTMLAudioElement | undefined>>
  setPlaying: Dispatch<SetStateAction<boolean>>
  setData: Dispatch<SetStateAction<AudioData>>
}

export const AudioContext = createContext<AudioContextValue>({} as AudioContextValue)

export function AudioContextProvider({ children }: { children: ReactNode }) {
  const [playing, setPlaying] = useState(false)
  const [audio, setAudio] = useState<HTMLAudioElement>()
  const [data, setData] = useState<AudioData>({} as AudioData)
  const [percentage, setPercentage] = useState(0)
  const [progressData, setProgressData] = useState<ProgressData>({
    currentTime: 0,
    duration: 0,
    percentage: 0,
  })

  useEffect(() => {
    if (!audio) return

    if (!playing) audio.pause()
    else audio.play()
  }, [playing])

  function handleTimeUpdate(e: Event) {
    const currentTarget = e.currentTarget as HTMLAudioElement

    const { currentTime, duration } = currentTarget
    const percentage = (currentTime / duration) * 100.0

    setProgressData({ currentTime, duration, percentage })
  }

  function play(newAudio: HTMLAudioElement) {
    console.log('play()')

    if (!!audio) {
      audio.pause()
      audio.removeEventListener('timeupdate', handleTimeUpdate)
    }

    newAudio.play()
    newAudio.addEventListener('timeupdate', handleTimeUpdate)

    setAudio(newAudio)
    setPlaying(true)
  }

  return (
    <AudioContext.Provider
      value={{ playing, data, progressData, play, setAudio, setPlaying, setData }}
    >
      {children}
    </AudioContext.Provider>
  )
}
