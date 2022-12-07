import SidebarButton from '../SidebarButton'
import { HomeIcon, QueueListIcon, HeartIcon } from '@heroicons/react/24/solid'

// import { SiDiscogs } from 'react-icons/si'
// import { RiHome2Fill } from 'react-icons/ri'
// import { RiPlayListFill } from 'react-icons/ri'
// import { IoMdHeart } from 'react-icons/io'

export default function sidebar() {
  return (
    <div className='bg-neutral-900 hidden md:flex md:w-64 flex-shrink-0 min-h-screen p-3 flex-col text-white'>
      <div className='flex-1 flex gap-1 flex-col items-right font-light py-2'>
        <SidebarButton
          title='Inicio'
          to='/'
          icon={<HomeIcon className='w-6 h-6 flex-shrink-0' />}
        />
        <SidebarButton
          title='Coleções'
          to='/colecoes'
          icon={<QueueListIcon className='w-6 h-6 flex-shrink-0' />}
        />
        <SidebarButton
          title='Favoritas'
          to='/favoritas'
          icon={<HeartIcon className='w-6 h-6 flex-shrink-0' />}
        />
        {/* <SidebarButton title="Playlists" to="/playlists" icon={<RiPlayListFill />} /> */}
      </div>
    </div>
  )
}
