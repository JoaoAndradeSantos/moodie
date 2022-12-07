import { app } from './firebase'
import { getStorage, uploadBytes, ref, getDownloadURL } from 'firebase/storage'

export const firestore = getStorage(app)

export async function uploadFile(file: File, customName?: string) {
  const fileReference = ref(firestore, `/files/${customName || file.name}`)
  const uploadTask = await uploadBytes(fileReference, file)
  return getDownloadURL(fileReference)
}
