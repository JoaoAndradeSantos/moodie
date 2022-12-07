import Album from './Album'
import type { Album as FirebaseAlbum } from '../services/firebase.d'

type AlbumListProps = {
  data: FirebaseAlbum[]
}

export default function AlbumList({ data }: AlbumListProps) {
  return (
    <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4'>
      {data.map((item, index) => (
        <Album key={index} {...item} />
      ))}
    </div>
  )
}
