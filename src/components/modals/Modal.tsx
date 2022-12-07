import { XMarkIcon } from '@heroicons/react/20/solid'
import type { ReactNode } from 'react'

export type ModalHandlers = {
  visible: boolean
  setVisible: (value: boolean) => void
}

type ModalProps = {
  children: ReactNode
} & ModalHandlers

export default function Modal({ children, visible, setVisible }: ModalProps) {
  if (!visible) return null

  return (
    <div className='flex items-center justify-center top-0 left-0 fixed bg-black/50 z-10 w-screen h-screen'>
      <div className='flex flex-col bg-neutral-800 min-w-[24rem] p-8 rounded-lg shadow-lg text-white'>
        <button
          className='mb-2 ml-auto bg-white/5 hover:bg-white/10 p-2 rounded-lg'
          onClick={() => {
            document.body.style.overflow = 'auto'
            setVisible(false)
          }}
        >
          <XMarkIcon className='w-5 h-5' />
        </button>
        {children}
      </div>
    </div>
  )
}
