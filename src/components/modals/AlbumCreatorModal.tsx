import { useRef, useState } from 'react'
import { uploadFile } from '../../services/storage'
import { setDocumentWithId } from '../../services/firebase'
import { useNavigate } from 'react-router-dom'

import Modal from './Modal'
import { CloudArrowUpIcon, PencilIcon } from '@heroicons/react/24/solid'

import type { ChangeEvent, FormEvent } from 'react'
import type { ModalHandlers } from './Modal'
import type { User } from '../../services/firebase.d'

type AlbumCreatorModalProps = { user: User } & ModalHandlers

const releaseYearList: number[] = []
const currentYear = new Date().getFullYear()

for (let i = 1990; i <= currentYear; i++) {
  releaseYearList.push(i)
}

export default function AlbumCreatorModal({ user, visible, setVisible }: AlbumCreatorModalProps) {
  const navigate = useNavigate()
  const fileInputElement = useRef<HTMLInputElement>(null)

  const [title, setTitle] = useState('')
  const [releaseYear, setReleaseYear] = useState(currentYear.toString())
  const [previewUrl, setPreviewUrl] = useState('')
  const [imageFile, setImageFile] = useState<File>()
  const [submitDisabled, setSubmitDisabled] = useState(false)

  function fileInputChanged() {
    const { current } = fileInputElement
    if (!current) return

    const { files } = current

    if (files && files.length === 1) {
      const objectUrl = URL.createObjectURL(files[0])

      setImageFile(files[0])
      setPreviewUrl(objectUrl)
    }
  }

  async function onFormSubmit(e: FormEvent) {
    e.preventDefault()

    if (!imageFile) return

    setSubmitDisabled(true)

    const uid = localStorage.getItem('uid')!
    const coverUrl = await uploadFile(imageFile)
    const albums = [...user.albums, { title, coverUrl, releaseYear, musics: [] }]

    const userResponse = await setDocumentWithId<User>('user', uid, {
      ...user,
      albums,
    })

    console.log(userResponse)

    navigate(0)
  }

  return (
    <Modal visible={visible} setVisible={setVisible}>
      <form className='flex flex-col space-y-4' onSubmit={onFormSubmit}>
        <input
          required
          id='file-input'
          name='file-input'
          type='file'
          accept='image/*'
          className='w-0 h-0 hidden overflow-hidden'
          ref={fileInputElement}
          onChange={fileInputChanged}
        />
        <label htmlFor='file-input' className='cursor-pointer'>
          {previewUrl ? (
            <div className='group relative w-80 mx-auto aspect-square rounded-md shadow-lg overflow-hidden'>
              <img src={previewUrl} className='object-cover w-full h-full' />
              <div className='hidden group-hover:flex items-center justify-center absolute top-0 left-0 w-full h-full bg-black/50'>
                <PencilIcon className='w-6 h-6' />
              </div>
            </div>
          ) : (
            <div className='flex flex-col items-center bg-violet-300 hover:bg-violet-400 text-violet-900 p-4 rounded-lg font-bold'>
              <CloudArrowUpIcon className='w-6 h-6' />
              <span>Escolha a imagem do álbum</span>
            </div>
          )}
        </label>
        <input
          required
          type='text'
          placeholder='Dê um nome a seu álbum'
          className='bg-neutral-700 focus:border-violet-600 rounded-md'
          value={title}
          onChange={(e) => setTitle(e.currentTarget.value)}
        />
        <select
          name='release-year'
          id='release-year'
          className='bg-neutral-700 focus:border-violet-600 rounded-md cursor-pointer'
          value={releaseYear}
          onChange={(e) => setReleaseYear(e.currentTarget.value)}
        >
          {releaseYearList.map((year) => (
            <option key={year} value={year.toString()}>
              {year}
            </option>
          ))}
        </select>
        <button
          className='button-primary'
          type='submit'
          disabled={!previewUrl || !title || submitDisabled}
        >
          Enviar
        </button>
      </form>
    </Modal>
  )
}
