import { useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { uploadFile } from '../../services/storage'
import { setDocumentWithId } from '../../services/firebase'

import Modal from './Modal'
import { CloudArrowUpIcon } from '@heroicons/react/24/outline'

import type { ChangeEvent, FormEvent } from 'react'
import type { ModalHandlers } from './Modal'
import type { User } from '../../services/firebase.d'

type UploadMusicModalProps = {
  user: User
} & ModalHandlers

export default function UploadMusicModal({ user, ...handlers }: UploadMusicModalProps) {
  const navigate = useNavigate()
  const fileInputElement = useRef<HTMLInputElement>(null)

  const [musicFile, setMusicFile] = useState<File>()
  const [title, setTitle] = useState('')
  const [albumIndex, setAlbumIndex] = useState(0)
  const [fileName, setFileName] = useState('Escolha um arquivo')
  const [loading, setLoading] = useState(false)

  function fileInputChanged(e: ChangeEvent) {
    const { current } = fileInputElement
    if (!current) return

    const { files } = current

    if (files && files.length === 1) {
      setMusicFile(files[0])
      setFileName(files[0].name)
    }
  }

  async function handleFormSubmit(e: FormEvent) {
    e.preventDefault()

    if (!musicFile) return

    setLoading(true)

    const uid = localStorage.getItem('uid')!
    const url = await uploadFile(musicFile)

    const albums = user.albums
    const musics = [...user.albums[albumIndex].musics, { url, title, views: 0 }]

    albums[albumIndex].musics = musics

    const userResponse = await setDocumentWithId<User>('user', uid, { ...user, albums })

    navigate(0)
  }

  return (
    <Modal {...handlers}>
      <form className='flex flex-col space-y-4' onSubmit={handleFormSubmit}>
        <input
          required
          id='file-input'
          name='file-input'
          type='file'
          accept='audio/*'
          className='w-0 h-0 hidden overflow-hidden'
          ref={fileInputElement}
          onChange={fileInputChanged}
        />
        <label
          htmlFor='file-input'
          className='flex flex-col items-center cursor-pointer bg-violet-300 hover:bg-violet-400 text-violet-900 p-4 rounded-lg font-bold'
        >
          <CloudArrowUpIcon className='w-6 h-6' />
          <span>{fileName}</span>
        </label>
        <input
          required
          type='text'
          placeholder='Dê um nome a sua música'
          className='bg-neutral-700 focus:border-violet-600 rounded-md'
          value={title}
          onChange={(e) => setTitle(e.currentTarget.value)}
        />
        <select
          name='albumName'
          className='bg-neutral-700 border-neutral-600 focus:border-violet-600 rounded-md cursor-pointer'
          required
          value={albumIndex}
          onChange={(e) => setAlbumIndex(parseInt(e.currentTarget.value))}
        >
          {user.albums.map((album, index) => (
            <option key={index} value={index}>
              {album.title}
            </option>
          ))}
        </select>
        <button
          className='button-primary'
          type='submit'
          disabled={!musicFile || !title || !user || loading}
        >
          Enviar
        </button>
      </form>
    </Modal>
  )
}
