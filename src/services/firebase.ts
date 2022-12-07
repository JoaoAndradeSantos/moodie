import { FirebaseError, initializeApp } from 'firebase/app'
import {
  collection,
  doc,
  getDoc,
  setDoc,
  getDocs,
  getFirestore,
  type DocumentData,
} from 'firebase/firestore'

const firebaseConfig = {
  apiKey: 'AIzaSyB2pSkbCAtTz7Ftydxpi-OjK6FvFfIizEM',
  authDomain: 'moodie-b817f.firebaseapp.com',
  projectId: 'moodie-b817f',
  storageBucket: 'moodie-b817f.appspot.com',
  messagingSenderId: '1070091312549',
  appId: '1:1070091312549:web:25fcf1c592aedb3fe99c4c',
  measurementId: 'G-F3575JL6YM',
}

export const app = initializeApp(firebaseConfig)
export const firestore = getFirestore(app)

export function generateRandomId() {
  let result = ''
  const length = 20
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'

  for (let i = 0; i < length; i++) result += characters.charAt(Math.random() * characters.length)
  return result
}

export async function getDocument<T>(collection: string, id: string) {
  const documentReference = doc(firestore, collection, id)
  const documentSnapshot = await getDoc(documentReference)
  return documentSnapshot.data() as T
}

export async function getCollection<T>(name: string) {
  const response: T[] = []
  const docs = await getDocs(collection(firestore, name))

  docs.forEach((item) => {
    response.push(item.data() as T)
  })

  return response
}

export async function setDocument<T extends DocumentData>(collection: string, data: T) {
  const randomId = generateRandomId()
  const document = doc(firestore, collection, randomId)
  await setDoc(document, data)

  return await getDocument<T>(collection, randomId)
}

export async function setDocumentWithId<T extends DocumentData>(
  collection: string,
  uid: string,
  data: T
) {
  const document = doc(firestore, collection, uid)
  await setDoc(document, data)

  return await getDocument<T>(collection, uid)
}

export function translateError(firebaseError: FirebaseError) {
  switch (firebaseError.code) {
    case 'auth/email-already-in-use':
      return 'E-mail já está em uso'
    case 'auth/invalid-email':
      return 'E-mail inserido é inválido'
    case 'auth/invalid-password':
      return 'Senha inserida precisa ser mais forte'
    case 'auth/user-not-found':
      return 'E-mail não cadastrado'
    case 'auth/wrong-password':
      return 'E-mail ou senha inválidos'

    default:
      return firebaseError.code
  }
}
