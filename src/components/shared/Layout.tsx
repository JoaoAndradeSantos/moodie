import { Outlet } from 'react-router-dom'

import Head from './Head'
import Sidebar from './Sidebar'
import MusicPlayer from '../MusicPlayer'

export default function Layout() {
  return (
    <div className='flex flex-col min-h-screen overflow-hidden bg-neutral-800'>
      <Head />
      <div className='flex h-full'>
        <Sidebar />
        <div className='w-full mb-[5.5rem]'>
          <Outlet />
        </div>
        <MusicPlayer />
      </div>
    </div>
  )
}
