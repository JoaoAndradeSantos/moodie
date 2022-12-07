import { useContext } from 'react'
import { AudioContext } from '../context/audio'

import type { HydratedMusic } from '../services/api/artist'

export default function SingleMusic({ title, author, imageUrl, url }: HydratedMusic) {
  const audio = new Audio(url)
  const { play, setData } = useContext(AudioContext)

  return (
    <div
      className='cursor-pointer'
      onClick={() => {
        play(audio)
        setData({ author, title, coverUrl: imageUrl })
      }}
    >
      <img
        src={imageUrl}
        alt={title}
        className='bg-neutral-900 w-full aspect-square object-cover rounded-lg select-none pointer-events-none'
      />
      <div className='text-white flex flex-col mt-3'>
        <span className='text-lg font-semibold truncate'>{title}</span>
        <span className='text-neutral-500 leading-3'>{author}</span>
      </div>
    </div>
  )
}
