import { useEffect, useState } from 'react'
import { getMusics } from '../services/api/artist'
import SingleMusic from '../components/SingleMusic'

import type { HydratedMusic } from '../services/api/artist'

function shuffle(array: any[]) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[array[i], array[j]] = [array[j], array[i]]
  }
}

export default function Inicio() {
  const [musics, setMusics] = useState<HydratedMusic[]>()

  useEffect(() => {
    async function fetchMusics() {
      const musics = await getMusics()
      shuffle(musics)
      setMusics(musics)
      // setMusics(musics.slice(0, 10))
    }

    fetchMusics()
  }, [])

  if (!musics) return null

  return (
    <div className='p-4 pb-12 text-white'>
      <h1 className='text-3xl font-bold mb-6'>Para você</h1>
      <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6'>
        {musics.map((music, index) => (
          <SingleMusic key={index} {...music} />
        ))}
      </div>
    </div>
  )
}
