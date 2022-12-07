import { XCircleIcon } from '@heroicons/react/20/solid'

export default function ErrorMessage({ message }: { message: string }) {
  if (!message || message === '') return null

  return (
    <div className='font-semibold flex items-center space-x-2 p-2 bg-red-300 text-red-700 rounded overflow-hidden my-4'>
      <XCircleIcon className='w-5 h-5 flex-shrink-0' />
      <span>{message}</span>
    </div>
  )
}
