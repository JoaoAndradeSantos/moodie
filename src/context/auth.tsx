import { app, translateError, setDocumentWithId, getDocument } from '../services/firebase'
import { createContext, useEffect, useState } from 'react'
import {
  GoogleAuthProvider,
  getAuth,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} from 'firebase/auth'
import { FirebaseError } from 'firebase/app'

import type { User } from '../services/firebase.d'
import type { ReactNode } from 'react'

type AuthContextValue = {
  signed: boolean
  user: User | null
  signInGoogle: () => Promise<User | null>
  signInEmail: (email: string, password: string) => Promise<User | null>
  signUpEmail: (
    name: string,
    email: string,
    username: string,
    password: string
  ) => Promise<User | null>
  logout: () => void
}

const googleProvider = new GoogleAuthProvider()
export const AuthContext = createContext<AuthContextValue>({} as AuthContextValue)

export function AuthContextProvider({ children }: { children: ReactNode }) {
  const auth = getAuth(app)
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    const storageUid = localStorage.getItem('uid')

    async function fetchUser() {
      if (!storageUid) return

      const userResponse = await getDocument<User>('user', storageUid)

      if (!userResponse) {
        localStorage.removeItem('uid')
        document.location.href = '/login'
        return
      }

      setUser({ ...userResponse, id: storageUid })
    }

    fetchUser()
  }, [])

  async function createUserDocument(id: string, name: string, username: string) {
    return await setDocumentWithId<User>('user', id, {
      id,
      name,
      username,
      albums: [],
      profilePhotoUrl: '',
      bannerPhotoUrl: '',
      pix: '',
    })
  }

  async function signInGoogle() {
    try {
      const { user: authUser } = await signInWithPopup(auth, googleProvider)

      const alreadyRegisteredUser = await getDocument<User>('user', authUser.uid)
      localStorage.setItem('uid', authUser.uid)

      if (!alreadyRegisteredUser) {
        const username = authUser.email!.split('@')[0]
        const userDocument = await createUserDocument(authUser.uid, authUser.displayName!, username)
        setUser(userDocument)
        return userDocument
      }

      return alreadyRegisteredUser
    } catch (error) {
      return null
    }
  }

  async function signInEmail(email: string, password: string) {
    try {
      const { user: authUser } = await signInWithEmailAndPassword(auth, email, password)
      const userDocument = await getDocument<User>('user', authUser.uid)
      setUser(userDocument)

      localStorage.setItem('uid', authUser.uid)

      return userDocument
    } catch (error) {
      if (error instanceof FirebaseError) throw new Error(translateError(error))
    }

    return null
  }

  async function signUpEmail(name: string, email: string, username: string, password: string) {
    try {
      const { user: authUser } = await createUserWithEmailAndPassword(auth, email, password)
      const userDocument = await createUserDocument(authUser.uid, name, username)
      setUser(userDocument)
      localStorage.setItem('uid', authUser.uid)

      return userDocument
    } catch (error) {
      if (error instanceof FirebaseError) throw new Error(translateError(error))
    }

    return null
  }

  function logout() {
    setUser(null)
    localStorage.removeItem('uid')
  }

  return (
    <AuthContext.Provider
      value={{ signed: !!user, user, signInEmail, signInGoogle, signUpEmail, logout }}
    >
      {children}
    </AuthContext.Provider>
  )
}
