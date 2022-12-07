export type AlbumProps = {
  coverUrl: string
  releaseYear: string
  title: string
}

export default function Album({ coverUrl, releaseYear, title }: AlbumProps) {
  return (
    <div className='hover:bg-white/10 rounded-md overflow-hidden bg-white/5 cursor-pointer'>
      <img className='w-full aspect-square object-cover' src={coverUrl} alt={title} />
      <div className='p-4'>
        <h1 className='font-bold truncate'>{title}</h1>
        <span className='text-sm text-neutral-400'>{releaseYear}</span>
      </div>
    </div>
  )
}
