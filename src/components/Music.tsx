import { useContext } from 'react'
import { AudioContext } from '../context/audio'
import { EllipsisVerticalIcon, ShareIcon } from '@heroicons/react/20/solid'

type MusicProps = {
  coverUrl: string
  title: string
  author: string
  url: string
  views: number
}

export default function Music({ coverUrl, title, author, views, url }: MusicProps) {
  const audio = new Audio(url)
  const { play, setData } = useContext(AudioContext)

  return (
    <div
      className='flex items-center p-4 hover:bg-white/10 rounded-md cursor-pointer'
      onClick={() => {
        play(audio)
        setData({ author, title, coverUrl })
      }}
    >
      <img className='w-12 h-12 mr-4 rounded-md object-cover' src={coverUrl} alt={title} />
      <div className='flex flex-col'>
        <span>{title}</span>
        <span className='text-sm text-neutral-400'>{views.toLocaleString()}</span>
      </div>
      <div className='ml-auto space-x-1'>
        <button className=' rounded-lg p-1  hover:bg-white/10'>
          <EllipsisVerticalIcon className=' w-5 h-5' />
        </button>
        <button className=' rounded-lg p-1  hover:bg-white/10'>
          <ShareIcon className=' w-5 h-5' />
        </button>
      </div>
    </div>
  )
}
