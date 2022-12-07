import { useContext, useMemo } from 'react'
import { AuthContext } from '../../context/auth'
import { MagnifyingGlassIcon, ArrowLeftOnRectangleIcon } from '@heroicons/react/20/solid'
import { Link, useNavigate } from 'react-router-dom'

export default function Head() {
  const { user, logout } = useContext(AuthContext)

  return (
    <div className='text-white bg-neutral-900 w- h-16 px-4 flex justify-between items-center'>
      <div className='flex text-4xl pl-7 flex-col items-center font-Kanit'>
        <a href='/'>Moodie</a>
      </div>
      <div className='flex items-center space-x-4'>
        <label className='hidden md:block relative'>
          <MagnifyingGlassIcon className='w-5 h-5 inset-y-2.5 left-3 absolute text-neutral-400' />
          <input
            name='pesquisa'
            type='text'
            placeholder='Pesquisa'
            className='rounded placeholder:text-neutral-400 bg-neutral-700 text-white border-none outline-none pl-10'
          />
        </label>
        {user ? <LoggedExtension /> : <UnloggedExtension />}
      </div>
    </div>
  )
}

function LoggedExtension() {
  const navigate = useNavigate()
  const { user, logout } = useContext(AuthContext)

  const profileLetters = useMemo(() => {
    if (!user) return

    const splittedName = user.name.split(' ')
    const firstLetters = splittedName.reduce(
      (accumulator, currentValue) => accumulator + currentValue.charAt(0).toUpperCase(),
      ''
    )

    return firstLetters.substring(0, 3)
  }, [user])

  if (!user) return null

  return (
    <div className='flex space-x-2'>
      <Link to='/perfil'>
        <img
          src={user.profilePhotoUrl}
          className={`w-10 h-10 rounded-lg shadow-lg object-cover pointer-events-none select-none ${
            !user.profilePhotoUrl && 'hidden'
          }`}
          alt={user.name}
        />
        <div
          className={`w-10 h-10 flex justify-center items-center rounded-lg shadow-lg select-none bg-violet-800 ${
            user.profilePhotoUrl && 'hidden'
          }`}
        >
          <span className='text-white font-bold text-xs'>{profileLetters}</span>
        </div>
      </Link>
      <button
        className='button-secondary'
        onClick={() => {
          logout()
          navigate('/login')
        }}
      >
        <ArrowLeftOnRectangleIcon className='w-5 h-5' />
      </button>
    </div>
  )
}

function UnloggedExtension() {
  return (
    <div className='flex space-x-2'>
      <Link to='/login' className='button-primary'>
        Entrar
      </Link>
      <Link to='/registro' className='button-secondary'>
        Registrar
      </Link>
    </div>
  )
}
