export type User = {
  id: string
  name: string
  username: string
  profilePhotoUrl: string
  bannerPhotoUrl: string
  pix: string
  albums: Album[]
}

export type Music = {
  url: string
  title: string
  views: number
}

export type Album = {
  title: string
  releaseYear: string
  coverUrl: string
  musics: Music[]
}
