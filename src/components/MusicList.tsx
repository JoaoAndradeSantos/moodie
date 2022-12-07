import MusicDisplay from './Music'
import type { Music } from '../services/firebase.d'

type MusicListProps = {
  data: Music[]
  coverUrl: string
  author: string
}

export default function MusicList({ data, coverUrl, author }: MusicListProps) {
  return (
    <div className='flex flex-col space-y-2'>
      {data.map((music, index) => (
        <MusicDisplay key={index} coverUrl={coverUrl} author={author} {...music} />
      ))}
    </div>
  )
}
