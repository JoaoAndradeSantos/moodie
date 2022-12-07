import { useContext, useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { uploadFile } from '../services/storage'

import AlbumList from '../components/AlbumList'
import MusicList from '../components/MusicList'
import AlbumCreatorModal from '../components/modals/AlbumCreatorModal'
import UploadMusicModal from '../components/modals/UploadMusicModal'
import EditProfileModal from '../components/modals/EditProfileModal'
import { PlusIcon } from '@heroicons/react/20/solid'
import { PencilIcon } from '@heroicons/react/24/solid'

import { AuthContext } from '../context/auth'
import { updateProfile } from '../services/api/user'

export default function Perfil() {
  const navigate = useNavigate()
  const { user } = useContext(AuthContext)

  const profileImageInputElement = useRef<HTMLInputElement>(null)
  const bannerImageInputElement = useRef<HTMLInputElement>(null)

  const [profileImageUrl, setProfileImageUrl] = useState('')
  const [bannerImageUrl, setBannerImageUrl] = useState('')

  const [editProfileVisible, setEditProfileVisible] = useState(false)
  const [uploadVisible, setUploadVisible] = useState(false)
  const [albumCreatorVisible, setAlbumCreatorVisible] = useState(false)

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
      (accumulator, currentValue) => accumulator + currentValue.charAt(0).toUpperCase(),
      ''
    )

    return firstLetters.substring(0, 3)
  }, [user])

  useEffect(() => {
    if (!user) return

    setBannerImageUrl(user.bannerPhotoUrl)
    setProfileImageUrl(user.profilePhotoUrl)
  }, [user])

  useEffect(() => {
    if (!localStorage.getItem('uid')) navigate('/login')
  }, [localStorage])

  async function profileImageInputChanged() {
    const { current } = profileImageInputElement
    if (!current || !user) return

    const { files } = current

    if (files && files.length === 1) {
      const imageFile = files[0]
      const objectUrl = URL.createObjectURL(imageFile)

      setProfileImageUrl(objectUrl)

      const profilePhotoUrl = await uploadFile(imageFile, `${user.username}_pfp`)
      await updateProfile(user.id, { profilePhotoUrl })

      navigate(0)
    }
  }

  async function bannerInputChanged() {
    const { current } = bannerImageInputElement
    if (!current || !user) return

    const { files } = current

    if (files && files.length === 1) {
      const imageFile = files[0]
      const objectUrl = URL.createObjectURL(imageFile)

      setBannerImageUrl(objectUrl)

      const bannerPhotoUrl = await uploadFile(imageFile, `${user.username}_bp`)
      await updateProfile(user.id, { bannerPhotoUrl })

      navigate(0)
    }
  }

  if (!user) return null

  return (
    <div className='bg-neutral-800 h-full'>
      <input
        id='banner-image-input'
        name='banner-image-input'
        type='file'
        accept='image/*'
        ref={bannerImageInputElement}
        onChange={bannerInputChanged}
        className='w-0 h-0 hidden overflow-hidden'
      />
      <input
        id='profile-image-input'
        name='profile-image-input'
        type='file'
        accept='image/*'
        ref={profileImageInputElement}
        onChange={profileImageInputChanged}
        className='w-0 h-0 hidden overflow-hidden'
      />
      <div className='relative'>
        <label htmlFor='banner-image-input'>
          <div className='w-full h-64 group'>
            {bannerImageUrl ? (
              <img
                className='w-full h-full object-cover select-none cursor-pointer'
                src={bannerImageUrl}
              />
            ) : (
              <div className='w-full h-full select-none bg-violet-900 cursor-pointer'></div>
            )}

            <div className='pointer-events-none absolute top-0 left-0 w-full h-full flex items-center justify-center bg-black/30 opacity-0 group-hover:opacity-100'>
              <PencilIcon className='w-6 h-6 text-white' />
            </div>
          </div>
        </label>

        <div className='flex flex-col md:flex-row items-center md:items-start space-y-4 md:space-y-0 md:space-x-4 absolute top-24 md:top-36 inset-x-0 md:inset-x-auto md:left-8'>
          <label htmlFor='profile-image-input'>
            <div className='relative w-48 h-48 rounded-lg overflow-hidden shadow-lg select-none cursor-pointer group'>
              <img
                src={profileImageUrl}
                alt={user.name}
                className={`w-full h-full object-cover ${!profileImageUrl && 'hidden'}`}
              />
              <div
                className={`w-full h-full flex justify-center items-center bg-violet-800 ${
                  profileImageUrl && 'hidden'
                }`}
              >
                <span className='text-white font-bold text-7xl'>{profileLetters}</span>
              </div>
              <div className='pointer-events-none absolute top-0 left-0 w-48 h-48 flex items-center justify-center rounded-lg bg-black/40 opacity-0 group-hover:opacity-100'>
                <PencilIcon className='w-6 h-6 text-white' />
              </div>
            </div>
          </label>

          <div className='flex flex-col h-min bg-black/40 p-4 rounded-xl text-white max-w-md'>
            <h1 className='text-4xl font-bold truncate'>{user.name}</h1>
            <span className='text-lg text-neutral-300 font-semibold'>@{user.username}</span>
            <div className='flex space-x-2 mt-4'>
              <button
                className='w-full button-primary font-semibold'
                onClick={() => {
                  setEditProfileVisible(true)
                  document.body.style.overflow = 'hidden'
                }}
              >
                Editar
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className='text-white mt-60 md:mt-24 p-4'>
        <div className='flex items-center mb-4'>
          <h1 className='font-bold text-2xl'>
            Suas Músicas&nbsp;
            <span className='text-neutral-500 font-semibold'>
              ({musicCount} {musicCount === 1 ? 'música' : 'músicas'})
            </span>
          </h1>
          <button
            className='button-primary ml-4'
            title={
              user.albums.length <= 0
                ? 'Crie ao menos um álbum antes de enviar músicas'
                : 'Clique para enviar uma nova música'
            }
            disabled={user.albums.length <= 0}
            onClick={() => {
              setUploadVisible(true)
              document.body.style.overflow = 'hidden'
            }}
          >
            <PlusIcon className='w-5 h-5' />
          </button>
        </div>
        {/* TODO: Make this thing better */}
        {musicCount > 0 ? (
          user.albums.map((item, index) => (
            <MusicList key={index} data={item.musics} coverUrl={item.coverUrl} author={user.name} />
          ))
        ) : (
          <h1 className='text-lg text-neutral-600 font-semibold'>
            Você ainda não publicou nenhuma música...
          </h1>
        )}
      </div>
      <div className='text-white mt-4 md:mt-2 p-4'>
        <div className='flex items-center mb-4'>
          <h1 className='font-bold text-2xl'>Seus Álbuns</h1>
          <button
            className='button-primary ml-4'
            onClick={() => {
              setAlbumCreatorVisible(true)
              document.body.style.overflow = 'hidden'
            }}
          >
            <PlusIcon className='w-5 h-5' />
          </button>
        </div>
        {user.albums.length > 0 ? (
          <AlbumList data={user.albums} />
        ) : (
          <h1 className='text-lg text-neutral-600 font-semibold'>
            Você ainda não publicou nenhum álbum...
          </h1>
        )}
      </div>
      <EditProfileModal
        user={user}
        visible={editProfileVisible}
        setVisible={setEditProfileVisible}
      />
      <UploadMusicModal user={user} visible={uploadVisible} setVisible={setUploadVisible} />
      <AlbumCreatorModal
        user={user}
        visible={albumCreatorVisible}
        setVisible={setAlbumCreatorVisible}
      />
    </div>
  )
}
