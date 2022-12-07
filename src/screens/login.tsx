import { FormEvent, useContext, useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { AuthContext } from '../context/auth'

import Head from '../components/shared/Head'
import TextDivider from '../components/TextDivider'
import ErrorMessageBox from '../components/ErrorMessage'
import { Link } from 'react-router-dom'

import { LockClosedIcon } from '@heroicons/react/20/solid'
import { FcGoogle } from 'react-icons/fc'

export default function Login() {
  const navigate = useNavigate()
  const { signInGoogle, signInEmail } = useContext(AuthContext)

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errorMessage, setErrorMessage] = useState('')

  useEffect(() => {
    if (!!localStorage.getItem('uid')) document.location.href = '/perfil'
  }, [])

  async function handleGoogleClick() {
    const user = await signInGoogle()
    if (!!user) document.location.href = '/perfil'
  }

  async function handleFormSubmit(e: FormEvent) {
    e.preventDefault()

    if (!email || !password) return

    try {
      const user = await signInEmail(email, password)
      if (!!user) document.location.href = '/perfil'
    } catch (error) {
      if (error instanceof Error) setErrorMessage(error.message)
    }
  }

  return (
    <div className='flex flex-col relative w-screen h-screen bg-gray-800'>
      <Head />
      <div className='flex justify-center items-center h-full'>
        <div className='bg-[#7b5cc9] p-8 max-w-md w-full mx-auto rounded-2xl'>
          <h1 className='text-2xl font-bold text-center text-white'>
            Para continuar, faça login no Moodie
          </h1>

          <button
            className='flex justify-center bg-white relative my-4 px-3 py-2 w-full rounded-md hover:text-violet-900'
            onClick={handleGoogleClick}
          >
            <FcGoogle className='absolute left-3 top-2 mr-4 text-2xl' />
            <span>Entrar com o Google</span>
          </button>

          <TextDivider value='OU' />

          <ErrorMessageBox message={errorMessage} />

          <form onSubmit={handleFormSubmit}>
            <label className='text-white block mb-4'>
              <span className='font-semibold'>E-mail</span>
              <input
                required
                className='w-full rounded-md bg-violet-400 mt-1 px-3 py-2 border-none  focus:bg-violet-400 placeholder:text-violet-300'
                type='email'
                placeholder='john@doe.com'
                value={email}
                onChange={(e) => setEmail(e.currentTarget.value)}
              />
            </label>

            <label className='text-white block mb-6'>
              <span className='font-semibold'>Senha</span>
              <input
                required
                className='w-full rounded-md  bg-violet-400 mt-1 px-3 py-2 border-none  focus:bg-violet-400 placeholder:text-violet-300'
                type='password'
                placeholder='••••••••'
                value={password}
                onChange={(e) => setPassword(e.currentTarget.value)}
              />
            </label>

            <button
              type='submit'
              className='group relative flex w-full justify-center rounded-md  bg-violet-800 mt-2 py-2 px-4 font-medium text-white hover:bg-violet-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2'
            >
              <LockClosedIcon
                className='absolute inset-y-2 left-3 h-5 w-5 text-violet-500 group-hover:text-violet-400'
                aria-hidden='true'
              />
              <span>Entrar</span>
            </button>
          </form>
          <Link
            to='/registro'
            className='text-center text-white font-semibold hover:underline block mt-4'
          >
            Crie sua conta
          </Link>
        </div>
      </div>
    </div>
  )
}
