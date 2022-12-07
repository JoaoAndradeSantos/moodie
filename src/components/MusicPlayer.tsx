import { useContext, useEffect, useMemo } from 'react'
import { AudioContext } from '../context/audio'
import { PlayIcon, PauseIcon } from '@heroicons/react/20/solid'

export default function MusicPlayer() {
  const { data, playing, progressData, setPlaying } = useContext(AudioContext)

  const [currentTime, duration] = useMemo(() => {
    const timeMinutes = Math.floor(progressData.currentTime / 60)
    const timeSeconds = Math.floor(progressData.currentTime % 60)
      .toString()
      .padStart(2, '0')

    const timeString = `${timeMinutes}:${timeSeconds}`

    const durationMinutes = Math.floor(progressData.duration / 60)
    const durationSeconds = Math.floor(progressData.duration % 60)
      .toString()
      .padStart(2, '0')

    const durationString = `${durationMinutes}:${durationSeconds}`

    return [timeString, durationString]
  }, [progressData])

  return (
    <div className='text-white border-t border-t-neutral-800 fixed bottom-0 bg-neutral-900 w-full p-4 flex items-center justify-between lg:justify-start lg:space-x-16'>
      <div className='flex flex-shrink-0 space-x-4 items-center lg:w-1/5'>
        {data.coverUrl && <img className='w-14 h-14 rounded-lg object-cover' src={data.coverUrl} />}
        <div className='flex flex-col'>
          <span className='font-bold'>{data.title}</span>
          <span className='text-neutral-500 leading-4'>{data.author}</span>
        </div>
      </div>
      <div className='flex flex-col items-center lg:w-3/5'>
        <button
          className='w-12 h-12 flex items-center justify-center bg-white text-black rounded-full lg:mb-2'
          onClick={() => setPlaying((value) => !value)}
        >
          {playing ? <PauseIcon className='w-5 h-5' /> : <PlayIcon className='w-5 h-5' />}
        </button>
        <div className='hidden lg:flex w-full text-sm font-medium text-neutral-500 items-center space-x-4'>
          <span>{currentTime}</span>
          <div className='h-1 rounded-full bg-neutral-700 w-full overflow-hidden'>
            <div className='bg-white h-full' style={{ width: `${progressData.percentage}%` }}></div>
          </div>
          <span>{duration}</span>
        </div>
      </div>
    </div>
  )
}
