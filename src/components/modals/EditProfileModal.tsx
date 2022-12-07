import { useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import Modal from './Modal'

import type { FormEvent } from 'react'
import type { ModalHandlers } from './Modal'
import type { User } from '../../services/firebase.d'
import { updateProfile } from '../../services/api/user'

type AlbumCreatorModalProps = { user: User } & ModalHandlers

const releaseYearList: number[] = []
const currentYear = new Date().getFullYear()

for (let i = 1990; i <= currentYear; i++) {
  releaseYearList.push(i)
}

export default function AlbumCreatorModal({ user, visible, setVisible }: AlbumCreatorModalProps) {
  const navigate = useNavigate()
  // const fileInputElement = useRef<HTMLInputElement>(null)

  const [name, setName] = useState(user.name)
  const [pix, setPix] = useState(user.pix)
  const [submitDisabled, setSubmitDisabled] = useState(false)

  async function onFormSubmit(e: FormEvent) {
    e.preventDefault()

    setSubmitDisabled(true)
    await updateProfile(user.id, { name, pix })

    // const uid = localStorage.getItem('uid')!
    // const coverUrl = await uploadFile(imageFile)
    // const albums = [...user.albums, { title, coverUrl, releaseYear, musics: [] }]

    // const userResponse = await setDocumentWithId<User>('user', uid, {
    //   ...user,
    //   albums,
    // })

    // console.log(userResponse)

    navigate(0)
  }

  return (
    <Modal visible={visible} setVisible={setVisible}>
      <form className='flex flex-col space-y-4' onSubmit={onFormSubmit}>
        <label className='flex flex-col'>
          <span className='mb-1.5 font-bold'>Nome</span>
          <input
            required
            type='text'
            placeholder={user.name}
            className='bg-neutral-700 focus:border-violet-600 rounded-md'
            value={name}
            onChange={(e) => setName(e.currentTarget.value)}
          />
        </label>
        <label className='flex flex-col'>
          <span className='mb-1.5 font-bold'>Chave PIX</span>
          <input
            type='text'
            placeholder={pix || '000.000.000-00'}
            className='bg-neutral-700 focus:border-violet-600 rounded-md'
            value={pix}
            onChange={(e) => setPix(e.currentTarget.value)}
          />
        </label>
        <button className='button-primary' type='submit' disabled={!name || submitDisabled}>
          Enviar
        </button>
      </form>
    </Modal>
  )
}
