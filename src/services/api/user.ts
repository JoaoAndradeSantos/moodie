import { getDocument, setDocumentWithId } from '../firebase'

import type { User } from '../firebase.d'

export async function updateProfile(uid: string, data: Partial<User>) {
  const document = await getDocument<User>('user', uid)
  const updatedData = { ...document, ...data }
  const updatedUser = await setDocumentWithId<User>('user', uid, updatedData)

  return updatedUser
}
