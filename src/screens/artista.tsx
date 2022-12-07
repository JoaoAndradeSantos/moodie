import { useState, useEffect, useMemo } from 'react'
import { getArtistByUsername } from '../services/api/artist'
import { useNavigate, useParams } from 'react-router-dom'

import AlbumList from '../components/AlbumList'
import MusicList from '../components/MusicList'
import PixIcon from '../components/PixIcon'

import type { User } from '../services/firebase.d'

export default function Artista() {
  const { id } = useParams()
  const navigate = useNavigate()

  const [user, setUser] = useState<User>()

  const musicCount = useMemo(() => {
    if (!user) return 0

    let result = 0
    user.albums.forEach((album) => (result += album.musics.length))

    return result
  }, [user])

  const profileLetters = useMemo(() => {
    if (!user) return

    const splittedName = user.name.split(' ')
    const firstLetters = splittedName.reduce(
      (accumulator, currentValue) =>
        accumulator + currentValue.charAt(0).toUpperCase().substring(0, 2),
      ''
    )

    return firstLetters
  }, [user])

  useEffect(() => {
    async function findUser() {
      try {
        const user = await getArtistByUsername<User>(id?.replace('@', '')!)
        setUser(user)
      } catch (error) {
        navigate('/')
      }
    }

    findUser()
  }, [])

  if (!user) return null

  return (
    <div className='bg-neutral-800 h-full'>
      <div className='relative'>
        {user.bannerPhotoUrl ? (
          <img
            className='w-full h-64 object-cover pointer-events-none select-none'
            src={user.bannerPhotoUrl}
          />
        ) : (
          <div className='w-full h-64 select-none pointer-events-none bg-violet-900'></div>
        )}
        <div className='flex flex-col md:flex-row items-center md:items-start space-y-4 md:space-y-0 md:space-x-4 absolute top-24 md:top-36 inset-x-0 md:inset-x-auto md:left-8'>
          <img
            src={user.profilePhotoUrl}
            className={`w-48 h-48 rounded-lg shadow-lg pointer-events-none object-cover select-none ${
              !user.profilePhotoUrl && 'hidden'
            }`}
            alt={user.name}
          />
          <div
            className={`w-48 h-48 flex justify-center items-center rounded-lg shadow-lg select-none bg-violet-800 ${
              user.profilePhotoUrl && 'hidden'
            }`}
          >
            <span className='text-white font-bold text-7xl'>{profileLetters}</span>
          </div>
          <div className='flex flex-col h-min bg-black/40 p-4 rounded-xl text-white'>
            <h1 className='text-4xl font-bold'>{user.name}</h1>
            <span className='text-lg text-neutral-300 font-semibold'>@{user.username}</span>
            <div className='flex space-x-2 mt-4'>
              <button className='w-full py-2 px-3 bg-violet-800 hover:bg-violet-700 rounded-md font-semibold'>
                Seguir
              </button>
              <button className='py-2 px-3 bg-violet-800 hover:bg-violet-700 rounded-md'>
                <PixIcon />
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className='text-white mt-52 md:mt-24 p-4'>
        <h1 className='font-bold text-2xl mb-4'>Populares</h1>
        {musicCount > 0 ? (
          user.albums.map((item, index) => (
            <MusicList key={index} data={item.musics} coverUrl={item.coverUrl} author={user.name} />
          ))
        ) : (
          <h1 className='text-lg text-neutral-600 font-semibold'>
            Este artista ainda não publicou nenhuma música...
          </h1>
        )}
      </div>
      <div className='text-white mt-4 md:mt-2 p-4'>
        <h1 className='font-bold text-2xl mb-4'>Álbuns</h1>
        <AlbumList data={user.albums} />
      </div>
    </div>
  )
}
