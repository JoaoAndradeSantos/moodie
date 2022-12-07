import { collection, query, where, getDocs } from 'firebase/firestore'
import { firestore } from '../firebase'
import type { Music, User } from '../firebase.d'

export async function getArtistByUsername<T>(username: string) {
  let result: T | undefined

  const usersReference = collection(firestore, 'user')
  const userQuery = query(usersReference, where('username', '==', username))

  const querySnapshot = await getDocs(userQuery)

  if (querySnapshot.size <= 0) throw new Error(`Artist with username ${username} not found`)

  querySnapshot.forEach((item) => {
    result = item.data() as T
  })

  return result
}

export type HydratedMusic = Music & {
  imageUrl: string
  author: string
}

export async function getMusics() {
  const musics: HydratedMusic[] = []
  const usersReference = collection(firestore, 'user')
  const usersSnapshot = await getDocs(usersReference)

  usersSnapshot.forEach((userSnapshot) => {
    const user = userSnapshot.data() as User
    user.albums.forEach((album) =>
      album.musics.forEach((music) =>
        musics.push({ ...music, author: user.name, imageUrl: album.coverUrl })
      )
    )
  })

  return musics
}
